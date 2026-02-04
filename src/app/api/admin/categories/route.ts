import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { requireRole } from '@/lib/auth-utils';
import { validateOrigin, getClientIp } from '@/lib/request-utils';
import { createCategorySchema } from '@/lib/validations';
import { ValidationError, apiErrorResponse } from '@/lib/errors';
import { slugify } from '@/lib/utils';
import type { ApiResponse } from '@/types';

const MAX_SLUG_ATTEMPTS = 100;

async function generateUniqueCategorySlug(name: string, excludeId?: string): Promise<string> {
  const baseSlug = slugify(name);
  let slug = baseSlug;
  let counter = 1;

  while (counter <= MAX_SLUG_ATTEMPTS) {
    const existing = await prisma.category.findUnique({
      where: { slug },
      select: { id: true },
    });
    if (!existing || (excludeId && existing.id === excludeId)) return slug;
    counter++;
    slug = `${baseSlug}-${counter}`;
  }

  throw new Error(
    `Impossible de generer un slug unique pour "${name}" apres ${MAX_SLUG_ATTEMPTS} tentatives`,
  );
}

export { generateUniqueCategorySlug };

export async function GET() {
  try {
    await requireRole(['OWNER', 'MANAGER', 'VIEWER']);

    const categories = await prisma.category.findMany({
      orderBy: { order: 'asc' },
      include: {
        _count: {
          select: {
            products: {
              where: { isPublished: true },
            },
          },
        },
      },
    });

    return NextResponse.json<ApiResponse<unknown>>({
      success: true,
      data: categories.map((c) => ({
        id: c.id,
        name: c.name,
        slug: c.slug,
        description: c.description,
        icon: c.icon,
        imageUrl: c.imageUrl,
        order: c.order,
        isActive: c.isActive,
        createdAt: c.createdAt,
        updatedAt: c.updatedAt,
        _count: c._count,
      })),
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
    const parsed = createCategorySchema.safeParse(body);

    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        fieldErrors[issue.path.join('.')] = issue.message;
      }
      throw new ValidationError('Donnees de la categorie invalides', fieldErrors);
    }

    const { name, description, icon, imageUrl, isActive } = parsed.data;

    const slug = await generateUniqueCategorySlug(name);

    // Set order to max existing order + 1
    const maxOrder = await prisma.category.aggregate({
      _max: { order: true },
    });
    const order = (maxOrder._max.order ?? -1) + 1;

    const category = await prisma.category.create({
      data: {
        name,
        slug,
        description,
        icon,
        imageUrl,
        order,
        isActive,
      },
    });

    // Bust public category caches so the new category appears immediately.
    revalidateTag('categories', 'default');

    const ip = getClientIp(request);
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: 'create_category',
        entityType: 'Category',
        entityId: category.id,
        changes: JSON.parse(JSON.stringify({ name, description, icon, isActive, order })),
        ipAddress: ip,
      },
    }).catch((err) => console.error('Audit log failed:', err));

    return NextResponse.json<ApiResponse<unknown>>(
      {
        success: true,
        data: category,
      },
      { status: 201 },
    );
  } catch (error) {
    return apiErrorResponse(error);
  }
}
