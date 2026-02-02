import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { validateOrigin, getClientIp, RateLimiter } from '@/lib/request-utils';
import { contactFormSchema } from '@/lib/validations';
import { ValidationError, apiErrorResponse } from '@/lib/errors';
import type { ApiResponse } from '@/types';

const contactRateLimiter = new RateLimiter({
  maxAttempts: 3,
  windowMs: 60 * 60 * 1000, // 3 per IP per hour
});

export async function POST(request: NextRequest) {
  try {
    validateOrigin(request);

    const ip = getClientIp(request);
    contactRateLimiter.check(ip);

    const body: unknown = await request.json();
    const parsed = contactFormSchema.safeParse(body);

    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        fieldErrors[issue.path.join('.')] = issue.message;
      }
      throw new ValidationError('Donnees du formulaire invalides', fieldErrors);
    }

    const { name, email, phone, subject, message, productId } = parsed.data;

    // Record attempt BEFORE the DB write so that even if the write fails
    // (e.g. DB timeout), the attempt is still counted against the rate limit.
    // This prevents unlimited retries of failing requests.
    contactRateLimiter.recordFailure(ip);

    const contactMessage = await prisma.contactMessage.create({
      data: {
        name,
        email,
        phone,
        subject,
        message,
        productId,
      },
    });

    return NextResponse.json<ApiResponse<{ referenceId: string }>>(
      {
        success: true,
        data: { referenceId: contactMessage.id },
      },
      { status: 201 },
    );
  } catch (error) {
    return apiErrorResponse(error);
  }
}
