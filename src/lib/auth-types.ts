/**
 * Shared Auth Response Types + Role Mapping
 *
 * Common type shapes returned by auth-related API routes.
 * Extracted to avoid duplication between login and session routes (M5 fix).
 *
 * Role mapping (C6 fix):
 * Prisma UserRole enum uses UPPER_CASE (OWNER, MANAGER, VIEWER) while the
 * frontend AdminRole type uses lowercase ('owner', 'manager', 'viewer').
 * The `toFrontendRole()` function bridges this gap in every API response.
 *
 * @module lib/auth-types
 */

import type { UserRole } from '@prisma/client';
import type { AdminRole } from '@/types';

/**
 * Map a Prisma UserRole enum to the frontend AdminRole string.
 * Used in all API responses that include user data.
 */
const ROLE_MAP: Record<UserRole, AdminRole> = {
  OWNER: 'owner',
  MANAGER: 'manager',
  VIEWER: 'viewer',
} as const;

/**
 * Convert a Prisma UserRole to frontend AdminRole.
 *
 * @example toFrontendRole('OWNER') → 'owner'
 */
export function toFrontendRole(role: UserRole): AdminRole {
  return ROLE_MAP[role];
}

/**
 * User data shape returned in auth API responses.
 *
 * This is an intentional subset of `AdminUser` (src/types/admin.ts).
 * It omits `createdAt`, `lastLoginAt`, and `isActive` because the
 * login/session endpoints only need to identify the user and their
 * permissions. The full `AdminUser` shape (with timestamps and status)
 * will be returned by the admin user-management endpoints in Phase 2.
 *
 * Deliberately omits `passwordHash` and other sensitive fields.
 * Role is the frontend-compatible lowercase string.
 */
export interface AuthUserResponse {
  id: string;
  username: string;
  email: string;
  displayName: string;
  role: AdminRole;
}
