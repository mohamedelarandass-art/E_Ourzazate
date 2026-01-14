/**
 * Theme Provider
 * 
 * Context provider for managing theme state across the application.
 * This wraps the useTheme hook to provide global theme context.
 * 
 * @module context/ThemeProvider
 */

'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

// Types
export type Theme = 'light' | 'dark' | 'system';
export type ResolvedTheme = 'light' | 'dark';

interface ThemeContextValue {
    /** Current theme preference */
    theme: Theme;
    /** Resolved theme (light or dark) */
    resolvedTheme: ResolvedTheme;
    /** Whether the component has mounted */
    mounted: boolean;
    /** Set the theme */
    setTheme: (theme: Theme) => void;
    /** Toggle between light and dark */
    toggleTheme: () => void;
    /** Check if current theme is dark */
    isDark: boolean;
    /** Check if current theme is light */
    isLight: boolean;
}

interface ThemeProviderProps {
    children: ReactNode;
    /** Default theme if none stored */
    defaultTheme?: Theme;
    /** Storage key for localStorage */
    storageKey?: string;
    /** Force a specific theme (overrides stored) */
    forcedTheme?: ResolvedTheme;
    /** Disable transitions on theme change */
    disableTransitionOnChange?: boolean;
}

// Context
const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

// Constants
const THEME_KEY = 'theme-preference';

/**
 * Get system color scheme preference.
 */
function getSystemTheme(): ResolvedTheme {
    if (typeof window === 'undefined') return 'light';
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

/**
 * ThemeProvider component.
 * Wrap your app with this to enable theme functionality.
 * 
 * @example
 * <ThemeProvider defaultTheme="system">
 *   <App />
 * </ThemeProvider>
 */
export function ThemeProvider({
    children,
    defaultTheme = 'system',
    storageKey = THEME_KEY,
    forcedTheme,
    disableTransitionOnChange = false,
}: ThemeProviderProps) {
    const [theme, setThemeState] = useState<Theme>(defaultTheme);
    const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>('light');
    const [mounted, setMounted] = useState(false);

    // Initialize on mount
    useEffect(() => {
        setMounted(true);

        // Get stored theme
        const stored = localStorage.getItem(storageKey) as Theme | null;
        const initial = stored || defaultTheme;
        setThemeState(initial);

        // Resolve theme
        const resolved = forcedTheme || (initial === 'system' ? getSystemTheme() : initial as ResolvedTheme);
        setResolvedTheme(resolved);
    }, [defaultTheme, storageKey, forcedTheme]);

    // Apply theme changes
    useEffect(() => {
        if (!mounted) return;

        const resolved = forcedTheme || (theme === 'system' ? getSystemTheme() : theme as ResolvedTheme);
        setResolvedTheme(resolved);

        // Disable transitions during theme change
        const disableAnimation = () => {
            const style = document.createElement('style');
            style.appendChild(
                document.createTextNode(
                    '*, *::before, *::after { transition: none !important; animation: none !important; }'
                )
            );
            document.head.appendChild(style);
            return style;
        };

        let style: HTMLStyleElement | undefined;
        if (disableTransitionOnChange) {
            style = disableAnimation();
        }

        // Apply theme to document
        document.documentElement.setAttribute('data-theme', resolved);

        // Store preference
        if (!forcedTheme) {
            localStorage.setItem(storageKey, theme);
        }

        // Re-enable transitions
        if (style) {
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    document.head.removeChild(style!);
                });
            });
        }
    }, [theme, mounted, storageKey, forcedTheme, disableTransitionOnChange]);

    // Listen for system preference changes
    useEffect(() => {
        if (typeof window === 'undefined' || theme !== 'system' || forcedTheme) return;

        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

        const handler = (e: MediaQueryListEvent) => {
            setResolvedTheme(e.matches ? 'dark' : 'light');
        };

        mediaQuery.addEventListener('change', handler);
        return () => mediaQuery.removeEventListener('change', handler);
    }, [theme, forcedTheme]);

    // Set theme function
    const setTheme = (newTheme: Theme) => {
        setThemeState(newTheme);
    };

    // Toggle theme function
    const toggleTheme = () => {
        setThemeState((current) => {
            const resolved = current === 'system' ? getSystemTheme() : current as ResolvedTheme;
            return resolved === 'light' ? 'dark' : 'light';
        });
    };

    const value: ThemeContextValue = {
        theme,
        resolvedTheme,
        mounted,
        setTheme,
        toggleTheme,
        isDark: resolvedTheme === 'dark',
        isLight: resolvedTheme === 'light',
    };

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
}

/**
 * Hook to use theme context.
 * Must be used within a ThemeProvider.
 * 
 * @example
 * const { theme, toggleTheme, isDark } = useThemeContext();
 */
export function useThemeContext(): ThemeContextValue {
    const context = useContext(ThemeContext);

    if (context === undefined) {
        throw new Error('useThemeContext must be used within a ThemeProvider');
    }

    return context;
}
