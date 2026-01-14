/**
 * Badge Component
 * 
 * Small status indicator for labels, counts, or tags.
 * 
 * @module components/ui/Badge
 */

import { HTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';
import styles from './Badge.module.css';

export type BadgeVariant = 'default' | 'primary' | 'success' | 'warning' | 'error' | 'new' | 'featured';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
    variant?: BadgeVariant;
    size?: 'sm' | 'md';
    dot?: boolean;
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
    ({ className, variant = 'default', size = 'md', dot, children, ...props }, ref) => {
        return (
            <span
                ref={ref}
                className={cn(styles.badge, styles[variant], styles[size], dot && styles.dot, className)}
                {...props}
            >
                {dot && <span className={styles.dotIndicator} />}
                {children}
            </span>
        );
    }
);

Badge.displayName = 'Badge';
