/**
 * Public Read-Only Prisma Queries
 *
 * Centralized database queries for public-facing pages.
 * All product queries filter isPublished: true.
 * All category queries filter isActive: true.
 *
 * Design decisions:
 * - Uses Prisma generated payload types instead of `any` for compile-time safety (M1).
 * - Key functions are wrapped with React.cache() so that generateMetadata
 *   and the page component share a single database round-trip per request (I2).
 * - getPublicProducts accepts a limit to avoid unbounded queries (I1).
 * - getPublicSimilarProducts uses dedicated `take` + `NOT` to avoid over-fetching (I3/M5).
 * - getPublicFeaturedProducts clamps limit to prevent abuse (I6).
 * - Transforms intentionally omit isPublished / isActive so admin state never
 *   leaks into RSC-serialized HTML or JSON responses (C2).
 *
 * The API routes use the toPublicApi* serializers to additionally serialize
 * dates to ISO strings for JSON transport (I9).
 *
 * @module lib/public-queries
 */

import { cache } from 'react';
import { prisma } from '@/lib/prisma';
import { toFrontendVariation } from '@/lib/transforms';
import type { Product, ProductImage, Category, CategoryWithCount } from '@/types';
import type {
  PublicApiProduct,
  PublicApiCategory,
  PublicApiCategoryWithCount,
} from '@/types/public-api';
import type { Prisma } from '@prisma/client';

// ─── Shared Prisma include ──────────────────────────────────────────────────

/** Prisma include for products — always include images (ordered) + variations. */
const productInclude = {
  images: { orderBy: { order: 'asc' as const } },
  variations: true,
} as const;

// ─── Type-safe Prisma payload types (M1 + M4) ───────────────────────────────

type ProductRow = Prisma.ProductGetPayload<{ include: typeof productInclude }>;
type ProductWithCategoryRow = Prisma.ProductGetPayload<{
  include: typeof productInclude & { category: true };
}>;

/** Full Prisma Category row — avoids the opaque `object` generic (M4). */
type PrismaCategory = Prisma.CategoryGetPayload<Record<string, never>>;

type CategoryWithCountRow = Prisma.CategoryGetPayload<{
  include: { _count: { select: { products: true } } };
}>;

// ─── Transform helpers ──────────────────────────────────────────────────────
//
// IMPORTANT (C2): These transforms intentionally OMIT `isPublished` from products
// and `isActive` from categories. This ensures admin-only state never appears
// in the RSC-serialized HTML payload sent to the browser.

/**
 * Transform a Prisma product row to the frontend Product shape.
 * `isPublished` is intentionally omitted (C2).
 */
function toFrontendProduct(row: ProductRow): Product {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description,
    categoryId: row.categoryId,
    images: row.images.map((img): ProductImage => ({
      id: img.id,
      url: img.url,
      alt: img.alt,
      order: img.order,
      isFeatured: img.isFeatured,
    })),
    variations: row.variations.map(toFrontendVariation),
    isNew: row.isNew,
    isFeatured: row.isFeatured,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

/**
 * Transform a Prisma category row to the frontend Category shape.
 * `isActive` is intentionally omitted (C2).
 */
function toFrontendCategory(row: PrismaCategory): Category {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description,
    icon: row.icon,
    imageUrl: row.imageUrl ?? undefined,
    order: row.order,
  };
}

// ─── Public API serialization helpers (C4 + I9) ─────────────────────────────
//
// These serialize dates to ISO strings for JSON responses. Only used by API routes.
// Admin fields are already stripped by toFrontendProduct/toFrontendCategory (C2).

/** Strip dates to ISO strings for API responses (I9). */
export function toPublicApiProduct(product: Product): PublicApiProduct {
  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    description: product.description,
    categoryId: product.categoryId,
    images: product.images,
    variations: product.variations,
    isNew: product.isNew,
    isFeatured: product.isFeatured,
    createdAt: product.createdAt instanceof Date
      ? product.createdAt.toISOString()
      : String(product.createdAt),
    updatedAt: product.updatedAt instanceof Date
      ? product.updatedAt.toISOString()
      : String(product.updatedAt),
  };
}

/** Serialize category for API responses (C4). */
export function toPublicApiCategory(category: Category): PublicApiCategory {
  return {
    id: category.id,
    name: category.name,
    slug: category.slug,
    description: category.description,
    icon: category.icon,
    imageUrl: category.imageUrl,
    order: category.order,
  };
}

/** Serialize category with count for API responses (C4). */
export function toPublicApiCategoryWithCount(cat: CategoryWithCount): PublicApiCategoryWithCount {
  return {
    ...toPublicApiCategory(cat),
    productCount: cat.productCount,
  };
}

// ─── Category queries ───────────────────────────────────────────────────────

/** Get all active categories ordered by display order. */
export async function getPublicCategories(): Promise<Category[]> {
  const rows = await prisma.category.findMany({
    where: { isActive: true },
    orderBy: { order: 'asc' },
  });
  return rows.map(toFrontendCategory);
}

