/**
 * Catalogue Page - Option B Redesign
 * 
 * Main catalogue page with sidebar layout:
 * - Left sidebar with category pills and filters
 * - Right content area with product grid
 * - URL-based filter state management
 * 
 * @module app/catalogue
 */

import type { Metadata } from 'next';
import { Suspense } from 'react';
import { Header, Footer } from '@/components';
import { getActiveCategories, getAllProducts } from '@/data';
import { CatalogueSidebar } from './CatalogueSidebar';
import { CatalogueContent } from './CatalogueContent';
import styles from './page.module.css';

/**
 * SEO Metadata
 */
export const metadata: Metadata = {
    title: 'Notre Catalogue | Equipement Ouarzazate',
    description: 'Découvrez notre catalogue complet de produits premium: Sanitaire, Meubles SDB, Carrelage, Luminaire et Outillage. Filtrez et trouvez exactement ce dont vous avez besoin.',
    openGraph: {
        title: 'Notre Catalogue | Equipement Ouarzazate',
        description: 'Explorez nos 5 catégories de produits de qualité professionnelle à Ouarzazate.',
        type: 'website',
    },
};

/**
 * Loading skeleton for products - #13: Enhanced with badge placeholders
 */
function ProductsSkeleton() {
    return (
        <div className={styles.skeletonGrid}>
            {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className={styles.skeletonCard}>
                    <div className={styles.skeletonImage}>
                        {/* Badge placeholders */}
                        <div className={styles.skeletonBadges}>
                            <div className={styles.skeletonBadge} />
                            {i % 2 === 0 && <div className={styles.skeletonBadge} />}
                        </div>
                    </div>
                    <div className={styles.skeletonContent}>
                        <div className={styles.skeletonCategory} />
                        <div className={styles.skeletonTitle} />
                        <div className={styles.skeletonText} />
                        <div className={styles.skeletonText} />
                        <div className={styles.skeletonActions}>
                            <div className={styles.skeletonButton} />
                            <div className={styles.skeletonButtonSmall} />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default function CataloguePage() {
    // Get all data server-side
    const categories = getActiveCategories();
    const allProducts = getAllProducts();

    return (
        <div className={styles.page}>
            {/* Header */}
            <Header />

            <main className={styles.main}>
                <div className={styles.catalogueLayout}>
                    {/* Left Sidebar - Desktop only */}
                    <aside className={styles.sidebarWrapper}>
                        <Suspense fallback={<div className={styles.sidebarSkeleton}>Chargement...</div>}>
                            <CatalogueSidebar categories={categories} />
                        </Suspense>
                    </aside>

                    {/* Main Content */}
                    <section className={styles.contentWrapper}>
                        <Suspense fallback={<ProductsSkeleton />}>
                            <CatalogueContent
                                products={allProducts}
                                categories={categories}
                            />
                        </Suspense>
                    </section>
                </div>

                {/* Mobile Filter Button - Rendered at page level to avoid sidebarWrapper hiding */}
                <Suspense fallback={null}>
                    <CatalogueSidebar categories={categories} mobileOnly />
                </Suspense>
            </main>

            {/* Footer */}
            <Footer />
        </div>
    );
}

