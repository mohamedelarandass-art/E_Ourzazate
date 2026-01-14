/**
 * CategoryCard Component - Premium Design
 * 
 * Premium card for displaying a product category with image,
 * overlay effects, and hover animations.
 * 
 * @module components/product/CategoryCard
 */

'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { categoryBlur } from '@/data';
import type { Category } from '@/types';
import styles from './CategoryCard.module.css';

export interface CategoryCardProps {
    category: Category;
    className?: string;
    /** Whether this is a featured (larger) card */
    featured?: boolean;
    /** Grid span for Bento layout */
    gridSpan?: 'normal' | 'wide' | 'tall';
    /** Optional inline styles */
    style?: React.CSSProperties;
}

/**
 * Map category slugs to their image paths
 */
const categoryImages: Record<string, string> = {
    'sanitaire': '/images/categories/sanitaire.webp',
    'meubles-sdb': '/images/categories/meubles-sdb.webp',
    'carrelage': '/images/categories/carrelage.webp',
    'luminaire': '/images/categories/luminaire.webp',
    // SUPPRIMÉ: 'electromenager' - Catégorie retirée du catalogue
    'outillage': '/images/categories/outillage.webp',
};

/**
 * Category icons (Lucide-style SVGs)
 */
const categoryIconPaths: Record<string, string> = {
    'sanitaire': 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z',
    'meubles-sdb': 'M20 6H4c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm0 12H4V8h16v10z',
    'carrelage': 'M3 3h8v8H3V3zm10 0h8v8h-8V3zM3 13h8v8H3v-8zm10 0h8v8h-8v-8z',
    'luminaire': 'M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1zm3-19C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7z',
    // SUPPRIMÉ: 'electromenager' - Catégorie retirée du catalogue
    'outillage': 'M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6 6 9 1.6 4.7C.4 7.1.9 10.1 2.9 12.1c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.5-.4.5-1.1.1-1.4z',
};

export function CategoryCard({
    category,
    className,
    featured = false,
    gridSpan = 'normal',
    style
}: CategoryCardProps) {
    const [isHovered, setIsHovered] = useState(false);
    const hasImage = categoryImages[category.slug];

    // Determine CSS classes based on props
    const cardClasses = cn(
        styles.card,
        featured && styles.featured,
        gridSpan === 'wide' && styles.wide,
        gridSpan === 'tall' && styles.tall,
        className
    );

    return (
        <Link
            href={`/catalogue/${category.slug}`}
            className={cardClasses}
            style={style}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Background Image or Gradient */}
            <div className={styles.imageWrapper}>
                {hasImage ? (
                    <Image
                        src={categoryImages[category.slug]}
                        alt={category.name}
                        fill
                        loading="lazy"
                        placeholder="blur"
                        blurDataURL={categoryBlur}
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className={cn(styles.image, isHovered && styles.imageHovered)}
                        style={{ objectFit: 'cover' }}
                    />
                ) : (
                    <div className={styles.gradientBackground} />
                )}
                {/* Overlay Gradient */}
                <div className={styles.overlay} />
            </div>

            {/* Icon Badge */}
            <div className={styles.iconBadge}>
                <span className={styles.emoji}>{category.icon}</span>
            </div>

            {/* Content */}
            <div className={styles.content}>
                <h3 className={styles.title}>{category.name}</h3>
                <p className={styles.description}>{category.description}</p>

                {/* CTA Button */}
                <div className={cn(styles.cta, isHovered && styles.ctaVisible)}>
                    <span className={styles.ctaText}>Explorer</span>
                    <ArrowRight size={18} className={styles.ctaIcon} />
                </div>
            </div>
        </Link>
    );
}
