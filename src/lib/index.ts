/**
 * Library Index (Barrel Export)
 * 
 * Central export point for all utility functions.
 * 
 * @module lib
 */

// Utils
export {
    cn,
    formatDate,
    formatDateTime,
    formatRelativeTime,
    slugify,
    truncate,
    generateId,
    debounce,
    throttle,
    formatNumber,
    capitalize,
    isClient,
    isServer,
    safeJsonParse,
    range,
    groupBy,
    unique,
} from './utils';

// WhatsApp utilities
export {
    whatsAppMessages,
    getWhatsAppUrl,
    getProductWhatsAppUrl,
    getCategoryWhatsAppUrl,
    getGeneralWhatsAppUrl,
    getQuoteWhatsAppUrl,
    openWhatsApp,
    openProductWhatsApp,
    formatPhoneForWhatsApp,
    isValidWhatsAppNumber,
} from './whatsapp';

// SEO utilities
export {
    generateMetadata,
    generateProductMetadata,
    generateCategoryMetadata,
    generateOrganizationSchema,
    generateProductSchema,
    generateBreadcrumbSchema,
} from './seo';
export type { PageMetadataOptions } from './seo';
