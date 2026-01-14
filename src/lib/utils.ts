/**
 * Utility Functions
 * 
 * Common utility functions used throughout the application.
 * 
 * @module lib/utils
 */

import { type ClassValue, clsx } from 'clsx';

/**
 * Combines class names conditionally.
 * Uses clsx for conditional class name handling.
 * 
 * @param inputs - Class values to combine
 * @returns Combined class string
 * 
 * @example
 * cn('base-class', isActive && 'active', { 'disabled': isDisabled })
 */
export function cn(...inputs: ClassValue[]): string {
    return clsx(inputs);
}

/**
 * Formats a date for display in French locale.
 * 
 * @param date - Date to format (Date object or string)
 * @returns Formatted date string (e.g., "15 janvier 2024")
 * 
 * @example
 * formatDate(new Date()) // "10 janvier 2026"
 */
export function formatDate(date: Date | string): string {
    return new Intl.DateTimeFormat('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    }).format(new Date(date));
}

/**
 * Formats a date with time for display in French locale.
 * 
 * @param date - Date to format
 * @returns Formatted date and time string
 */
export function formatDateTime(date: Date | string): string {
    return new Intl.DateTimeFormat('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    }).format(new Date(date));
}

/**
 * Formats a relative time (e.g., "il y a 2 jours").
 * 
 * @param date - Date to format
 * @returns Relative time string
 */
export function formatRelativeTime(date: Date | string): string {
    const now = new Date();
    const target = new Date(date);
    const diffMs = now.getTime() - target.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        if (diffHours === 0) {
            const diffMinutes = Math.floor(diffMs / (1000 * 60));
            if (diffMinutes < 1) return "À l'instant";
            return `Il y a ${diffMinutes} minute${diffMinutes > 1 ? 's' : ''}`;
        }
        return `Il y a ${diffHours} heure${diffHours > 1 ? 's' : ''}`;
    }

    if (diffDays === 1) return 'Hier';
    if (diffDays < 7) return `Il y a ${diffDays} jours`;
    if (diffDays < 30) {
        const weeks = Math.floor(diffDays / 7);
        return `Il y a ${weeks} semaine${weeks > 1 ? 's' : ''}`;
    }

    return formatDate(date);
}

/**
 * Generates a URL-friendly slug from a string.
 * Handles French characters and diacritics.
 * 
 * @param str - String to slugify
 * @returns URL-friendly slug
 * 
 * @example
 * slugify("Meubles Salle de Bain") // "meubles-salle-de-bain"
 * slugify("Électroménager") // "electromenager"
 */
export function slugify(str: string): string {
    return str
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
        .replace(/[^a-z0-9]+/g, '-')     // Replace non-alphanumeric with hyphens
        .replace(/(^-|-$)/g, '');        // Remove leading/trailing hyphens
}

/**
 * Truncates text with ellipsis.
 * 
 * @param str - String to truncate
 * @param length - Maximum length
 * @returns Truncated string with ellipsis
 * 
 * @example
 * truncate("This is a long text", 10) // "This is a..."
 */
export function truncate(str: string, length: number): string {
    if (str.length <= length) return str;
    return str.slice(0, length).trim() + '...';
}

/**
 * Generates a unique ID.
 * 
 * @param prefix - Optional prefix for the ID
 * @returns Unique ID string
 */
export function generateId(prefix = ''): string {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 9);
    return prefix ? `${prefix}-${timestamp}${random}` : `${timestamp}${random}`;
}

/**
 * Debounces a function call.
 * 
 * @param fn - Function to debounce
 * @param delay - Delay in milliseconds
 * @returns Debounced function
 */
export function debounce<T extends (...args: Parameters<T>) => void>(
    fn: T,
    delay: number
): (...args: Parameters<T>) => void {
    let timeoutId: ReturnType<typeof setTimeout>;

    return (...args: Parameters<T>) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => fn(...args), delay);
    };
}

/**
 * Throttles a function call.
 * 
 * @param fn - Function to throttle
 * @param limit - Time limit in milliseconds
 * @returns Throttled function
 */
export function throttle<T extends (...args: Parameters<T>) => void>(
    fn: T,
    limit: number
): (...args: Parameters<T>) => void {
    let inThrottle = false;

    return (...args: Parameters<T>) => {
        if (!inThrottle) {
            fn(...args);
            inThrottle = true;
            setTimeout(() => (inThrottle = false), limit);
        }
    };
}

/**
 * Formats a number with French locale formatting.
 * 
 * @param num - Number to format
 * @returns Formatted number string
 */
export function formatNumber(num: number): string {
    return new Intl.NumberFormat('fr-FR').format(num);
}

/**
 * Capitalizes the first letter of a string.
 * 
 * @param str - String to capitalize
 * @returns Capitalized string
 */
export function capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Checks if we're running on the client side.
 */
export const isClient = typeof window !== 'undefined';

/**
 * Checks if we're running on the server side.
 */
export const isServer = typeof window === 'undefined';

/**
 * Safe JSON parse with default value.
 * 
 * @param str - String to parse
 * @param defaultValue - Default value if parsing fails
 * @returns Parsed value or default
 */
export function safeJsonParse<T>(str: string, defaultValue: T): T {
    try {
        return JSON.parse(str) as T;
    } catch {
        return defaultValue;
    }
}

/**
 * Creates an array of numbers from start to end.
 * 
 * @param start - Start number
 * @param end - End number
 * @returns Array of numbers
 */
export function range(start: number, end: number): number[] {
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
}

/**
 * Groups an array of items by a key.
 * 
 * @param items - Array of items
 * @param key - Key to group by
 * @returns Grouped object
 */
export function groupBy<T>(items: T[], key: keyof T): Record<string, T[]> {
    return items.reduce((acc, item) => {
        const groupKey = String(item[key]);
        if (!acc[groupKey]) {
            acc[groupKey] = [];
        }
        acc[groupKey].push(item);
        return acc;
    }, {} as Record<string, T[]>);
}

/**
 * Removes duplicate items from an array.
 * 
 * @param items - Array with potential duplicates
 * @param key - Optional key to compare by (for objects)
 * @returns Array with unique items
 */
export function unique<T>(items: T[], key?: keyof T): T[] {
    if (key) {
        const seen = new Set<unknown>();
        return items.filter((item) => {
            const value = item[key];
            if (seen.has(value)) return false;
            seen.add(value);
            return true;
        });
    }
    return [...new Set(items)];
}
