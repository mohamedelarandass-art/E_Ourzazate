import { Suspense } from 'react';
import { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth-utils';
import { toFrontendRole } from '@/lib/auth-types';
import MessageManager from './MessageManager';

export const metadata: Metadata = {
  title: 'Messages',
};

/**
 * Server-side paginated messages page.
 *
 * Fetches a bounded window of messages (max 200) to prevent unbounded memory
 * growth as the contact_messages table grows. The client component adds
 * further client-side pagination with PAGE_SIZE=20 for rendering performance.
 */
const SERVER_PAGE_SIZE = 200;

interface PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function MessagesPage({ searchParams }: PageProps) {
  const { user } = await requireAuth();
  const params = await searchParams;

  const serverPage = Math.max(1, parseInt(String(params.page || '1'), 10));
  const statusFilter = String(params.status || '');

  // Build optional status filter
  const where: Record<string, unknown> = {};
  if (statusFilter && ['NEW', 'READ', 'REPLIED', 'ARCHIVED'].includes(statusFilter)) {
    where.status = statusFilter;
  }

  const [messages, total] = await Promise.all([
    prisma.contactMessage.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: SERVER_PAGE_SIZE,
      skip: (serverPage - 1) * SERVER_PAGE_SIZE,
    }),
    prisma.contactMessage.count({ where }),
  ]);

  // Resolve product names for messages that reference a product
  const productIds = messages
    .map((m) => m.productId)
    .filter((id): id is string => id !== null);

  const products = productIds.length > 0
    ? await prisma.product.findMany({
        where: { id: { in: productIds } },
        select: { id: true, name: true },
      })
    : [];

  const productMap = new Map(products.map((p) => [p.id, p.name]));

  const initialMessages = messages.map((m) => ({
    id: m.id,
    name: m.name,
    email: m.email,
    phone: m.phone ?? undefined,
    subject: m.subject,
    message: m.message,
    productId: m.productId ?? undefined,
    productName: m.productId ? productMap.get(m.productId) ?? undefined : undefined,
    status: m.status as 'NEW' | 'READ' | 'REPLIED' | 'ARCHIVED',
    notes: m.notes ?? undefined,
    createdAt: m.createdAt.toISOString(),
  }));

  const totalServerPages = Math.ceil(total / SERVER_PAGE_SIZE);

  return (
    <Suspense fallback={null}>
      <MessageManager
        initialMessages={initialMessages}
        totalMessages={total}
        serverPage={serverPage}
        totalServerPages={totalServerPages}
        userRole={toFrontendRole(user.role)}
      />
    </Suspense>
  );
}
