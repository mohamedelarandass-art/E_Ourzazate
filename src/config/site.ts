/**
 * Site Configuration
 * 
 * This file contains all site-wide configuration including:
 * - Site name and branding
 * - SEO defaults
 * - Locale settings
 * 
 * All values are exported as a const object for type safety
 * and to prevent accidental modification.
 * 
 * @module config/site
 * @description Central site configuration for Equipement Ouarzazate
 */

/**
 * Main site configuration object.
 * Used throughout the application for consistent branding and SEO.
 */
export const siteConfig = {
    /**
     * Full company name used in headers and footers
     */
    name: 'Equipement Ouarzazate',

    /**
     * Short name for compact displays and mobile
     */
    shortName: 'EO',

    /**
     * Main meta description for the site
     */
    description: 'Votre partenaire en matériaux de construction depuis 1975. Sanitaire, Meubles SDB, Carrelage, Luminaire, Électroménager, Outillage à Ouarzazate, Maroc.',

    /**
     * Company tagline emphasizing heritage
     */
    tagline: 'Depuis 1975',

    /**
     * Full tagline for hero sections
     */
    fullTagline: 'Votre Partenaire en Matériaux de Construction Depuis 1975',

    /**
     * Company establishment year
     */
    establishedYear: 1975,

    /**
     * Years of experience (calculated dynamically)
     */
    yearsOfExperience: new Date().getFullYear() - 1975,

    /**
     * Production URL of the site
     */
    url: 'https://equipement-ouarzazate.ma',

    /**
     * OpenGraph locale
     */
    locale: 'fr_MA',

    /**
     * Default locale for i18n
     */
    defaultLocale: 'fr',

    /**
     * Supported locales
     */
    locales: ['fr', 'ar'] as const,

    /**
     * SEO configuration for metadata
     */
    seo: {
        /**
         * Title template with site name suffix
         */
        titleTemplate: '%s | Equipement Ouarzazate',

        /**
         * Default page title when no specific title is set
         */
        defaultTitle: 'Equipement Ouarzazate - Matériaux de Construction Depuis 1975',

        /**
         * Default meta description
         */
        defaultDescription: 'Votre partenaire en matériaux de construction depuis 1975 à Ouarzazate. Découvrez notre catalogue: Sanitaire, Meubles SDB, Carrelage, Luminaire, Électroménager, Outillage.',

        /**
         * Keywords for SEO (comma-separated)
         */
        keywords: [
            'matériaux construction',
            'Ouarzazate',
            'Maroc',
            'sanitaire',
            'carrelage',
            'luminaire',
            'électroménager',
            'outillage',
            'meubles salle de bain',
            'robinetterie',
            'cuisine',
            'bricolage',
        ],

        /**
         * OpenGraph configuration
         */
        openGraph: {
            type: 'website',
            siteName: 'Equipement Ouarzazate',
            locale: 'fr_MA',
        },

        /**
         * Twitter card configuration
         */
        twitter: {
            card: 'summary_large_image',
            creator: '@equipement_ouarzazate',
        },
    },

    /**
     * Feature flags for the application
     */
    features: {
        /**
         * Whether newsletter signup is enabled
         */
        newsletter: true,

        /**
         * Whether the site supports dark mode
         */
        darkMode: true,

        /**
         * Whether search functionality is enabled
         */
        search: true,

        /**
         * Whether analytics tracking is enabled
         */
        analytics: true,

        /**
         * Whether WhatsApp integration is enabled
         */
        whatsapp: true,
    },

    /**
     * Pagination defaults
     */
    pagination: {
        /**
         * Default number of products per page
         */
        productsPerPage: 12,

        /**
         * Default number of items in admin tables
         */
        adminItemsPerPage: 20,
    },
} as const;

/**
 * Type for site configuration
 */
export type SiteConfig = typeof siteConfig;

/**
 * Helper function to get the full page title
 * @param pageTitle - The specific page title
 * @returns The full title with template applied
 */
export function getPageTitle(pageTitle?: string): string {
    if (!pageTitle) {
        return siteConfig.seo.defaultTitle;
    }
    return siteConfig.seo.titleTemplate.replace('%s', pageTitle);
}

/**
 * Helper function to get SEO metadata
 * @param options - Override options for the metadata
 * @returns Metadata object for Next.js
 */
export function getSeoMetadata(options?: {
    title?: string;
    description?: string;
    image?: string;
    noIndex?: boolean;
}) {
    return {
        title: options?.title || siteConfig.seo.defaultTitle,
        description: options?.description || siteConfig.seo.defaultDescription,
        keywords: siteConfig.seo.keywords.join(', '),
        openGraph: {
            ...siteConfig.seo.openGraph,
            title: options?.title || siteConfig.seo.defaultTitle,
            description: options?.description || siteConfig.seo.defaultDescription,
            images: options?.image ? [{ url: options.image }] : undefined,
        },
        twitter: {
            ...siteConfig.seo.twitter,
            title: options?.title || siteConfig.seo.defaultTitle,
            description: options?.description || siteConfig.seo.defaultDescription,
        },
        robots: options?.noIndex ? 'noindex, nofollow' : 'index, follow',
    };
}
