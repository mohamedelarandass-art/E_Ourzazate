/**
 * useDebounce Hook
 * 
 * Custom hooks for debouncing values and callbacks.
 * 
 * @module hooks/useDebounce
 */

'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Hook that debounces a value.
 * 
 * @param value - Value to debounce
 * @param delay - Delay in milliseconds
 * @returns Debounced value
 * 
 * @example
 * const [searchTerm, setSearchTerm] = useState('');
 * const debouncedSearch = useDebounce(searchTerm, 300);
 * 
 * useEffect(() => {
 *   // This runs only after the user stops typing for 300ms
 *   searchProducts(debouncedSearch);
 * }, [debouncedSearch]);
 */
export function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(timer);
        };
    }, [value, delay]);

    return debouncedValue;
}

/**
 * Hook that returns a debounced callback function.
 * 
 * @param callback - Function to debounce
 * @param delay - Delay in milliseconds
 * @returns Debounced function
 * 
 * @example
 * const debouncedSave = useDebouncedCallback((value) => {
 *   saveToServer(value);
 * }, 500);
 * 
 * // Call debouncedSave multiple times, only last call executes
 * debouncedSave(newValue);
 */
export function useDebouncedCallback<T extends (...args: Parameters<T>) => void>(
    callback: T,
    delay: number
): (...args: Parameters<T>) => void {
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
    const callbackRef = useRef(callback);

    // Update callback ref when callback changes
    useEffect(() => {
        callbackRef.current = callback;
    }, [callback]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    const debouncedFn = useCallback(
        (...args: Parameters<T>) => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }

            timeoutRef.current = setTimeout(() => {
                callbackRef.current(...args);
            }, delay);
        },
        [delay]
    );

    return debouncedFn;
}

/**
 * Hook that returns a debounced callback with cancel and flush methods.
 * 
 * @param callback - Function to debounce
 * @param delay - Delay in milliseconds
 * @returns Object with debounced function, cancel, and flush methods
 */
export function useDebouncedCallbackWithControls<T extends (...args: Parameters<T>) => void>(
    callback: T,
    delay: number
) {
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
    const callbackRef = useRef(callback);
    const argsRef = useRef<Parameters<T> | undefined>(undefined);

    useEffect(() => {
        callbackRef.current = callback;
    }, [callback]);

    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    const debouncedFn = useCallback(
        (...args: Parameters<T>) => {
            argsRef.current = args;

            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }

            timeoutRef.current = setTimeout(() => {
                callbackRef.current(...args);
            }, delay);
        },
        [delay]
    );

    const cancel = useCallback(() => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
    }, []);

    const flush = useCallback(() => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        if (argsRef.current) {
            callbackRef.current(...(argsRef.current as Parameters<T>));
        }
    }, []);

    return {
        /** The debounced function */
        debouncedFn,
        /** Cancel the pending debounced call */
        cancel,
        /** Execute the pending call immediately */
        flush,
    };
}
