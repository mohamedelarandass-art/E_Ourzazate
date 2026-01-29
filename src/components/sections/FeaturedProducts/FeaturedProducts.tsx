/**
 * FeaturedProducts Section - Premium Design
 * 
 * Grid of featured products for the homepage.
 * Features:
 * - Elegant section header with decorative elements
 * - Animated entrance effects
 * - Premium product card grid
 * 
 * @module components/sections/FeaturedProducts
 */

'use client';

import { useEffect, useState } from 'react';
import { Sparkles } from 'lucide-react';
import { ProductCard } from '@/components/product';
import { MagneticButton } from '@/components/ui';
import { getFeaturedProducts } from '@/data';
import styles from './FeaturedProducts.module.css';

export interface FeaturedProductsProps {
    className?: string;
    limit?: number;
}

export function FeaturedProducts({ className, limit = 6 }: FeaturedProductsProps) {
    const products = getFeaturedProducts(limit);
    const [isVisible, setIsVisible] = useState(false);

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

                {/* Products Grid */}
                <div className={styles.grid}>
                    {products.map((product, index) => (
                        <div
                            key={product.id}
                            className={styles.gridItem}
                            style={{ animationDelay: `${0.1 + index * 0.08}s` } as React.CSSProperties}
                        >
                            <ProductCard product={product} />
                        </div>
                    ))}
                </div>

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
