import { Metadata } from 'next';
import { requireAuth } from '@/lib/auth-utils';
import { toFrontendRole } from '@/lib/auth-types';
import { prisma } from '@/lib/prisma';
import AdminShell from './AdminShell';

export const metadata: Metadata = {
  title: {
    default: 'Administration',
    template: '%s - Administration',
  },
  robots: { index: false, follow: false },
};

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = await requireAuth();

  const unreadMessages = await prisma.contactMessage.count({
    where: { status: 'NEW' },
  });

  return (
    <AdminShell
      user={{
        displayName: user.displayName,
        role: toFrontendRole(user.role),
      }}
      unreadMessages={unreadMessages}
    >
      {children}
    </AdminShell>
  );
}
