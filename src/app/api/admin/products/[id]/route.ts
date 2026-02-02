import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireRole } from '@/lib/auth-utils';
import { validateOrigin, getClientIp } from '@/lib/request-utils';
import { createProductSchema } from '@/lib/validations';
import { ValidationError, NotFoundError, apiErrorResponse } from '@/lib/errors';
import { toFrontendVariation } from '@/lib/transforms';
import { generateUniqueSlug } from '@/lib/slug';
import type { VariationType } from '@prisma/client';
import type { ApiResponse } from '@/types';

const VARIATION_TYPE_TO_PRISMA: Record<string, VariationType> = {
  color: 'COLOR',
  size: 'SIZE',
  material: 'MATERIAL',
};

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(request: NextRequest, context: RouteContext) {
  try {
    await requireRole(['OWNER', 'MANAGER', 'VIEWER']);
    const { id } = await context.params;

    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        images: { orderBy: { order: 'asc' } },
        variations: true,
      },
    });

    if (!product) throw new NotFoundError('Produit introuvable');

    return NextResponse.json<ApiResponse<unknown>>({
      success: true,
      data: {
        ...product,
        variations: product.variations.map(toFrontendVariation),
        images: product.images.map((img) => ({
          id: img.id,
          url: img.url,
          alt: img.alt,
          order: img.order,
          isFeatured: img.isFeatured,
        })),
      },
    });
  } catch (error) {
    return apiErrorResponse(error);
  }
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    const user = await requireRole(['OWNER', 'MANAGER']);
    validateOrigin(request);
    const { id } = await context.params;

    const existing = await prisma.product.findUnique({
      where: { id },
      include: { images: true, variations: true },
    });
    if (!existing) throw new NotFoundError('Produit introuvable');

    const body: unknown = await request.json();
    const partialSchema = createProductSchema.partial();
    const parsed = partialSchema.safeParse(body);

    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        fieldErrors[issue.path.join('.')] = issue.message;
      }
      throw new ValidationError('Données du produit invalides', fieldErrors);
    }

    const data = parsed.data;

    // C6: Validate categoryId exists when changed
    if (data.categoryId !== undefined) {
      const category = await prisma.category.findUnique({
        where: { id: data.categoryId },
        select: { id: true },
      });
      if (!category) {
        throw new ValidationError('Catégorie invalide', { categoryId: 'Cette catégorie n\'existe pas' });
      }
    }

    let slug = existing.slug;
    if (data.name && data.name !== existing.name) {
      slug = await generateUniqueSlug(data.name, id);
    }

    const changes: Record<string, unknown> = {};
    if (data.name !== undefined && data.name !== existing.name) changes.name = { from: existing.name, to: data.name };
    if (data.description !== undefined && data.description !== existing.description) changes.description = { from: existing.description, to: data.description };
    if (data.categoryId !== undefined && data.categoryId !== existing.categoryId) changes.categoryId = { from: existing.categoryId, to: data.categoryId };
    if (data.isNew !== undefined && data.isNew !== existing.isNew) changes.isNew = { from: existing.isNew, to: data.isNew };
    if (data.isFeatured !== undefined && data.isFeatured !== existing.isFeatured) changes.isFeatured = { from: existing.isFeatured, to: data.isFeatured };
    if (data.isPublished !== undefined && data.isPublished !== existing.isPublished) changes.isPublished = { from: existing.isPublished, to: data.isPublished };

    const product = await prisma.$transaction(async (tx) => {
      if (data.images !== undefined) {
        await tx.productImage.deleteMany({ where: { productId: id } });
        if (data.images.length > 0) {
          await tx.productImage.createMany({
            data: data.images.map((img) => ({
              productId: id,
              url: img.url,
              alt: img.alt,
              order: img.order,
              isFeatured: img.isFeatured,
            })),
          });
        }
      }

      if (data.variations !== undefined) {
        await tx.productVariation.deleteMany({ where: { productId: id } });
        if (data.variations.length > 0) {
          await tx.productVariation.createMany({
            data: data.variations.map((v) => ({
              productId: id,
              type: VARIATION_TYPE_TO_PRISMA[v.type],
              name: v.name,
              value: v.value,
            })),
          });
        }
      }

      const updated = await tx.product.update({
        where: { id },
        data: {
          ...(data.name !== undefined && { name: data.name }),
          ...(data.name !== undefined && { slug }),
          ...(data.description !== undefined && { description: data.description }),
          ...(data.categoryId !== undefined && { categoryId: data.categoryId }),
          ...(data.isNew !== undefined && { isNew: data.isNew }),
          ...(data.isFeatured !== undefined && { isFeatured: data.isFeatured }),
          ...(data.isPublished !== undefined && { isPublished: data.isPublished }),
        },
        include: {
          category: true,
          images: { orderBy: { order: 'asc' } },
          variations: true,
        },
      });

      return updated;
    });

    const ip = getClientIp(request);
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: 'update_product',
        entityType: 'Product',
        entityId: id,
        changes: Object.keys(changes).length > 0 ? JSON.parse(JSON.stringify(changes)) : undefined,
        ipAddress: ip,
      },
    }).catch((err) => console.error('Audit log failed:', err));

    return NextResponse.json<ApiResponse<unknown>>({
      success: true,
      data: {
        ...product,
        variations: product.variations.map(toFrontendVariation),
        images: product.images.map((img) => ({
          id: img.id,
          url: img.url,
          alt: img.alt,
          order: img.order,
          isFeatured: img.isFeatured,
        })),
      },
    });
  } catch (error) {
    return apiErrorResponse(error);
  }
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    const user = await requireRole(['OWNER', 'MANAGER']);
    validateOrigin(request);
    const { id } = await context.params;

    const existing = await prisma.product.findUnique({
      where: { id },
      select: { id: true, name: true },
    });
    if (!existing) throw new NotFoundError('Produit introuvable');

    const ip = getClientIp(request);

    if (user.role === 'MANAGER') {
      await prisma.product.update({
        where: { id },
        data: { isPublished: false },
      });

      await prisma.auditLog.create({
        data: {
          userId: user.id,
          action: 'unpublish_product',
          entityType: 'Product',
          entityId: id,
          ipAddress: ip,
        },
      }).catch((err) => console.error('Audit log failed:', err));

      return NextResponse.json<ApiResponse<{ message: string }>>({
        success: true,
        data: {
          message: 'Produit dépublié. Seul un propriétaire peut supprimer définitivement un produit.',
        },
      });
    }

    await prisma.product.delete({ where: { id } });

    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: 'delete_product',
        entityType: 'Product',
        entityId: id,
        changes: JSON.parse(JSON.stringify({ name: existing.name })),
        ipAddress: ip,
      },
    }).catch((err) => console.error('Audit log failed:', err));

    return NextResponse.json<ApiResponse<{ message: string }>>({
      success: true,
      data: { message: 'Produit supprimé définitivement.' },
    });
  } catch (error) {
    return apiErrorResponse(error);
  }
}
