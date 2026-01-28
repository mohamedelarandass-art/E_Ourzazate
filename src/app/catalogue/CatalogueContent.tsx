/**
 * CatalogueContent Component
 * 
 * Main content area with:
 * - Breadcrumb navigation
 * - View toggle (1 or 2 columns on mobile)
 * - Active filter chips (removable)
 * - Responsive product grid with Load More
 * - Empty state handling
 * 
 * @module app/catalogue/CatalogueContent
 */

'use client';

import { useMemo, useState, useCallback } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import {
    ChevronRight, X, PackageX, Star, Sparkles,
    ArrowUpAZ, ArrowDownAZ, LayoutGrid, LayoutList, Loader2,
    Home, Search
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ProductCard } from '@/components';
import type { Product, Category } from '@/types';
import styles from './page.module.css';

interface CatalogueContentProps {
    products: Product[];
    categories: Category[];
}

type SortOption = 'newest' | 'name-asc' | 'name-desc';
type ViewMode = 'single' | 'double';

const PRODUCTS_PER_PAGE = 10;

export function CatalogueContent({ products, categories }: CatalogueContentProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    // Read filters from URL
    const categorySlug = searchParams.get('category') || '';
    const showFeatured = searchParams.get('featured') === 'true';
    const showNew = searchParams.get('new') === 'true';
    const sortBy = (searchParams.get('sort') as SortOption) || 'newest';
    const viewMode = (searchParams.get('view') as ViewMode) || 'single';

    // Local state for displayed products count
    const [displayCount, setDisplayCount] = useState(PRODUCTS_PER_PAGE);
    const [isLoading, setIsLoading] = useState(false);

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

    // Products to display (with Load More)
    const displayedProducts = useMemo(() => {
        return filteredProducts.slice(0, displayCount);
    }, [filteredProducts, displayCount]);

    // Check if there are more products to load
    const hasMore = displayCount < filteredProducts.length;
    const remainingCount = filteredProducts.length - displayCount;

    // Load more products
    const handleLoadMore = useCallback(() => {
        setIsLoading(true);
        // Simulate a small delay for smooth UX
        setTimeout(() => {
            setDisplayCount(prev => Math.min(prev + PRODUCTS_PER_PAGE, filteredProducts.length));
            setIsLoading(false);
        }, 300);
    }, [filteredProducts.length]);

    // Toggle view mode
    const toggleViewMode = useCallback((mode: ViewMode) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('view', mode);
        router.push(`/catalogue?${params.toString()}`, { scroll: false });
    }, [router, searchParams]);

    // Remove a specific filter
    const removeFilter = (filterKey: string) => {
        const params = new URLSearchParams(searchParams.toString());
        params.delete(filterKey);
        // Reset display count when filters change
        setDisplayCount(PRODUCTS_PER_PAGE);
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

    // Grid class based on view mode
    const gridClass = viewMode === 'double'
        ? `${styles.productsGrid} ${styles.productsGridDouble}`
        : styles.productsGrid;

    return (
        <div className={styles.content}>
            {/* Breadcrumb - P2 #7: Enhanced with home icon */}
            <nav className={styles.breadcrumb} aria-label="Fil d'Ariane">
                <Link href="/" className={styles.breadcrumbLink}>
                    <Home size={14} className={styles.breadcrumbHomeIcon} aria-hidden="true" />
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

            {/* Page Header with View Toggle */}
            <header className={styles.contentHeader}>
                <div className={styles.headerLeft}>
                    <h1 className={styles.pageTitle}>{pageTitle}</h1>
                    {/* P2 #8: Enhanced product count messaging */}
                    <p className={styles.productCount}>
                        {selectedCategory ? (
                            <>
                                <span className={styles.countNumber}>{filteredProducts.length}</span>
                                {' '}
                                {filteredProducts.length === 1
                                    ? `${selectedCategory.name.toLowerCase()} trouvé`
                                    : `${selectedCategory.name.toLowerCase()}s trouvés`
                                }
                            </>
                        ) : (
                            <>
                                Découvrez notre sélection de{' '}
                                <span className={styles.countNumber}>{filteredProducts.length}</span>
                                {' '}
                                {filteredProducts.length === 1 ? 'produit' : 'produits'}
                            </>
                        )}
                    </p>
                </div>

                {/* View Toggle - Visible on mobile */}
                <div className={styles.viewToggle}>
                    <button
                        className={`${styles.viewButton} ${viewMode === 'single' ? styles.viewButtonActive : ''}`}
                        onClick={() => toggleViewMode('single')}
                        aria-label="Vue une colonne"
                        aria-pressed={viewMode === 'single'}
                    >
                        <LayoutList size={18} />
                    </button>
                    <button
                        className={`${styles.viewButton} ${viewMode === 'double' ? styles.viewButtonActive : ''}`}
                        onClick={() => toggleViewMode('double')}
                        aria-label="Vue deux colonnes"
                        aria-pressed={viewMode === 'double'}
                    >
                        <LayoutGrid size={18} />
                    </button>
                </div>
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
                <>
                    <motion.div
                        className={gridClass}
                        layout
                    >
                        <AnimatePresence mode="popLayout">
                            {displayedProducts.map((product, index) => (
                                <motion.div
                                    key={product.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{
                                        duration: 0.3,
                                        ease: "easeOut",
                                        layout: { duration: 0.3 }
                                    }}
                                    className={styles.productItem}
                                >
                                    <ProductCard
                                        product={product}
                                        compact={viewMode === 'double'}
                                    />
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </motion.div>

                    {/* Load More Section */}
                    <div className={styles.loadMoreSection}>
                        <p className={styles.loadMoreCount}>
                            {displayedProducts.length} sur {filteredProducts.length} produits affichés
                        </p>

                        {hasMore && (
                            <button
                                className={styles.loadMoreButton}
                                onClick={handleLoadMore}
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 size={18} className={styles.loadMoreSpinner} />
                                        Chargement...
                                    </>
                                ) : (
                                    <>
                                        Voir plus ({remainingCount} restant{remainingCount > 1 ? 's' : ''})
                                    </>
                                )}
                            </button>
                        )}
                    </div>
                </>
            ) : (
                /* P2 #9: Enhanced empty state */
                <div className={styles.emptyState}>
                    <div className={styles.emptyIcon}>
                        <Search size={56} strokeWidth={1.2} />
                    </div>
                    <h2 className={styles.emptyTitle}>
                        {selectedCategory
                            ? `Aucun ${selectedCategory.name.toLowerCase()} disponible`
                            : 'Aucun produit trouvé'
                        }
                    </h2>
                    <p className={styles.emptyText}>
                        {selectedCategory ? (
                            <>
                                Nous n&apos;avons pas trouvé de {selectedCategory.name.toLowerCase()} correspondant à vos filtres.
                                Essayez de modifier vos critères ou explorez nos autres catégories.
                            </>
                        ) : (
                            <>
                                Aucun produit ne correspond à vos critères de recherche.
                                Découvrez nos luminaires, notre carrelage premium ou nos équipements sanitaires.
                            </>
                        )}
                    </p>
                    <div className={styles.emptyActions}>
                        <Link href="/catalogue" className={styles.emptyButton}>
                            Voir tous les produits
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
}
