/**
 * Public Categories API
 *
 * GET /api/public/categories
 * Returns all active categories with published product counts.
 * No authentication required.
 *
 * Response shape: { categories: PublicApiCategoryWithCount[] }
 * Internal fields (isActive) are stripped before serialization (C4).
 *
 * Caching (I5): Uses `unstable_cache` with a 60-second TTL and
 * `tags: ['categories']` for on-demand revalidation. Admin mutation
 * routes call `revalidateTag('categories')` to bust this cache instantly
 * when a category is created, updated, or deleted.
 *
 * @module api/public/categories
 */

import { NextResponse } from 'next/server';
import { unstable_cache } from 'next/cache';
import {
  getPublicCategoriesWithCount,
  toPublicApiCategoryWithCount,
} from '@/lib/public-queries';
import { apiErrorResponse } from '@/lib/errors';

/**
 * Cached categories with product counts (I5).
 * Tag-based revalidation allows admin actions to bust this cache instantly.
 */
const getCachedCategories = unstable_cache(
  async () => {
    const categories = await getPublicCategoriesWithCount();
    return categories.map(toPublicApiCategoryWithCount);
  },
  ['public-categories'],
  { revalidate: 60, tags: ['categories'] },
);

export async function GET() {
  try {
    const categories = await getCachedCategories();
    return NextResponse.json({ categories });
  } catch (error: unknown) {
    console.error('[api/public/categories] GET failed:', error);
    return apiErrorResponse(error);
  }
}
