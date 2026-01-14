/**
 * Accordion Component
 * 
 * Expandable content panels for FAQ and collapsible sections.
 * 
 * @module components/ui/Accordion
 */

'use client';

import { useState, ReactNode, createContext, useContext } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import styles from './Accordion.module.css';

// Context for accordion state
interface AccordionContextValue {
    expandedItems: Set<string>;
    toggleItem: (id: string) => void;
    allowMultiple: boolean;
}

const AccordionContext = createContext<AccordionContextValue | null>(null);

export interface AccordionProps {
    children: ReactNode;
    allowMultiple?: boolean;
    defaultExpanded?: string[];
    className?: string;
}

export function Accordion({ children, allowMultiple = false, defaultExpanded = [], className }: AccordionProps) {
    const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set(defaultExpanded));

    const toggleItem = (id: string) => {
        setExpandedItems((prev) => {
            const next = new Set(prev);
            if (next.has(id)) {
                next.delete(id);
            } else {
                if (!allowMultiple) next.clear();
                next.add(id);
            }
            return next;
        });
    };

    return (
        <AccordionContext.Provider value={{ expandedItems, toggleItem, allowMultiple }}>
            <div className={cn(styles.accordion, className)}>{children}</div>
        </AccordionContext.Provider>
    );
}

export interface AccordionItemProps {
    id: string;
    title: string;
    children: ReactNode;
    icon?: ReactNode;
    disabled?: boolean;
}

export function AccordionItem({ id, title, children, icon, disabled }: AccordionItemProps) {
    const context = useContext(AccordionContext);
    if (!context) throw new Error('AccordionItem must be used within Accordion');

    const { expandedItems, toggleItem } = context;
    const isExpanded = expandedItems.has(id);

    return (
        <div className={cn(styles.item, disabled && styles.disabled)}>
            <button
                type="button"
                className={cn(styles.trigger, isExpanded && styles.expanded)}
                onClick={() => !disabled && toggleItem(id)}
                aria-expanded={isExpanded}
                aria-controls={`accordion-content-${id}`}
                disabled={disabled}
            >
                <span className={styles.triggerContent}>
                    {icon && <span className={styles.icon}>{icon}</span>}
                    <span className={styles.title}>{title}</span>
                </span>
                <ChevronDown className={cn(styles.chevron, isExpanded && styles.chevronExpanded)} />
            </button>
            <div
                id={`accordion-content-${id}`}
                className={cn(styles.content, isExpanded && styles.contentExpanded)}
                role="region"
                aria-labelledby={`accordion-trigger-${id}`}
                hidden={!isExpanded}
            >
                <div className={styles.contentInner}>{children}</div>
            </div>
        </div>
    );
}
