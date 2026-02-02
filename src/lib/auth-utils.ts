/**
 * Authentication Utility Functions
 *
 * Provides password hashing (Argon2id), session validation helpers,
 * and role-based access control guards for API routes and server components.
 *
 * @module lib/auth-utils
 */

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { hash, verify } from 'argon2';
import { lucia } from './auth';
import { UnauthorizedError, ForbiddenError } from './errors';
import type { Session, User } from 'lucia';
import type { UserRole } from '@prisma/client';

/**
 * Hash a plaintext password using Argon2id (OWASP recommended).
 * Uses argon2's secure defaults for memory cost, time cost, and parallelism.
 */
export async function hashPassword(password: string): Promise<string> {
  return hash(password, { type: 2 }); // type 2 = argon2id
}

/**
 * Verify a plaintext password against an Argon2id hash.
 * Returns true if the password matches, false otherwise.
 */
export async function verifyPassword(
  hashedPassword: string,
  password: string,
): Promise<boolean> {
  return verify(hashedPassword, password);
}

/** Shape returned by validateRequest when a valid session exists. */
interface AuthSuccess {
  user: User;
  session: Session;
}

/** Shape returned by validateRequest when no valid session exists. */
interface AuthFailure {
  user: null;
  session: null;
}

/**
 * Read the session cookie and validate it with Lucia.
 * Returns the user + session if valid, or null values if not.
 *
 * Automatically refreshes the session cookie when Lucia extends it.
 */
export async function validateRequest(): Promise<AuthSuccess | AuthFailure> {
  const sessionId = (await cookies()).get(lucia.sessionCookieName)?.value ?? null;

  if (!sessionId) {
    return { user: null, session: null };
  }

  const result = await lucia.validateSession(sessionId);

  try {
    if (result.session && result.session.fresh) {
      const sessionCookie = lucia.createSessionCookie(result.session.id);
      (await cookies()).set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes,
      );
    }

    if (!result.session) {
      const sessionCookie = lucia.createBlankSessionCookie();
      (await cookies()).set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes,
      );
    }
  } catch {
    // cookies() throws when called outside a server component/action context.
    // This is expected in middleware — silently ignore.
  }

  if (!result.session || !result.user) {
    return { user: null, session: null };
  }

  return { user: result.user, session: result.session };
}

/**
 * Guard that requires an authenticated session.
 * Redirects to /admin/login if no valid session is found.
 * Intended for server components and server actions.
 */
export async function requireAuth(): Promise<AuthSuccess> {
  const result = await validateRequest();

  if (!result.user || !result.session) {
    redirect('/admin/login');
  }

  if (!result.user.isActive) {
    redirect('/admin/login');
  }

  return result;
}

/**
 * Guard that requires specific user roles.
 * Throws ForbiddenError (403) if the authenticated user lacks the required role.
 *
 * @param allowedRoles - Array of roles that are permitted access.
 * @returns The authenticated User object.
 * @throws UnauthorizedError if not authenticated.
 * @throws ForbiddenError if role is insufficient.
 */
export async function requireRole(allowedRoles: UserRole[]): Promise<User> {
  const { user } = await validateRequest();

  if (!user) {
    throw new UnauthorizedError();
  }

  if (!user.isActive) {
    throw new ForbiddenError('Compte desactive');
  }

  if (!allowedRoles.includes(user.role as UserRole)) {
    throw new ForbiddenError('Permissions insuffisantes');
  }

  return user;
}
