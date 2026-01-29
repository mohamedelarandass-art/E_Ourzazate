'use client';

import React, { useRef, useState } from 'react';
import { motion, useSpring, useTransform, useMotionValue } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import styles from './magnetic-button.module.css';
import { cn } from '@/lib/utils'; // Assuming you have a standard cn utility

interface MagneticButtonProps {
    children: React.ReactNode;
    onClick?: () => void;
    href?: string;
    size?: 'sm' | 'md' | 'lg' | 'xl';
    strength?: number; // 0 to 1, how strong the magnetic pull is
    className?: string;
}

export function MagneticButton({
    children,
    onClick,
    href,
    size = 'md',
    strength = 0.5,
    className,
}: MagneticButtonProps) {
    const ref = useRef<HTMLButtonElement>(null);

    // Mouse position relative to the button center
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    // Spring physics for smooth movement
    // Spring physics for smooth movement
    const springConfig = { damping: 30, stiffness: 80, mass: 0.8 };
    const xSpring = useSpring(x, springConfig);
    const ySpring = useSpring(y, springConfig);

    // Transform logic: The button moves towards the mouse
    // We limit the movement to avoid it running away too far
    // Strength multiplier adjusts the range

    const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
        if (!ref.current) return;

        const { clientX, clientY } = e;
        const { left, top, width, height } = ref.current.getBoundingClientRect();

        const centerX = left + width / 2;
        const centerY = top + height / 2;

        const distanceX = clientX - centerX;
        const distanceY = clientY - centerY;

        // Apply strength factor
        x.set(distanceX * strength);
        y.set(distanceY * strength);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    // Component Content
    const Content = () => (
        <>
            {/* Grain Texture */}
            <div className={styles.grain} aria-hidden="true" />

            {/* Liquid Fill Element */}
            <div className={styles.fill} aria-hidden="true" />

            {/* Text */}
            <span className={styles.text}>{children}</span>

            {/* Animated Arrow */}
            <div className={styles.arrowContainer} aria-hidden="true">
                <ArrowRight className={cn(styles.arrow, styles.arrowPrimary)} />
                <ArrowRight className={cn(styles.arrow, styles.arrowSecondary)} />
            </div>
        </>
    );

    // Common props
    const motionProps = {
        ref: ref,
        className: cn(styles.magneticButton, styles[size], className),
        onMouseMove: handleMouseMove,
        onMouseLeave: handleMouseLeave,
        style: { x: xSpring, y: ySpring },
        whileTap: { scale: 0.95 },
    };

    if (href) {
        // If it's a link, we need to wrap formatting. 
        // Note: motion.a supports the same props.
        // Importing Link from next/link usually wraps an anchor.
        // For physics to work on the anchor itself, we use motion.a

        return (
            <motion.a
                href={href}
                {...(motionProps as any)}
                onClick={onClick}
            >
                <Content />
            </motion.a>
        );
    }

    return (
        <motion.button
            {...motionProps}
            onClick={onClick}
        >
            <Content />
        </motion.button>
    );
}
