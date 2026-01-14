/**
 * Input Component
 * 
 * Form input with label, error state, and icon support.
 * 
 * @module components/ui/Input
 */

'use client';

import { forwardRef, InputHTMLAttributes, ReactNode, useId } from 'react';
import { cn } from '@/lib/utils';
import styles from './Input.module.css';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    /** Label text */
    label?: string;
    /** Error message */
    error?: string;
    /** Helper text */
    helperText?: string;
    /** Left icon */
    leftIcon?: ReactNode;
    /** Right icon */
    rightIcon?: ReactNode;
    /** Full width */
    fullWidth?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    (
        {
            className,
            label,
            error,
            helperText,
            leftIcon,
            rightIcon,
            fullWidth = true,
            id,
            required,
            disabled,
            ...props
        },
        ref
    ) => {
        const generatedId = useId();
        const inputId = id || `input-${generatedId}`;
        const hasError = Boolean(error);

        return (
            <div className={cn(styles.wrapper, fullWidth && styles.fullWidth)}>
                {label && (
                    <label htmlFor={inputId} className={styles.label}>
                        {label}
                        {required && <span className={styles.required}>*</span>}
                    </label>
                )}

                <div className={styles.inputWrapper}>
                    {leftIcon && (
                        <span className={styles.leftIcon} aria-hidden="true">
                            {leftIcon}
                        </span>
                    )}

                    <input
                        ref={ref}
                        id={inputId}
                        className={cn(
                            styles.input,
                            hasError && styles.error,
                            leftIcon && styles.hasLeftIcon,
                            rightIcon && styles.hasRightIcon,
                            disabled && styles.disabled,
                            className
                        )}
                        disabled={disabled}
                        aria-invalid={hasError}
                        aria-describedby={
                            error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined
                        }
                        {...props}
                    />

                    {rightIcon && (
                        <span className={styles.rightIcon} aria-hidden="true">
                            {rightIcon}
                        </span>
                    )}
                </div>

                {error && (
                    <p id={`${inputId}-error`} className={styles.errorText} role="alert">
                        {error}
                    </p>
                )}

                {!error && helperText && (
                    <p id={`${inputId}-helper`} className={styles.helperText}>
                        {helperText}
                    </p>
                )}
            </div>
        );
    }
);

Input.displayName = 'Input';
