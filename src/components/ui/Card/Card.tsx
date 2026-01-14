/**
 * Card Component
 * 
 * A versatile card container with hover effects and click support.
 * 
 * @module components/ui/Card
 */

import { forwardRef, HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';
import styles from './Card.module.css';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
    /** Card variant */
    variant?: 'default' | 'outlined' | 'elevated';
    /** Add hover effect */
    hoverable?: boolean;
    /** Make entire card clickable */
    clickable?: boolean;
    /** Padding size */
    padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
    ({ className, variant = 'default', hoverable, clickable, padding = 'md', children, ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={cn(
                    styles.card,
                    styles[variant],
                    styles[`padding-${padding}`],
                    hoverable && styles.hoverable,
                    clickable && styles.clickable,
                    className
                )}
                {...props}
            >
                {children}
            </div>
        );
    }
);

Card.displayName = 'Card';

export interface CardHeaderProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
    title?: ReactNode;
    subtitle?: ReactNode;
    action?: ReactNode;
}

export const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
    ({ className, title, subtitle, action, children, ...props }, ref) => {
        return (
            <div ref={ref} className={cn(styles.header, className)} {...props}>
                <div className={styles.headerContent}>
                    {title && <h3 className={styles.title}>{title}</h3>}
                    {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
                    {children}
                </div>
                {action && <div className={styles.headerAction}>{action}</div>}
            </div>
        );
    }
);

CardHeader.displayName = 'CardHeader';

export const CardContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => (
        <div ref={ref} className={cn(styles.content, className)} {...props} />
    )
);

CardContent.displayName = 'CardContent';

export const CardFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => (
        <div ref={ref} className={cn(styles.footer, className)} {...props} />
    )
);

CardFooter.displayName = 'CardFooter';

export const CardImage = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement> & { aspectRatio?: string }>(
    ({ className, aspectRatio = '4/3', style, ...props }, ref) => (
        <div
            ref={ref}
            className={cn(styles.image, className)}
            style={{ ...style, aspectRatio }}
            {...props}
        />
    )
);

CardImage.displayName = 'CardImage';
