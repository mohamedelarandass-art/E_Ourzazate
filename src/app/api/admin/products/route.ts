import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { requireRole } from '@/lib/auth-utils';
import { validateOrigin, getClientIp } from '@/lib/request-utils';
import { createProductSchema } from '@/lib/validations';
import { ValidationError, apiErrorResponse } from '@/lib/errors';
import { toFrontendVariation } from '@/lib/transforms';
import { generateUniqueSlug } from '@/lib/slug';
import type { VariationType } from '@prisma/client';
import type { ApiResponse, PaginatedResponse } from '@/types';

const VARIATION_TYPE_TO_PRISMA: Record<string, VariationType> = {
  color: 'COLOR',
  size: 'SIZE',
  material: 'MATERIAL',
};

export async function GET(request: NextRequest) {
  try {
    await requireRole(['OWNER', 'MANAGER', 'VIEWER']);

    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const pageSize = Math.min(100, Math.max(1, parseInt(searchParams.get('pageSize') || '20', 10)));
    const search = searchParams.get('search') || '';
    const categoryId = searchParams.get('categoryId') || '';
    const isPublished = searchParams.get('isPublished');
    const isFeatured = searchParams.get('isFeatured');
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') === 'asc' ? 'asc' : 'desc';

    const where: Record<string, unknown> = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (categoryId) where.categoryId = categoryId;
    if (isPublished === 'true') where.isPublished = true;
    if (isPublished === 'false') where.isPublished = false;
    if (isFeatured === 'true') where.isFeatured = true;
    if (isFeatured === 'false') where.isFeatured = false;

    const allowedSortFields = ['createdAt', 'name', 'updatedAt'];
    const orderField = allowedSortFields.includes(sortBy) ? sortBy : 'createdAt';

    const [items, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          category: { select: { name: true, slug: true } },
          images: { take: 1, orderBy: { order: 'asc' } },
          _count: { select: { variations: true } },
        },
        orderBy: { [orderField]: sortOrder },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.product.count({ where }),
    ]);

    const totalPages = Math.ceil(total / pageSize);

    const result: PaginatedResponse<unknown> = {
      items: items.map((p) => ({
        id: p.id,
        name: p.name,
        slug: p.slug,
        description: p.description,
        categoryId: p.categoryId,
        category: p.category,
        images: p.images.map((img) => ({
          id: img.id,
          url: img.url,
          alt: img.alt,
          order: img.order,
          isFeatured: img.isFeatured,
        })),
        isNew: p.isNew,
        isFeatured: p.isFeatured,
        isPublished: p.isPublished,
        createdAt: p.createdAt,
        updatedAt: p.updatedAt,
        _count: p._count,
      })),
      total,
      page,
      pageSize,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    };

    return NextResponse.json<ApiResponse<PaginatedResponse<unknown>>>({
      success: true,
      data: result,
    });
  } catch (error) {
    return apiErrorResponse(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireRole(['OWNER', 'MANAGER']);
    validateOrigin(request);

    const body: unknown = await request.json();
    const parsed = createProductSchema.safeParse(body);

    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        fieldErrors[issue.path.join('.')] = issue.message;
      }
      throw new ValidationError('Données du produit invalides', fieldErrors);
    }

    const { name, description, categoryId, isNew, isFeatured, isPublished, images, variations } = parsed.data;

    // C6: Validate categoryId exists
    const category = await prisma.category.findUnique({
      where: { id: categoryId },
      select: { id: true },
    });
    if (!category) {
      throw new ValidationError('Catégorie invalide', { categoryId: 'Cette catégorie n\'existe pas' });
    }

    const slug = await generateUniqueSlug(name);

    const product = await prisma.$transaction(async (tx) => {
      const created = await tx.product.create({
        data: {
          name,
          slug,
          description,
          categoryId,
          isNew,
          isFeatured,
          isPublished,
          images: {
            create: images.map((img) => ({
              url: img.url,
              alt: img.alt,
              order: img.order,
              isFeatured: img.isFeatured,
            })),
          },
          variations: {
            create: variations.map((v) => ({
              type: VARIATION_TYPE_TO_PRISMA[v.type],
              name: v.name,
              value: v.value,
            })),
          },
        },
        include: {
          category: true,
          images: { orderBy: { order: 'asc' } },
          variations: true,
        },
      });

      return created;
    });

    // Bust public product caches so the new product appears immediately.
    revalidateTag('products', 'default');

    const ip = getClientIp(request);
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: 'create_product',
        entityType: 'Product',
        entityId: product.id,
        ipAddress: ip,
      },
    }).catch((err) => console.error('Audit log failed:', err));

    return NextResponse.json<ApiResponse<unknown>>(
      {
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
      },
      { status: 201 },
    );
  } catch (error) {
    return apiErrorResponse(error);
  }
}
