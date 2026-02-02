/**
 * GET /api/health
 *
 * Health check endpoint. Verifies database connectivity by executing
 * a lightweight query. Returns the overall service status and timestamp.
 *
 * Response shape matches HealthCheckResponse in src/types/api.ts.
 *
 * Note (M4): Version is hardcoded rather than reading process.env.npm_package_version
 * to avoid leaking exact version info on a public endpoint.
 *
 * @module api/health
 */

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import type { HealthCheckResponse } from '@/types';

export async function GET(): Promise<NextResponse<HealthCheckResponse>> {
  let database: 'connected' | 'disconnected' = 'disconnected';

  try {
    await prisma.$queryRaw`SELECT 1`;
    database = 'connected';
  } catch {
    // Database unreachable — report degraded status
  }

  const status = database === 'connected' ? 'healthy' : 'degraded';

  return NextResponse.json<HealthCheckResponse>(
    {
      status,
      timestamp: new Date().toISOString(),
      version: '0.1.0',
      database,
    },
    { status: status === 'healthy' ? 200 : 503 },
  );
}
