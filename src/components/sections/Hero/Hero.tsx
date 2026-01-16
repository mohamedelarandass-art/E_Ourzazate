/**
 * Hero Section - Premium Editorial Design
 * 
 * Editorial Minimalism with Industrial Soul
 * Core emotion: Trust through quiet confidence
 * 
 * Features:
 * - Centered layout with dramatic dark overlay
 * - Single abstract material background (marble texture)
 * - Serif headline with heritage message
 * - Single primary CTA (catalogue) + subtle text link
 * - Inline trust stats (no cards)
 * - Refined entrance animations
 * 
 * @module components/sections/Hero
 */

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { siteConfig } from '@/config';
import { getWhatsAppUrl } from '@/lib/whatsapp';
import { Button } from '@/components/ui';
import styles from './Hero.module.css';

export interface HeroProps {
    className?: string;
}

/**
 * Trust statistics for display
 */
const stats = [
    {
        value: '50+',
        label: 'années',
    },
    {
        value: '6',
        label: 'catégories',
    },
    {
        value: '1000+',
        label: 'produits',
    },
];

export function Hero({ className }: HeroProps) {
    const [isLoaded, setIsLoaded] = useState(false);

    // Initial load animation trigger
    useEffect(() => {
        const timer = setTimeout(() => setIsLoaded(true), 100);
        return () => clearTimeout(timer);
    }, []);

    // Handle scroll indicator click
    const handleScrollClick = () => {
        window.scrollTo({
            top: window.innerHeight,
            behavior: 'smooth',
        });
    };

    return (
        <section className={`${styles.hero} ${className || ''} ${isLoaded ? styles.loaded : ''}`}>
            {/* Background Image */}
            <div className={styles.backgroundContainer} aria-hidden="true">
                <Image
                    src="/images/hero/hero-material-texture.png"
                    alt=""
                    fill
                    priority
                    quality={85}
                    sizes="100vw"
                    style={{ objectFit: 'cover' }}
                    className={styles.backgroundImage}
                />
                {/* Dark Gradient Overlay */}
                <div className={styles.gradientOverlay} />
            </div>

            {/* Subtle Floating Patterns */}
            <div className={styles.patterns} aria-hidden="true">
                <div className={styles.pattern1} />
                <div className={styles.pattern2} />
            </div>

            {/* Main Content - Centered */}
            <div className={`container ${styles.container}`}>
                <div className={styles.content}>
                    {/* Gold Accent Line */}
                    <div className={styles.accentLine} />

                    {/* Headline */}
                    <h1 className={styles.title}>
                        <span className={styles.headline}>
                            L'excellence des matériaux,
                        </span>
                        <span className={styles.headlineAccent}>
                            depuis {siteConfig.establishedYear}.
                        </span>
                    </h1>

                    {/* Subtitle */}
                    <p className={styles.subtitle}>
                        Fournisseur de référence au Maroc pour vos projets d'exception.
                    </p>

                    {/* CTAs */}
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
                            className={styles.secondaryLink}
                        >
                            Une question ? Contactez-nous →
                        </a>
                    </div>

                    {/* Trust Stats - Inline */}
                    <div className={styles.stats}>
                        {stats.map((stat, index) => (
                            <div key={stat.label} className={styles.statGroup}>
                                <div className={styles.stat}>
                                    <span className={styles.statNumber}>{stat.value}</span>
                                    <span className={styles.statLabel}>{stat.label}</span>
                                </div>
                                {index < stats.length - 1 && (
                                    <div className={styles.statDivider} />
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Scroll Indicator */}
            <button
                type="button"
                className={styles.scrollIndicator}
                onClick={handleScrollClick}
                aria-label="Défiler vers le bas"
            >
                <ChevronDown size={28} />
            </button>
        </section>
    );
}
