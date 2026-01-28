/**
 * Data Index (Barrel Export)
 * 
 * Central export point for all mock data.
 * 
 * @module data
 */

// Categories
export {
    categories,
    getCategoryBySlug,
    getCategoryById,
    getActiveCategories,
} from './categories';

// Products
export {
    products,
    getProductById,
    getProductBySlug,
    getProductsByCategory,
    getFeaturedProducts,
    getNewProducts,
    searchProducts,
    getAllProducts,
} from './products';

// Blur Placeholders (performance optimization)
export {
    blurPlaceholders,
    getBlurPlaceholder,
    genericBlurPlaceholder,
    categoryBlur,
    productBlur,
    productShowcaseBlur,
} from './blurPlaceholders';

// Partners
export {
    partners,
    partnerCategories,
} from './partners';
export type { Partner, PartnerCategory } from './partners';

// Statistics
export {
    companyStatistics,
    FOUNDING_YEAR,
    getYearsOfExperience,
    formatStatValue,
} from './statistics';
export type { Statistic } from './statistics';

// About Page Data
export {
    timeline,
    timelinePending,
    values,
    projects,
    projectCategories,
    director,
    socialProofStats,
    certifications,
    heroContent,
    ctaContent,
    pendingItems,
} from './about';
export type {
    TimelineItem,
    Value,
    Project,
    ProjectCategory,
    DirectorInfo,
} from './about';

