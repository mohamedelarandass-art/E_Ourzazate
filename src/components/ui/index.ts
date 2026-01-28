/**
 * UI Components Barrel Export
 * 
 * Central export point for all UI primitives.
 * 
 * @module components/ui
 */

// Button
export { Button } from './Button';
export type { ButtonProps, ButtonVariant, ButtonSize } from './Button';

// Input
export { Input } from './Input';
export type { InputProps } from './Input';

// Card
export { Card, CardHeader, CardContent, CardFooter, CardImage } from './Card';
export type { CardProps, CardHeaderProps } from './Card';

// Badge
export { Badge } from './Badge';
export type { BadgeProps, BadgeVariant } from './Badge';

// Skeleton
export { Skeleton, ProductCardSkeleton, CategoryCardSkeleton } from './Skeleton';
export type { SkeletonProps } from './Skeleton';

// Modal
export { Modal } from './Modal';
export type { ModalProps } from './Modal';

// Accordion
export { Accordion, AccordionItem } from './Accordion';
export type { AccordionProps, AccordionItemProps } from './Accordion';

// Toast
export { ToastProvider, useToast } from './Toast';
export type { Toast, ToastType } from './Toast';

// SpotlightCard
export { SpotlightCard } from './SpotlightCard';
export type { SpotlightCardProps } from './SpotlightCard';
