/**
 * Prisma Client Singleton
 *
 * Provides a single PrismaClient instance shared across the application.
 * Uses the global object pattern to survive Next.js hot-reloads in development
 * without exhausting database connections.
 *
 * @module lib/prisma
 */

import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

/**
 * Shared Prisma client instance.
 * In development, stored on `globalThis` to persist across hot-reloads.
 * In production, a fresh instance is created once at startup.
 */
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
