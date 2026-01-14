/**
 * SEO Utilities
 * 
 * Functions for generating SEO metadata for Next.js pages.
 * 
 * @module lib/seo
 */

import { Metadata } from 'next';
import { siteConfig } from '@/config';

/**
 * Options for generating page metadata.
 */
export interface PageMetadataOptions {
    /** Page title (will be combined with site name) */
    title?: string;

    /** Page description */
    description?: string;

    /** Canonical URL path (without domain) */
    path?: string;

    /** OpenGraph image URL */
    image?: string;

    /** Whether to index the page */
    noIndex?: boolean;

    /** Additional keywords */
    keywords?: string[];

    /** OpenGraph type */
    type?: 'website' | 'article';
}

/**
 * Generates page metadata for Next.js.
 * 
 * @param options - Metadata options
 * @returns Next.js Metadata object
 * 
 * @example
 * export const metadata = generateMetadata({
 *   title: 'Catalogue',
 *   description: 'Découvrez notre catalogue de produits',
 *   path: '/catalogue',
 * });
 */
export function generateMetadata(options: PageMetadataOptions = {}): Metadata {
    const {
        title,
        description = siteConfig.seo.defaultDescription,
        path = '',
        image,
        noIndex = false,
        keywords = [],
        type = 'website',
    } = options;

    // Generate full title
    const fullTitle = title
        ? siteConfig.seo.titleTemplate.replace('%s', title)
        : siteConfig.seo.defaultTitle;

    // Generate canonical URL
    const canonicalUrl = `${siteConfig.url}${path}`;

    // Combine keywords
    const allKeywords = [...siteConfig.seo.keywords, ...keywords];

    // Base metadata
    const metadata: Metadata = {
        title: fullTitle,
        description,
        keywords: allKeywords,
        authors: [{ name: siteConfig.name }],
        creator: siteConfig.name,
        publisher: siteConfig.name,
        formatDetection: {
            telephone: true,
            email: true,
            address: true,
        },
        metadataBase: new URL(siteConfig.url),
        alternates: {
            canonical: canonicalUrl,
        },
        openGraph: {
            type,
            title: fullTitle,
            description,
            url: canonicalUrl,
            siteName: siteConfig.name,
            locale: siteConfig.locale,
            images: image
                ? [{ url: image, alt: title || siteConfig.name }]
                : undefined,
        },
        twitter: {
            card: 'summary_large_image',
            title: fullTitle,
            description,
            images: image ? [image] : undefined,
        },
        robots: noIndex
            ? { index: false, follow: false }
            : { index: true, follow: true },
    };

    return metadata;
}

/**
 * Generates product-specific metadata.
 * 
 * @param product - Product data
 * @returns Next.js Metadata object
 */
export function generateProductMetadata(product: {
    name: string;
    description: string;
    slug: string;
    images?: { url: string }[];
    categoryName?: string;
}): Metadata {
    const keywords = [product.name];
    if (product.categoryName) {
        keywords.push(product.categoryName);
    }

    return generateMetadata({
        title: product.name,
        description: product.description,
        path: `/produit/${product.slug}`,
        image: product.images?.[0]?.url,
        keywords,
        type: 'article',
    });
}

/**
 * Generates category-specific metadata.
 * 
 * @param category - Category data
 * @returns Next.js Metadata object
 */
export function generateCategoryMetadata(category: {
    name: string;
    description: string;
    slug: string;
    imageUrl?: string;
}): Metadata {
    return generateMetadata({
        title: category.name,
        description: category.description,
        path: `/catalogue/${category.slug}`,
        image: category.imageUrl,
        keywords: [category.name],
    });
}

/**
 * Generates JSON-LD structured data for the organization.
 * 
 * @returns JSON-LD script content
 */
export function generateOrganizationSchema(): object {
    return {
        '@context': 'https://schema.org',
        '@type': 'LocalBusiness',
        name: siteConfig.name,
        description: siteConfig.description,
        url: siteConfig.url,
        logo: `${siteConfig.url}/logo.png`,
        foundingDate: '1975',
        address: {
            '@type': 'PostalAddress',
            streetAddress: 'Avenue Mohammed V',
            addressLocality: 'Ouarzazate',
            addressCountry: 'MA',
        },
        geo: {
            '@type': 'GeoCoordinates',
            latitude: 30.92,
            longitude: -6.9,
        },
        openingHoursSpecification: [
            {
                '@type': 'OpeningHoursSpecification',
                dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
                opens: '09:00',
                closes: '19:00',
            },
            {
                '@type': 'OpeningHoursSpecification',
                dayOfWeek: 'Saturday',
                opens: '09:00',
                closes: '18:00',
            },
        ],
        sameAs: [
            'https://facebook.com/equipement.ouarzazate',
            'https://instagram.com/equipement.ouarzazate',
        ],
    };
}

/**
 * Generates JSON-LD structured data for a product.
 * 
 * @param product - Product data
 * @returns JSON-LD script content
 */
export function generateProductSchema(product: {
    name: string;
    description: string;
    slug: string;
    images?: { url: string }[];
    categoryName?: string;
}): object {
    return {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product.name,
        description: product.description,
        url: `${siteConfig.url}/produit/${product.slug}`,
        image: product.images?.map((img) => img.url),
        brand: {
            '@type': 'Brand',
            name: siteConfig.name,
        },
        category: product.categoryName,
        offers: {
            '@type': 'Offer',
            availability: 'https://schema.org/InStock',
            priceCurrency: 'MAD',
            seller: {
                '@type': 'Organization',
                name: siteConfig.name,
            },
        },
    };
}

/**
 * Generates breadcrumb structured data.
 * 
 * @param items - Breadcrumb items
 * @returns JSON-LD script content
 */
export function generateBreadcrumbSchema(
    items: { name: string; url: string }[]
): object {
    return {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items.map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item.name,
            item: `${siteConfig.url}${item.url}`,
        })),
    };
}
