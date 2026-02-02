/**
 * Data Transform Utilities
 *
 * Bridges between Prisma model shapes and frontend TypeScript interfaces.
 * Handles enum case conversion and relation flattening.
 *
 * Key mappings:
 * - VariationType: Prisma "COLOR" → frontend "color"
 * - UserRole: Prisma "OWNER" → frontend "owner" (see auth-types.ts)
 *
 * @module lib/transforms
 */

import type { VariationType } from '@prisma/client';
import type { ProductVariation as FrontendVariation } from '@/types';

/** Map Prisma VariationType enum to lowercase frontend string. */
const VARIATION_TYPE_MAP: Record<VariationType, FrontendVariation['type']> = {
  COLOR: 'color',
  SIZE: 'size',
  MATERIAL: 'material',
} as const;

/**
 * Convert a Prisma VariationType to the frontend lowercase string.
 *
 * @example toFrontendVariationType('COLOR') → 'color'
 */
export function toFrontendVariationType(type: VariationType): FrontendVariation['type'] {
  return VARIATION_TYPE_MAP[type];
}

/**
 * Transform a Prisma ProductVariation row to the frontend ProductVariation shape.
 */
export function toFrontendVariation(variation: {
  id: string;
  type: VariationType;
  name: string;
  value: string;
}): FrontendVariation {
  return {
    id: variation.id,
    type: toFrontendVariationType(variation.type),
    name: variation.name,
    value: variation.value,
  };
}
