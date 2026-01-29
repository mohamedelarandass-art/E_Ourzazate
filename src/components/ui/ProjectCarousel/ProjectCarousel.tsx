/**
 * ProjectCarousel Component
 * 
 * A premium horizontal carousel for showcasing projects with 3D perspective
 * rotation effects. Adapted from React Bits for Equipement Ouarzazate.
 * 
 * Features:
 * - 3D rotateY effect on scroll/drag
 * - Autoplay with pause on hover
 * - Loop mode for infinite scrolling
 * - Touch/swipe support
 * - Dot indicators
 * - Design system integration (gold accents, glassmorphism)
 * 
 * @module components/ui/ProjectCarousel
 */

'use client';

import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { motion, useMotionValue, useTransform, type MotionValue } from 'framer-motion';
import styles from './ProjectCarousel.module.css';

/* ==========================================================================
   TYPES
   ========================================================================== */

export interface CarouselItem {
    id: string;
    title: string;
    description?: string;
    icon: ReactNode;
    category?: string;
}

export interface ProjectCarouselProps {
    /** Array of items to display */
    items: CarouselItem[];
    /** Base width of the carousel container */
    baseWidth?: number;
    /** Enable autoplay */
    autoplay?: boolean;
    /** Autoplay interval in ms */
    autoplayDelay?: number;
    /** Pause autoplay on hover */
    pauseOnHover?: boolean;
    /** Enable infinite loop */
    loop?: boolean;
    /** Additional CSS class */
    className?: string;
}

/* ==========================================================================
   CONSTANTS
   ========================================================================== */

const DRAG_BUFFER = 0;
const VELOCITY_THRESHOLD = 500;
const GAP = 20;
const SPRING_OPTIONS = { type: 'spring' as const, stiffness: 300, damping: 30 };

/* ==========================================================================
   CAROUSEL ITEM COMPONENT
   ========================================================================== */

interface CarouselItemProps {
    item: CarouselItem;
    index: number;
    itemWidth: number;
    trackItemOffset: number;
    x: MotionValue<number>;
    transition: typeof SPRING_OPTIONS | { duration: number };
}

function CarouselItemCard({
    item,
    index,
    itemWidth,
    trackItemOffset,
    x,
    transition,
}: CarouselItemProps) {
    // 3D rotation based on position
    const range = [
        -(index + 1) * trackItemOffset,
        -index * trackItemOffset,
        -(index - 1) * trackItemOffset,
    ];
    const outputRange = [60, 0, -60]; // Reduced rotation for subtlety
    const rotateY = useTransform(x, range, outputRange, { clamp: false });

    return (
        <motion.div
            className={styles.carouselItem}
            style={{
                width: itemWidth,
                rotateY,
            }}
            transition={transition}
        >
            {/* Icon Header */}
            <div className={styles.itemHeader}>
                <span className={styles.iconContainer}>
                    {item.icon}
                </span>
            </div>

            {/* Content */}
            <div className={styles.itemContent}>
                <h4 className={styles.itemTitle}>{item.title}</h4>
                {item.description && (
                    <p className={styles.itemDescription}>{item.description}</p>
                )}
                {item.category && (
                    <span className={styles.itemCategory}>{item.category}</span>
                )}
            </div>
        </motion.div>
    );
}

/* ==========================================================================
   MAIN CAROUSEL COMPONENT
   ========================================================================== */

