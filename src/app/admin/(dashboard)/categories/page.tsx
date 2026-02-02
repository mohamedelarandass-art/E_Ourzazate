import { Suspense } from 'react';
import { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth-utils';
import { toFrontendRole } from '@/lib/auth-types';
import CategoryManager from './CategoryManager';

export const metadata: Metadata = {
  title: 'Categories',
};

export default async function CategoriesPage() {
  const { user } = await requireAuth();

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

  const initialCategories = categories.map((c) => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
    description: c.description,
    icon: c.icon,
    imageUrl: c.imageUrl ?? undefined,
    order: c.order,
    isActive: c.isActive,
    _count: c._count,
  }));

  return (
    <Suspense fallback={null}>
      <CategoryManager
        initialCategories={initialCategories}
        userRole={toFrontendRole(user.role)}
      />
    </Suspense>
  );
}
