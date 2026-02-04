/**
 * Public API Response Types
 *
 * Type definitions for public-facing API responses.
 * These types intentionally omit internal admin fields:
 * - `isPublished` is stripped from products (C4/C2)
 * - `isActive` is stripped from categories (C4/C2)
 * - Dates are serialized to ISO strings for JSON transport (I9)
 *
 * @module types/public-api
 */

import type { ProductImage, ProductVariation } from './product';

/** Product shape for public API responses — no isPublished, string dates. */
export interface PublicApiProduct {
  id: string;
  name: string;
  slug: string;
  description: string;
  categoryId: string;
  images: ProductImage[];
  variations: ProductVariation[];
  isNew: boolean;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
}

/** Category shape for public API responses — no isActive. */
export interface PublicApiCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  imageUrl?: string;
  order: number;
}

/** Category with product count for public API responses. */
export interface PublicApiCategoryWithCount extends PublicApiCategory {
  productCount: number;
}
