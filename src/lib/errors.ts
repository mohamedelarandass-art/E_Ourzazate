/**
 * Custom Error Classes
 *
 * Structured error hierarchy for consistent API error responses.
 * Each error carries an HTTP status code and machine-readable code
 * so the global handler can produce a uniform ApiResponse envelope.
 *
 * @module lib/errors
 */

import { NextResponse } from 'next/server';
import type { ApiResponse } from '@/types';

/**
 * Base application error.
 * All custom errors extend this class.
 */
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly details?: Record<string, string>;

  constructor(
    statusCode: number,
    code: string,
    message: string,
    details?: Record<string, string>,
  ) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
  }
}

/** 400 — Request validation failed. */
export class ValidationError extends AppError {
  constructor(message: string, details?: Record<string, string>) {
    super(400, 'VALIDATION_ERROR', message, details);
    this.name = 'ValidationError';
  }
}

/** 401 — Missing or invalid credentials. */
export class UnauthorizedError extends AppError {
  constructor(message = 'Non autorise') {
    super(401, 'UNAUTHORIZED', message);
    this.name = 'UnauthorizedError';
  }
}

/** 403 — Authenticated but insufficient permissions. */
export class ForbiddenError extends AppError {
  constructor(message = 'Acces interdit') {
    super(403, 'FORBIDDEN', message);
    this.name = 'ForbiddenError';
  }
}

/** 404 — Resource not found. */
export class NotFoundError extends AppError {
  constructor(message = 'Ressource introuvable') {
    super(404, 'NOT_FOUND', message);
    this.name = 'NotFoundError';
  }
}

/** 429 — Too many requests. */
export class RateLimitError extends AppError {
  public readonly retryAfterSeconds: number;

  constructor(
    retryAfterSeconds = 900,
    message = 'Trop de tentatives. Veuillez reessayer plus tard.',
  ) {
    super(429, 'RATE_LIMIT', message);
    this.name = 'RateLimitError';
    this.retryAfterSeconds = retryAfterSeconds;
  }
}

/**
 * Convert any thrown value into a structured NextResponse.
 * Used as a catch-all in API route handlers.
 */
export function apiErrorResponse(error: unknown): NextResponse<ApiResponse<never>> {
  if (error instanceof AppError) {
    const body: ApiResponse<never> = {
      success: false,
      error: error.message,
      ...(error.details ? { details: error.details } : {}),
    };
    const headers: HeadersInit = {};
    if (error instanceof RateLimitError) {
      headers['Retry-After'] = String(error.retryAfterSeconds);
    }
    return NextResponse.json(body, { status: error.statusCode, headers });
  }

  // Unexpected errors — hide internals in production
  const message =
    process.env.NODE_ENV === 'development' && error instanceof Error
      ? error.message
      : 'Erreur interne du serveur';

  return NextResponse.json<ApiResponse<never>>(
    { success: false, error: message },
    { status: 500 },
  );
}