/** Get all active categories with published product counts. */
export async function getPublicCategoriesWithCount(): Promise<CategoryWithCount[]> {
  const rows = await prisma.category.findMany({
    where: { isActive: true },
    orderBy: { order: 'asc' },
    include: {
      _count: {
        select: { products: { where: { isPublished: true } } },
      },
    },
  });
  return rows.map((row: CategoryWithCountRow) => ({
    ...toFrontendCategory(row),
    productCount: row._count.products,
  }));
}

/** Get a single active category by slug. */
export async function getPublicCategoryBySlug(slug: string): Promise<Category | null> {
  const row = await prisma.category.findFirst({
    where: { slug, isActive: true },
  });
  return row ? toFrontendCategory(row) : null;
}

// ─── Product queries ────────────────────────────────────────────────────────

/**
 * Maximum products for the catalogue page (I3).
 * Set high enough to avoid silent truncation for the foreseeable future.
 * If the catalogue grows beyond this, consider server-side pagination.
 */
const CATALOGUE_PRODUCT_LIMIT = 500;

/** Default limit for the products API route. */
const API_PRODUCT_LIMIT = 50;

/**
 * Get published products for the catalogue page.
 * Upper-bounded to CATALOGUE_PRODUCT_LIMIT (500) to prevent unbounded queries (I1/I3).
 *
 * @param limit - Maximum products to return (default 500, max 500).
 */
export async function getPublicProducts(limit: number = CATALOGUE_PRODUCT_LIMIT): Promise<Product[]> {
  const clamped = Math.min(Math.max(limit, 1), CATALOGUE_PRODUCT_LIMIT);
  const rows = await prisma.product.findMany({
    where: { isPublished: true },
    orderBy: { createdAt: 'desc' },
    take: clamped,
    include: productInclude,
  });
  return rows.map(toFrontendProduct);
}

/**
 * Get published products in a specific category.
 * Bounded to `limit` to prevent unbounded queries (I2).
 *
 * @param categoryId - Category to filter by.
 * @param limit - Maximum results (default 200, max 500).
 */
export async function getPublicProductsByCategory(
  categoryId: string,
  limit: number = 200,
): Promise<Product[]> {
  const clamped = Math.min(Math.max(limit, 1), CATALOGUE_PRODUCT_LIMIT);
  const rows = await prisma.product.findMany({
    where: { categoryId, isPublished: true },
    orderBy: { createdAt: 'desc' },
    take: clamped,
    include: productInclude,
  });
  return rows.map(toFrontendProduct);
}

/**
 * Get featured published products, limited to `limit`.
 * Limit is clamped to [1, 50] to prevent abuse (I6).
 */
export async function getPublicFeaturedProducts(limit: number): Promise<Product[]> {
  const clamped = Math.min(Math.max(limit, 1), 50);
  const rows = await prisma.product.findMany({
    where: { isPublished: true, isFeatured: true },
    orderBy: { createdAt: 'desc' },
    take: clamped,
    include: productInclude,
  });
  return rows.map(toFrontendProduct);
}

/** Get all published product slugs (for generateStaticParams). */
export async function getPublishedProductSlugs(): Promise<string[]> {
  const rows = await prisma.product.findMany({
    where: { isPublished: true },
    select: { slug: true },
  });
  return rows.map((r) => r.slug);
}

/**
 * Get a single published product by slug with its category included.
 * Wrapped with React.cache() so generateMetadata and the page component
 * share a single database round-trip per request (I2).
 *
 * @returns Product and its category, or null if not found (M4).
 */
export const getPublicProductBySlugWithCategory = cache(
  async (slug: string): Promise<{ product: Product; category: Category } | null> => {
    const row: ProductWithCategoryRow | null = await prisma.product.findFirst({
      where: { slug, isPublished: true },
      include: {
        ...productInclude,
        category: true,
      },
    });
    if (!row) return null;
    return {
      product: toFrontendProduct(row),
      category: toFrontendCategory(row.category),
    };
  },
);

// ─── Similar products (I3 + M5) ─────────────────────────────────────────────

/** Maximum similar products to return. */
const SIMILAR_PRODUCTS_LIMIT = 4;

/**
 * Get similar published products in the same category, excluding a specific product.
 * Uses a dedicated Prisma query with `take` and `NOT` to avoid over-fetching (I3).
 *
 * @param categoryId - Category to search within.
 * @param excludeId - Product ID to exclude (the current product).
 * @param limit - Maximum results (default 4, max 12).
 */
export async function getPublicSimilarProducts(
  categoryId: string,
  excludeId: string,
  limit: number = SIMILAR_PRODUCTS_LIMIT,
): Promise<Product[]> {
  const clamped = Math.min(Math.max(limit, 1), 12);
  const rows = await prisma.product.findMany({
    where: {
      categoryId,
      isPublished: true,
      id: { not: excludeId },
    },
    orderBy: { createdAt: 'desc' },
    take: clamped,
    include: productInclude,
  });
  return rows.map(toFrontendProduct);
}
