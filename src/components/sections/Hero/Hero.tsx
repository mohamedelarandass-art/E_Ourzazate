/**
 * Hero Section - Premium Editorial Design
 * 
 * Design Direction: "Editorial Minimalism with Industrial Soul"
 * Core Emotion: Trust through heritage, quality, and simplicity
 * 
 * Features:
 * - Centered layout with responsive spacing
 * - Abstract material background (marble texture)
 * - Mode-aware styling (light/dark)
 * - Serif headline with heritage message
 * - Single primary CTA + subtle secondary link
 * - Inline trust stats
 * - Scroll indicator (guaranteed visible via flex layout)
 * - Staggered entrance animations
 * - Full accessibility support
 * 
 * @module components/sections/Hero
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { siteConfig } from '@/config';
import { getWhatsAppUrl } from '@/lib/whatsapp';
import { Button } from '@/components/ui';
import styles from './Hero.module.css';

/* -------------------------------------------------------------------------- */
/*                                   Types                                    */
/* -------------------------------------------------------------------------- */

export interface HeroProps {
    /** Additional CSS class names */
    className?: string;
}

/* -------------------------------------------------------------------------- */
/*                                   Data                                     */
/* -------------------------------------------------------------------------- */

/**
 * Trust statistics displayed inline at the bottom of the hero
 */
const trustStats = [
    { value: '50+', label: 'années' },
    { value: '6', label: 'catégories' },
    { value: '1000+', label: 'produits' },
] as const;

/* -------------------------------------------------------------------------- */
/*                                 Component                                  */
/* -------------------------------------------------------------------------- */

export function Hero({ className }: HeroProps) {
    // Animation trigger state
    const [isLoaded, setIsLoaded] = useState(false);

    // Trigger entrance animations after mount
    useEffect(() => {
        const timer = setTimeout(() => setIsLoaded(true), 100);
        return () => clearTimeout(timer);
    }, []);

    // Handle scroll indicator click
    const handleScrollClick = useCallback(() => {
        window.scrollTo({
            top: window.innerHeight,
            behavior: 'smooth',
        });
    }, []);

    return (
        <section
            className={`${styles.hero} ${className || ''} ${isLoaded ? styles.loaded : ''}`}
            aria-label="Section d'accueil"
        >
            {/* Background Layer */}
            <div className={styles.background} aria-hidden="true">
                <Image
                    src="/images/hero/hero-material-texture.png"
                    alt=""
                    fill
                    priority
                    quality={85}
                    sizes="100vw"
                    className={styles.backgroundImage}
                />
                <div className={styles.overlay} />
            </div>

            {/* Decorative Floating Elements */}
            <div className={styles.decorations} aria-hidden="true">
                <div className={styles.decorSquare} />
                <div className={styles.decorCircle} />
            </div>

            {/* Main Content */}
            <div className={styles.container}>
                <div className={styles.content}>
                    {/* Gold Accent Line */}
                    <div className={styles.accentLine} aria-hidden="true" />

                    {/* Headline */}
                    <h1 className={styles.headline}>
                        <span className={styles.headlineMain}>
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

                    {/* Call to Actions */}
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
                            className={styles.secondaryCta}
                        >
                            Une question ? Contactez-nous
                            <span className={styles.ctaArrow}>→</span>
                        </a>
                    </div>

                    {/* Trust Stats */}
                    <div className={styles.stats}>
                        {trustStats.map((stat, index) => (
                            <div key={stat.label} className={styles.statItem}>
                                <span className={styles.statValue}>{stat.value}</span>
                                <span className={styles.statLabel}>{stat.label}</span>
                                {index < trustStats.length - 1 && (
                                    <span className={styles.statDivider} aria-hidden="true" />
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Scroll Indicator - Inside container for guaranteed visibility */}
                <button
                    type="button"
                    className={styles.scrollIndicator}
                    onClick={handleScrollClick}
                    aria-label="Défiler vers le contenu"
                >
                    <ChevronDown size={24} strokeWidth={1.5} />
                </button>
            </div>
        </section>
    );
}

export default Hero;
