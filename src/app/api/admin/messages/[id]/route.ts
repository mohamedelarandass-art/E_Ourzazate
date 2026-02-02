import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireRole } from '@/lib/auth-utils';
import { validateOrigin, getClientIp } from '@/lib/request-utils';
import { ValidationError, NotFoundError, apiErrorResponse } from '@/lib/errors';
import type { ApiResponse } from '@/types';

type RouteContext = { params: Promise<{ id: string }> };

const VALID_STATUSES = ['NEW', 'READ', 'REPLIED', 'ARCHIVED'] as const;

export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    const user = await requireRole(['OWNER', 'MANAGER']);
    validateOrigin(request);
    const { id } = await context.params;

    const existing = await prisma.contactMessage.findUnique({ where: { id } });
    if (!existing) throw new NotFoundError('Message introuvable');

    const body = await request.json() as { status?: string; notes?: string };

    const changes: Record<string, unknown> = {};
    const updateData: Record<string, unknown> = {};

    if (body.status !== undefined) {
      if (!VALID_STATUSES.includes(body.status as typeof VALID_STATUSES[number])) {
        throw new ValidationError('Statut invalide', { status: 'Le statut doit etre NEW, READ, REPLIED ou ARCHIVED.' });
      }
      if (body.status !== existing.status) {
        changes.status = { from: existing.status, to: body.status };
      }
      updateData.status = body.status;
    }

    if (body.notes !== undefined) {
      if (body.notes !== existing.notes) {
        changes.notes = { from: existing.notes, to: body.notes };
      }
      updateData.notes = body.notes;
    }

    const updated = await prisma.contactMessage.update({
      where: { id },
      data: updateData,
    });

    const ip = getClientIp(request);
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: 'update_message',
        entityType: 'ContactMessage',
        entityId: id,
        changes: Object.keys(changes).length > 0 ? JSON.parse(JSON.stringify(changes)) : undefined,
        ipAddress: ip,
      },
    }).catch((err) => console.error('Audit log failed:', err));

    return NextResponse.json<ApiResponse<unknown>>({
      success: true,
      data: updated,
    });
  } catch (error) {
    return apiErrorResponse(error);
  }
}
