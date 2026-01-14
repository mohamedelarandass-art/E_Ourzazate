/**
 * useLocalStorage Hook
 * 
 * Custom hook for persisting state in localStorage.
 * 
 * @module hooks/useLocalStorage
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { isClient, safeJsonParse } from '@/lib/utils';

/**
 * Hook for persisting state in localStorage.
 * 
 * @param key - localStorage key
 * @param initialValue - Initial value if key doesn't exist
 * @returns [value, setValue, removeValue] tuple
 * 
 * @example
 * const [favorites, setFavorites] = useLocalStorage<string[]>('favorites', []);
 * 
 * // Add to favorites
 * setFavorites([...favorites, productId]);
 * 
 * // Clear favorites
 * removeValue();
 */
export function useLocalStorage<T>(
    key: string,
    initialValue: T
): [T, (value: T | ((prev: T) => T)) => void, () => void] {
    // Initialize state
    const [storedValue, setStoredValue] = useState<T>(() => {
        if (!isClient) return initialValue;

        try {
            const item = localStorage.getItem(key);
            return item ? safeJsonParse(item, initialValue) : initialValue;
        } catch (error) {
            console.warn(`Error reading localStorage key "${key}":`, error);
            return initialValue;
        }
    });

    // Update localStorage when state changes
    useEffect(() => {
        if (!isClient) return;

        try {
            localStorage.setItem(key, JSON.stringify(storedValue));
        } catch (error) {
            console.warn(`Error setting localStorage key "${key}":`, error);
        }
    }, [key, storedValue]);

    // Listen for changes from other tabs
    useEffect(() => {
        if (!isClient) return;

        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === key && e.newValue !== null) {
                setStoredValue(safeJsonParse(e.newValue, initialValue));
            }
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, [key, initialValue]);

    // Set value (supports function updater)
    const setValue = useCallback(
        (value: T | ((prev: T) => T)) => {
            setStoredValue((prev) => {
                const newValue = value instanceof Function ? value(prev) : value;
                return newValue;
            });
        },
        []
    );

    // Remove value from localStorage
    const removeValue = useCallback(() => {
        if (isClient) {
            try {
                localStorage.removeItem(key);
                setStoredValue(initialValue);
            } catch (error) {
                console.warn(`Error removing localStorage key "${key}":`, error);
            }
        }
    }, [key, initialValue]);

    return [storedValue, setValue, removeValue];
}

/**
 * Hook for persisting state in sessionStorage.
 * Same API as useLocalStorage but uses sessionStorage.
 */
export function useSessionStorage<T>(
    key: string,
    initialValue: T
): [T, (value: T | ((prev: T) => T)) => void, () => void] {
    const [storedValue, setStoredValue] = useState<T>(() => {
        if (!isClient) return initialValue;

        try {
            const item = sessionStorage.getItem(key);
            return item ? safeJsonParse(item, initialValue) : initialValue;
        } catch (error) {
            console.warn(`Error reading sessionStorage key "${key}":`, error);
            return initialValue;
        }
    });

    useEffect(() => {
        if (!isClient) return;

        try {
            sessionStorage.setItem(key, JSON.stringify(storedValue));
        } catch (error) {
            console.warn(`Error setting sessionStorage key "${key}":`, error);
        }
    }, [key, storedValue]);

    const setValue = useCallback(
        (value: T | ((prev: T) => T)) => {
            setStoredValue((prev) => {
                const newValue = value instanceof Function ? value(prev) : value;
                return newValue;
            });
        },
        []
    );

    const removeValue = useCallback(() => {
        if (isClient) {
            try {
                sessionStorage.removeItem(key);
                setStoredValue(initialValue);
            } catch (error) {
                console.warn(`Error removing sessionStorage key "${key}":`, error);
            }
        }
    }, [key, initialValue]);

    return [storedValue, setValue, removeValue];
}
