/**
 * Toast Component
 * 
 * Notification toast with context provider.
 * 
 * @module components/ui/Toast
 */

'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import styles from './Toast.module.css';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
    id: string;
    type: ToastType;
    title: string;
    description?: string;
    duration?: number;
}

interface ToastContextValue {
    toasts: Toast[];
    addToast: (toast: Omit<Toast, 'id'>) => void;
    removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const addToast = useCallback((toast: Omit<Toast, 'id'>) => {
        const id = Math.random().toString(36).substring(7);
        const newToast = { ...toast, id };

        setToasts((prev) => [...prev, newToast]);

        // Auto remove after duration
        const duration = toast.duration ?? 5000;
        if (duration > 0) {
            setTimeout(() => {
                setToasts((prev) => prev.filter((t) => t.id !== id));
            }, duration);
        }
    }, []);

    const removeToast = useCallback((id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    return (
        <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
            {children}
            <ToastContainer toasts={toasts} removeToast={removeToast} />
        </ToastContext.Provider>
    );
}

export function useToast() {
    const context = useContext(ToastContext);
    if (!context) throw new Error('useToast must be used within ToastProvider');

    return {
        toast: context.addToast,
        success: (title: string, description?: string) =>
            context.addToast({ type: 'success', title, description }),
        error: (title: string, description?: string) =>
            context.addToast({ type: 'error', title, description }),
        warning: (title: string, description?: string) =>
            context.addToast({ type: 'warning', title, description }),
        info: (title: string, description?: string) =>
            context.addToast({ type: 'info', title, description }),
        dismiss: context.removeToast,
    };
}

function ToastContainer({ toasts, removeToast }: { toasts: Toast[]; removeToast: (id: string) => void }) {
    if (typeof window === 'undefined' || toasts.length === 0) return null;

    const icons = {
        success: <CheckCircle size={20} />,
        error: <AlertCircle size={20} />,
        warning: <AlertTriangle size={20} />,
        info: <Info size={20} />,
    };

    return createPortal(
        <div className={styles.container} role="region" aria-label="Notifications">
            {toasts.map((toast) => (
                <div
                    key={toast.id}
                    className={cn(styles.toast, styles[toast.type])}
                    role="alert"
                >
                    <span className={styles.icon}>{icons[toast.type]}</span>
                    <div className={styles.content}>
                        <p className={styles.title}>{toast.title}</p>
                        {toast.description && <p className={styles.description}>{toast.description}</p>}
                    </div>
                    <button
                        onClick={() => removeToast(toast.id)}
                        className={styles.close}
                        aria-label="Fermer"
                    >
                        <X size={16} />
                    </button>
                </div>
            ))}
        </div>,
        document.body
    );
}
