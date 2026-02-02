import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { toFrontendVariationType } from '@/lib/transforms';
import ProductForm from '../../ProductForm';

export const metadata: Metadata = {
  title: 'Modifier le Produit',
};

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProductPage({ params }: PageProps) {
  const { id } = await params;

  const [product, categories] = await Promise.all([
    prisma.product.findUnique({
      where: { id },
      include: {
        images: { orderBy: { order: 'asc' } },
        variations: true,
        category: true,
      },
    }),
    prisma.category.findMany({
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
    }),
  ]);

  if (!product) notFound();

  const productData = {
    id: product.id,
    name: product.name,
    description: product.description,
    categoryId: product.categoryId,
    images: product.images.map((img) => ({
      id: img.id,
      url: img.url,
      alt: img.alt,
      order: img.order,
      isFeatured: img.isFeatured,
    })),
    variations: product.variations.map((v) => ({
      id: v.id,
      type: toFrontendVariationType(v.type) as 'color' | 'size' | 'material',
      name: v.name,
      value: v.value,
    })),
    isNew: product.isNew,
    isFeatured: product.isFeatured,
    isPublished: product.isPublished,
  };

  const mappedCategories = categories.map((c) => ({
    ...c,
    imageUrl: c.imageUrl ?? undefined,
  }));

  return <ProductForm product={productData} categories={mappedCategories} />;
}
