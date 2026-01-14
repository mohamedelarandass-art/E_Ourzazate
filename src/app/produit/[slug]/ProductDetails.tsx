/**
 * Product Details Component - Premium Redesign
 * 
 * Enhanced product section with:
 * - Lightbox modal for image zoom
 * - Smooth variation transitions
 * - Premium micro-interactions
 * - Floating CTA design
 * 
 * @module app/produit/[slug]/ProductDetails
 */

'use client';

import { useState, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { MessageCircle, Eye, Sparkles, Star, Check, ZoomIn, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getProductWhatsAppUrl } from '@/lib/whatsapp';
import { Button } from '@/components/ui';
import type { Product, ProductVariation, Category } from '@/types';
import styles from './page.module.css';

interface ProductDetailsProps {
    product: Product;
    category?: Category;
}

export function ProductDetails({ product, category }: ProductDetailsProps) {
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [selectedVariations, setSelectedVariations] = useState<Record<string, string>>({});
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);
    const [imageError, setImageError] = useState(false);
    const [isImageLoaded, setIsImageLoaded] = useState(false);

    // Get current image
    const images = product.images || [];
    const currentImage = images[selectedImageIndex] || images[0];
    const hasMultipleImages = images.length > 1;

    // Group variations by type
    const variationsByType = (product.variations || []).reduce((acc, variation) => {
        if (!acc[variation.type]) {
            acc[variation.type] = [];
        }
        acc[variation.type].push(variation);
        return acc;
    }, {} as Record<string, ProductVariation[]>);

    // Handle variation selection
    const handleVariationSelect = useCallback((type: string, variationId: string) => {
        setSelectedVariations((prev) => ({
            ...prev,
            [type]: variationId,
        }));
    }, []);

    // Navigate images in lightbox
    const navigateImage = useCallback((direction: 'prev' | 'next') => {
        setSelectedImageIndex((prev) => {
            if (direction === 'prev') {
                return prev === 0 ? images.length - 1 : prev - 1;
            }
            return prev === images.length - 1 ? 0 : prev + 1;
        });
    }, [images.length]);

    // Handle keyboard navigation in lightbox
    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
        if (e.key === 'Escape') setIsLightboxOpen(false);
        if (e.key === 'ArrowLeft') navigateImage('prev');
        if (e.key === 'ArrowRight') navigateImage('next');
    }, [navigateImage]);

    // Build WhatsApp message with selected variations
    const getWhatsAppMessage = useCallback(() => {
        let productName = product.name;

        if (Object.keys(selectedVariations).length > 0) {
            const variationNames = Object.values(selectedVariations)
                .map((id) => product.variations?.find((v) => v.id === id)?.name)
                .filter(Boolean)
                .join(', ');

            if (variationNames) {
                productName += ` (${variationNames})`;
            }
        }

        return getProductWhatsAppUrl(productName, product.id);
    }, [product, selectedVariations]);

    return (
        <>
            <section className={styles.productSection}>
                <div className={styles.productGrid}>
                    {/* Left Column - Gallery */}
                    <div className={styles.galleryColumn}>
                        {/* Main Image */}
                        <div
                            className={styles.mainImageWrapper}
                            onClick={() => setIsLightboxOpen(true)}
                            role="button"
                            tabIndex={0}
                            aria-label="Agrandir l'image"
                            onKeyDown={(e) => e.key === 'Enter' && setIsLightboxOpen(true)}
                        >
                            {currentImage && !imageError ? (
                                <>
                                    <Image
                                        src={currentImage.url}
                                        alt={currentImage.alt || product.name}
                                        fill
                                        priority
                                        className={styles.mainImage}
                                        sizes="(max-width: 768px) 100vw, 50vw"
                                        onError={() => setImageError(true)}
                                        onLoad={() => setIsImageLoaded(true)}
                                        style={{ opacity: isImageLoaded ? 1 : 0 }}
                                    />
                                    <div className={styles.zoomHint}>
                                        <ZoomIn size={16} />
                                        <span>Cliquez pour agrandir</span>
                                    </div>
                                </>
                            ) : (
                                <div className={styles.imagePlaceholder}>
                                    <Eye size={64} strokeWidth={1} />
                                    <span>{product.name}</span>
                                </div>
                            )}
                        </div>

                        {/* Thumbnails */}
                        {hasMultipleImages && (
                            <div className={styles.thumbnails}>
                                {images.map((image, index) => (
                                    <button
                                        key={image.id}
                                        className={cn(
                                            styles.thumbnail,
                                            index === selectedImageIndex && styles.thumbnailActive
                                        )}
                                        onClick={() => {
                                            setSelectedImageIndex(index);
                                            setIsImageLoaded(false);
                                        }}
                                        aria-label={`Voir image ${index + 1}`}
                                        aria-current={index === selectedImageIndex ? 'true' : undefined}
                                    >
                                        <Image
                                            src={image.url}
                                            alt={image.alt || `${product.name} - ${index + 1}`}
                                            fill
                                            sizes="72px"
                                            className={styles.thumbnailImage}
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Right Column - Product Info */}
                    <div className={styles.infoColumn}>
                        {/* Badges */}
                        {(product.isNew || product.isFeatured) && (
                            <div className={styles.badges}>
                                {product.isNew && (
                                    <span className={styles.badgeNew}>
                                        <Sparkles size={14} />
                                        Nouveau
                                    </span>
                                )}
                                {product.isFeatured && (
                                    <span className={styles.badgeFeatured}>
                                        <Star size={14} />
                                        Vedette
                                    </span>
                                )}
                            </div>
                        )}

                        {/* Category Tag */}
                        {category && (
                            <Link
                                href={`/catalogue?category=${category.slug}`}
                                className={styles.categoryTag}
                            >
                                <span>{category.icon}</span>
                                <span>{category.name}</span>
                            </Link>
                        )}

                        {/* Product Title */}
                        <h1 className={styles.productTitle}>{product.name}</h1>

                        {/* Description */}
                        <p className={styles.productDescription}>{product.description}</p>

                        {/* Variations */}
                        {Object.entries(variationsByType).map(([type, variations]) => (
                            <div key={type} className={styles.variationsSection}>
                                <h3 className={styles.variationsTitle}>
                                    {type === 'color' && 'Couleur'}
                                    {type === 'size' && 'Dimension'}
                                    {type === 'material' && 'Matériau'}
                                </h3>

                                <div className={styles.variationsGrid}>
                                    {type === 'color' ? (
                                        // Color Swatches
                                        variations.map((variation) => (
                                            <button
                                                key={variation.id}
                                                className={cn(
                                                    styles.colorSwatch,
                                                    selectedVariations[type] === variation.id && styles.swatchSelected
                                                )}
                                                style={{ backgroundColor: variation.value }}
                                                onClick={() => handleVariationSelect(type, variation.id)}
                                                title={variation.name}
                                                aria-label={`Sélectionner la couleur ${variation.name}`}
                                                aria-pressed={selectedVariations[type] === variation.id}
                                            >
                                                {selectedVariations[type] === variation.id && (
                                                    <Check size={18} className={styles.swatchCheck} />
                                                )}
                                            </button>
                                        ))
                                    ) : (
                                        // Size/Material Buttons
                                        variations.map((variation) => (
                                            <button
                                                key={variation.id}
                                                className={cn(
                                                    styles.variationButton,
                                                    selectedVariations[type] === variation.id && styles.variationSelected
                                                )}
                                                onClick={() => handleVariationSelect(type, variation.id)}
                                                aria-pressed={selectedVariations[type] === variation.id}
                                            >
                                                {variation.name}
                                            </button>
                                        ))
                                    )}
                                </div>

                                {/* Selected Variation Name for Colors */}
                                {type === 'color' && selectedVariations[type] && (
                                    <p className={styles.selectedVariationName}>
                                        ✓ {variations.find((v) => v.id === selectedVariations[type])?.name}
                                    </p>
                                )}
                            </div>
                        ))}

                        {/* CTA Section */}
                        <div className={styles.ctaSection}>
                            <Button
                                variant="whatsapp"
                                size="lg"
                                fullWidth
                                leftIcon={<MessageCircle size={22} />}
                                onClick={() => window.open(getWhatsAppMessage(), '_blank')}
                                className={styles.whatsappCta}
                            >
                                Demander le Prix
                            </Button>
                            <p className={styles.ctaHint}>
                                <span>💬</span>
                                Nos conseillers vous répondent rapidement sur WhatsApp
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Lightbox Modal */}
            {isLightboxOpen && currentImage && (
                <div
                    className={styles.lightbox}
                    onClick={() => setIsLightboxOpen(false)}
                    onKeyDown={handleKeyDown}
                    role="dialog"
                    aria-modal="true"
                    aria-label="Galerie d'images"
                    tabIndex={-1}
                >
                    <div className={styles.lightboxBackdrop} />

                    <button
                        className={styles.lightboxClose}
                        onClick={() => setIsLightboxOpen(false)}
                        aria-label="Fermer"
                    >
                        <X size={24} />
                    </button>

                    {hasMultipleImages && (
                        <>
                            <button
                                className={cn(styles.lightboxNav, styles.lightboxPrev)}
                                onClick={(e) => { e.stopPropagation(); navigateImage('prev'); }}
                                aria-label="Image précédente"
                            >
                                <ChevronLeft size={32} />
                            </button>
                            <button
                                className={cn(styles.lightboxNav, styles.lightboxNext)}
                                onClick={(e) => { e.stopPropagation(); navigateImage('next'); }}
                                aria-label="Image suivante"
                            >
                                <ChevronRight size={32} />
                            </button>
                        </>
                    )}

                    <div
                        className={styles.lightboxContent}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <Image
                            src={currentImage.url}
                            alt={currentImage.alt || product.name}
                            fill
                            className={styles.lightboxImage}
                            sizes="90vw"
                            priority
                        />
                    </div>

                    {hasMultipleImages && (
                        <div className={styles.lightboxCounter}>
                            {selectedImageIndex + 1} / {images.length}
                        </div>
                    )}
                </div>
            )}
        </>
    );
}
