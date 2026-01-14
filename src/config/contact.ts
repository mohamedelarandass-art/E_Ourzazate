/**
 * Contact Configuration
 * 
 * This file contains all contact information for the business including:
 * - Phone numbers
 * - WhatsApp number
 * - Email addresses
 * - Physical address
 * - Business hours
 * - Social media links
 * 
 * All values are centralized here for easy updates and consistency.
 * 
 * @module config/contact
 * @description Contact information configuration for Equipement Ouarzazate
 */

/**
 * Main contact configuration object.
 * All contact information for the company in one place.
 */
export const contactConfig = {
    /**
     * Primary phone number (formatted for display)
     */
    phone: '05.24.88.21.56',

    /**
     * Phone number without formatting (for tel: links)
     */
    phoneRaw: '+212524882156',

    /**
     * All phone lines
     */
    phones: [
        { label: 'Principal', number: '05.24.88.21.56', raw: '+212524882156' },
        { label: 'Ligne 2', number: '05.24.88.44.11', raw: '+212524884411' },
        { label: 'Ligne 3', number: '05.24.88.27.98', raw: '+212524882798' },
    ],

    /**
     * Fax number
     */
    fax: '05.24.88.43.43',

    /**
     * WhatsApp number (without + prefix for wa.me links)
     */
    whatsapp: '212524882156',

    /**
     * WhatsApp number formatted for display
     */
    whatsappDisplay: '05.24.88.21.56',

    /**
     * Primary email address
     */
    email: 'equipementouarzazate@gmail.com',

    /**
     * Secondary/sales email (same as primary for now)
     */
    salesEmail: 'equipementouarzazate@gmail.com',

    /**
     * Physical address components
     */
    address: {
        /**
         * Street address
         */
        street: 'N° 65 Quartier Industriel',

        /**
         * Boîte Postale
         */
        bp: 'BP 84',

        /**
         * City
         */
        city: 'Ouarzazate',

        /**
         * Postal code
         */
        postalCode: '45000',

        /**
         * Region
         */
        region: 'Drâa-Tafilalet',

        /**
         * Country
         */
        country: 'Maroc',

        /**
         * Full formatted address
         */
        full: 'N° 65 Quartier Industriel, BP 84, 45000 Ouarzazate, Maroc',

        /**
         * Short address for compact displays
         */
        short: 'Quartier Industriel, Ouarzazate',
    },

    /**
     * Google Maps configuration
     */
    maps: {
        /**
         * Google Maps short link (from client)
         */
        shortUrl: 'https://maps.app.goo.gl/8idAgaRPHZKtGNJm9',

        /**
         * Google Maps embed URL
         * TODO: Extract actual embed URL from shortUrl
         */
        embedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3404.8!2d-6.893!3d30.918!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sEquipement+Ouarzazate!5e0!3m2!1sfr!2sma',

        /**
         * Google Maps link for directions
         */
        directionsUrl: 'https://www.google.com/maps/dir/?api=1&destination=N+65+Quartier+Industriel+Ouarzazate+Maroc',

        /**
         * Latitude for map center
         */
        latitude: 30.92,

        /**
         * Longitude for map center
         */
        longitude: -6.9,
    },

    /**
     * Business hours
     */
    hours: {
        /**
         * Weekday hours (Monday - Friday)
         */
        weekdays: 'Lun - Ven: 9h00 - 19h00',

        /**
         * Saturday hours
         */
        saturday: 'Sam: 9h00 - 18h00',

        /**
         * Sunday hours (closed)
         */
        sunday: 'Dim: Fermé',

        /**
         * Full hours text for display
         */
        full: 'Lun - Ven: 9h00 - 19h00 | Sam: 9h00 - 18h00 | Dim: Fermé',

        /**
         * Compact hours text
         */
        compact: 'Lun - Sam: 9h - 19h',

        /**
         * Structured hours data for detailed display
         */
        structured: [
            { day: 'Lundi', open: '09:00', close: '19:00', isClosed: false },
            { day: 'Mardi', open: '09:00', close: '19:00', isClosed: false },
            { day: 'Mercredi', open: '09:00', close: '19:00', isClosed: false },
            { day: 'Jeudi', open: '09:00', close: '19:00', isClosed: false },
            { day: 'Vendredi', open: '09:00', close: '19:00', isClosed: false },
            { day: 'Samedi', open: '09:00', close: '18:00', isClosed: false },
            { day: 'Dimanche', open: '', close: '', isClosed: true },
        ],
    },

    /**
     * Social media links
     */
    socials: {
        /**
         * Facebook page URL
         */
        facebook: 'https://facebook.com/equipement.ouarzazate',

        /**
         * Instagram profile URL
         */
        instagram: 'https://instagram.com/equipement.ouarzazate',

        /**
         * WhatsApp direct link
         */
        whatsapp: 'https://wa.me/212524882156',

        /**
         * YouTube channel (optional)
         */
        youtube: undefined,

        /**
         * LinkedIn page (optional)
         */
        linkedin: undefined,
    },
} as const;

/**
 * Type for contact configuration
 */
export type ContactConfig = typeof contactConfig;

/**
 * Generate a WhatsApp link with a pre-filled message
 * 
 * @param message - The message to pre-fill
 * @returns The WhatsApp URL
 */
export function getWhatsAppLink(message?: string): string {
    const baseUrl = `https://wa.me/${contactConfig.whatsapp}`;
    if (message) {
        return `${baseUrl}?text=${encodeURIComponent(message)}`;
    }
    return baseUrl;
}

/**
 * Generate a WhatsApp link for a product inquiry
 * 
 * @param productName - The name of the product
 * @returns The WhatsApp URL with product inquiry message
 */
export function getProductWhatsAppLink(productName: string): string {
    const message = `Bonjour! Je suis intéressé(e) par le produit "${productName}" de votre catalogue. Pourriez-vous me donner plus d'informations et le prix? Merci!`;
    return getWhatsAppLink(message);
}

/**
 * Generate a tel: link for phone calls
 * 
 * @returns The tel: URL
 */
export function getPhoneLink(): string {
    return `tel:${contactConfig.phoneRaw}`;
}

/**
 * Generate a mailto: link for emails
 * 
 * @param subject - Optional email subject
 * @returns The mailto: URL
 */
export function getEmailLink(subject?: string): string {
    const baseUrl = `mailto:${contactConfig.email}`;
    if (subject) {
        return `${baseUrl}?subject=${encodeURIComponent(subject)}`;
    }
    return baseUrl;
}

/**
 * Check if the business is currently open
 * Note: This is a simplified version that doesn't account for holidays
 * 
 * @returns Whether the business is open right now
 */
export function isBusinessOpen(): boolean {
    const now = new Date();
    const day = now.getDay(); // 0 = Sunday, 1 = Monday, etc.
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const currentTime = hours * 60 + minutes;

    // Closed on Sunday
    if (day === 0) return false;

    // Saturday: 9:00 - 18:00
    if (day === 6) {
        const open = 9 * 60; // 9:00
        const close = 18 * 60; // 18:00
        return currentTime >= open && currentTime < close;
    }

    // Weekdays: 9:00 - 19:00
    const open = 9 * 60; // 9:00
    const close = 19 * 60; // 19:00
    return currentTime >= open && currentTime < close;
}
