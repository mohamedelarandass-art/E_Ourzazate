/**
 * Modal Component
 * 
 * Accessible modal dialog with animations.
 * 
 * @module components/ui/Modal
 */

'use client';

import { useEffect, useRef, ReactNode, KeyboardEvent } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '../Button';
import styles from './Modal.module.css';

export interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    description?: string;
    children: ReactNode;
    size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
    showCloseButton?: boolean;
    closeOnOverlayClick?: boolean;
    closeOnEsc?: boolean;
    footer?: ReactNode;
}

export function Modal({
    isOpen,
    onClose,
    title,
    description,
    children,
    size = 'md',
    showCloseButton = true,
    closeOnOverlayClick = true,
    closeOnEsc = true,
    footer,
}: ModalProps) {
    const modalRef = useRef<HTMLDivElement>(null);
    const previousFocusRef = useRef<HTMLElement | null>(null);

    // Handle ESC key
    useEffect(() => {
        if (!isOpen || !closeOnEsc) return;

        const handleKeyDown = (e: globalThis.KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, closeOnEsc, onClose]);

    // Lock body scroll and manage focus
    useEffect(() => {
        if (isOpen) {
            previousFocusRef.current = document.activeElement as HTMLElement;
            document.body.style.overflow = 'hidden';
            modalRef.current?.focus();
        } else {
            document.body.style.overflow = '';
            previousFocusRef.current?.focus();
        }

        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    // Trap focus inside modal
    const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
        if (e.key !== 'Tab') return;

        const focusable = modalRef.current?.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (!focusable || focusable.length === 0) return;

        const first = focusable[0] as HTMLElement;
        const last = focusable[focusable.length - 1] as HTMLElement;

        if (e.shiftKey && document.activeElement === first) {
            e.preventDefault();
            last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            first.focus();
        }
    };

    if (!isOpen) return null;

    const modalContent = (
        <div className={styles.overlay} onClick={closeOnOverlayClick ? onClose : undefined}>
            <div
                ref={modalRef}
                className={cn(styles.modal, styles[size])}
                onClick={(e) => e.stopPropagation()}
                onKeyDown={handleKeyDown}
                role="dialog"
                aria-modal="true"
                aria-labelledby={title ? 'modal-title' : undefined}
                aria-describedby={description ? 'modal-description' : undefined}
                tabIndex={-1}
            >
                {/* Header */}
                {(title || showCloseButton) && (
                    <div className={styles.header}>
                        <div>
                            {title && <h2 id="modal-title" className={styles.title}>{title}</h2>}
                            {description && <p id="modal-description" className={styles.description}>{description}</p>}
                        </div>
                        {showCloseButton && (
                            <Button
                                variant="ghost"
                                size="sm"
                                iconOnly
                                onClick={onClose}
                                aria-label="Fermer"
                                className={styles.closeButton}
                            >
                                <X size={20} />
                            </Button>
                        )}
                    </div>
                )}

                {/* Content */}
                <div className={styles.content}>{children}</div>

                {/* Footer */}
                {footer && <div className={styles.footer}>{footer}</div>}
            </div>
        </div>
    );

    if (typeof window === 'undefined') return null;
    return createPortal(modalContent, document.body);
}
