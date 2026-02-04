import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { requireRole } from '@/lib/auth-utils';
import { validateOrigin, getClientIp } from '@/lib/request-utils';
import { createCategorySchema } from '@/lib/validations';
import { ValidationError, NotFoundError, apiErrorResponse } from '@/lib/errors';
import { generateUniqueCategorySlug } from '../route';
import type { ApiResponse } from '@/types';

type RouteContext = { params: Promise<{ id: string }> };

export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    const user = await requireRole(['OWNER', 'MANAGER']);
    validateOrigin(request);
    const { id } = await context.params;

    const existing = await prisma.category.findUnique({ where: { id } });
    if (!existing) throw new NotFoundError('Categorie introuvable');

    const body: unknown = await request.json();
    const partialSchema = createCategorySchema.partial();
    const parsed = partialSchema.safeParse(body);

    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        fieldErrors[issue.path.join('.')] = issue.message;
      }
      throw new ValidationError('Donnees de la categorie invalides', fieldErrors);
    }

    const data = parsed.data;

    let slug = existing.slug;
    if (data.name && data.name !== existing.name) {
      slug = await generateUniqueCategorySlug(data.name, id);
    }

    const changes: Record<string, unknown> = {};
    if (data.name !== undefined && data.name !== existing.name) changes.name = { from: existing.name, to: data.name };
    if (data.description !== undefined && data.description !== existing.description) changes.description = { from: existing.description, to: data.description };
    if (data.icon !== undefined && data.icon !== existing.icon) changes.icon = { from: existing.icon, to: data.icon };
    if (data.isActive !== undefined && data.isActive !== existing.isActive) changes.isActive = { from: existing.isActive, to: data.isActive };
    if (data.order !== undefined && data.order !== existing.order) changes.order = { from: existing.order, to: data.order };

    const category = await prisma.category.update({
      where: { id },
      data: {
        ...(data.name !== undefined && { name: data.name, slug }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.icon !== undefined && { icon: data.icon }),
        ...(data.imageUrl !== undefined && { imageUrl: data.imageUrl }),
        ...(data.isActive !== undefined && { isActive: data.isActive }),
        ...(data.order !== undefined && { order: data.order }),
      },
    });

    // Bust public category caches so updates appear immediately.
    revalidateTag('categories', 'default');

    const ip = getClientIp(request);
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: 'update_category',
        entityType: 'Category',
        entityId: id,
        changes: Object.keys(changes).length > 0 ? JSON.parse(JSON.stringify(changes)) : undefined,
        ipAddress: ip,
      },
    }).catch((err) => console.error('Audit log failed:', err));

    return NextResponse.json<ApiResponse<unknown>>({
      success: true,
      data: category,
    });
  } catch (error) {
    return apiErrorResponse(error);
  }
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    const user = await requireRole(['OWNER']);
    validateOrigin(request);
    const { id } = await context.params;

    const existing = await prisma.category.findUnique({
      where: { id },
      select: { id: true, name: true },
    });
    if (!existing) throw new NotFoundError('Categorie introuvable');

    const ip = getClientIp(request);

    try {
      await prisma.category.delete({ where: { id } });
    } catch (err: unknown) {
      // Prisma P2003: foreign key constraint violation
      if (
        typeof err === 'object' &&
        err !== null &&
        'code' in err &&
        (err as { code: string }).code === 'P2003'
      ) {
        throw new ValidationError(
          'Impossible de supprimer cette categorie car elle contient des produits. Supprimez ou deplacez les produits d\'abord.',
        );
      }
      throw err;
    }

    // Bust public category caches so the deleted category disappears.
    revalidateTag('categories', 'default');

    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: 'delete_category',
        entityType: 'Category',
        entityId: id,
        changes: JSON.parse(JSON.stringify({ name: existing.name })),
        ipAddress: ip,
      },
    }).catch((err) => console.error('Audit log failed:', err));

    return NextResponse.json<ApiResponse<{ message: string }>>({
      success: true,
      data: { message: 'Categorie supprimee.' },
    });
  } catch (error) {
    return apiErrorResponse(error);
  }
}
