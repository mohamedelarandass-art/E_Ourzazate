/**
 * Public Single Product API
 *
 * GET /api/public/products/:slug
 * Returns a single published product by slug, including its category
 * and up to 4 similar products from the same category.
 *
 * No authentication required.
 *
 * Response shape:
 *   { product: PublicApiProduct & { category: PublicApiCategory }, similarProducts: PublicApiProduct[] }
 *
 * Internal fields are stripped before serialization (C4/C2).
 * Uses getPublicSimilarProducts for efficient querying (I3).
 *
 * Note (I1): `export const revalidate` is a no-op on Route Handlers that
 * accept a Request parameter. We use `unstable_cache` instead for cross-request
 * caching with a 60-second TTL and tag-based revalidation.
 *
 * @module api/public/products/[slug]
 */

import { NextRequest, NextResponse } from 'next/server';
import { unstable_cache } from 'next/cache';
import {
  getPublicProductBySlugWithCategory,
  getPublicSimilarProducts,
  toPublicApiProduct,
  toPublicApiCategory,
} from '@/lib/public-queries';
import type { PublicApiProduct } from '@/types/public-api';
import { apiErrorResponse, NotFoundError } from '@/lib/errors';

/**
 * Cached product + category lookup by slug (I1).
 * Key includes slug for per-product cache entries.
 */
function getCachedProductBySlug(slug: string) {
  return unstable_cache(
    async () => {
      const result = await getPublicProductBySlugWithCategory(slug);
      if (!result) return null;

      const { product, category } = result;

      // Fetch similar products — wrapped in try/catch so a failure doesn't
      // crash the entire response (M7). Returns empty array on error.
      let similarProducts: PublicApiProduct[] = [];
      try {
        const similar = await getPublicSimilarProducts(
          product.categoryId,
          product.id,
        );
        similarProducts = similar.map(toPublicApiProduct);
      } catch (err) {
        console.error('[api/public/products/[slug]] Similar products fetch failed:', err);
        similarProducts = [];
      }

      return {
        product: {
          ...toPublicApiProduct(product),
          category: toPublicApiCategory(category),
        },
        similarProducts,
      };
    },
    ['public-product-detail', slug],
    { revalidate: 60, tags: ['products'] },
  )();
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await params;
    const result = await getCachedProductBySlug(slug);

    if (!result) {
      throw new NotFoundError('Produit non trouvé.');
    }

    return NextResponse.json(result);
  } catch (error: unknown) {
    console.error('[api/public/products/[slug]] GET failed:', error);
    return apiErrorResponse(error);
  }
}
