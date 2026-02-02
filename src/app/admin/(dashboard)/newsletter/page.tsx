import { Suspense } from 'react';
import { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth-utils';
import { toFrontendRole } from '@/lib/auth-types';
import NewsletterManager from './NewsletterManager';

export const metadata: Metadata = {
  title: 'Newsletter',
};

/**
 * Server-side paginated newsletter page.
 *
 * Fetches a bounded window of subscribers (max 200) to prevent unbounded
 * memory growth. The client component adds further client-side pagination
 * with PAGE_SIZE=20 for rendering performance.
 */
const SERVER_PAGE_SIZE = 200;

interface PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function NewsletterPage({ searchParams }: PageProps) {
  const { user } = await requireAuth();
  const params = await searchParams;

  const serverPage = Math.max(1, parseInt(String(params.page || '1'), 10));

  const [subscribers, totalCount, activeCount, unsubscribedThisMonth] = await Promise.all([
    prisma.newsletterSubscriber.findMany({
      orderBy: { subscribedAt: 'desc' },
      take: SERVER_PAGE_SIZE,
      skip: (serverPage - 1) * SERVER_PAGE_SIZE,
    }),
    prisma.newsletterSubscriber.count(),
    prisma.newsletterSubscriber.count({ where: { isSubscribed: true } }),
    prisma.newsletterSubscriber.count({
      where: {
        isSubscribed: false,
        unsubscribedAt: {
          gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        },
      },
    }),
  ]);

  const totalServerPages = Math.ceil(totalCount / SERVER_PAGE_SIZE);

  const initialSubscribers = subscribers.map((s) => ({
    id: s.id,
    email: s.email,
    isSubscribed: s.isSubscribed,
    source: s.source,
    subscribedAt: s.subscribedAt.toISOString(),
    unsubscribedAt: s.unsubscribedAt?.toISOString() ?? null,
  }));

  return (
    <Suspense fallback={null}>
      <NewsletterManager
        initialSubscribers={initialSubscribers}
        stats={{
          total: totalCount,
          active: activeCount,
          unsubscribedThisMonth,
        }}
        serverPage={serverPage}
        totalServerPages={totalServerPages}
        userRole={toFrontendRole(user.role)}
      />
    </Suspense>
  );
}
