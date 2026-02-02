'use client';

import { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Download, ChevronLeft, ChevronRight, Users } from 'lucide-react';
import { Button, Input, Badge } from '@/components/ui';
import { formatDate } from '@/lib/utils';
import type { AdminRole } from '@/types';
import styles from './newsletter.module.css';

interface SubscriberItem {
  id: string;
  email: string;
  isSubscribed: boolean;
  source: string | null;
  subscribedAt: string;
  unsubscribedAt: string | null;
}

interface NewsletterManagerProps {
  initialSubscribers: SubscriberItem[];
  stats: {
    total: number;
    active: number;
    unsubscribedThisMonth: number;
  };
  serverPage: number;
  totalServerPages: number;
  userRole: AdminRole;
}

const PAGE_SIZE = 20;

/**
 * Sanitize a cell value for CSV export.
 * - Escape double quotes by doubling them.
 * - Prefix cells starting with =, +, -, @ with a tab character to prevent
 *   formula injection when opened in Excel (I-4 fix).
 */
function sanitizeCsvCell(cell: string): string {
  let sanitized = cell.replace(/"/g, '""');
  if (/^[=+\-@]/.test(sanitized)) {
    sanitized = '\t' + sanitized;
  }
  return `"${sanitized}"`;
}

export default function NewsletterManager({
  initialSubscribers,
  stats,
  serverPage,
  totalServerPages,
  userRole,
}: NewsletterManagerProps) {
  const [subscribers] = useState<SubscriberItem[]>(initialSubscribers);

  // Controlled input value + debounced search query (I-1 fix)
  const [inputValue, setInputValue] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(null);

  // M-NEW-3 fix: clean up debounce timer on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  const canExport = userRole === 'owner' || userRole === 'manager';

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value); // Update displayed value immediately (I-1 fix)
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setSearchQuery(value);
      setPage(1);
    }, 300);
  };

  // Memoize filtered list so useCallback deps are stable (M-4 fix)
  const filtered = useMemo(
    () =>
      subscribers.filter((s) =>
        s.email.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
    [subscribers, searchQuery],
  );

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleExportCSV = useCallback(() => {
    const headers = ['Email', 'Statut', 'Source', 'Date inscription'];
    const rows = filtered.map((s) => [
      s.email,
      s.isSubscribed ? 'Actif' : 'Desabonne',
      s.source || 'website',
      formatDate(s.subscribedAt),
    ]);

    // Use sanitizeCsvCell for formula injection protection (I-4 fix)
    const csv = [headers, ...rows]
      .map((row) => row.map(sanitizeCsvCell).join(','))
      .join('\n');

    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `newsletter-abonnes-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [filtered]);

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.pageHeader}>
        <div className={styles.pageHeaderTop}>
          <h1 className={styles.pageTitle}>Newsletter</h1>
          {canExport && (
            <Button
              variant="outline"
              size="sm"
              leftIcon={<Download size={16} />}
              onClick={handleExportCSV}
            >
              Exporter CSV
            </Button>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Total abonnes</span>
          <p className={styles.statValue}>{stats.total}</p>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Actifs</span>
          <p className={styles.statValue}>{stats.active}</p>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Desabonnes ce mois</span>
          <p className={styles.statValue}>{stats.unsubscribedThisMonth}</p>
        </div>
      </div>

      {/* Search — controlled input (I-1 fix) */}
      <div className={styles.toolbar}>
        <div className={styles.searchRow}>
          <Input
            placeholder="Rechercher par email..."
            value={inputValue}
            onChange={handleSearchChange}
          />
        </div>
      </div>

      {/* Subscriber Table */}
      <div className={styles.section}>
        {paginated.length === 0 ? (
          <div className={styles.empty}>
            <Users size={48} className={styles.emptyIcon} />
            <p className={styles.emptyTitle}>Aucun abonne</p>
            <p className={styles.emptyText}>
              {searchQuery
                ? 'Aucun resultat pour cette recherche.'
                : 'Aucun abonne a la newsletter pour le moment.'}
            </p>
          </div>
        ) : (
          <>
            {/* Mobile rows */}
            <div className={styles.mobileOnly}>
              {paginated.map((sub) => (
                <div key={sub.id} className={styles.mobileRow}>
                  <div className={styles.mobileInfo}>
                    <p className={styles.mobileEmail}>{sub.email}</p>
                    <div className={styles.mobileMeta}>
                      <span className={styles.mobileDate}>
                        {formatDate(sub.subscribedAt)}
                      </span>
                      <Badge
                        variant={sub.isSubscribed ? 'success' : 'default'}
                        size="sm"
                      >
                        {sub.isSubscribed ? 'Actif' : 'Desabonne'}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop table */}
            <table className={`${styles.table} ${styles.desktopOnly}`}>
              <thead>
                <tr>
                  <th>Email</th>
                  <th>Date d&apos;inscription</th>
                  <th>Source</th>
                  <th>Statut</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((sub) => (
                  <tr key={sub.id}>
                    <td>{sub.email}</td>
                    <td>{formatDate(sub.subscribedAt)}</td>
                    <td>{sub.source || 'website'}</td>
                    <td>
                      <Badge
                        variant={sub.isSubscribed ? 'success' : 'default'}
                        size="sm"
                      >
                        {sub.isSubscribed ? 'Actif' : 'Desabonne'}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}

        {/* Client-side pagination (within current server page) */}
        {totalPages > 1 && (
          <div className={styles.pagination}>
            <button
              className={styles.paginationButton}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              aria-label="Page precedente"
            >
              <ChevronLeft size={18} />
            </button>
            <span className={styles.paginationInfo}>
              Page {page} sur {totalPages}
            </span>
            <button
              className={styles.paginationButton}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              aria-label="Page suivante"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        )}

        {/* Server-side pagination (navigate between server pages) */}
        {totalServerPages > 1 && (
          <div className={styles.serverPagination}>
            <Link
              href={`/admin/newsletter?page=${serverPage - 1}`}
              className={`${styles.serverPaginationLink} ${serverPage <= 1 ? styles.serverPaginationDisabled : ''}`}
              aria-label="Lot precedent"
            >
              <ChevronLeft size={16} />
            </Link>
            <span className={styles.serverPaginationInfo}>
              Lot {serverPage} sur {totalServerPages}
            </span>
            <Link
              href={`/admin/newsletter?page=${serverPage + 1}`}
              className={`${styles.serverPaginationLink} ${serverPage >= totalServerPages ? styles.serverPaginationDisabled : ''}`}
              aria-label="Lot suivant"
            >
              <ChevronRight size={16} />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
