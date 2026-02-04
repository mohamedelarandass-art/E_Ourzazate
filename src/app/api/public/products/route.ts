/**
 * Public Products API
 *
 * GET /api/public/products
 * Returns published products. Supports query params:
 *   ?featured=true  — only featured products
 *   &limit=6        — max number of results (clamped to [1, 50])
 *
 * No authentication required.
 *
 * Note: This Route Handler reads request.nextUrl (query params), which makes
 * it dynamic — `export const revalidate` would be a no-op. Instead, we use
 * `unstable_cache` to cache the underlying Prisma queries with a 60-second
 * TTL so we don't hit Neon on every request.
 *
 * Cache keys include the limit param so each variant gets its own cache
 * entry (C1). Tags enable on-demand revalidation from admin actions.
 *
 * Response shape: { products: PublicApiProduct[] }
 * Internal fields (isPublished) are stripped before serialization (C4).
 *
 * @module api/public/products
 */

import { NextRequest, NextResponse } from 'next/server';
import { unstable_cache } from 'next/cache';
import {
  getPublicFeaturedProducts,
  getPublicProducts,
  toPublicApiProduct,
} from '@/lib/public-queries';
import { apiErrorResponse } from '@/lib/errors';

/** Maximum limit a client can request (I6). */
const MAX_API_LIMIT = 50;

/** Default limit when ?featured=true and no explicit limit is provided. */
const DEFAULT_FEATURED_LIMIT = 6;

/**
 * Cached wrapper for featured products.
 * Key includes limit so different limits don't share stale data (C1).
 *
 * Pattern note (I2): We use a factory that creates and immediately invokes
 * unstable_cache(...)() because the cache key must include the dynamic `limit`
 * param. Module-scope definition isn't possible when the key varies per request.
 * Next.js deduplicates by key array, so this is semantically identical to a
 * module-scope definition — no extra overhead beyond closure creation.
 */
function getCachedFeaturedProducts(limit: number) {
  return unstable_cache(
    async () => {
      const products = await getPublicFeaturedProducts(limit);
      return products.map(toPublicApiProduct);
    },
    ['public-featured-products', String(limit)],
    { revalidate: 60, tags: ['products'] },
  )();
}

/**
 * Cached wrapper for all products.
 * Key includes limit so different limits don't share stale data (C1).
 */
function getCachedProducts(limit: number) {
  return unstable_cache(
    async () => {
      const products = await getPublicProducts(limit);
      return products.map(toPublicApiProduct);
    },
    ['public-products', String(limit)],
    { revalidate: 60, tags: ['products'] },
  )();
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const featured = searchParams.get('featured') === 'true';
    const rawLimit = parseInt(searchParams.get('limit') ?? '', 10);

    // Determine the effective limit (M3):
    // 1. Use the client-provided limit if it's a valid positive integer.
    // 2. Otherwise fall back to DEFAULT_FEATURED_LIMIT (6) for featured, MAX_API_LIMIT (50) for all.
    // 3. Clamp to [1, MAX_API_LIMIT] to prevent abuse.
    const defaultLimit = featured ? DEFAULT_FEATURED_LIMIT : MAX_API_LIMIT;
    const effectiveLimit = Number.isFinite(rawLimit) && rawLimit > 0 ? rawLimit : defaultLimit;
    const limit = Math.min(Math.max(effectiveLimit, 1), MAX_API_LIMIT);

    const products = featured
      ? await getCachedFeaturedProducts(limit)
      : await getCachedProducts(limit);

    return NextResponse.json({ products });
  } catch (error: unknown) {
    console.error('[api/public/products] GET failed:', error);
    return apiErrorResponse(error);
  }
}
