/**
 * Next.js Middleware — Admin Route Protection
 *
 * Protects all /admin/* routes by checking for the presence of a session cookie.
 *
 * KNOWN LIMITATION (I3): This middleware only checks cookie *presence*, not
 * validity. An expired or forged cookie value will pass this gate. Full session
 * validation happens server-side in `validateRequest()` (called by server
 * components and API routes). This means an unauthenticated user with a stale
 * cookie may briefly see the admin layout skeleton before being redirected by
 * the server component. This is an acceptable trade-off for a catalog site
 * where the admin layout itself contains no sensitive data — all actual data
 * fetching is gated behind `requireAuth()`.
 *
 * Why not validate here? Next.js Edge middleware cannot use Prisma (Node.js
 * runtime) or perform database lookups needed for session validation.
 *
 * Allowed without auth:
 * - /admin/login
 * - /api/public/*
 * - All non-admin routes
 *
 * @module middleware
 */

import { NextResponse, type NextRequest } from 'next/server';

const SESSION_COOKIE_NAME = 'auth_session';

export function middleware(request: NextRequest): NextResponse {
  const { pathname } = request.nextUrl;

  // Allow the login page itself
  if (pathname === '/admin/login') {
    return NextResponse.next();
  }

  // Allow all public API routes
  if (pathname.startsWith('/api/public/')) {
    return NextResponse.next();
  }

  // Protect /admin/* routes — cookie presence gate
  if (pathname.startsWith('/admin')) {
    const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME);

    if (!sessionCookie?.value) {
      const loginUrl = new URL('/admin/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
  ],
};
