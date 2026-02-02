/**
 * POST /api/auth/login
 *
 * Authenticates an admin user with username + password.
 * Creates a Lucia session and sets the session cookie on success.
 *
 * Security:
 * - CSRF: Origin header validated against Host (C3)
 * - Rate limiting: 5 failed attempts per IP in 15 min window
 * - IP: Uses request.ip on Vercel (non-spoofable), header fallback for dev (C4)
 * - Rate limiter: Bounded Map with automatic expired-entry cleanup (C5)
 * - No username enumeration: same error for "not found" and "wrong password"
 *
 * @module api/auth/login
 */

import { NextRequest, NextResponse } from 'next/server';
import { lucia } from '@/lib/auth';
import { verifyPassword } from '@/lib/auth-utils';
import { prisma } from '@/lib/prisma';
import { loginSchema } from '@/lib/validations';
import { ValidationError, UnauthorizedError, apiErrorResponse } from '@/lib/errors';
import { validateOrigin, getClientIp, loginRateLimiter } from '@/lib/request-utils';
import { toFrontendRole } from '@/lib/auth-types';
import type { AuthUserResponse } from '@/lib/auth-types';
import type { ApiResponse } from '@/types';

export async function POST(
  request: NextRequest,
): Promise<NextResponse<ApiResponse<AuthUserResponse>>> {
  try {
    // CSRF protection — reject cross-origin POSTs
    validateOrigin(request);

    const ip = getClientIp(request);
    loginRateLimiter.check(ip);

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
      loginRateLimiter.recordFailure(ip);
      throw new UnauthorizedError('Identifiants incorrects');
    }

    // Verify password
    const validPassword = await verifyPassword(user.passwordHash, password);

    if (!validPassword) {
      loginRateLimiter.recordFailure(ip);
      throw new UnauthorizedError('Identifiants incorrects');
    }

    // Check if account is active
    if (!user.isActive) {
      throw new UnauthorizedError('Compte desactive');
    }

    // Create session
    const session = await lucia.createSession(user.id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);

    loginRateLimiter.clear(ip);

    // Update lastLoginAt (C7) + log audit event in parallel.
    // Wrapped in try/catch so a bookkeeping failure doesn't
    // break an otherwise successful login (RI5).
    try {
      await Promise.all([
        prisma.user.update({
          where: { id: user.id },
          data: { lastLoginAt: new Date() },
        }),
        prisma.auditLog.create({
          data: {
            userId: user.id,
            action: 'LOGIN',
            entityType: 'User',
            entityId: user.id,
            ipAddress: ip,
          },
        }),
      ]);
    } catch (bookkeepingError) {
      console.error('Post-login bookkeeping failed:', bookkeepingError);
    }

    const response = NextResponse.json<ApiResponse<AuthUserResponse>>(
      {
        success: true,
        data: {
          id: user.id,
          username: user.username,
          email: user.email,
          displayName: user.displayName,
          role: toFrontendRole(user.role),
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
