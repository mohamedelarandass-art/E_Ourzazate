/**
 * CategoryProducts - Client Component
 * 
 * Handles sorting and displays products grid with interactivity.
 * Separated from the main page to allow server-side rendering.
 * 
 * @module app/catalogue/[slug]/CategoryProducts
 */

'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { ArrowUpDown, PackageX } from 'lucide-react';
import { ProductCard } from '@/components';
import type { Product } from '@/types';
import styles from './page.module.css';

type SortOption = 'name-asc' | 'name-desc' | 'newest' | 'oldest';

interface CategoryProductsProps {
    products: Product[];
    categoryName: string;
}

const sortOptions: { value: SortOption; label: string }[] = [
    { value: 'name-asc', label: 'Nom A-Z' },
    { value: 'name-desc', label: 'Nom Z-A' },
    { value: 'newest', label: 'Plus récent' },
    { value: 'oldest', label: 'Plus ancien' },
];

export function CategoryProducts({ products, categoryName }: CategoryProductsProps) {
    const [sortBy, setSortBy] = useState<SortOption>('newest');

    // Sort products based on selected option
    const sortedProducts = useMemo(() => {
        const sorted = [...products];

        switch (sortBy) {
            case 'name-asc':
                return sorted.sort((a, b) => a.name.localeCompare(b.name, 'fr'));
            case 'name-desc':
                return sorted.sort((a, b) => b.name.localeCompare(a.name, 'fr'));
            case 'newest':
                return sorted.sort((a, b) =>
                    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                );
            case 'oldest':
                return sorted.sort((a, b) =>
                    new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
                );
            default:
                return sorted;
        }
    }, [products, sortBy]);

    // Empty state
    if (products.length === 0) {
        return (
            <section className={styles.emptySection}>
                <div className={styles.emptyContent}>
                    <div className={styles.emptyIcon}>
                        <PackageX size={64} strokeWidth={1} />
                    </div>
                    <h2 className={styles.emptyTitle}>
                        Aucun produit disponible
                    </h2>
                    <p className={styles.emptyText}>
                        Il n'y a pas encore de produits dans la catégorie {categoryName}.
                        Revenez bientôt pour découvrir nos nouveautés !
                    </p>
                    <Link href="/catalogue" className={styles.emptyButton}>
                        Explorer d'autres catégories
                    </Link>
                </div>
            </section>
        );
    }

    return (
        <section className={styles.productsSection} aria-label="Liste des produits">
            {/* Toolbar */}
            <div className={styles.toolbar}>
                <div className={styles.productCount}>
                    <span className={styles.countHighlight}>{products.length}</span>
                    {' '}
                    {products.length === 1 ? 'produit trouvé' : 'produits trouvés'}
                </div>

                <div className={styles.sortWrapper}>
                    <ArrowUpDown size={16} className={styles.sortIcon} aria-hidden="true" />
                    <label htmlFor="sort-select" className="sr-only">
                        Trier par
                    </label>
                    <select
                        id="sort-select"
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as SortOption)}
                        className={styles.sortSelect}
                        aria-label="Trier les produits"
                    >
                        {sortOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Products Grid */}
            <div className={styles.productsGrid}>
                {sortedProducts.map((product, index) => (
                    <div
                        key={product.id}
                        className={styles.productItem}
                        style={{ animationDelay: `${index * 80}ms` }}
                    >
                        <ProductCard product={product} />
                    </div>
                ))}
            </div>
        </section>
    );
}
