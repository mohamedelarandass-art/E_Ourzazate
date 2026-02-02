'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { Mail, Phone, MessageSquare, Inbox, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button, Badge } from '@/components/ui';
import { useToast } from '@/components/ui/Toast/Toast';
import { formatRelativeTime } from '@/lib/utils';
import type { AdminRole } from '@/types';
import styles from './messages.module.css';

type MessageStatus = 'NEW' | 'READ' | 'REPLIED' | 'ARCHIVED';

interface MessageItem {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  productId?: string;
  productName?: string;
  status: MessageStatus;
  notes?: string;
  createdAt: string;
}

interface MessageManagerProps {
  initialMessages: MessageItem[];
  totalMessages: number;
  serverPage: number;
  totalServerPages: number;
  userRole: AdminRole;
}

type FilterTab = 'ALL' | 'NEW' | 'READ' | 'ARCHIVED';

const PAGE_SIZE = 20;

const STATUS_BADGE_VARIANT: Record<MessageStatus, 'primary' | 'default' | 'success'> = {
  NEW: 'primary',
  READ: 'default',
  REPLIED: 'success',
  ARCHIVED: 'default',
};

const STATUS_LABELS: Record<MessageStatus, string> = {
  NEW: 'Nouveau',
  READ: 'Lu',
  REPLIED: 'Repondu',
  ARCHIVED: 'Archive',
};

