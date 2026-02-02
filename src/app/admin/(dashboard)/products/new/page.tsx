import { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import ProductForm from '../ProductForm';

export const metadata: Metadata = {
  title: 'Nouveau Produit',
};

export default async function NewProductPage() {
  const categories = await prisma.category.findMany({
    where: { isActive: true },
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
  });

  const mappedCategories = categories.map((c) => ({
    ...c,
    imageUrl: c.imageUrl ?? undefined,
  }));

  return <ProductForm categories={mappedCategories} />;
}
