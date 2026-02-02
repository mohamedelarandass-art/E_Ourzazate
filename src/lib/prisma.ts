/**
 * Prisma Client Singleton — Neon Serverless Adapter
 *
 * Uses @neondatabase/serverless + @prisma/adapter-neon to connect to Neon
 * via WebSockets. This bypasses Prisma's native query engine TLS, which
 * fails on Node.js v24+ with Neon's connection pooler.
 *
 * Uses the global object pattern to survive Next.js hot-reloads in development
 * without exhausting database connections.
 *
 * @module lib/prisma
 */

import { Pool, neonConfig } from '@neondatabase/serverless';
import { PrismaNeon } from '@prisma/adapter-neon';
import { PrismaClient } from '@prisma/client';
import ws from 'ws';

// Enable WebSocket connections for the Neon serverless driver (required in Node.js)
neonConfig.webSocketConstructor = ws;

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient(): PrismaClient {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const adapter = new PrismaNeon(pool);

  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });
}

/**
 * Shared Prisma client instance.
 * In development, stored on `globalThis` to persist across hot-reloads.
 * In production, a fresh instance is created once at startup.
 */
export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