export default function ProjectCarousel({
    items,
    baseWidth = 340,
    autoplay = true,
    autoplayDelay = 4000,
    pauseOnHover = true,
    loop = true,
    className = '',
}: ProjectCarouselProps) {
    const containerPadding = 20;
    const itemWidth = baseWidth - containerPadding * 2;
    const trackItemOffset = itemWidth + GAP;

    // Clone items for infinite loop
    const itemsForRender = useMemo(() => {
        if (!loop) return items;
        if (items.length === 0) return [];
        return [items[items.length - 1], ...items, items[0]];
    }, [items, loop]);

    const [position, setPosition] = useState(loop ? 1 : 0);
    const x = useMotionValue(0);
    const [isHovered, setIsHovered] = useState(false);
    const [isJumping, setIsJumping] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);

    const containerRef = useRef<HTMLDivElement>(null);

    // Hover detection for pause
    useEffect(() => {
        if (pauseOnHover && containerRef.current) {
            const container = containerRef.current;
            const handleMouseEnter = () => setIsHovered(true);
            const handleMouseLeave = () => setIsHovered(false);
            container.addEventListener('mouseenter', handleMouseEnter);
            container.addEventListener('mouseleave', handleMouseLeave);
            return () => {
                container.removeEventListener('mouseenter', handleMouseEnter);
                container.removeEventListener('mouseleave', handleMouseLeave);
            };
        }
    }, [pauseOnHover]);

    // Autoplay timer
    useEffect(() => {
        if (!autoplay || itemsForRender.length <= 1) return undefined;
        if (pauseOnHover && isHovered) return undefined;

        const timer = setInterval(() => {
            setPosition(prev => Math.min(prev + 1, itemsForRender.length - 1));
        }, autoplayDelay);

        return () => clearInterval(timer);
    }, [autoplay, autoplayDelay, isHovered, pauseOnHover, itemsForRender.length]);

    // Initialize position
    useEffect(() => {
        const startingPosition = loop ? 1 : 0;
        setPosition(startingPosition);
        x.set(-startingPosition * trackItemOffset);
    }, [items.length, loop, trackItemOffset, x]);

    // Bounds check
    useEffect(() => {
        if (!loop && position > itemsForRender.length - 1) {
            setPosition(Math.max(0, itemsForRender.length - 1));
        }
    }, [itemsForRender.length, loop, position]);

    const effectiveTransition = isJumping ? { duration: 0 } : SPRING_OPTIONS;

    const handleAnimationStart = () => {
        setIsAnimating(true);
    };

    const handleAnimationComplete = () => {
        if (!loop || itemsForRender.length <= 1) {
            setIsAnimating(false);
            return;
        }
        const lastCloneIndex = itemsForRender.length - 1;

        // Jump to real first item when reaching end clone
        if (position === lastCloneIndex) {
            setIsJumping(true);
            const target = 1;
            setPosition(target);
            x.set(-target * trackItemOffset);
            requestAnimationFrame(() => {
                setIsJumping(false);
                setIsAnimating(false);
            });
            return;
        }

        // Jump to real last item when reaching start clone
        if (position === 0) {
            setIsJumping(true);
            const target = items.length;
            setPosition(target);
            x.set(-target * trackItemOffset);
            requestAnimationFrame(() => {
                setIsJumping(false);
                setIsAnimating(false);
            });
            return;
        }

        setIsAnimating(false);
    };

    const handleDragEnd = (
        _: MouseEvent | TouchEvent | PointerEvent,
        info: { offset: { x: number }; velocity: { x: number } }
    ) => {
        const { offset, velocity } = info;
        const direction =
            offset.x < -DRAG_BUFFER || velocity.x < -VELOCITY_THRESHOLD
                ? 1
                : offset.x > DRAG_BUFFER || velocity.x > VELOCITY_THRESHOLD
                    ? -1
                    : 0;

        if (direction === 0) return;

        setPosition(prev => {
            const next = prev + direction;
            const max = itemsForRender.length - 1;
            return Math.max(0, Math.min(next, max));
        });
    };

    const dragProps = loop
        ? {}
        : {
            dragConstraints: {
                left: -trackItemOffset * Math.max(itemsForRender.length - 1, 0),
                right: 0,
            },
        };

    // Current active item index (accounting for loop clones)
    const activeIndex =
        items.length === 0
            ? 0
            : loop
                ? (position - 1 + items.length) % items.length
                : Math.min(position, items.length - 1);

    return (
        <div
            ref={containerRef}
            className={`${styles.carouselContainer} ${className}`}
            style={{ width: `${baseWidth}px` }}
        >
            {/* Track */}
            <motion.div
                className={styles.carouselTrack}
                drag={isAnimating ? false : 'x'}
                {...dragProps}
                style={{
                    width: itemWidth,
                    gap: `${GAP}px`,
                    perspective: 1000,
                    perspectiveOrigin: `${position * trackItemOffset + itemWidth / 2}px 50%`,
                    x,
                }}
                onDragEnd={handleDragEnd}
                animate={{ x: -(position * trackItemOffset) }}
                transition={effectiveTransition}
                onAnimationStart={handleAnimationStart}
                onAnimationComplete={handleAnimationComplete}
            >
                {itemsForRender.map((item, index) => (
                    <CarouselItemCard
                        key={`${item?.id ?? index}-${index}`}
                        item={item}
                        index={index}
                        itemWidth={itemWidth}
                        trackItemOffset={trackItemOffset}
                        x={x}
                        transition={effectiveTransition}
                    />
                ))}
            </motion.div>

            {/* Dot Indicators */}
            <div className={styles.indicatorsContainer}>
                <div className={styles.indicators}>
                    {items.map((_, index) => (
                        <motion.button
                            key={index}
                            className={`${styles.indicator} ${activeIndex === index ? styles.indicatorActive : ''}`}
                            animate={{ scale: activeIndex === index ? 1.3 : 1 }}
                            onClick={() => setPosition(loop ? index + 1 : index)}
                            transition={{ duration: 0.15 }}
                            aria-label={`Aller au projet ${index + 1}`}
                            aria-current={activeIndex === index ? 'true' : undefined}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
