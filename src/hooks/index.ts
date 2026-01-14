/**
 * Hooks Index (Barrel Export)
 * 
 * Central export point for all custom React hooks.
 * 
 * @module hooks
 */

// Theme
export { useTheme } from './useTheme';
export type { Theme, ResolvedTheme } from './useTheme';

// Media queries
export {
    useMediaQuery,
    useBreakpoint,
    useBreakpoints,
    useIsTouchDevice,
    useIsPrinting,
    usePrefersReducedMotion,
    breakpoints,
} from './useMediaQuery';
export type { Breakpoint } from './useMediaQuery';

// Debounce
export {
    useDebounce,
    useDebouncedCallback,
    useDebouncedCallbackWithControls,
} from './useDebounce';

// Local storage
export {
    useLocalStorage,
    useSessionStorage,
} from './useLocalStorage';
