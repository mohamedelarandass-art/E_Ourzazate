/**
 * useTheme Hook
 * 
 * Custom hook for managing theme (light/dark mode).
 * Handles localStorage persistence and system preference detection.
 * 
 * @module hooks/useTheme
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { isClient } from '@/lib/utils';

export type Theme = 'light' | 'dark' | 'system';
export type ResolvedTheme = 'light' | 'dark';

const THEME_KEY = 'theme-preference';

/**
 * Get the system color scheme preference.
 */
function getSystemTheme(): ResolvedTheme {
    if (!isClient) return 'light';
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

/**
 * Get the stored theme from localStorage.
 */
function getStoredTheme(): Theme {
    if (!isClient) return 'system';
    const stored = localStorage.getItem(THEME_KEY);
    if (stored === 'light' || stored === 'dark' || stored === 'system') {
        return stored;
    }
    return 'system';
}

/**
 * Hook for managing theme state.
 * 
 * @returns Theme state and setters
 * 
 * @example
 * const { theme, resolvedTheme, setTheme, toggleTheme } = useTheme();
 */
export function useTheme() {
    const [theme, setThemeState] = useState<Theme>('system');
    const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>('light');
    const [mounted, setMounted] = useState(false);

    // Initialize on mount
    useEffect(() => {
        setMounted(true);
        const stored = getStoredTheme();
        setThemeState(stored);

        const resolved = stored === 'system' ? getSystemTheme() : stored;
        setResolvedTheme(resolved);
    }, []);

    // Apply theme to document
    useEffect(() => {
        if (!mounted) return;

        const resolved = theme === 'system' ? getSystemTheme() : theme;
        setResolvedTheme(resolved);

        // Apply to document
        document.documentElement.setAttribute('data-theme', resolved);

        // Store preference
        localStorage.setItem(THEME_KEY, theme);
    }, [theme, mounted]);

    // Listen for system preference changes
    useEffect(() => {
        if (!isClient || theme !== 'system') return;

        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

        const handler = (e: MediaQueryListEvent) => {
            setResolvedTheme(e.matches ? 'dark' : 'light');
        };

        mediaQuery.addEventListener('change', handler);
        return () => mediaQuery.removeEventListener('change', handler);
    }, [theme]);

    /**
     * Set the theme preference.
     */
    const setTheme = useCallback((newTheme: Theme) => {
        setThemeState(newTheme);
    }, []);

    /**
     * Toggle between light and dark themes.
     */
    const toggleTheme = useCallback(() => {
        setThemeState((current) => {
            const resolved = current === 'system' ? getSystemTheme() : current;
            return resolved === 'light' ? 'dark' : 'light';
        });
    }, []);

    return {
        /** Current theme preference ('light', 'dark', or 'system') */
        theme,

        /** Resolved theme based on preference and system ('light' or 'dark') */
        resolvedTheme,

        /** Whether the component has mounted (for SSR) */
        mounted,

        /** Set the theme preference */
        setTheme,

        /** Toggle between light and dark */
        toggleTheme,

        /** Check if current theme is dark */
        isDark: resolvedTheme === 'dark',

        /** Check if current theme is light */
        isLight: resolvedTheme === 'light',
    };
}
