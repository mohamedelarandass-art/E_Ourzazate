import { Metadata } from 'next';
import Link from 'next/link';
import {
  Package,
  CheckCircle,
  FileText,
  Grid3x3,
  MessageSquare,
  Mail,
  Plus,
} from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { formatRelativeTime } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import styles from './dashboard.module.css';

export const metadata: Metadata = {
  title: 'Tableau de Bord',
};

const ACTION_LABELS: Record<string, string> = {
  LOGIN: 'Connexion',
  LOGOUT: 'Déconnexion',
  create_product: 'Création de produit',
  update_product: 'Mise à jour de produit',
  delete_product: 'Suppression de produit',
  create_category: 'Création de catégorie',
  update_category: 'Mise à jour de catégorie',
  delete_category: 'Suppression de catégorie',
};

export default async function DashboardPage() {
  const [
    totalProducts,
    publishedProducts,
    draftProducts,
    activeCategories,
    unreadMessages,
    activeSubscribers,
    recentActivity,
  ] = await Promise.all([
    prisma.product.count(),
    prisma.product.count({ where: { isPublished: true } }),
    prisma.product.count({ where: { isPublished: false } }),
    prisma.category.count({ where: { isActive: true } }),
    prisma.contactMessage.count({ where: { status: 'NEW' } }),
    prisma.newsletterSubscriber.count({ where: { isSubscribed: true } }),
    prisma.auditLog.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: { user: { select: { displayName: true } } },
    }),
  ]);

  const stats = [
    { label: 'Total Produits', value: totalProducts, icon: Package, variant: 'statIconProducts' as const },
    { label: 'Publiés', value: publishedProducts, icon: CheckCircle, variant: 'statIconPublished' as const },
    { label: 'Brouillons', value: draftProducts, icon: FileText, variant: 'statIconDrafts' as const },
    { label: 'Catégories actives', value: activeCategories, icon: Grid3x3, variant: 'statIconCategories' as const },
    { label: 'Messages non lus', value: unreadMessages, icon: MessageSquare, variant: 'statIconMessages' as const },
    { label: 'Abonnés newsletter', value: activeSubscribers, icon: Mail, variant: 'statIconNewsletter' as const },
  ];

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Tableau de Bord</h1>
        <p className={styles.pageSubtitle}>Vue d&apos;ensemble de votre catalogue</p>
      </div>

      {/* Stats */}
      <div className={styles.statsGrid}>
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className={styles.statCard}>
              <div className={`${styles.statIcon} ${styles[stat.variant]}`}>
                <Icon size={22} />
              </div>
              <div className={styles.statContent}>
                <p className={styles.statValue}>{stat.value}</p>
                <p className={styles.statLabel}>{stat.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions + Recent Activity */}
      <div className={styles.twoColumn}>
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Actions rapides</h2>
          </div>
          <div className={styles.sectionContent}>
            <div className={styles.quickActions}>
              <Button
                as="a"
                href="/admin/products/new"
                variant="primary"
                leftIcon={<Plus size={18} />}
                fullWidth
              >
                Ajouter un produit
              </Button>
              <Button
                as="a"
                href="/admin/messages"
                variant="outline"
                leftIcon={<MessageSquare size={18} />}
                fullWidth
              >
                Voir les messages
                {unreadMessages > 0 && ` (${unreadMessages})`}
              </Button>
            </div>
          </div>
        </div>

        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Activité récente</h2>
          </div>
          <div className={styles.sectionContent}>
            {recentActivity.length === 0 ? (
              <p className={styles.emptyActivity}>Aucune activité récente</p>
            ) : (
              <div className={styles.activityList}>
                {recentActivity.map((log) => (
                  <div key={log.id} className={styles.activityItem}>
                    <div className={styles.activityDot} />
                    <div className={styles.activityInfo}>
                      <p className={styles.activityAction}>
                        <strong>{log.user.displayName}</strong>
                        {' — '}
                        {ACTION_LABELS[log.action] || log.action}
                        {log.entityType && ` (${log.entityType})`}
                      </p>
                      <p className={styles.activityMeta}>
                        {formatRelativeTime(log.createdAt)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
