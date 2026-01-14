/**
 * Button Component
 * 
 * A versatile button component with multiple variants and sizes.
 * Supports loading state, icons, polymorphic rendering, and full accessibility.
 * 
 * @module components/ui/Button
 */

'use client';

import { forwardRef, ButtonHTMLAttributes, AnchorHTMLAttributes, ReactNode, ElementType } from 'react';
import { cn } from '@/lib/utils';
import styles from './Button.module.css';

/**
 * Button variants available.
 */
export type ButtonVariant =
    | 'primary'    // Dark background, light text
    | 'secondary'  // Light background, dark text, border
    | 'outline'    // Transparent with border
    | 'ghost'      // Transparent, no border
    | 'whatsapp'   // WhatsApp green
    | 'wood'       // Wood accent color
    | 'danger';    // Red for destructive actions

/**
 * Button sizes available.
 */
export type ButtonSize = 'sm' | 'md' | 'lg';

/**
 * Base button props (shared between button and anchor).
 */
interface BaseButtonProps {
    /** Visual variant of the button */
    variant?: ButtonVariant;
    /** Size of the button */
    size?: ButtonSize;
    /** Show loading spinner */
    isLoading?: boolean;
    /** Loading text (optional) */
    loadingText?: string;
    /** Icon to show on the left */
    leftIcon?: ReactNode;
    /** Icon to show on the right */
    rightIcon?: ReactNode;
    /** Make button full width */
    fullWidth?: boolean;
    /** Only show icon (no text) */
    iconOnly?: boolean;
    /** Custom class name */
    className?: string;
    /** Children content */
    children?: ReactNode;
}

/**
 * Props when as="a" is specified.
 */
interface ButtonAsAnchorProps extends BaseButtonProps, Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof BaseButtonProps> {
    as: 'a';
    href: string;
}

/**
 * Props when as="button" or not specified.
 */
interface ButtonAsButtonProps extends BaseButtonProps, Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof BaseButtonProps> {
    as?: 'button';
}

/**
 * Button props type (polymorphic).
 */
export type ButtonProps = ButtonAsAnchorProps | ButtonAsButtonProps;

/**
 * Type guard to check if props are for anchor.
 */
function isAnchorProps(props: ButtonProps): props is ButtonAsAnchorProps {
    return props.as === 'a';
}

/**
 * Button component with polymorphic rendering support.
 * 
 * @example
 * // Primary button
 * <Button variant="primary">Confirmer</Button>
 * 
 * // Button as anchor
 * <Button as="a" href="/contact" variant="secondary">Contact</Button>
 * 
 * // WhatsApp CTA
 * <Button variant="whatsapp" leftIcon={<MessageCircle />}>
 *   Demander le Prix
 * </Button>
 * 
 * // Loading state
 * <Button isLoading loadingText="Envoi en cours...">
 *   Envoyer
 * </Button>
 */
export const Button = forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
    (props, ref) => {
        const {
            className,
            variant = 'primary',
            size = 'md',
            isLoading = false,
            loadingText,
            leftIcon,
            rightIcon,
            fullWidth = false,
            iconOnly = false,
            children,
            ...restProps
        } = props;

        const buttonClasses = cn(
            styles.button,
            styles[variant],
            styles[size],
            isLoading && styles.loading,
            fullWidth && styles.fullWidth,
            iconOnly && styles.iconOnly,
            className
        );

        const content = (
            <>
                {/* Loading spinner */}
                {isLoading && (
                    <span className={styles.spinner} aria-hidden="true">
                        <svg
                            className={styles.spinnerIcon}
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <circle
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="3"
                                strokeLinecap="round"
                                strokeDasharray="32"
                                strokeDashoffset="12"
                            />
                        </svg>
                    </span>
                )}

                {/* Left icon */}
                {!isLoading && leftIcon && (
                    <span className={styles.icon} aria-hidden="true">
                        {leftIcon}
                    </span>
                )}

                {/* Button text */}
                {!iconOnly && (
                    <span className={cn(styles.text, isLoading && styles.textHidden)}>
                        {isLoading && loadingText ? loadingText : children}
                    </span>
                )}

                {/* Right icon */}
                {!isLoading && rightIcon && (
                    <span className={styles.icon} aria-hidden="true">
                        {rightIcon}
                    </span>
                )}
            </>
        );

        // Render as anchor
        if (isAnchorProps(props)) {
            const { as, ...anchorProps } = restProps as Omit<ButtonAsAnchorProps, keyof BaseButtonProps>;
            return (
                <a
                    ref={ref as React.Ref<HTMLAnchorElement>}
                    className={buttonClasses}
                    {...anchorProps}
                >
                    {content}
                </a>
            );
        }

        // Render as button
        const { as, disabled, type = 'button', ...buttonProps } = restProps as Omit<ButtonAsButtonProps, keyof BaseButtonProps> & { disabled?: boolean; type?: 'button' | 'submit' | 'reset' };
        const isDisabled = disabled || isLoading;

        return (
            <button
                ref={ref as React.Ref<HTMLButtonElement>}
                type={type}
                className={buttonClasses}
                disabled={isDisabled}
                aria-busy={isLoading}
                aria-disabled={isDisabled}
                {...buttonProps}
            >
                {content}
            </button>
        );
    }
);

Button.displayName = 'Button';

