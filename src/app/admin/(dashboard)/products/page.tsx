import { Suspense } from 'react';
import { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth-utils';
import { toFrontendRole } from '@/lib/auth-types';
import ProductList from './ProductList';

export const metadata: Metadata = {
  title: 'Produits',
};

interface PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function ProductsPage({ searchParams }: PageProps) {
  const { user } = await requireAuth();
  const params = await searchParams;

  const page = Math.max(1, parseInt(String(params.page || '1'), 10));
  const pageSize = 20;

  // I5: Read filters from URL searchParams on the server
  const searchQuery = String(params.search || '');
  const filterCategoryId = String(params.categoryId || '');
  const filterStatus = String(params.status || '');
  const sortBy = String(params.sortBy || 'createdAt');
  const allowedSortFields = ['createdAt', 'name', 'updatedAt'];
  const orderField = allowedSortFields.includes(sortBy) ? sortBy : 'createdAt';

  // Build the Prisma where clause from URL filters
  const where: Record<string, unknown> = {};
  if (searchQuery) {
    where.OR = [
      { name: { contains: searchQuery, mode: 'insensitive' } },
      { description: { contains: searchQuery, mode: 'insensitive' } },
    ];
  }
  if (filterCategoryId) where.categoryId = filterCategoryId;
  if (filterStatus === 'published') where.isPublished = true;
  if (filterStatus === 'draft') where.isPublished = false;

  const [productsResult, total, categories] = await Promise.all([
    prisma.product.findMany({
      where,
      include: {
        category: { select: { name: true, slug: true } },
        images: { take: 1, orderBy: { order: 'asc' } },
        _count: { select: { variations: true } },
      },
      orderBy: { [orderField]: 'desc' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.product.count({ where }),
    prisma.category.findMany({
      orderBy: { order: 'asc' },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        icon: true,
        imageUrl: true,
        order: true,
        isActive: true,
      },
    }),
  ]);

  const initialProducts = productsResult.map((p) => ({
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
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString(),
    _count: p._count,
  }));

  return (
    <Suspense fallback={null}>
      <ProductList
        initialProducts={initialProducts}
        initialTotal={total}
        initialPage={page}
        initialPageSize={pageSize}
        categories={categories.map((c) => ({ ...c, imageUrl: c.imageUrl ?? undefined }))}
        userRole={toFrontendRole(user.role)}
      />
    </Suspense>
  );
}