export default function MessageManager({
  initialMessages,
  totalMessages,
  serverPage,
  totalServerPages,
  userRole,
}: MessageManagerProps) {
  const toast = useToast();
  const [messages, setMessages] = useState<MessageItem[]>(initialMessages);
  const [activeTab, setActiveTab] = useState<FilterTab>('ALL');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [notesMap, setNotesMap] = useState<Record<string, string>>(() => {
    const map: Record<string, string> = {};
    for (const m of initialMessages) {
      if (m.notes) map[m.id] = m.notes;
    }
    return map;
  });
  const [savingId, setSavingId] = useState<string | null>(null);

  const canEdit = userRole === 'owner' || userRole === 'manager';

  const filteredMessages = messages.filter((m) => {
    if (activeTab === 'ALL') return true;
    return m.status === activeTab;
  });

  // Client-side pagination over the filtered list
  const totalPages = Math.ceil(filteredMessages.length / PAGE_SIZE);
  const paginatedMessages = filteredMessages.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE,
  );

  const newCount = messages.filter((m) => m.status === 'NEW').length;

  // I-NEW-2 fix: use messages.length for "Tous" badge to stay consistent
  // with client state after status changes, and show totalMessages only
  // when it differs (i.e. there are more messages on other server pages)
  const allCount = totalMessages > messages.length ? totalMessages : messages.length;

  const tabs: { key: FilterTab; label: string; count?: number }[] = [
    { key: 'ALL', label: 'Tous', count: allCount },
    { key: 'NEW', label: 'Nouveaux', count: newCount },
    { key: 'READ', label: 'Lus' },
    { key: 'ARCHIVED', label: 'Archives' },
  ];

  const handleTabChange = (tab: FilterTab) => {
    setActiveTab(tab);
    setPage(1); // Reset pagination when switching tabs
  };

  const handleUpdateStatus = useCallback(async (id: string, status: MessageStatus) => {
    setSavingId(id);
    try {
      const res = await fetch(`/api/admin/messages/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      const json = await res.json();

      if (!res.ok || !json.success) {
        toast.error('Erreur', json.error || 'Impossible de mettre a jour le statut.');
        return;
      }

      setMessages((prev) =>
        prev.map((m) => (m.id === id ? { ...m, status } : m)),
      );
      toast.success(`Message marque comme ${STATUS_LABELS[status].toLowerCase()}`);
    } catch {
      toast.error('Erreur', 'Une erreur est survenue.');
    } finally {
      setSavingId(null);
    }
  }, [toast]);

  const handleSaveNotes = useCallback(async (id: string) => {
    setSavingId(id);
    try {
      const notes = notesMap[id] || '';
      const res = await fetch(`/api/admin/messages/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes }),
      });
      const json = await res.json();

      if (!res.ok || !json.success) {
        toast.error('Erreur', json.error || 'Impossible de sauvegarder les notes.');
        return;
      }

      setMessages((prev) =>
        prev.map((m) => (m.id === id ? { ...m, notes } : m)),
      );
      toast.success('Notes sauvegardees');
    } catch {
      toast.error('Erreur', 'Une erreur est survenue.');
    } finally {
      setSavingId(null);
    }
  }, [notesMap, toast]);

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.pageHeader}>
        <div className={styles.pageHeaderTop}>
          <h1 className={styles.pageTitle}>Messages</h1>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className={styles.filterTabs}>
        {tabs.map((tab) => (
          <button
            key={tab.key}
            className={`${styles.filterTab} ${activeTab === tab.key ? styles.filterTabActive : ''}`}
            onClick={() => handleTabChange(tab.key)}
          >
            {tab.label}
            {tab.count !== undefined && tab.count > 0 && (
              <span className={styles.tabBadge}>{tab.count}</span>
            )}
          </button>
        ))}
      </div>

      {/* Message List */}
      <div className={styles.section}>
        {paginatedMessages.length === 0 ? (
          <div className={styles.empty}>
            <Inbox size={48} className={styles.emptyIcon} />
            <p className={styles.emptyTitle}>Aucun message</p>
            <p className={styles.emptyText}>
              {activeTab === 'ALL'
                ? 'Aucun message pour le moment.'
                : `Aucun message avec le statut "${tabs.find((t) => t.key === activeTab)?.label}".`}
            </p>
          </div>
        ) : (
          paginatedMessages.map((msg) => (
            <div key={msg.id} className={styles.messageRow}>
              {/* Clickable header */}
              <button
                className={styles.messageHeader}
                onClick={() => toggleExpand(msg.id)}
              >
                <div className={styles.messageInfo}>
                  <p className={styles.messageName}>{msg.name}</p>
                  <p className={styles.messageSubject}>{msg.subject}</p>
                  <div className={styles.messageMeta}>
                    <span className={styles.messageDate}>
                      {formatRelativeTime(msg.createdAt)}
                    </span>
                    <span className={styles.messageEmail}>{msg.email}</span>
                  </div>
                </div>
                <Badge
                  variant={STATUS_BADGE_VARIANT[msg.status]}
                  size="sm"
                >
                  {STATUS_LABELS[msg.status]}
                </Badge>
              </button>

              {/* Expanded detail */}
              {expandedId === msg.id && (
                <div className={styles.messageDetail}>
                  {/* Contact info */}
                  <div className={styles.messageContact}>
                    <span className={styles.messageContactItem}>
                      <Mail size={14} /> {msg.email}
                    </span>
                    {msg.phone && (
                      <span className={styles.messageContactItem}>
                        <Phone size={14} /> {msg.phone}
                      </span>
                    )}
                  </div>

                  {/* Product reference */}
                  {msg.productId && (
                    <p className={styles.productRef}>
                      <MessageSquare size={12} />{' '}
                      Concernant le produit : {msg.productName || 'Produit supprime'}
                    </p>
                  )}

                  {/* Message body */}
                  <div className={styles.messageBody}>{msg.message}</div>

                  {/* Notes */}
                  {canEdit && (
                    <div className={styles.notesSection}>
                      <label className={styles.notesLabel}>Notes internes</label>
                      <textarea
                        className={styles.notesTextarea}
                        value={notesMap[msg.id] ?? msg.notes ?? ''}
                        onChange={(e) =>
                          setNotesMap((prev) => ({ ...prev, [msg.id]: e.target.value }))
                        }
                        placeholder="Ajouter des notes..."
                        rows={2}
                      />
                      <div className={styles.messageActions}>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleSaveNotes(msg.id)}
                          isLoading={savingId === msg.id}
                          loadingText="Sauvegarde..."
                        >
                          Sauvegarder les notes
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Status actions */}
                  {canEdit && (
                    <div className={styles.messageActions}>
                      {msg.status === 'NEW' && (
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => handleUpdateStatus(msg.id, 'READ')}
                          isLoading={savingId === msg.id}
                        >
                          Marquer comme lu
                        </Button>
                      )}
                      {msg.status !== 'ARCHIVED' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleUpdateStatus(msg.id, 'ARCHIVED')}
                          isLoading={savingId === msg.id}
                        >
                          Archiver
                        </Button>
                      )}
                      {msg.status !== 'REPLIED' && msg.status !== 'NEW' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleUpdateStatus(msg.id, 'REPLIED')}
                          isLoading={savingId === msg.id}
                        >
                          Marquer comme repondu
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))
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
              href={`/admin/messages?page=${serverPage - 1}`}
              className={`${styles.serverPaginationLink} ${serverPage <= 1 ? styles.serverPaginationDisabled : ''}`}
              aria-label="Lot precedent"
            >
              <ChevronLeft size={16} />
            </Link>
            <span className={styles.serverPaginationInfo}>
              Lot {serverPage} sur {totalServerPages}
            </span>
            <Link
              href={`/admin/messages?page=${serverPage + 1}`}
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
