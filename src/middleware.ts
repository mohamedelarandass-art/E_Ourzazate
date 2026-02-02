/**
 * Next.js Middleware — Admin Route Protection
 *
 * Protects all /admin/* routes by checking for the presence of a session cookie.
 * The actual session validation (signature check, expiry, database lookup) happens
 * server-side in `validateRequest()` — the middleware only does a fast cookie-presence
 * gate to avoid rendering the admin shell for unauthenticated visitors.
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

  // Protect /admin/* routes
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
