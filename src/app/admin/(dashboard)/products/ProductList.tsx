'use client';

import { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  Search,
  Plus,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Package,
  ImageIcon,
} from 'lucide-react';
import { cn, formatRelativeTime, truncate } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { useToast } from '@/components/ui/Toast/Toast';
import styles from './products.module.css';

import type { Category } from '@/types';

interface ProductItem {
  id: string;
  name: string;
  slug: string;
  description: string;
  categoryId: string;
  category: { name: string; slug: string };
  images: { id: string; url: string; alt: string; order: number; isFeatured: boolean }[];
  isNew: boolean;
  isFeatured: boolean;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
  _count: { variations: number };
}

interface ProductListProps {
  initialProducts: ProductItem[];
  initialTotal: number;
  initialPage: number;
  initialPageSize: number;
  categories: Category[];
  userRole: 'owner' | 'manager' | 'viewer';
}

/**
 * Media query hook with SSR-safe hydration.
 * Returns `null` during SSR/first render (before mount),
 * then the real match value after hydration.
 * This avoids hydration mismatch by rendering BOTH layouts
 * via CSS on the server, then switching to JS-only on client.
 */
function useMediaQuery(query: string): boolean | null {
  const [matches, setMatches] = useState<boolean | null>(null);

  useEffect(() => {
    const mql = window.matchMedia(query);
    setMatches(mql.matches);

    function onChange(e: MediaQueryListEvent) {
      setMatches(e.matches);
    }
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, [query]);

  return matches;
}

export default function ProductList({
  initialProducts,
  initialTotal,
  initialPage,
  initialPageSize,
  categories,
  userRole,
}: ProductListProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const toast = useToast();
  const isDesktop = useMediaQuery('(min-width: 768px)');

  const [products, setProducts] = useState(initialProducts);
  const [total, setTotal] = useState(initialTotal);
  const [page, setPage] = useState(initialPage);
  const [loading, setLoading] = useState(false);

  // I4+I5: Initialize filters from URL searchParams
  const [search, setSearch] = useState(searchParams.get('search') ?? '');
  const [categoryId, setCategoryId] = useState(searchParams.get('categoryId') ?? '');
  const [statusFilter, setStatusFilter] = useState(searchParams.get('status') ?? '');
  const [sortBy, setSortBy] = useState(searchParams.get('sortBy') ?? 'createdAt');

  const [deleteTarget, setDeleteTarget] = useState<ProductItem | null>(null);
  const [deleting, setDeleting] = useState(false);

  const totalPages = Math.ceil(total / initialPageSize);
  const canMutate = userRole === 'owner' || userRole === 'manager';

  // I3: Use ref to access latest filter values without stale closures
  const filtersRef = useRef({ search, categoryId, statusFilter, sortBy });
  filtersRef.current = { search, categoryId, statusFilter, sortBy };

  // I4+I5: Sync filters to URL searchParams
  const syncFiltersToUrl = useCallback(
    (params: { page: number; search: string; categoryId: string; statusFilter: string; sortBy: string }) => {
      const url = new URL(window.location.href);
      const sp = url.searchParams;

      // Set or delete params
      if (params.search) sp.set('search', params.search); else sp.delete('search');
      if (params.categoryId) sp.set('categoryId', params.categoryId); else sp.delete('categoryId');
      if (params.statusFilter) sp.set('status', params.statusFilter); else sp.delete('status');
      if (params.sortBy !== 'createdAt') sp.set('sortBy', params.sortBy); else sp.delete('sortBy');
      if (params.page > 1) sp.set('page', String(params.page)); else sp.delete('page');

      router.replace(url.pathname + (sp.toString() ? `?${sp}` : ''), { scroll: false });
    },
    [router],
  );

  const fetchProducts = useCallback(
    async (params: {
      page: number;
      search: string;
      categoryId: string;
      statusFilter: string;
      sortBy: string;
    }) => {
      setLoading(true);
      try {
        const query = new URLSearchParams();
        query.set('page', String(params.page));
        query.set('pageSize', String(initialPageSize));
        if (params.search) query.set('search', params.search);
        if (params.categoryId) query.set('categoryId', params.categoryId);
        if (params.statusFilter === 'published') query.set('isPublished', 'true');
        if (params.statusFilter === 'draft') query.set('isPublished', 'false');
        query.set('sortBy', params.sortBy);
        query.set('sortOrder', 'desc');

        const res = await fetch(`/api/admin/products?${query}`);
        const json = await res.json();

        if (json.success && json.data) {
          setProducts(json.data.items);
          setTotal(json.data.total);
          setPage(json.data.page);
        }
      } catch {
        toast.error('Erreur', 'Impossible de charger les produits');
      } finally {
        setLoading(false);
      }
    },
    [initialPageSize, toast],
  );

  // I3: Stable debounced search using ref — no stale closure
  const searchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const debouncedSearch = useMemo(
    () => (value: string) => {
      if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
      searchTimerRef.current = setTimeout(() => {
        const f = filtersRef.current;
        const params = { page: 1, search: value, categoryId: f.categoryId, statusFilter: f.statusFilter, sortBy: f.sortBy };
        fetchProducts(params);
        syncFiltersToUrl(params);
      }, 300);
    },
    [fetchProducts, syncFiltersToUrl],
  );

  function handleSearchChange(value: string) {
    setSearch(value);
    debouncedSearch(value);
  }

  function handleFilterChange(newCategory: string, newStatus: string, newSort: string) {
    setCategoryId(newCategory);
    setStatusFilter(newStatus);
    setSortBy(newSort);
    const params = { page: 1, search, categoryId: newCategory, statusFilter: newStatus, sortBy: newSort };
    fetchProducts(params);
    syncFiltersToUrl(params);
  }

  function handlePageChange(newPage: number) {
    setPage(newPage);
    const params = { page: newPage, search, categoryId, statusFilter, sortBy };
    fetchProducts(params);
    syncFiltersToUrl(params);
  }

  async function handleTogglePublish(product: ProductItem) {
    try {
      const res = await fetch(`/api/admin/products/${product.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isPublished: !product.isPublished }),
      });

      if (res.status === 403) {
        toast.error('Accès refusé', 'Vous n\'avez pas la permission de modifier ce produit');
        return;
      }
      if (res.status === 429) {
        toast.error('Trop de requêtes', 'Veuillez patienter avant de réessayer');
        return;
      }

      const json = await res.json();
      if (json.success) {
        setProducts((prev) =>
          prev.map((p) =>
            p.id === product.id ? { ...p, isPublished: !p.isPublished } : p,
          ),
        );
        toast.success(product.isPublished ? 'Produit dépublié' : 'Produit publié');
      } else {
        toast.error('Erreur', json.error || 'Impossible de modifier le statut');
      }
    } catch {
      toast.error('Erreur', 'Impossible de modifier le statut');
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/products/${deleteTarget.id}`, {
        method: 'DELETE',
      });
      const json = await res.json();
      if (json.success) {
        toast.success('Succès', json.data?.message || 'Produit supprimé');
        setDeleteTarget(null);
        fetchProducts({ page, search, categoryId, statusFilter, sortBy });
      } else {
        toast.error('Erreur', json.error || 'Échec de la suppression');
      }
    } catch {
      toast.error('Erreur', 'Impossible de supprimer le produit');
    } finally {
      setDeleting(false);
    }
  }

  const thumbnailUrl = (product: ProductItem) =>
    product.images.length > 0 ? product.images[0].url : null;

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.pageHeader}>
        <div className={styles.pageHeaderTop}>
          <h1 className={styles.pageTitle}>Produits</h1>
          {canMutate && (
            <Button
              as="a"
              href="/admin/products/new"
              variant="primary"
              size="sm"
              leftIcon={<Plus size={18} />}
            >
              Nouveau Produit
            </Button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className={styles.filters}>
        <div className={styles.searchRow}>
          <Input
            placeholder="Rechercher un produit..."
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            leftIcon={<Search size={18} />}
            className={styles.searchInput}
          />
        </div>
        <div className={styles.filterRow}>
          <select
            className={styles.filterSelect}
            value={categoryId}
            onChange={(e) => handleFilterChange(e.target.value, statusFilter, sortBy)}
          >
            <option value="">Toutes les catégories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          <select
            className={styles.filterSelect}
            value={statusFilter}
            onChange={(e) => handleFilterChange(categoryId, e.target.value, sortBy)}
          >
            <option value="">Tous les statuts</option>
            <option value="published">Publié</option>
            <option value="draft">Brouillon</option>
          </select>
          <select
            className={styles.filterSelect}
            value={sortBy}
            onChange={(e) => handleFilterChange(categoryId, statusFilter, e.target.value)}
          >
            <option value="createdAt">Plus récent</option>
            <option value="name">Nom</option>
            <option value="updatedAt">Dernière modification</option>
          </select>
        </div>
      </div>

      {/* Products */}
      <div className={styles.tableWrapper}>
        {products.length === 0 ? (
          <div className={styles.empty}>
            <Package size={48} className={styles.emptyIcon} />
            <p className={styles.emptyTitle}>Aucun produit trouvé</p>
            <p className={styles.emptyText}>
              {search || categoryId || statusFilter
                ? 'Essayez de modifier vos filtres'
                : 'Commencez par ajouter votre premier produit'}
            </p>
          </div>
        ) : (
          <>
            {/*
             * N2: SSR-safe responsive rendering.
             * isDesktop is null on server/first render → render BOTH layouts,
             * CSS hides the wrong one via media queries (already in products.module.css).
             * After hydration, JS takes over and renders only the correct layout.
             */}
            {(isDesktop === null || !isDesktop) && (
              <div className={isDesktop === null ? styles.mobileOnly : undefined}>
                {products.map((product) => {
                  const thumb = thumbnailUrl(product);
                  return (
                    <div key={product.id} className={styles.mobileRow}>
                      {thumb ? (
                        <Image
                          src={thumb}
                          alt={product.name}
                          width={56}
                          height={56}
                          className={styles.mobileThumb}
                        />
                      ) : (
                        <div className={styles.mobileThumbPlaceholder}>
                          <ImageIcon size={20} />
                        </div>
                      )}
                      <div className={styles.mobileInfo}>
                        <p className={styles.mobileName}>{truncate(product.name, 40)}</p>
                        <div className={styles.mobileMeta}>
                          <Badge variant="default" size="sm">{product.category.name}</Badge>
                          <span className={product.isPublished ? styles.statusPublished : styles.statusDraft}>
                            {product.isPublished ? 'Publié' : 'Brouillon'}
                          </span>
                          <span className={styles.mobileDate}>
                            {formatRelativeTime(product.createdAt)}
                          </span>
                        </div>
                      </div>
                      <div className={styles.mobileActions}>
                        {canMutate && (
                          <>
                            <Link
                              href={`/admin/products/${product.id}/edit`}
                              className={styles.actionButton}
                              aria-label="Modifier"
                            >
                              <Pencil size={16} />
                            </Link>
                            <button
                              className={cn(styles.actionButton, styles.actionButtonDanger)}
                              onClick={() => setDeleteTarget(product)}
                              aria-label="Supprimer"
                            >
                              <Trash2 size={16} />
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {(isDesktop === null || isDesktop) && (
              <table className={cn(styles.table, isDesktop === null && styles.desktopOnly)}>
                <thead>
                  <tr>
                    <th style={{ width: '60px' }}></th>
                    <th>Nom</th>
                    <th>Catégorie</th>
                    <th>Statut</th>
                    <th>Date</th>
                    {canMutate && <th style={{ width: '120px' }}>Actions</th>}
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => {
                    const thumb = thumbnailUrl(product);
                    return (
                      <tr key={product.id}>
                        <td>
                          {thumb ? (
                            <Image
                              src={thumb}
                              alt={product.name}
                              width={40}
                              height={40}
                              className={styles.thumb}
                            />
                          ) : (
                            <div className={styles.thumbPlaceholder}>
                              <ImageIcon size={16} />
                            </div>
                          )}
                        </td>
                        <td>
                          <span className={styles.productName}>
                            {truncate(product.name, 50)}
                          </span>
                        </td>
                        <td>
                          <Badge variant="default" size="sm">{product.category.name}</Badge>
                        </td>
                        <td>
                          <button
                            className={product.isPublished ? styles.statusPublished : styles.statusDraft}
                            onClick={() => canMutate && handleTogglePublish(product)}
                            disabled={!canMutate}
                            style={{ cursor: canMutate ? 'pointer' : 'default', border: 'none' }}
                          >
                            {product.isPublished ? 'Publié' : 'Brouillon'}
                          </button>
                        </td>
                        <td>{formatRelativeTime(product.createdAt)}</td>
                        {canMutate && (
                          <td>
                            <div className={styles.actions}>
                              <Link
                                href={`/admin/products/${product.id}/edit`}
                                className={styles.actionButton}
                                aria-label="Modifier"
                              >
                                <Pencil size={16} />
                              </Link>
                              <button
                                className={cn(styles.actionButton, styles.actionButtonDanger)}
                                onClick={() => setDeleteTarget(product)}
                                aria-label="Supprimer"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className={styles.pagination}>
            <button
              className={styles.paginationButton}
              onClick={() => handlePageChange(page - 1)}
              disabled={page <= 1 || loading}
              aria-label="Page précédente"
            >
              <ChevronLeft size={18} />
            </button>
            <span className={styles.paginationInfo}>
              Page {page} / {totalPages}
            </span>
            <button
              className={styles.paginationButton}
              onClick={() => handlePageChange(page + 1)}
              disabled={page >= totalPages || loading}
              aria-label="Page suivante"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        )}
      </div>

      {/* Delete confirmation modal */}
      <Modal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Supprimer le produit"
        size="sm"
        footer={
          <>
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>
              Annuler
            </Button>
            <Button
              variant="danger"
              onClick={handleDelete}
              isLoading={deleting}
              loadingText="Suppression..."
            >
              {userRole === 'owner' ? 'Supprimer définitivement' : 'Dépublier'}
            </Button>
          </>
        }
      >
        <p>
          {userRole === 'owner'
            ? `Êtes-vous sûr de vouloir supprimer définitivement « ${deleteTarget?.name} » ? Cette action est irréversible.`
            : `Le produit « ${deleteTarget?.name} » sera dépublié. Seul un propriétaire peut supprimer définitivement un produit.`}
        </p>
      </Modal>
    </div>
  );
}
