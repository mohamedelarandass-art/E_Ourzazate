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
 * - Staggered entrance animations
 * - Full accessibility support
 * 
 * @module components/sections/Hero
 */

'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, MoveRight } from 'lucide-react';
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
/*                                   Icons                                    */
/* -------------------------------------------------------------------------- */

/**
 * Premium WhatsApp Icon (Outline style to match editorial design)
 */
function WhatsAppIcon({ className }: { className?: string }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21" />
            <path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1a5 5 0 0 0 5 5h1a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1" />
        </svg>
    );
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

    // Magnetic effect state
    const [magneticOffset, setMagneticOffset] = useState({ x: 0, y: 0 });
    const secondaryCtaRef = useRef<HTMLAnchorElement>(null);

    // Trigger entrance animations after mount
    useEffect(() => {
        const timer = setTimeout(() => setIsLoaded(true), 100);
        return () => clearTimeout(timer);
    }, []);

    /**
     * Handle mouse move for magnetic pull effect
     * Calculates offset from element center, applies subtle displacement
     */
    const handleMouseMove = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
        const element = secondaryCtaRef.current;
        if (!element) return;

        const rect = element.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        // Calculate magnetic offset (max ~8px movement for subtle effect)
        const offsetX = (e.clientX - centerX) * 0.15;
        const offsetY = (e.clientY - centerY) * 0.25;

        // Clamp values to prevent excessive movement
        const clampedX = Math.max(-8, Math.min(8, offsetX));
        const clampedY = Math.max(-4, Math.min(4, offsetY));

        setMagneticOffset({ x: clampedX, y: clampedY });
    }, []);

    /**
     * Reset magnetic offset when mouse leaves
     */
    const handleMouseLeave = useCallback(() => {
        setMagneticOffset({ x: 0, y: 0 });
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

                        {/* Secondary CTA - Magnetic Text Link */}
                        <a
                            ref={secondaryCtaRef}
                            href={getWhatsAppUrl()}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.secondaryCta}
                            onMouseMove={handleMouseMove}
                            onMouseLeave={handleMouseLeave}
                            style={{
                                transform: `translate(${magneticOffset.x}px, ${magneticOffset.y}px)`,
                            }}
                        >
                            <span className={styles.ctaText}>Une question ? Contactez-nous</span>
                            <span className={styles.iconWrapper}>
                                <MoveRight size={18} strokeWidth={1.5} className={styles.arrowIcon} />
                                <WhatsAppIcon className={styles.whatsappIcon} />
                            </span>
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
            </div>
        </section>
    );
}

export default Hero;

