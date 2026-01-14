/**
 * Skeleton Component
 * 
 * Loading placeholder with shimmer animation.
 * 
 * @module components/ui/Skeleton
 */

import { HTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';
import styles from './Skeleton.module.css';

export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
    variant?: 'text' | 'title' | 'circular' | 'rectangular' | 'image';
    width?: string | number;
    height?: string | number;
    animation?: 'pulse' | 'wave' | 'none';
}

export const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>(
    ({ className, variant = 'text', width, height, animation = 'wave', style, ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={cn(styles.skeleton, styles[variant], styles[animation], className)}
                style={{ width, height, ...style }}
                aria-hidden="true"
                {...props}
            />
        );
    }
);

Skeleton.displayName = 'Skeleton';

/** Preset for product card skeleton */
export function ProductCardSkeleton() {
    return (
        <div className={styles.productCard}>
            <Skeleton variant="image" className={styles.productImage} />
            <div className={styles.productContent}>
                <Skeleton variant="text" width="40%" />
                <Skeleton variant="title" width="80%" />
                <Skeleton variant="text" width="60%" />
            </div>
        </div>
    );
}

/** Preset for category card skeleton */
export function CategoryCardSkeleton() {
    return (
        <div className={styles.categoryCard}>
            <Skeleton variant="circular" width={64} height={64} />
            <Skeleton variant="title" width="60%" />
            <Skeleton variant="text" width="80%" />
        </div>
    );
}
