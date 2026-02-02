/**
 * Request Utilities — CSRF Protection + Rate Limiting
 *
 * Shared helpers for API route handlers:
 * - Origin header validation (CSRF defense)
 * - IP extraction (Vercel-aware, non-spoofable)
 * - In-memory rate limiter with automatic cleanup
 *
 * NOTE: The rate limiter uses an in-memory Map. This is per-process and
 * resets on deploy/cold-start. For production at scale, migrate to Redis
 * or Vercel KV. Flagged as Phase 2 tech debt.
 *
 * @module lib/request-utils
 */

import { NextRequest } from 'next/server';
import { ForbiddenError, RateLimitError } from './errors';

// ──────────────────────────────────────────────
// CSRF Origin Validation (C3)
// ──────────────────────────────────────────────

/**
 * Validate that the request Origin header matches the Host header.
 * Prevents cross-origin form submissions and same-site subdomain attacks.
 *
 * Limitation: Non-browser clients (curl, Postman, custom scripts) can omit
 * the Origin header entirely and bypass this check. This is acceptable
 * because CSRF is a browser-specific attack vector — non-browser clients
 * already control their own requests and don't need CSRF protection.
 * Server-side auth (session cookie validation) remains the primary gate.
 *
 * @throws ForbiddenError if origin is present and doesn't match host.
 */
export function validateOrigin(request: NextRequest): void {
  const origin = request.headers.get('origin');
  const host = request.headers.get('host');

  // No Origin header — allow. Non-browser clients won't send it, and
  // same-origin fetches may omit it. See JSDoc above for rationale.
  if (!origin) return;

  if (!host) {
    throw new ForbiddenError('Origine de la requete invalide');
  }

  try {
    const originHost = new URL(origin).host;
    if (originHost !== host) {
      throw new ForbiddenError('Origine de la requete invalide');
    }
  } catch (error) {
    // Re-throw our own ForbiddenError (from the host mismatch above)
    if (error instanceof ForbiddenError) throw error;
    // URL parse failure — treat as invalid origin
    throw new ForbiddenError('Origine de la requete invalide');
  }
}

// ──────────────────────────────────────────────
// Client IP Extraction (C4)
// ──────────────────────────────────────────────

/**
 * Extract the real client IP from a NextRequest.
 *
 * Priority:
 * 1. `request.ip` — Set by Vercel from the actual connecting IP (non-spoofable)
 * 2. `x-forwarded-for` — Fallback for local dev behind a proxy
 * 3. `'unknown'` — Last resort
 *
 * Note: `request.ip` is only available on Vercel. In local dev, we fall back
 * to headers which ARE spoofable — acceptable for development only.
 */
export function getClientIp(request: NextRequest): string {
  // Vercel provides this reliably — not spoofable via headers
  if ('ip' in request && typeof request.ip === 'string' && request.ip) {
    return request.ip;
  }
  // Fallback for local dev
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    'unknown'
  );
}

// ──────────────────────────────────────────────
// Rate Limiter with Cleanup (C5)
// ──────────────────────────────────────────────

interface RateLimitEntry {
  count: number;
  firstAttempt: number;
}

interface RateLimiterConfig {
  /** Maximum attempts before blocking. */
  maxAttempts: number;
  /** Time window in milliseconds. */
  windowMs: number;
  /** Maximum entries to store before forced cleanup. */
  maxEntries: number;
}

const DEFAULT_CONFIG: RateLimiterConfig = {
  maxAttempts: 5,
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxEntries: 10_000,
};

/**
 * In-memory rate limiter with automatic cleanup of expired entries.
 *
 * Bounded to `maxEntries` to prevent unbounded memory growth (C5).
 * Expired entries are purged on every `check()` call when the map
 * exceeds 80% capacity, and forced-purged at 100%.
 *
 * TECH DEBT: Replace with Redis/Vercel KV for multi-instance deployments.
 */
export class RateLimiter {
  private readonly entries = new Map<string, RateLimitEntry>();
  private readonly config: RateLimiterConfig;

  constructor(config?: Partial<RateLimiterConfig>) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  /** Check if the given key is rate-limited. Throws RateLimitError if so. */
  check(key: string): void {
    this.cleanupIfNeeded();

    const now = Date.now();
    const entry = this.entries.get(key);

    if (!entry) return;

    // Reset window if expired
    if (now - entry.firstAttempt > this.config.windowMs) {
      this.entries.delete(key);
      return;
    }

    if (entry.count >= this.config.maxAttempts) {
      const elapsed = now - entry.firstAttempt;
      const remainingMs = this.config.windowMs - elapsed;
      const retryAfterSeconds = Math.ceil(Math.max(remainingMs, 1000) / 1000);
      throw new RateLimitError(retryAfterSeconds);
    }
  }

  /** Record a failed attempt for the given key. */
  recordFailure(key: string): void {
    const now = Date.now();
    const entry = this.entries.get(key);

    if (!entry || now - entry.firstAttempt > this.config.windowMs) {
      this.entries.set(key, { count: 1, firstAttempt: now });
    } else {
      entry.count += 1;
    }
  }

  /** Clear all attempts for the given key (e.g., after successful login). */
  clear(key: string): void {
    this.entries.delete(key);
  }

  /** Purge expired entries when the map grows too large. */
  private cleanupIfNeeded(): void {
    if (this.entries.size < this.config.maxEntries * 0.8) return;

    const now = Date.now();
    for (const [key, entry] of this.entries) {
      if (now - entry.firstAttempt > this.config.windowMs) {
        this.entries.delete(key);
      }
    }

    // If still over limit after cleanup, drop entries by insertion order.
    // Map iteration order in JS is insertion-order, which approximates
    // oldest-first. Not strictly timestamp-sorted, but acceptable for
    // an in-memory rate limiter that will be replaced by Redis in Phase 2.
    if (this.entries.size >= this.config.maxEntries) {
      const overflow = this.entries.size - Math.floor(this.config.maxEntries * 0.5);
      let removed = 0;
      for (const key of this.entries.keys()) {
        if (removed >= overflow) break;
        this.entries.delete(key);
        removed++;
      }
    }
  }
}

/** Shared login rate limiter instance. */
export const loginRateLimiter = new RateLimiter({
  maxAttempts: 5,
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxEntries: 10_000,
});
