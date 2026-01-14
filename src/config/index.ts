/**
 * Configuration Index (Barrel Export)
 * 
 * This file re-exports all configuration from the config directory.
 * It provides a clean import interface for consumers.
 * 
 * Usage:
 * import { siteConfig, contactConfig, mainNavItems } from '@/config';
 * 
 * @module config
 * @description Central export point for all configuration
 */

// Site configuration
export {
    siteConfig,
    getPageTitle,
    getSeoMetadata,
} from './site';
export type { SiteConfig } from './site';

// Contact configuration
export {
    contactConfig,
    getWhatsAppLink,
    getProductWhatsAppLink,
    getPhoneLink,
    getEmailLink,
    isBusinessOpen,
} from './contact';
export type { ContactConfig } from './contact';

// Navigation configuration
export {
    mainNavItems,
    footerNavSections,
    adminNavItems,
    headerActions,
    socialLinks,
    breadcrumbHome,
    getBreadcrumbs,
    isPathActive,
} from './navigation';
export type { NavItem } from './navigation';

// Company legal information
export {
    companyInfo,
    getFooterLegalText,
    getLegalInfoList,
} from './company';
export type { CompanyInfo, CompanyLegalInfo } from './company';

