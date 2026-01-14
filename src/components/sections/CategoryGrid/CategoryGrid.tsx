/**
 * CategoryGrid Section - Premium Bento Layout
 * 
 * Grid of all product categories for the homepage.
 * Features Bento-style asymmetric layout with varying card sizes.
 * 
 * @module components/sections/CategoryGrid
 */

'use client';

import { useEffect, useState } from 'react';
import { CategoryCard } from '@/components/product';
import { getActiveCategories } from '@/data';
import styles from './CategoryGrid.module.css';

export interface CategoryGridProps {
    className?: string;
}

/**
 * Define which cards should be featured (larger)
 * First category (Sanitaire) is featured with tall layout
 */
const categoryLayouts: Record<string, 'normal' | 'wide' | 'tall'> = {
    'sanitaire': 'tall',
    'luminaire': 'wide',
};

export function CategoryGrid({ className }: CategoryGridProps) {
    const categories = getActiveCategories();
    const [isVisible, setIsVisible] = useState(false);

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

                {/* Bento Grid */}
                <div className={styles.grid}>
                    {categories.map((category, index) => {
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
                    })}
                </div>
            </div>
        </section>
    );
}
