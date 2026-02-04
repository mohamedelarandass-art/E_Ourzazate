/**
 * CategoryGrid Section - Premium Bento Layout
 *
 * Grid of all product categories for the homepage.
 * Features Bento-style asymmetric layout with varying card sizes.
 *
 * Enhancements:
 * - Loading skeleton while fetching (I5)
 * - AbortController cleanup on unmount (I5)
 * - res.ok check before parsing JSON (M6)
 * - Error state with retry button (I7)
 *
 * @module components/sections/CategoryGrid
 */

'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { CategoryCard } from '@/components/product';
import type { Category } from '@/types';
import styles from './CategoryGrid.module.css';

export interface CategoryGridProps {
    className?: string;
}

/**
 * Hardcoded slug-to-layout mapping for the Bento grid.
 *
 * ⚠️  Coupling note (M7): These slugs must match the `slug` column in the
 *    `categories` table. If a category slug is renamed or new categories are
 *    added in the admin panel, this map may need updating. Consider storing
 *    layout preference in the Category model (e.g. a `displayLayout` field)
 *    if this becomes a maintenance burden.
 */
const categoryLayouts: Record<string, 'normal' | 'wide' | 'tall'> = {
    'sanitaire': 'tall',
    'luminaire': 'wide',
};

/** Number of skeleton cards to show while loading. */
const SKELETON_COUNT = 5;

export function CategoryGrid({ className }: CategoryGridProps) {
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isVisible, setIsVisible] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Ref to the current AbortController so retry aborts any in-flight request (I5).
    const controllerRef = useRef<AbortController | null>(null);

    // Fetch active categories from public API with AbortController cleanup (I5)
    const fetchCategories = useCallback(() => {
        // Abort any in-flight request before starting a new one (I5).
        controllerRef.current?.abort();
        const controller = new AbortController();
        controllerRef.current = controller;

        setIsLoading(true);
        setError(null);

        fetch('/api/public/categories', { signal: controller.signal })
            .then((res) => {
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                return res.json();
            })
            .then((data) => {
                setCategories(data.categories ?? []);
                setIsLoading(false);
            })
            .catch((err) => {
                if (err instanceof DOMException && err.name === 'AbortError') return;
                console.error('[CategoryGrid] Fetch failed:', err);
                setError('Impossible de charger les catégories.');
                setIsLoading(false);
            });
    }, []);

    useEffect(() => {
        fetchCategories();
        return () => controllerRef.current?.abort();
    }, [fetchCategories]);

    // Trigger entrance animation
    useEffect(() => {
        const timer = setTimeout(() => setIsVisible(true), 100);
        return () => clearTimeout(timer);
    }, []);

    return (
        <section className={`${styles.section} ${className || ''} ${isVisible ? styles.visible : ''}`}>
            <div className="container">
                {/* Header */}
                <div className={styles.header}>
                    <span className={styles.eyebrow}>Nos Catégories</span>
                    <h2 className={styles.title}>Explorez Notre Catalogue</h2>
                    <p className={styles.description}>
                        Découvrez nos 5 catégories de produits soigneusement sélectionnés
                        pour répondre à tous vos besoins en construction et équipement de maison.
                    </p>
                </div>

                {/* Error State (I7) */}
                {error && !isLoading ? (
                    <div className={styles.errorState}>
                        <AlertTriangle size={32} className={styles.errorIcon} />
                        <p className={styles.errorMessage}>{error}</p>
                        <button
                            className={styles.retryButton}
                            onClick={fetchCategories}
                            type="button"
                        >
                            <RefreshCw size={16} />
                            Réessayer
                        </button>
                    </div>
                ) : (
                    /* Bento Grid — show skeletons while loading (I5) */
                    <div className={styles.grid}>
                        {isLoading
                            ? Array.from({ length: SKELETON_COUNT }).map((_, i) => (
                                <div
                                    key={`skeleton-${i}`}
                                    className={`${styles.card} ${styles.skeletonCard}`}
                                    style={{ animationDelay: `${0.1 + i * 0.08}s` } as React.CSSProperties}
                                    aria-hidden="true"
                                >
                                    <div className={styles.skeletonInner}>
                                        <div className={styles.skeletonLine} />
                                        <div className={styles.skeletonLineShort} />
                                    </div>
                                </div>
                            ))
                            : categories.map((category, index) => {
                                const layout = categoryLayouts[category.slug] || 'normal';
                                const isFeatured = layout !== 'normal';

                                return (
                                    <CategoryCard
                                        key={category.id}
                                        category={category}
                                        featured={isFeatured}
                                        gridSpan={layout}
                                        className={styles.card}
                                        style={{ animationDelay: `${0.1 + index * 0.08}s` } as React.CSSProperties}
                                    />
                                );
                            })
                        }
                    </div>
                )}
            </div>
        </section>
    );
}
