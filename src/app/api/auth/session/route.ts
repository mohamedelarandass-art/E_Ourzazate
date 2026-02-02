/**
 * GET /api/auth/session
 *
 * Returns the currently authenticated user if a valid session exists.
 * Returns `data: null` when no session is active (not an error — just unauthenticated).
 *
 * @module api/auth/session
 */

import { NextResponse } from 'next/server';
import { validateRequest } from '@/lib/auth-utils';
import { apiErrorResponse } from '@/lib/errors';
import type { ApiResponse } from '@/types';

interface SessionResponseData {
  id: string;
  username: string;
  email: string;
  displayName: string;
  role: string;
}

export async function GET(): Promise<NextResponse<ApiResponse<SessionResponseData | null>>> {
  try {
    const { user } = await validateRequest();

    if (!user) {
      return NextResponse.json<ApiResponse<null>>(
        { success: true, data: null },
        { status: 200 },
      );
    }

    return NextResponse.json<ApiResponse<SessionResponseData>>(
      {
        success: true,
        data: {
          id: user.id,
          username: user.username,
          email: user.email,
          displayName: user.displayName,
          role: user.role,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    return apiErrorResponse(error);
  }
}
