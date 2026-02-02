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
 * TECH DEBT: Lucia v3 (3.2.2) and @lucia-auth/adapter-prisma (4.0.1) are
 * deprecated by their author. Versions are pinned in package.json (no ^).
 * Plan migration to manual session management per the Copenhagen Book
 * before adding more auth features. See: https://thecopenhagenbook.com/
 *
 * @module lib/auth
 */

import { Lucia, TimeSpan } from 'lucia';
import { PrismaAdapter } from '@lucia-auth/adapter-prisma';
import { prisma } from './prisma';
import type { UserRole } from '@prisma/client';

const adapter = new PrismaAdapter(prisma.session, prisma.user);

/**
 * Lucia instance — the central auth object.
 * Import this wherever you need to create/validate/invalidate sessions.
 */
export const lucia = new Lucia(adapter, {
  sessionExpiresIn: new TimeSpan(30, 'd'),
  sessionCookie: {
    name: 'auth_session',
    expires: false, // Session cookies are refreshed on each validation
    attributes: {
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    },
  },
  getUserAttributes: (attributes) => ({
    username: attributes.username,
    email: attributes.email,
    displayName: attributes.displayName,
    role: attributes.role,
    isActive: attributes.isActive,
  }),
});

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
