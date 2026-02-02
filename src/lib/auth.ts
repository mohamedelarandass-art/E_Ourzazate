/**
 * Lucia v3 Authentication Instance
 *
 * Configures session-based authentication using Lucia with a Prisma adapter.
 * Sessions are stored in PostgreSQL alongside user data.
 *
 * Cookie config:
 * - httpOnly: true (no JS access)
 * - secure: true in production (HTTPS only)
 * - sameSite: lax (CSRF protection while allowing top-level navigations)
 * - maxAge: 30 days
 *
 * @module lib/auth
 */

import { Lucia } from 'lucia';
import { PrismaAdapter } from '@lucia-auth/adapter-prisma';
import { prisma } from './prisma';
import type { UserRole } from '@prisma/client';

const adapter = new PrismaAdapter(prisma.session, prisma.user);

/**
 * Lucia instance — the central auth object.
 * Import this wherever you need to create/validate/invalidate sessions.
 */
export const lucia = new Lucia(adapter, {
  sessionCookie: {
    name: 'auth_session',
    expires: false, // Session cookies are refreshed on each validation
    attributes: {
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    },
  },
  sessionExpiresIn: new TimeSpan(30, 'd'),
  getUserAttributes: (attributes) => ({
    username: attributes.username,
    email: attributes.email,
    displayName: attributes.displayName,
    role: attributes.role,
    isActive: attributes.isActive,
  }),
});

// TimeSpan is from Lucia — re-import for session expiry config
import { TimeSpan } from 'lucia';

// ──────────────────────────────────────────────
// Type augmentation for Lucia
// ──────────────────────────────────────────────

/**
 * Augment Lucia's types so `session.user` carries our custom attributes.
 * This must be declared in the same module that creates the Lucia instance.
 */
declare module 'lucia' {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: DatabaseUserAttributes;
  }
}

interface DatabaseUserAttributes {
  username: string;
  email: string;
  displayName: string;
  role: UserRole;
  isActive: boolean;
}
