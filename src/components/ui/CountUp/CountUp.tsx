/**
 * CountUp Component
 * 
 * Animated number counter that triggers when element comes into view.
 * Uses spring physics for smooth, natural animation.
 * 
 * Adapted from React Bits for Equipement Ouarzazate.
 * 
 * @module components/ui/CountUp
 */

'use client';

import { useInView, useMotionValue, useSpring } from 'framer-motion';
import { useCallback, useEffect, useRef } from 'react';

export interface CountUpProps {
    /** Target number to count to */
    to: number;
    /** Starting number */
    from?: number;
    /** Count direction */
    direction?: 'up' | 'down';
    /** Delay before starting (in seconds) */
    delay?: number;
    /** Animation duration (in seconds) */
    duration?: number;
    /** CSS class name */
    className?: string;
    /** Whether to start counting (use for conditional triggers) */
    startWhen?: boolean;
    /** Number separator (e.g., " " for "1 000") */
    separator?: string;
    /** Prefix (e.g., "+") */
    prefix?: string;
    /** Suffix (e.g., " ans") */
    suffix?: string;
    /** Callback when animation starts */
    onStart?: () => void;
    /** Callback when animation ends */
    onEnd?: () => void;
}

export default function CountUp({
    to,
    from = 0,
    direction = 'up',
    delay = 0,
    duration = 2,
    className = '',
    startWhen = true,
    separator = '',
    prefix = '',
    suffix = '',
    onStart,
    onEnd,
}: CountUpProps) {
    const ref = useRef<HTMLSpanElement>(null);
    const motionValue = useMotionValue(direction === 'down' ? to : from);

    // Spring physics based on duration
    const damping = 20 + 40 * (1 / duration);
    const stiffness = 100 * (1 / duration);

    const springValue = useSpring(motionValue, {
        damping,
        stiffness,
    });

    const isInView = useInView(ref, { once: true, margin: '0px' });

    // Calculate decimal places
    const getDecimalPlaces = (num: number): number => {
        const str = num.toString();
        if (str.includes('.')) {
            const decimals = str.split('.')[1];
            if (parseInt(decimals) !== 0) {
                return decimals.length;
            }
        }
        return 0;
    };

    const maxDecimals = Math.max(getDecimalPlaces(from), getDecimalPlaces(to));

    // Format the displayed value
    const formatValue = useCallback(
        (latest: number): string => {
            const hasDecimals = maxDecimals > 0;

            const options: Intl.NumberFormatOptions = {
                useGrouping: !!separator,
                minimumFractionDigits: hasDecimals ? maxDecimals : 0,
                maximumFractionDigits: hasDecimals ? maxDecimals : 0,
            };

            const formattedNumber = Intl.NumberFormat('fr-FR', options).format(latest);
            const withSeparator = separator
                ? formattedNumber.replace(/\s/g, separator)
                : formattedNumber;

            return `${prefix}${withSeparator}${suffix}`;
        },
        [maxDecimals, separator, prefix, suffix]
    );

    // Set initial value
    useEffect(() => {
        if (ref.current) {
            ref.current.textContent = formatValue(direction === 'down' ? to : from);
        }
    }, [from, to, direction, formatValue]);

    // Start animation when in view
    useEffect(() => {
        if (isInView && startWhen) {
            if (typeof onStart === 'function') onStart();

            const timeoutId = setTimeout(() => {
                motionValue.set(direction === 'down' ? from : to);
            }, delay * 1000);

            const durationTimeoutId = setTimeout(
                () => {
                    if (typeof onEnd === 'function') onEnd();
                },
                delay * 1000 + duration * 1000
            );

            return () => {
                clearTimeout(timeoutId);
                clearTimeout(durationTimeoutId);
            };
        }
    }, [isInView, startWhen, motionValue, direction, from, to, delay, onStart, onEnd, duration]);

    // Update display on spring value change
    useEffect(() => {
        const unsubscribe = springValue.on('change', (latest: number) => {
            if (ref.current) {
                ref.current.textContent = formatValue(latest);
            }
        });

        return () => unsubscribe();
    }, [springValue, formatValue]);

    return <span className={className} ref={ref} />;
}
