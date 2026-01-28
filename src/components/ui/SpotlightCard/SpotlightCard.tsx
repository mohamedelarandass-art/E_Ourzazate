/**
 * SpotlightCard Component
 * 
 * A premium interactive card that creates a radial spotlight effect following
 * the user's cursor. Designed for showcasing prestigious projects and content
 * that deserves special attention.
 * 
 * Adapted from React Bits, customized for Equipement Ouarzazate design system:
 * - Gold/wood spotlight color as default
 * - Glassmorphism integration
 * - Dark mode support
 * - Accessibility features (focus-within support)
 * - Touch device considerations
 * 
 * @module components/ui/SpotlightCard
 * @see https://reactbits.dev/components/spotlight-card
 */

'use client';

import { useRef, useCallback, type ReactNode, type MouseEvent, type CSSProperties } from 'react';
import { cn } from '@/lib/utils';
import styles from './SpotlightCard.module.css';

/* ==========================================================================
   TYPES
   ========================================================================== */

export interface SpotlightCardProps {
    /** Card content */
    children: ReactNode;
    /** Additional CSS classes */
    className?: string;
    /** 
     * Spotlight color in rgba format
     * @default 'rgba(176, 141, 87, 0.25)' - Gold/wood color from design system
     */
    spotlightColor?: string;
    /**
     * Spotlight blur radius
     * @default '80%'
     */
    spotlightRadius?: string;
    /**
     * Spotlight intensity on hover (0-1)
     * @default 0.6
     */
    spotlightIntensity?: number;
    /** 
     * Whether the card is in "featured" mode (larger spotlight, more emphasis)
     * @default false
     */
    featured?: boolean;
    /**
     * Border radius variant
     * @default 'xl'
     */
    radius?: 'md' | 'lg' | 'xl' | '2xl' | '3xl';
    /**
     * Card size variant
     * @default 'default'
     */
    size?: 'compact' | 'default' | 'large';
    /**
     * Whether to show subtle border glow on hover
     * @default false
     */
    glowBorder?: boolean;
    /** Optional click handler */
    onClick?: () => void;
    /** Custom inline styles */
    style?: CSSProperties;
    /** Accessible label */
    'aria-label'?: string;
}

/* ==========================================================================
   COMPONENT
   ========================================================================== */

const SpotlightCard = ({
    children,
    className = '',
    spotlightColor = 'rgba(176, 141, 87, 0.25)',
    spotlightRadius = '80%',
    spotlightIntensity = 0.6,
    featured = false,
    radius = 'xl',
    size = 'default',
    glowBorder = false,
    onClick,
    style,
    'aria-label': ariaLabel,
}: SpotlightCardProps) => {
    const cardRef = useRef<HTMLDivElement>(null);

    /**
     * Handles mouse movement to update spotlight position
     * Uses CSS custom properties for smooth, GPU-accelerated animation
     */
    const handleMouseMove = useCallback((e: MouseEvent<HTMLDivElement>) => {
        if (!cardRef.current) return;

        const rect = cardRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Update CSS custom properties for spotlight position
        cardRef.current.style.setProperty('--spotlight-x', `${x}px`);
        cardRef.current.style.setProperty('--spotlight-y', `${y}px`);
    }, []);

    /**
     * Resets spotlight to center when mouse leaves the card
     * Creates a smooth fade-out effect
     */
    const handleMouseLeave = useCallback(() => {
        if (!cardRef.current) return;

        // Reset to center for a graceful exit
        const rect = cardRef.current.getBoundingClientRect();
        cardRef.current.style.setProperty('--spotlight-x', `${rect.width / 2}px`);
        cardRef.current.style.setProperty('--spotlight-y', `${rect.height / 2}px`);
    }, []);

    // Build CSS custom property styles
    const customStyles: CSSProperties = {
        '--spotlight-color': spotlightColor,
        '--spotlight-radius': spotlightRadius,
        '--spotlight-intensity': spotlightIntensity,
        ...style,
    } as CSSProperties;

    // Build class names
    const cardClasses = cn(
        styles.spotlightCard,
        styles[`radius-${radius}`],
        styles[`size-${size}`],
        {
            [styles.featured]: featured,
            [styles.glowBorder]: glowBorder,
            [styles.clickable]: !!onClick,
        },
        className
    );

    return (
        <div
            ref={cardRef}
            className={cardClasses}
            style={customStyles}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onClick={onClick}
            role={onClick ? 'button' : undefined}
            tabIndex={onClick ? 0 : undefined}
            aria-label={ariaLabel}
            onKeyDown={onClick ? (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onClick();
                }
            } : undefined}
        >
            {/* Spotlight Effect Layer */}
            <div className={styles.spotlightEffect} aria-hidden="true" />

            {/* Optional Glow Border */}
            {glowBorder && <div className={styles.glowBorderEffect} aria-hidden="true" />}

            {/* Card Content */}
            <div className={styles.content}>
                {children}
            </div>
        </div>
    );
};

export default SpotlightCard;
