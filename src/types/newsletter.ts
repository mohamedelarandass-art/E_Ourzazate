/**
 * Newsletter Types
 * 
 * This file contains all TypeScript interfaces related to the newsletter feature.
 * The newsletter allows customers to subscribe for updates about new products.
 * 
 * @module types/newsletter
 * @description Newsletter subscription type definitions for Equipement Ouarzazate
 */

/**
 * NewsletterSubscriber
 * 
 * Represents a newsletter subscriber in the database.
 */
export interface NewsletterSubscriber {
    /** Unique identifier for the subscriber */
    id: string;

    /** Subscriber's email address */
    email: string;

    /** Subscriber's name (optional) */
    name?: string;

    /** Subscriber's phone number (optional, for WhatsApp updates) */
    phone?: string;

    /** Whether the subscription is active */
    isActive: boolean;

    /** When the subscriber signed up */
    subscribedAt: Date;

    /** When the subscriber unsubscribed (if applicable) */
    unsubscribedAt?: Date;

    /** Source of the subscription (homepage, footer, popup, etc.) */
    source: NewsletterSource;
}

/**
 * NewsletterSource
 * 
 * Where the newsletter subscription originated from.
 */
export type NewsletterSource =
    | 'homepage'
    | 'footer'
    | 'popup'
    | 'product_page'
    | 'contact_page'
    | 'admin';

/**
 * NewsletterSubscribeRequest
 * 
 * Request body for subscribing to the newsletter.
 */
export interface NewsletterSubscribeRequest {
    /** Email address to subscribe */
    email: string;

    /** Optional name */
    name?: string;

    /** Optional phone for WhatsApp */
    phone?: string;

    /** Where the subscription came from */
    source: NewsletterSource;
}

/**
 * NewsletterSubscribeResponse
 * 
 * Response after attempting to subscribe.
 */
export interface NewsletterSubscribeResponse {
    /** Whether the subscription was successful */
    success: boolean;

    /** Message to display to the user */
    message: string;

    /** Whether the email was already subscribed */
    alreadySubscribed?: boolean;
}

/**
 * NewsletterStats
 * 
 * Statistics about newsletter subscribers for admin dashboard.
 */
export interface NewsletterStats {
    /** Total number of active subscribers */
    totalSubscribers: number;

    /** Subscribers added this month */
    newThisMonth: number;

    /** Unsubscribes this month */
    unsubscribesThisMonth: number;

    /** Breakdown by source */
    bySource: Record<NewsletterSource, number>;
}

/**
 * NewsletterFormProps
 * 
 * Props for the NewsletterForm component.
 */
export interface NewsletterFormProps {
    /** Where the form is being displayed */
    source: NewsletterSource;

    /** Whether to show the name field */
    showName?: boolean;

    /** Whether to show the phone field */
    showPhone?: boolean;

    /** Custom placeholder for email */
    emailPlaceholder?: string;

    /** Custom button text */
    buttonText?: string;

    /** Variant styling */
    variant?: 'default' | 'minimal' | 'inline';

    /** Callback on successful subscription */
    onSuccess?: () => void;
}
