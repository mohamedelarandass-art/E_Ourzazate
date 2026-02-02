import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { validateOrigin, getClientIp, RateLimiter } from '@/lib/request-utils';
import { newsletterSchema } from '@/lib/validations';
import { ValidationError, apiErrorResponse } from '@/lib/errors';
import type { ApiResponse } from '@/types';

const newsletterRateLimiter = new RateLimiter({
  maxAttempts: 5,
  windowMs: 60 * 60 * 1000, // 5 per IP per hour
});

export async function POST(request: NextRequest) {
  try {
    validateOrigin(request);

    const ip = getClientIp(request);
    newsletterRateLimiter.check(ip);

    const body: unknown = await request.json();
    const parsed = newsletterSchema.safeParse(body);

    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        fieldErrors[issue.path.join('.')] = issue.message;
      }
      throw new ValidationError('Donnees invalides', fieldErrors);
    }

    const { email, source } = parsed.data;

    // Record attempt BEFORE the DB write so that even if the write fails
    // (e.g. DB timeout), the attempt is still counted against the rate limit.
    // This prevents unlimited retries of failing requests.
    newsletterRateLimiter.recordFailure(ip);

    // Upsert logic: re-subscribe if unsubscribed, idempotent if already subscribed
    const existing = await prisma.newsletterSubscriber.findUnique({
      where: { email },
    });

    if (existing) {
      if (!existing.isSubscribed) {
        // Re-subscribe
        await prisma.newsletterSubscriber.update({
          where: { email },
          data: {
            isSubscribed: true,
            unsubscribedAt: null,
            subscribedAt: new Date(),
          },
        });
      }
      // If already subscribed, do nothing (idempotent)
    } else {
      // Create new subscriber
      await prisma.newsletterSubscriber.create({
        data: {
          email,
          source: source || 'website',
          isSubscribed: true,
        },
      });
    }

    return NextResponse.json<ApiResponse<null>>({
      success: true,
    });
  } catch (error) {
    return apiErrorResponse(error);
  }
}
