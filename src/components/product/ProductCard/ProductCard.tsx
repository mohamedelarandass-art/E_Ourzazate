/**
 * ProductCard Component - Premium Design
 * 
 * Card for displaying a product with image, badges, and WhatsApp CTA.
 * Features:
 * - Premium image with fallback gradient
 * - Gold/prominent badges for New and Featured
 * - Hover effects with image zoom and shadow lift
 * - Quick actions bar on hover
 * - Category tag with subtle styling
 * 
 * @module components/product/ProductCard
 */

'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MessageCircle, Eye, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getProductWhatsAppUrl } from '@/lib/whatsapp';
import { productBlur } from '@/data';
import type { Product } from '@/types';
import { Button } from '@/components/ui';
import styles from './ProductCard.module.css';

export interface ProductCardProps {
    product: Product;
    className?: string;
}

/**
 * Map category IDs to display names
 */
const categoryNames: Record<string, string> = {
    'cat-sanitaire': 'Sanitaire',
    'cat-meubles-sdb': 'Meubles SDB',
    'cat-carrelage': 'Carrelage',
    'cat-luminaire': 'Luminaire',
    'cat-electromenager': 'Électroménager',
    'cat-outillage': 'Outillage',
};

export function ProductCard({ product, className }: ProductCardProps) {
    const [isHovered, setIsHovered] = useState(false);
    const [imageError, setImageError] = useState(false);
    const featuredImage = product.images?.find((img) => img.isFeatured) || product.images?.[0];
    const categoryName = categoryNames[product.categoryId] || product.categoryId;

    return (
        <article
            className={cn(styles.card, className)}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Image Container */}
            <Link href={`/produit/${product.slug}`} className={styles.imageWrapper}>
                {featuredImage && !imageError ? (
                    <Image
                        src={featuredImage.url}
                        alt={featuredImage.alt || product.name}
                        fill
                        loading="lazy"
                        placeholder="blur"
                        blurDataURL={productBlur}
                        className={cn(styles.image, isHovered && styles.imageHovered)}
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        onError={() => setImageError(true)}
                    />
                ) : (
                    <div className={styles.imagePlaceholder}>
                        <div className={styles.placeholderIcon}>
                            <Eye size={40} strokeWidth={1.5} />
                        </div>
                        <span className={styles.placeholderText}>{product.name}</span>
                    </div>
                )}

                {/* Badges - Top Left */}
                <div className={styles.badges}>
                    {product.isNew && (
                        <span className={styles.badgeNew}>
                            Nouveau
                        </span>
                    )}
                    {product.isFeatured && (
                        <span className={styles.badgeFeatured}>
                            Vedette
                        </span>
                    )}
                </div>

                {/* Quick View Overlay */}
                <div className={cn(styles.quickView, isHovered && styles.quickViewVisible)}>
                    <span className={styles.quickViewText}>
                        <Eye size={16} />
                        Voir les détails
                    </span>
                </div>
            </Link>

            {/* Content */}
            <div className={styles.content}>
                {/* Category Tag */}
                <span className={styles.category}>{categoryName}</span>

                {/* Title */}
                <Link href={`/produit/${product.slug}`} className={styles.titleLink}>
                    <h3 className={styles.title}>{product.name}</h3>
                </Link>

                {/* Description */}
                <p className={styles.description}>{product.description}</p>

                {/* Actions */}
                <div className={styles.actions}>
                    <Button
                        variant="whatsapp"
                        size="sm"
                        leftIcon={<MessageCircle size={16} />}
                        className={styles.whatsappBtn}
                        onClick={(e) => {
                            e.preventDefault();
                            window.open(getProductWhatsAppUrl(product.name, product.id), '_blank');
                        }}
                    >
                        Demander le Prix
                    </Button>
                    <Link href={`/produit/${product.slug}`}>
                        <Button
                            variant="outline"
                            size="sm"
                            className={styles.detailsBtn}
                            rightIcon={<ArrowRight size={14} />}
                        >
                            Détails
                        </Button>
                    </Link>
                </div>
            </div>
        </article>
    );
}
