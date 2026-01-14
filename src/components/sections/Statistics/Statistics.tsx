/**
 * Statistics Section Component
 * 
 * Displays company statistics with animated counters that trigger on scroll.
 * Features glassmorphism design, smooth animations, and responsive grid layout.
 * 
 * @module components/sections/Statistics
 */

'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import {
    Award,
    Truck,
    Users,
    Package,
    Boxes,
    Building,
    LucideIcon
} from 'lucide-react';
import { companyStatistics, type Statistic } from '@/data/statistics';
import styles from './Statistics.module.css';

/**
 * Statistics section props
 */
export interface StatisticsProps {
    /** Optional custom class name */
    className?: string;
    /** Animation duration in ms */
    animationDuration?: number;
}

/**
 * Icon mapping for statistics
 */
const iconMap: Record<Statistic['icon'], LucideIcon> = {
    Award,
    Truck,
    Users,
    Package,
    Boxes,
    Building,
};

/**
 * Custom hook for animated counter
 */
function useAnimatedCounter(
    end: number,
    duration: number,
    isVisible: boolean,
    hasDecimal: boolean = false
): number {
    const [count, setCount] = useState(0);
    const frameRef = useRef<number | null>(null);
    const startTimeRef = useRef<number | null>(null);

    useEffect(() => {
        if (!isVisible) {
            setCount(0);
            return;
        }

        const animate = (timestamp: number) => {
            if (startTimeRef.current === null) {
                startTimeRef.current = timestamp;
            }

            const elapsed = timestamp - startTimeRef.current;
            const progress = Math.min(elapsed / duration, 1);

            // Easing function for smooth animation (easeOutQuart)
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const currentValue = end * easeOutQuart;

            setCount(hasDecimal ? parseFloat(currentValue.toFixed(1)) : Math.floor(currentValue));

            if (progress < 1) {
                frameRef.current = requestAnimationFrame(animate);
            } else {
                setCount(end);
            }
        };

        frameRef.current = requestAnimationFrame(animate);

        return () => {
            if (frameRef.current !== null) {
                cancelAnimationFrame(frameRef.current);
            }
            startTimeRef.current = null;
        };
    }, [end, duration, isVisible, hasDecimal]);

    return count;
}

/**
 * Individual statistic card component
 */
interface StatCardProps {
    stat: Statistic;
    isVisible: boolean;
    duration: number;
    index: number;
}

function StatCard({ stat, isVisible, duration, index }: StatCardProps) {
    const Icon = iconMap[stat.icon];
    const hasDecimal = stat.value % 1 !== 0;
    const animatedValue = useAnimatedCounter(stat.value, duration, isVisible, hasDecimal);

    // Format the value with prefix and suffix
    const formattedValue = `${stat.prefix || ''}${hasDecimal ? animatedValue.toFixed(1) : animatedValue}${stat.suffix || ''}`;

    return (
        <article
            className={styles.card}
            style={{ animationDelay: `${index * 100}ms` }}
            data-visible={isVisible}
        >
            <div className={styles.cardInner}>
                {/* Icon container with glow effect */}
                <div className={styles.iconWrapper}>
                    <div className={styles.iconGlow} />
                    <Icon size={28} className={styles.icon} aria-hidden="true" />
                </div>

                {/* Value with animated counter */}
                <div className={styles.value} aria-live="polite">
                    {formattedValue}
                </div>

                {/* Label */}
                <div className={styles.label}>
                    {stat.label}
                </div>
            </div>

            {/* Decorative border gradient */}
            <div className={styles.borderGradient} aria-hidden="true" />
        </article>
    );
}

/**
 * Statistics Section Component
 * 
 * Displays company key figures with animated counters that trigger on scroll.
 * Uses Intersection Observer for scroll-based animation trigger.
 */
export function Statistics({
    className = '',
    animationDuration = 2000
}: StatisticsProps) {
    const [isVisible, setIsVisible] = useState(false);
    const sectionRef = useRef<HTMLElement>(null);

    // Intersection Observer for scroll-based animation trigger
    const handleIntersection = useCallback((entries: IntersectionObserverEntry[]) => {
        const [entry] = entries;
        if (entry.isIntersecting && !isVisible) {
            setIsVisible(true);
        }
    }, [isVisible]);

    useEffect(() => {
        const section = sectionRef.current;
        if (!section) return;

        const observer = new IntersectionObserver(handleIntersection, {
            threshold: 0.2,
            rootMargin: '0px 0px -100px 0px'
        });

        observer.observe(section);

        return () => {
            observer.disconnect();
        };
    }, [handleIntersection]);

    return (
        <section
            ref={sectionRef}
            className={`${styles.statistics} ${className}`.trim()}
            aria-labelledby="statistics-heading"
        >
            {/* Background decorations */}
            <div className={styles.backgroundPattern} aria-hidden="true" />
            <div className={styles.gradientOverlay} aria-hidden="true" />

            <div className={styles.container}>
                {/* Section Header */}
                <header className={styles.header}>
                    <span className={styles.eyebrow}>Notre Excellence</span>
                    <h2 id="statistics-heading" className={styles.title}>
                        Équipement Ouarzazate en chiffres
                    </h2>
                    <p className={styles.subtitle}>
                        Plus de 50 ans d'engagement au service de la construction au Maroc
                    </p>
                </header>

                {/* Statistics Grid */}
                <div className={styles.grid} role="list">
                    {companyStatistics.map((stat, index) => (
                        <StatCard
                            key={stat.id}
                            stat={stat}
                            isVisible={isVisible}
                            duration={animationDuration}
                            index={index}
                        />
                    ))}
                </div>

                {/* Bottom accent line */}
                <div className={styles.accentLine} aria-hidden="true" />
            </div>
        </section>
    );
}

Statistics.displayName = 'Statistics';
