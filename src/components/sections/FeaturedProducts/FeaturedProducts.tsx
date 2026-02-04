/**
 * FeaturedProducts Section - Premium Design
 *
 * Grid of featured products for the homepage.
 * Features:
 * - Elegant section header with decorative elements
 * - Animated entrance effects
 * - Premium product card grid
 * - Loading skeleton while fetching (I4)
 * - AbortController cleanup on unmount (I4)
 * - res.ok check before parsing JSON (M6)
 * - Error state with retry button (I7)
 *
 * @module components/sections/FeaturedProducts
 */

'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { Sparkles, AlertTriangle, RefreshCw } from 'lucide-react';
import { ProductCard } from '@/components/product';
import { MagneticButton } from '@/components/ui';
import type { Product } from '@/types';
import styles from './FeaturedProducts.module.css';

export interface FeaturedProductsProps {
    className?: string;
    limit?: number;
}

export function FeaturedProducts({ className, limit = 6 }: FeaturedProductsProps) {
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isVisible, setIsVisible] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Ref to the current AbortController so retry aborts any in-flight request (I5).
    const controllerRef = useRef<AbortController | null>(null);

    // Fetch featured products from public API with AbortController cleanup (I4/I5)
    const fetchProducts = useCallback(() => {
        // Abort any in-flight request before starting a new one (I5).
        controllerRef.current?.abort();
        const controller = new AbortController();
        controllerRef.current = controller;

        setIsLoading(true);
        setError(null);

        fetch(`/api/public/products?featured=true&limit=${limit}`, {
            signal: controller.signal,
        })
            .then((res) => {
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                return res.json();
            })
            .then((data) => {
                setProducts(data.products ?? []);
                setIsLoading(false);
            })
            .catch((err) => {
                if (err instanceof DOMException && err.name === 'AbortError') return;
                console.error('[FeaturedProducts] Fetch failed:', err);
                setError('Impossible de charger les produits vedettes.');
                setIsLoading(false);
            });
    }, [limit]);

    useEffect(() => {
        fetchProducts();
        return () => controllerRef.current?.abort();
    }, [fetchProducts]);

    // Trigger entrance animation
    useEffect(() => {
        const timer = setTimeout(() => setIsVisible(true), 100);
        return () => clearTimeout(timer);
    }, []);

    return (
        <section className={`${styles.section} ${className || ''} ${isVisible ? styles.visible : ''}`}>
            {/* Decorative Background */}
            <div className={styles.decorBg} aria-hidden="true">
                <div className={styles.decorCircle1} />
                <div className={styles.decorCircle2} />
            </div>

            <div className="container">
                {/* Header */}
                <div className={styles.header}>
                    <div className={styles.headerContent}>
                        <div className={styles.eyebrowWrapper}>
                            <Sparkles size={16} className={styles.eyebrowIcon} />
                            <span className={styles.eyebrow}>Produits Vedettes</span>
                        </div>
                        <h2 className={styles.title}>Nos Meilleures Sélections</h2>
                        <p className={styles.description}>
                            Découvrez notre sélection de produits premium, choisis pour leur qualité exceptionnelle.
                        </p>
                    </div>
                    <div className={styles.headerCta}>
                        <MagneticButton href="/catalogue" size="lg" strength={0.4}>
                            Voir Tout le Catalogue
                        </MagneticButton>
                    </div>
                </div>

                {/* Error State (I7) */}
                {error && !isLoading ? (
                    <div className={styles.errorState}>
                        <AlertTriangle size={32} className={styles.errorIcon} />
                        <p className={styles.errorMessage}>{error}</p>
                        <button
                            className={styles.retryButton}
                            onClick={fetchProducts}
                            type="button"
                        >
                            <RefreshCw size={16} />
                            Réessayer
                        </button>
                    </div>
                ) : (
                    /* Products Grid — show skeleton placeholders while loading (I4) */
                    <div className={styles.grid}>
                        {isLoading
                            ? Array.from({ length: limit }).map((_, i) => (
                                <div
                                    key={`skeleton-${i}`}
                                    className={`${styles.gridItem} ${styles.skeletonCard}`}
                                    style={{ animationDelay: `${0.1 + i * 0.08}s` } as React.CSSProperties}
                                    aria-hidden="true"
                                >
                                    <div className={styles.skeletonImage} />
                                    <div className={styles.skeletonBody}>
                                        <div className={styles.skeletonLine} />
                                        <div className={styles.skeletonLineShort} />
                                    </div>
                                </div>
                            ))
                            : products.map((product, index) => (
                                <div
                                    key={product.id}
                                    className={styles.gridItem}
                                    style={{ animationDelay: `${0.1 + index * 0.08}s` } as React.CSSProperties}
                                >
                                    <ProductCard product={product} />
                                </div>
                            ))
                        }
                    </div>
                )}

                {/* Mobile CTA */}
                <div className={styles.mobileCta}>
                    <MagneticButton href="/catalogue" size="xl">
                        Voir Tout le Catalogue
                    </MagneticButton>
                </div>
            </div>
        </section>
    );
}
