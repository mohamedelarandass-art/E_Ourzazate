/**
 * CatalogueSidebar Component
 * 
 * Left sidebar with:
 * - Category pills for filtering
 * - Type filters (Vedette, Nouveau)
 * - Sort options (radio buttons)
 * - Apply filters button
 * 
 * @module app/catalogue/CatalogueSidebar
 */

'use client';

import { useState, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Filter, Sparkles, Star, ArrowUpAZ, ArrowDownAZ, Clock, X } from 'lucide-react';
import type { Category } from '@/types';
import styles from './page.module.css';

interface CatalogueSidebarProps {
    categories: Category[];
    /** When true, only renders the mobile FAB button and filter drawer (used at page level) */
    mobileOnly?: boolean;
}

type SortOption = 'newest' | 'name-asc' | 'name-desc';

export function CatalogueSidebar({ categories, mobileOnly = false }: CatalogueSidebarProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    // Read initial state from URL
    const currentCategory = searchParams.get('category') || '';
    const currentFeatured = searchParams.get('featured') === 'true';
    const currentNew = searchParams.get('new') === 'true';
    const currentSort = (searchParams.get('sort') as SortOption) || 'newest';

    // Local state for form
    const [selectedCategory, setSelectedCategory] = useState(currentCategory);
    const [showFeatured, setShowFeatured] = useState(currentFeatured);
    const [showNew, setShowNew] = useState(currentNew);
    const [sortBy, setSortBy] = useState<SortOption>(currentSort);

    // Mobile sidebar toggle
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    // Check if there are any active filters
    const hasActiveFilters = selectedCategory || showFeatured || showNew || sortBy !== 'newest';

    // Apply filters - update URL
    const applyFilters = useCallback(() => {
        const params = new URLSearchParams();

        if (selectedCategory) params.set('category', selectedCategory);
        if (showFeatured) params.set('featured', 'true');
        if (showNew) params.set('new', 'true');
        if (sortBy !== 'newest') params.set('sort', sortBy);

        // Preserve view mode
        const currentView = searchParams.get('view');
        if (currentView) params.set('view', currentView);

        const queryString = params.toString();
        router.push(`/catalogue${queryString ? `?${queryString}` : ''}`, { scroll: false });

        // Close mobile sidebar after applying
        setIsMobileOpen(false);
    }, [router, searchParams, selectedCategory, showFeatured, showNew, sortBy]);

    // Clear all filters
    const clearAllFilters = useCallback(() => {
        setSelectedCategory('');
        setShowFeatured(false);
        setShowNew(false);
        setSortBy('newest');

        // Preserve view mode when clearing
        const currentView = searchParams.get('view');
        const params = new URLSearchParams();
        if (currentView) params.set('view', currentView);

        router.push(`/catalogue${params.toString() ? `?${params.toString()}` : ''}`, { scroll: false });
        setIsMobileOpen(false);
    }, [router, searchParams]);

    // Handle category click (toggle)
    const handleCategoryClick = (slug: string) => {
        setSelectedCategory(prev => prev === slug ? '' : slug);
    };

    // Mobile-only mode: render FAB button, overlay, and drawer
    if (mobileOnly) {
        return (
            <>
                {/* Mobile Toggle Button - Now toggles open/closed */}
                <button
                    className={styles.mobileFilterButton}
                    onClick={() => setIsMobileOpen(!isMobileOpen)}
                    aria-label={isMobileOpen ? "Fermer les filtres" : "Ouvrir les filtres"}
                    aria-expanded={isMobileOpen}
                >
                    <Filter size={20} />
                    <span>Filtres</span>
                    {hasActiveFilters && <span className={styles.filterBadge} />}
                </button>

                {/* Mobile Overlay */}
                {isMobileOpen && (
                    <div
                        className={styles.mobileOverlay}
                        onClick={() => setIsMobileOpen(false)}
                        aria-hidden="true"
                    />
                )}

                {/* Mobile Drawer Sidebar */}
                <div className={`${styles.mobileSidebar} ${isMobileOpen ? styles.sidebarOpen : ''}`}>
                    {/* Mobile Close Button */}
                    <button
                        className={styles.mobileCloseButton}
                        onClick={() => setIsMobileOpen(false)}
                        aria-label="Fermer les filtres"
                    >
                        <X size={24} />
                    </button>

                    {/* Section Title */}
                    <h2 className={styles.sidebarTitle}>
                        <Filter size={18} />
                        Filtres et Catégories
                    </h2>

                    {/* Category Pills */}
                    <div className={styles.filterSection}>
                        <div className={styles.categoryPills}>
                            <button
                                className={`${styles.categoryPill} ${!selectedCategory ? styles.categoryPillActive : ''}`}
                                onClick={() => setSelectedCategory('')}
                                aria-pressed={!selectedCategory}
                            >
                                Tout
                            </button>
                            {categories.map((cat) => (
                                <button
                                    key={cat.id}
                                    className={`${styles.categoryPill} ${selectedCategory === cat.slug ? styles.categoryPillActive : ''}`}
                                    onClick={() => handleCategoryClick(cat.slug)}
                                    aria-pressed={selectedCategory === cat.slug}
                                >
                                    {cat.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Type Filters */}
                    <div className={styles.filterSection}>
                        <h3 className={styles.filterSectionTitle}>Type</h3>
                        <div className={styles.filterGroup}>
                            <label className={styles.checkboxLabel}>
                                <input
                                    type="checkbox"
                                    checked={showFeatured}
                                    onChange={(e) => setShowFeatured(e.target.checked)}
                                    className={styles.checkboxInput}
                                />
                                <span className={styles.checkboxCustom}>
                                    {showFeatured && <span className={styles.checkboxCheck} />}
                                </span>
                                <Star size={12} className={styles.filterIcon} />
                                <span>Vedette</span>
                            </label>
                            <label className={styles.checkboxLabel}>
                                <input
                                    type="checkbox"
                                    checked={showNew}
                                    onChange={(e) => setShowNew(e.target.checked)}
                                    className={styles.checkboxInput}
                                />
                                <span className={styles.checkboxCustom}>
                                    {showNew && <span className={styles.checkboxCheck} />}
                                </span>
                                <Sparkles size={12} className={styles.filterIcon} />
                                <span>Nouveau</span>
                            </label>
                        </div>
                    </div>

                    {/* Sort Options */}
                    <div className={styles.filterSection}>
                        <h3 className={styles.filterSectionTitle}>Tri</h3>
                        <div className={styles.filterGroup}>
                            <label className={styles.radioLabel}>
                                <input
                                    type="radio"
                                    name="sort-mobile"
                                    value="name-asc"
                                    checked={sortBy === 'name-asc'}
                                    onChange={() => setSortBy('name-asc')}
                                    className={styles.radioInput}
                                />
                                <span className={styles.radioCustom}>
                                    {sortBy === 'name-asc' && <span className={styles.radioDot} />}
                                </span>
                                <ArrowUpAZ size={12} className={styles.filterIcon} />
                                <span>A-Z</span>
                            </label>
                            <label className={styles.radioLabel}>
                                <input
                                    type="radio"
                                    name="sort-mobile"
                                    value="name-desc"
                                    checked={sortBy === 'name-desc'}
                                    onChange={() => setSortBy('name-desc')}
                                    className={styles.radioInput}
                                />
                                <span className={styles.radioCustom}>
                                    {sortBy === 'name-desc' && <span className={styles.radioDot} />}
                                </span>
                                <ArrowDownAZ size={12} className={styles.filterIcon} />
                                <span>Z-A</span>
                            </label>
                            <label className={styles.radioLabel}>
                                <input
                                    type="radio"
                                    name="sort-mobile"
                                    value="newest"
                                    checked={sortBy === 'newest'}
                                    onChange={() => setSortBy('newest')}
                                    className={styles.radioInput}
                                />
                                <span className={styles.radioCustom}>
                                    {sortBy === 'newest' && <span className={styles.radioDot} />}
                                </span>
                                <Clock size={12} className={styles.filterIcon} />
                                <span>Récent</span>
                            </label>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className={styles.sidebarActions}>
                        <button
                            className={styles.applyButton}
                            onClick={applyFilters}
                        >
                            Appliquer
                        </button>
                        {hasActiveFilters && (
                            <button
                                className={styles.clearButton}
                                onClick={clearAllFilters}
                            >
                                Réinitialiser
                            </button>
                        )}
                    </div>
                </div>
            </>
        );
    }

    // Desktop mode: render only the sidebar (no FAB button, that's rendered separately)
    return (
        <div className={styles.sidebar}>
            {/* Section Title */}
            <h2 className={styles.sidebarTitle}>
                <Filter size={18} />
                Filtres et Catégories
            </h2>

            {/* Category Pills */}
            <div className={styles.filterSection}>
                <div className={styles.categoryPills}>
                    <button
                        className={`${styles.categoryPill} ${!selectedCategory ? styles.categoryPillActive : ''}`}
                        onClick={() => setSelectedCategory('')}
                        aria-pressed={!selectedCategory}
                    >
                        Tout
                    </button>
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            className={`${styles.categoryPill} ${selectedCategory === cat.slug ? styles.categoryPillActive : ''}`}
                            onClick={() => handleCategoryClick(cat.slug)}
                            aria-pressed={selectedCategory === cat.slug}
                        >
                            {cat.name}
                        </button>
                    ))}
                </div>
            </div>

            {/* Type Filters */}
            <div className={styles.filterSection}>
                <h3 className={styles.filterSectionTitle}>Type</h3>
                <div className={styles.filterGroup}>
                    <label className={styles.checkboxLabel}>
                        <input
                            type="checkbox"
                            checked={showFeatured}
                            onChange={(e) => setShowFeatured(e.target.checked)}
                            className={styles.checkboxInput}
                        />
                        <span className={styles.checkboxCustom}>
                            {showFeatured && <span className={styles.checkboxCheck} />}
                        </span>
                        <Star size={12} className={styles.filterIcon} />
                        <span>Vedette</span>
                    </label>
                    <label className={styles.checkboxLabel}>
                        <input
                            type="checkbox"
                            checked={showNew}
                            onChange={(e) => setShowNew(e.target.checked)}
                            className={styles.checkboxInput}
                        />
                        <span className={styles.checkboxCustom}>
                            {showNew && <span className={styles.checkboxCheck} />}
                        </span>
                        <Sparkles size={12} className={styles.filterIcon} />
                        <span>Nouveau</span>
                    </label>
                </div>
            </div>

            {/* Sort Options */}
            <div className={styles.filterSection}>
                <h3 className={styles.filterSectionTitle}>Tri</h3>
                <div className={styles.filterGroup}>
                    <label className={styles.radioLabel}>
                        <input
                            type="radio"
                            name="sort"
                            value="name-asc"
                            checked={sortBy === 'name-asc'}
                            onChange={() => setSortBy('name-asc')}
                            className={styles.radioInput}
                        />
                        <span className={styles.radioCustom}>
                            {sortBy === 'name-asc' && <span className={styles.radioDot} />}
                        </span>
                        <ArrowUpAZ size={12} className={styles.filterIcon} />
                        <span>A-Z</span>
                    </label>
                    <label className={styles.radioLabel}>
                        <input
                            type="radio"
                            name="sort"
                            value="name-desc"
                            checked={sortBy === 'name-desc'}
                            onChange={() => setSortBy('name-desc')}
                            className={styles.radioInput}
                        />
                        <span className={styles.radioCustom}>
                            {sortBy === 'name-desc' && <span className={styles.radioDot} />}
                        </span>
                        <ArrowDownAZ size={12} className={styles.filterIcon} />
                        <span>Z-A</span>
                    </label>
                    <label className={styles.radioLabel}>
                        <input
                            type="radio"
                            name="sort"
                            value="newest"
                            checked={sortBy === 'newest'}
                            onChange={() => setSortBy('newest')}
                            className={styles.radioInput}
                        />
                        <span className={styles.radioCustom}>
                            {sortBy === 'newest' && <span className={styles.radioDot} />}
                        </span>
                        <Clock size={12} className={styles.filterIcon} />
                        <span>Récent</span>
                    </label>
                </div>
            </div>

            {/* Action Buttons */}
            <div className={styles.sidebarActions}>
                <button
                    className={styles.applyButton}
                    onClick={applyFilters}
                >
                    Appliquer
                </button>
                {hasActiveFilters && (
                    <button
                        className={styles.clearButton}
                        onClick={clearAllFilters}
                    >
                        Réinitialiser
                    </button>
                )}
            </div>
        </div>
    );
}
