/**
 * POST /api/auth/login
 *
 * Authenticates an admin user with username + password.
 * Creates a Lucia session and sets the session cookie on success.
 *
 * Rate limiting: rejects after 5 failed attempts from the same IP within 15 minutes.
 * In production this should be backed by Redis — the in-memory Map here is per-process only.
 *
 * @module api/auth/login
 */

import { NextRequest, NextResponse } from 'next/server';
import { lucia } from '@/lib/auth';
import { verifyPassword } from '@/lib/auth-utils';
import { prisma } from '@/lib/prisma';
import { loginSchema } from '@/lib/validations';
import { ValidationError, UnauthorizedError, RateLimitError, apiErrorResponse } from '@/lib/errors';
import type { ApiResponse } from '@/types';

// ──────────────────────────────────────────────
// In-memory rate limiter (per-process, dev/staging only)
// ──────────────────────────────────────────────

interface RateLimitEntry {
  count: number;
  firstAttempt: number;
}

const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const RATE_LIMIT_MAX_ATTEMPTS = 5;
const failedAttempts = new Map<string, RateLimitEntry>();

/** Extract client IP from request headers. */
function getClientIp(request: NextRequest): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    request.headers.get('x-real-ip') ??
    'unknown'
  );
}

/** Check and enforce rate limit for the given IP. */
function checkRateLimit(ip: string): void {
  const now = Date.now();
  const entry = failedAttempts.get(ip);

  if (!entry) return;

  // Reset window if expired
  if (now - entry.firstAttempt > RATE_LIMIT_WINDOW_MS) {
    failedAttempts.delete(ip);
    return;
  }

  if (entry.count >= RATE_LIMIT_MAX_ATTEMPTS) {
    throw new RateLimitError();
  }
}

/** Record a failed login attempt for the given IP. */
function recordFailedAttempt(ip: string): void {
  const now = Date.now();
  const entry = failedAttempts.get(ip);

  if (!entry || now - entry.firstAttempt > RATE_LIMIT_WINDOW_MS) {
    failedAttempts.set(ip, { count: 1, firstAttempt: now });
  } else {
    entry.count += 1;
  }
}

/** Clear failed attempts for the given IP after a successful login. */
function clearFailedAttempts(ip: string): void {
  failedAttempts.delete(ip);
}

// ──────────────────────────────────────────────
// Route Handler
// ──────────────────────────────────────────────

interface LoginResponseData {
  id: string;
  username: string;
  email: string;
  displayName: string;
  role: string;
}

export async function POST(
  request: NextRequest,
): Promise<NextResponse<ApiResponse<LoginResponseData>>> {
  try {
    const ip = getClientIp(request);
    checkRateLimit(ip);

    // Parse and validate request body
    const body: unknown = await request.json();
    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const field = issue.path.join('.');
        fieldErrors[field] = issue.message;
      }
      throw new ValidationError('Donnees de connexion invalides', fieldErrors);
    }

    const { username, password } = parsed.data;

    // Find user by username
    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      recordFailedAttempt(ip);
      throw new UnauthorizedError('Identifiants incorrects');
    }

    // Verify password
    const validPassword = await verifyPassword(user.passwordHash, password);

    if (!validPassword) {
      recordFailedAttempt(ip);
      throw new UnauthorizedError('Identifiants incorrects');
    }

    // Check if account is active
    if (!user.isActive) {
      throw new UnauthorizedError('Compte desactive');
    }

    // Create session
    const session = await lucia.createSession(user.id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);

    clearFailedAttempts(ip);

    // Log audit event
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: 'LOGIN',
        entityType: 'User',
        entityId: user.id,
        ipAddress: ip,
      },
    });

    const response = NextResponse.json<ApiResponse<LoginResponseData>>(
      {
        success: true,
        data: {
          id: user.id,
          username: user.username,
          email: user.email,
          displayName: user.displayName,
          role: user.role,
        },
      },
      { status: 200 },
    );

    response.cookies.set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes,
    );

    return response;
  } catch (error) {
    return apiErrorResponse(error);
  }
}
