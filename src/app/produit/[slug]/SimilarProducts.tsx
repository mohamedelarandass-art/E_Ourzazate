/**
 * Similar Products Component - Premium Redesign
 * 
 * Enhanced horizontal slider with:
 * - Scroll-triggered animations
 * - Smooth momentum scrolling
 * - Premium card hover effects
 * - Navigation with feedback
 * 
 * @module app/produit/[slug]/SimilarProducts
 */

'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ProductCard } from '@/components/product';
import type { Product } from '@/types';
import styles from './page.module.css';

interface SimilarProductsProps {
    products: Product[];
}

export function SimilarProducts({ products }: SimilarProductsProps) {
    const sliderRef = useRef<HTMLDivElement>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);
    const [isVisible, setIsVisible] = useState(false);

    // Check scroll position for arrow visibility
    const checkScrollPosition = useCallback(() => {
        if (sliderRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
            setCanScrollLeft(scrollLeft > 10);
            setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
        }
    }, []);

    // Intersection Observer for scroll-triggered animation
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setIsVisible(true);
                        observer.disconnect();
                    }
                });
            },
            { threshold: 0.2 }
        );

        const section = document.querySelector(`.${styles.similarSection}`);
        if (section) {
            observer.observe(section);
        }

        return () => observer.disconnect();
    }, []);

    // Update scroll position on mount and resize
    useEffect(() => {
        checkScrollPosition();
        window.addEventListener('resize', checkScrollPosition);
        return () => window.removeEventListener('resize', checkScrollPosition);
    }, [checkScrollPosition]);

    // Smooth scroll with custom easing
    const scroll = useCallback((direction: 'left' | 'right') => {
        if (sliderRef.current) {
            const cardWidth = 320 + 24; // Card width + gap
            const scrollAmount = direction === 'left' ? -cardWidth : cardWidth;

            sliderRef.current.scrollBy({
                left: scrollAmount,
                behavior: 'smooth',
            });

            // Update button states after scroll
            setTimeout(checkScrollPosition, 350);
        }
    }, [checkScrollPosition]);

    if (products.length === 0) return null;

    return (
        <section className={cn(styles.similarSection, isVisible && styles.visible)}>
            <div className={styles.similarHeader}>
                <h2 className={styles.similarTitle}>Vous aimerez aussi</h2>

                {/* Navigation Arrows */}
                <div className={styles.sliderNav}>
                    <button
                        className={cn(
                            styles.sliderArrow,
                            !canScrollLeft && styles.sliderArrowDisabled
                        )}
                        onClick={() => scroll('left')}
                        disabled={!canScrollLeft}
                        aria-label="Produits précédents"
                    >
                        <ChevronLeft size={22} />
                    </button>
                    <button
                        className={cn(
                            styles.sliderArrow,
                            !canScrollRight && styles.sliderArrowDisabled
                        )}
                        onClick={() => scroll('right')}
                        disabled={!canScrollRight}
                        aria-label="Produits suivants"
                    >
                        <ChevronRight size={22} />
                    </button>
                </div>
            </div>

            <div
                className={styles.similarSlider}
                ref={sliderRef}
                onScroll={checkScrollPosition}
            >
                {products.map((product, index) => (
                    <div
                        key={product.id}
                        className={styles.similarCard}
                        style={{
                            animationDelay: isVisible ? `${index * 0.1}s` : '0s',
                        }}
                    >
                        <ProductCard product={product} />
                    </div>
                ))}
            </div>
        </section>
    );
}
