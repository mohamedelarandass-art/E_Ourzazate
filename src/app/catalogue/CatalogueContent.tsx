/**
 * CatalogueContent Component
 * 
 * Main content area with:
 * - Breadcrumb navigation
 * - Active filter chips (removable)
 * - Responsive product grid
 * - Empty state handling
 * 
 * @module app/catalogue/CatalogueContent
 */

'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { ChevronRight, X, PackageX, Star, Sparkles, ArrowUpAZ, ArrowDownAZ, Clock } from 'lucide-react';
import { ProductCard } from '@/components';
import type { Product, Category } from '@/types';
import styles from './page.module.css';

interface CatalogueContentProps {
    products: Product[];
    categories: Category[];
}

type SortOption = 'newest' | 'name-asc' | 'name-desc';

export function CatalogueContent({ products, categories }: CatalogueContentProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    // Read filters from URL
    const categorySlug = searchParams.get('category') || '';
    const showFeatured = searchParams.get('featured') === 'true';
    const showNew = searchParams.get('new') === 'true';
    const sortBy = (searchParams.get('sort') as SortOption) || 'newest';

    // Get category details
    const selectedCategory = categories.find(c => c.slug === categorySlug);

    // Filter and sort products
    const filteredProducts = useMemo(() => {
        let result = [...products];

        // Filter by category
        if (categorySlug) {
            const catId = `cat-${categorySlug}`;
            result = result.filter(p => p.categoryId === catId);
        }

        // Filter by featured
        if (showFeatured) {
            result = result.filter(p => p.isFeatured);
        }

        // Filter by new
        if (showNew) {
            result = result.filter(p => p.isNew);
        }

        // Sort
        switch (sortBy) {
            case 'name-asc':
                result.sort((a, b) => a.name.localeCompare(b.name, 'fr'));
                break;
            case 'name-desc':
                result.sort((a, b) => b.name.localeCompare(a.name, 'fr'));
                break;
            case 'newest':
            default:
                result.sort((a, b) =>
                    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                );
                break;
        }

        return result;
    }, [products, categorySlug, showFeatured, showNew, sortBy]);

    // Remove a specific filter
    const removeFilter = (filterKey: string) => {
        const params = new URLSearchParams(searchParams.toString());
        params.delete(filterKey);
        router.push(`/catalogue${params.toString() ? `?${params.toString()}` : ''}`, { scroll: false });
    };

    // Build active filters list
    const activeFilters: { key: string; label: string; icon: React.ReactNode }[] = [];

    if (categorySlug && selectedCategory) {
        activeFilters.push({
            key: 'category',
            label: selectedCategory.name,
            icon: <span className={styles.chipEmoji}>{selectedCategory.icon}</span>,
        });
    }
    if (showFeatured) {
        activeFilters.push({
            key: 'featured',
            label: 'Vedette',
            icon: <Star size={12} />,
        });
    }
    if (showNew) {
        activeFilters.push({
            key: 'new',
            label: 'Nouveau',
            icon: <Sparkles size={12} />,
        });
    }
    if (sortBy === 'name-asc') {
        activeFilters.push({
            key: 'sort',
            label: 'Nom A-Z',
            icon: <ArrowUpAZ size={12} />,
        });
    } else if (sortBy === 'name-desc') {
        activeFilters.push({
            key: 'sort',
            label: 'Nom Z-A',
            icon: <ArrowDownAZ size={12} />,
        });
    }

    // Page title
    const pageTitle = selectedCategory ? selectedCategory.name : 'Tous les produits';

    return (
        <div className={styles.content}>
            {/* Breadcrumb */}
            <nav className={styles.breadcrumb} aria-label="Fil d'Ariane">
                <Link href="/" className={styles.breadcrumbLink}>
                    Accueil
                </Link>
                <ChevronRight size={14} className={styles.breadcrumbSeparator} aria-hidden="true" />
                <Link href="/catalogue" className={styles.breadcrumbLink}>
                    Catalogue
                </Link>
                {selectedCategory && (
                    <>
                        <ChevronRight size={14} className={styles.breadcrumbSeparator} aria-hidden="true" />
                        <span className={styles.breadcrumbCurrent} aria-current="page">
                            {selectedCategory.name}
                        </span>
                    </>
                )}
            </nav>

            {/* Page Header */}
            <header className={styles.contentHeader}>
                <h1 className={styles.pageTitle}>{pageTitle}</h1>
                <p className={styles.productCount}>
                    <span className={styles.countNumber}>{filteredProducts.length}</span>
                    {' '}
                    {filteredProducts.length === 1 ? 'produit' : 'produits'}
                </p>
            </header>

            {/* Active Filters Chips */}
            {activeFilters.length > 0 && (
                <div className={styles.activeFilters} aria-label="Filtres actifs">
                    {activeFilters.map((filter) => (
                        <button
                            key={filter.key}
                            className={styles.filterChip}
                            onClick={() => removeFilter(filter.key)}
                            aria-label={`Retirer le filtre: ${filter.label}`}
                        >
                            {filter.icon}
                            <span>{filter.label}</span>
                            <X size={14} className={styles.chipClose} />
                        </button>
                    ))}
                </div>
            )}

            {/* Products Grid or Empty State */}
            {filteredProducts.length > 0 ? (
                <div className={styles.productsGrid}>
                    {filteredProducts.map((product, index) => (
                        <div
                            key={product.id}
                            className={styles.productItem}
                            style={{ animationDelay: `${index * 60}ms` }}
                        >
                            <ProductCard product={product} />
                        </div>
                    ))}
                </div>
            ) : (
                <div className={styles.emptyState}>
                    <div className={styles.emptyIcon}>
                        <PackageX size={56} strokeWidth={1.2} />
                    </div>
                    <h2 className={styles.emptyTitle}>Aucun produit trouvé</h2>
                    <p className={styles.emptyText}>
                        Aucun produit ne correspond à vos critères de recherche.
                        Essayez de modifier vos filtres ou explorez d'autres catégories.
                    </p>
                    <Link href="/catalogue" className={styles.emptyButton}>
                        Voir tous les produits
                    </Link>
                </div>
            )}

            {/* Infinite Scroll Indicator (placeholder for future) */}
            {filteredProducts.length > 0 && (
                <div className={styles.loadMoreIndicator}>
                    <span className={styles.indicatorText}>
                        {filteredProducts.length} sur {filteredProducts.length} produits affichés
                    </span>
                </div>
            )}
        </div>
    );
}
