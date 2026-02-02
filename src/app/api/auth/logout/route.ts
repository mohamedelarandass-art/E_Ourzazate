/**
 * POST /api/auth/logout
 *
 * Invalidates the current Lucia session and clears the session cookie.
 * Logs an audit event before destroying the session.
 *
 * @module api/auth/logout
 */

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { lucia } from '@/lib/auth';
import { validateRequest } from '@/lib/auth-utils';
import { prisma } from '@/lib/prisma';
import { apiErrorResponse } from '@/lib/errors';
import type { ApiResponse } from '@/types';

export async function POST(): Promise<NextResponse<ApiResponse<null>>> {
  try {
    const { user, session } = await validateRequest();

    if (session) {
      // Log audit event before invalidating
      if (user) {
        await prisma.auditLog.create({
          data: {
            userId: user.id,
            action: 'LOGOUT',
            entityType: 'User',
            entityId: user.id,
          },
        });
      }

      await lucia.invalidateSession(session.id);
    }

    const blankCookie = lucia.createBlankSessionCookie();
    (await cookies()).set(
      blankCookie.name,
      blankCookie.value,
      blankCookie.attributes,
    );

    return NextResponse.json<ApiResponse<null>>(
      { success: true, data: null },
      { status: 200 },
    );
  } catch (error) {
    return apiErrorResponse(error);
  }
}
