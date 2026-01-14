/**
 * Hero Section - Premium Design
 * 
 * Main hero banner for the homepage with immersive visuals.
 * Features:
 * - Split layout: content left, showcase image right
 * - Luxury bathroom/kitchen background images
 * - Glassmorphism elements
 * - Floating geometric patterns
 * - Enhanced trust indicators
 * - Micro-animations
 * 
 * @module components/sections/Hero
 */

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, MessageCircle, Award, Grid3X3, Package, Sparkles } from 'lucide-react';
import { siteConfig } from '@/config';
import { getWhatsAppUrl } from '@/lib/whatsapp';
import { getBlurPlaceholder, productShowcaseBlur } from '@/data';
import { Button } from '@/components/ui';
import styles from './Hero.module.css';

export interface HeroProps {
    className?: string;
}

/**
 * Background images for hero slideshow effect
 */
const heroBackgrounds = [
    {
        src: '/images/hero/hero-bathroom.webp',
        alt: 'Salle de bain luxueuse moderne',
    },
    {
        src: '/images/hero/hero-kitchen.webp',
        alt: 'Cuisine premium moderne',
    },
];

/**
 * Trust indicators with icons and data
 */
const trustIndicators = [
    {
        icon: Award,
        value: '50+',
        label: "Années d'Expérience",
        suffix: '',
    },
    {
        icon: Grid3X3,
        value: '6',
        label: 'Catégories',
        suffix: '',
    },
    {
        icon: Package,
        value: '1000+',
        label: 'Produits',
        suffix: '',
    },
];

export function Hero({ className }: HeroProps) {
    const [currentBgIndex, setCurrentBgIndex] = useState(0);
    const [isLoaded, setIsLoaded] = useState(false);

    // Background image rotation effect
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentBgIndex((prev) => (prev + 1) % heroBackgrounds.length);
        }, 8000); // Change every 8 seconds

        return () => clearInterval(timer);
    }, []);

    // Initial load animation trigger
    useEffect(() => {
        const timer = setTimeout(() => setIsLoaded(true), 100);
        return () => clearTimeout(timer);
    }, []);

    return (
        <section className={`${styles.hero} ${className || ''} ${isLoaded ? styles.loaded : ''}`}>
            {/* Background Images with Crossfade */}
            <div className={styles.backgroundContainer} aria-hidden="true">
                {heroBackgrounds.map((bg, index) => (
                    <div
                        key={bg.src}
                        className={`${styles.backgroundImage} ${index === currentBgIndex ? styles.active : ''
                            }`}
                    >
                        <Image
                            src={bg.src}
                            alt={bg.alt}
                            fill
                            priority={index === 0}
                            quality={75}
                            placeholder="blur"
                            blurDataURL={getBlurPlaceholder(bg.src)}
                            sizes="100vw"
                            style={{ objectFit: 'cover' }}
                        />
                    </div>
                ))}
                {/* Gradient Overlay */}
                <div className={styles.gradientOverlay} />
            </div>

            {/* Floating Geometric Patterns */}
            <div className={styles.patterns} aria-hidden="true">
                <div className={styles.pattern1} />
                <div className={styles.pattern2} />
                <div className={styles.pattern3} />
                <div className={styles.patternGrid} />
            </div>

            {/* Main Content */}
            <div className={`container ${styles.container}`}>
                <div className={styles.grid}>
                    {/* Left Side - Content */}
                    <div className={styles.content}>
                        {/* Excellence Badge */}
                        <div className={styles.badge}>
                            <Sparkles size={16} className={styles.badgeIcon} />
                            <span>Excellence Depuis {siteConfig.establishedYear}</span>
                        </div>

                        {/* Title */}
                        <h1 className={styles.title}>
                            <span className={styles.titleLine1}>Votre Partenaire en</span>
                            <span className={styles.titleLine2}>
                                Matériaux de{' '}
                                <span className={styles.highlight}>Construction</span>
                            </span>
                        </h1>

                        {/* Subtitle */}
                        <p className={styles.subtitle}>
                            Fournisseur de matériaux haut de gamme et solutions sur mesure
                            pour des projets d'exception au Maroc depuis plus de{' '}
                            <strong>{siteConfig.yearsOfExperience} ans</strong>.
                        </p>

                        {/* CTA Buttons */}
                        <div className={styles.actions}>
                            <Link href="/catalogue" className={styles.primaryCta}>
                                <Button
                                    variant="primary"
                                    size="lg"
                                    rightIcon={<ArrowRight size={20} />}
                                    className={styles.ctaButton}
                                >
                                    Explorer le Catalogue
                                </Button>
                            </Link>
                            <a
                                href={getWhatsAppUrl()}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles.whatsappCta}
                            >
                                <Button
                                    variant="whatsapp"
                                    size="lg"
                                    leftIcon={<MessageCircle size={20} />}
                                    className={styles.ctaButton}
                                >
                                    Contactez-nous
                                </Button>
                            </a>
                        </div>

                        {/* Trust Indicators */}
                        <div className={styles.trust}>
                            {trustIndicators.map((indicator, index) => (
                                <div
                                    key={indicator.label}
                                    className={styles.trustItem}
                                    style={{ animationDelay: `${0.6 + index * 0.1}s` }}
                                >
                                    <div className={styles.trustIcon}>
                                        <indicator.icon size={24} />
                                    </div>
                                    <div className={styles.trustContent}>
                                        <span className={styles.trustNumber}>
                                            {indicator.value}
                                            {indicator.suffix}
                                        </span>
                                        <span className={styles.trustLabel}>
                                            {indicator.label}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Side - Product Showcase */}
                    <div className={styles.showcase}>
                        <div className={styles.showcaseCard}>
                            {/* Glassmorphism Frame */}
                            <div className={styles.showcaseFrame}>
                                <Image
                                    src="/images/hero/product-showcase.webp"
                                    alt="Collection de matériaux premium"
                                    width={500}
                                    height={500}
                                    quality={75}
                                    placeholder="blur"
                                    blurDataURL={productShowcaseBlur}
                                    className={styles.showcaseImage}
                                    priority
                                />
                            </div>
                            {/* Floating Badge */}
                            <div className={styles.showcaseBadge}>
                                <span className={styles.showcaseBadgeText}>Collection Premium</span>
                            </div>
                        </div>
                        {/* Decorative Elements */}
                        <div className={styles.showcaseDecor1} aria-hidden="true" />
                        <div className={styles.showcaseDecor2} aria-hidden="true" />
                    </div>
                </div>
            </div>

            {/* Background Dots Indicator */}
            <div className={styles.bgIndicator} aria-hidden="true">
                {heroBackgrounds.map((_, index) => (
                    <button
                        key={index}
                        type="button"
                        className={`${styles.bgDot} ${index === currentBgIndex ? styles.activeDot : ''}`}
                        onClick={() => setCurrentBgIndex(index)}
                        aria-label={`Afficher l'image ${index + 1}`}
                    />
                ))}
            </div>
        </section>
    );
}
