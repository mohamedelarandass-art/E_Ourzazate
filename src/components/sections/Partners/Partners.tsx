/**
 * Partners Section Component
 * 
 * Displays partner logos in an infinite scrolling carousel.
 * Features grayscale-to-color hover effect and smooth CSS animations.
 * 
 * @module components/sections/Partners
 */

'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { Handshake } from 'lucide-react';
import { partners, type Partner } from '@/data/partners';
import styles from './Partners.module.css';

/**
 * Partners section props
 */
export interface PartnersProps {
    /** Optional custom class name */
    className?: string;
    /** Animation speed in seconds */
    animationSpeed?: number;
}

/**
 * Partner logo component
 */
interface PartnerLogoProps {
    partner: Partner;
}

function PartnerLogo({ partner }: PartnerLogoProps) {
    return (
        <div className={styles.logoWrapper} title={partner.name}>
            <Image
                src={partner.logo}
                alt={`Logo ${partner.name} - ${partner.category}`}
                width={140}
                height={70}
                className={styles.logo}
                loading="lazy"
                data-no-dark-adjust="true"
            />
            <div className={styles.logoOverlay}>
                <span className={styles.logoName}>{partner.name}</span>
            </div>
        </div>
    );
}

/**
 * Partners Section Component
 * 
 * Displays partner logos in a premium infinite carousel.
 * Uses CSS animations for smooth, performant scrolling.
 */
export function Partners({
    className = '',
    animationSpeed = 30
}: PartnersProps) {
    const [isPaused, setIsPaused] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const sectionRef = useRef<HTMLElement>(null);

    // Divide partners into two rows
    const midpoint = Math.ceil(partners.length / 2);
    const row1Partners = partners.slice(0, midpoint);
    const row2Partners = partners.slice(midpoint);

    // Duplicate for seamless loop
    const row1Duplicated = [...row1Partners, ...row1Partners];
    const row2Duplicated = [...row2Partners, ...row2Partners];

    // Intersection Observer for reveal animation
    useEffect(() => {
        const section = sectionRef.current;
        if (!section) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                }
            },
            { threshold: 0.1 }
        );

        observer.observe(section);
        return () => observer.disconnect();
    }, []);

    return (
        <section
            ref={sectionRef}
            className={`${styles.partners} ${className}`.trim()}
            aria-labelledby="partners-heading"
            data-visible={isVisible}
        >
            {/* Background decorations */}
            <div className={styles.backgroundGradient} aria-hidden="true" />

            {/* Edge fade overlays - positioned at section level for full-width coverage */}
            <div className={styles.fadeLeft} aria-hidden="true" />
            <div className={styles.fadeRight} aria-hidden="true" />

            <div className={styles.container}>
                {/* Section Header */}
                <header className={styles.header}>
                    <div className={styles.iconBadge}>
                        <Handshake size={24} className={styles.headerIcon} />
                    </div>
                    <h2 id="partners-heading" className={styles.title}>
                        Nos partenaires, notre force d'innovation
                    </h2>
                    <p className={styles.subtitle}>
                        Nous collaborons avec les plus grandes marques du secteur pour vous garantir
                        qualité et fiabilité
                    </p>
                </header>

                {/* Carousel Container */}
                <div
                    className={styles.carouselContainer}
                    onMouseEnter={() => setIsPaused(true)}
                    onMouseLeave={() => setIsPaused(false)}
                    role="region"
                    aria-label="Logos des partenaires"
                >
                    {/* Row 1 - Scroll Left */}
                    <div
                        className={styles.carouselRow}
                        style={{
                            animationDuration: `${animationSpeed}s`,
                            animationPlayState: isPaused ? 'paused' : 'running'
                        }}
                        data-direction="left"
                    >
                        {row1Duplicated.map((partner, index) => (
                            <PartnerLogo
                                key={`row1-${partner.id}-${index}`}
                                partner={partner}
                            />
                        ))}
                    </div>

                    {/* Row 2 - Scroll Right */}
                    <div
                        className={styles.carouselRow}
                        style={{
                            animationDuration: `${animationSpeed * 1.2}s`,
                            animationPlayState: isPaused ? 'paused' : 'running'
                        }}
                        data-direction="right"
                    >
                        {row2Duplicated.map((partner, index) => (
                            <PartnerLogo
                                key={`row2-${partner.id}-${index}`}
                                partner={partner}
                            />
                        ))}
                    </div>
                </div>

                {/* Stats badge */}
                <div className={styles.statsBadge}>
                    <span className={styles.statsNumber}>+300</span>
                    <span className={styles.statsLabel}>marques partenaires</span>
                </div>
            </div>
        </section>
    );
}

Partners.displayName = 'Partners';
