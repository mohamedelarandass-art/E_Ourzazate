/**
 * WhatsApp Utilities
 * 
 * Functions for generating WhatsApp links with pre-filled messages.
 * Core to the business model as WhatsApp is the primary conversion channel.
 * 
 * @module lib/whatsapp
 */

import { contactConfig } from '@/config';

/**
 * WhatsApp message templates for different contexts.
 */
export const whatsAppMessages = {
    /**
     * General inquiry message
     */
    general: 'Bonjour! Je souhaite avoir plus d\'informations sur vos produits. Merci!',

    /**
     * Product inquiry message template
     * @param productName - Name of the product
     */
    product: (productName: string): string =>
        `Bonjour! Je suis intéressé(e) par le produit "${productName}" de votre catalogue. Pourriez-vous me donner plus d'informations et le prix? Merci!`,

    /**
     * Category inquiry message template
     * @param categoryName - Name of the category
     */
    category: (categoryName: string): string =>
        `Bonjour! Je recherche des produits dans la catégorie "${categoryName}". Pourriez-vous me conseiller? Merci!`,

    /**
     * Quote request message
     */
    quote: 'Bonjour! Je souhaite demander un devis pour plusieurs produits. Pourriez-vous me contacter? Merci!',

    /**
     * After-sales service message
     */
    support: 'Bonjour! J\'ai besoin d\'assistance concernant un achat précédent. Merci!',
} as const;

/**
 * Generates a WhatsApp link with optional pre-filled message.
 * 
 * @param message - Optional message to pre-fill
 * @returns Complete WhatsApp URL
 * 
 * @example
 * getWhatsAppUrl() // "https://wa.me/212600000000"
 * getWhatsAppUrl("Hello!") // "https://wa.me/212600000000?text=Hello!"
 */
export function getWhatsAppUrl(message?: string): string {
    const baseUrl = `https://wa.me/${contactConfig.whatsapp}`;

    if (!message) {
        return baseUrl;
    }

    return `${baseUrl}?text=${encodeURIComponent(message)}`;
}

/**
 * Generates a WhatsApp link for a product inquiry.
 * 
 * @param productName - Name of the product
 * @param productId - Optional product ID for reference
 * @returns WhatsApp URL with product inquiry message
 * 
 * @example
 * getProductWhatsAppUrl("Lavabo Moderne") 
 * // Returns URL with pre-filled product inquiry
 */
export function getProductWhatsAppUrl(productName: string, productId?: string): string {
    let message = whatsAppMessages.product(productName);

    if (productId) {
        message += ` (Réf: ${productId})`;
    }

    return getWhatsAppUrl(message);
}

/**
 * Generates a WhatsApp link for a category inquiry.
 * 
 * @param categoryName - Name of the category
 * @returns WhatsApp URL with category inquiry message
 */
export function getCategoryWhatsAppUrl(categoryName: string): string {
    return getWhatsAppUrl(whatsAppMessages.category(categoryName));
}

/**
 * Generates a WhatsApp link for a general inquiry.
 * 
 * @returns WhatsApp URL with general inquiry message
 */
export function getGeneralWhatsAppUrl(): string {
    return getWhatsAppUrl(whatsAppMessages.general);
}

/**
 * Generates a WhatsApp link for a quote request.
 * 
 * @returns WhatsApp URL with quote request message
 */
export function getQuoteWhatsAppUrl(): string {
    return getWhatsAppUrl(whatsAppMessages.quote);
}

/**
 * Opens WhatsApp in a new window/tab.
 * 
 * @param message - Optional message to pre-fill
 */
export function openWhatsApp(message?: string): void {
    if (typeof window !== 'undefined') {
        window.open(getWhatsAppUrl(message), '_blank', 'noopener,noreferrer');
    }
}

/**
 * Opens WhatsApp for a product inquiry.
 * 
 * @param productName - Name of the product
 * @param productId - Optional product ID
 */
export function openProductWhatsApp(productName: string, productId?: string): void {
    if (typeof window !== 'undefined') {
        window.open(getProductWhatsAppUrl(productName, productId), '_blank', 'noopener,noreferrer');
    }
}

/**
 * Formats a phone number for WhatsApp (removes non-numeric characters).
 * 
 * @param phone - Phone number to format
 * @returns Formatted phone number
 */
export function formatPhoneForWhatsApp(phone: string): string {
    return phone.replace(/\D/g, '');
}

/**
 * Validates if a phone number is valid for WhatsApp.
 * Basic validation for Moroccan numbers.
 * 
 * @param phone - Phone number to validate
 * @returns Whether the phone number is valid
 */
export function isValidWhatsAppNumber(phone: string): boolean {
    const cleaned = formatPhoneForWhatsApp(phone);
    // Moroccan numbers: 212XXXXXXXXX (12 digits)
    return /^212[5-7]\d{8}$/.test(cleaned);
}
