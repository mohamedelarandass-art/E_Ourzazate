/**
 * useMediaQuery Hook
 * 
 * Custom hook for responsive design with media queries.
 * 
 * @module hooks/useMediaQuery
 */

'use client';

import { useState, useEffect } from 'react';
import { isClient } from '@/lib/utils';

/**
 * Breakpoint values matching our CSS variables.
 */
export const breakpoints = {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
} as const;

export type Breakpoint = keyof typeof breakpoints;

/**
 * Hook for matching a media query.
 * 
 * @param query - Media query string
 * @returns Whether the query matches
 * 
 * @example
 * const isLarge = useMediaQuery('(min-width: 1024px)');
 */
export function useMediaQuery(query: string): boolean {
    const [matches, setMatches] = useState(false);

    useEffect(() => {
        if (!isClient) return;

        const mediaQuery = window.matchMedia(query);
        setMatches(mediaQuery.matches);

        const handler = (e: MediaQueryListEvent) => {
            setMatches(e.matches);
        };

        mediaQuery.addEventListener('change', handler);
        return () => mediaQuery.removeEventListener('change', handler);
    }, [query]);

    return matches;
}

/**
 * Hook for checking if viewport is at or above a breakpoint.
 * 
 * @param breakpoint - Breakpoint name
 * @returns Whether viewport is at or above the breakpoint
 * 
 * @example
 * const isDesktop = useBreakpoint('lg');
 */
export function useBreakpoint(breakpoint: Breakpoint): boolean {
    return useMediaQuery(`(min-width: ${breakpoints[breakpoint]})`);
}

/**
 * Hook for getting all breakpoint states at once.
 * 
 * @returns Object with boolean for each breakpoint
 * 
 * @example
 * const { isMobile, isTablet, isDesktop } = useBreakpoints();
 */
export function useBreakpoints() {
    const sm = useMediaQuery(`(min-width: ${breakpoints.sm})`);
    const md = useMediaQuery(`(min-width: ${breakpoints.md})`);
    const lg = useMediaQuery(`(min-width: ${breakpoints.lg})`);
    const xl = useMediaQuery(`(min-width: ${breakpoints.xl})`);
    const xxl = useMediaQuery(`(min-width: ${breakpoints['2xl']})`);

    return {
        /** At or above 640px */
        sm,
        /** At or above 768px */
        md,
        /** At or above 1024px */
        lg,
        /** At or above 1280px */
        xl,
        /** At or above 1536px */
        xxl,

        // Semantic aliases
        /** Below 640px (mobile phones) */
        isMobile: !sm,
        /** 640px - 1023px (tablets) */
        isTablet: sm && !lg,
        /** 1024px and above (desktops) */
        isDesktop: lg,
        /** 1280px and above (large screens) */
        isLargeScreen: xl,
    };
}

/**
 * Hook for detecting touch devices.
 * 
 * @returns Whether the device supports touch
 */
export function useIsTouchDevice(): boolean {
    const [isTouch, setIsTouch] = useState(false);

    useEffect(() => {
        if (!isClient) return;

        const hasTouch =
            'ontouchstart' in window ||
            navigator.maxTouchPoints > 0;

        setIsTouch(hasTouch);
    }, []);

    return isTouch;
}

/**
 * Hook for detecting print mode.
 * 
 * @returns Whether the page is being printed
 */
export function useIsPrinting(): boolean {
    return useMediaQuery('print');
}

/**
 * Hook for detecting reduced motion preference.
 * 
 * @returns Whether user prefers reduced motion
 */
export function usePrefersReducedMotion(): boolean {
    return useMediaQuery('(prefers-reduced-motion: reduce)');
}
