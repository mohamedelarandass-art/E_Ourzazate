/**
 * Category Types
 * 
 * This file contains all TypeScript interfaces related to product categories.
 * Categories organize products into logical groups for easy navigation.
 * 
 * The 6 core categories are:
 * 1. Sanitaire (Bathroom fixtures)
 * 2. Meubles SDB (Bathroom furniture)
 * 3. Carrelage (Tiles)
 * 4. Luminaire (Lighting)
 * 5. Électroménager (Appliances)
 * 6. Outillage (Tools)
 * 
 * @module types/category
 * @description Category type definitions for Equipement Ouarzazate
 */

/**
 * Category
 * 
 * Represents a product category in the catalogue.
 * Categories are displayed on the homepage and used for filtering.
 */
export interface Category {
    /** Unique identifier for the category */
    id: string;

    /** Category name in French (e.g., "Sanitaire") */
    name: string;

    /** URL-friendly slug (e.g., "sanitaire") */
    slug: string;

    /** Detailed description of the category */
    description: string;

    /** Icon representation (emoji or Lucide icon name) */
    icon: string;

    /** Optional URL to a category image */
    imageUrl?: string;

    /** Display order (lower numbers appear first) */
    order: number;

    /** Whether the category is visible in the catalogue */
    isActive: boolean;
}

/**
 * CategoryWithCount
 * 
 * Extended category interface that includes the product count.
 * Used for displaying category cards with product counts.
 */
export interface CategoryWithCount extends Category {
    /** Number of active products in this category */
    productCount: number;
}

/**
 * CategoryCardProps
 * 
 * Props interface for the CategoryCard component.
 */
export interface CategoryCardProps {
    /** The category to display */
    category: Category;

    /** Optional product count to display */
    productCount?: number;

    /** Whether to show the description */
    showDescription?: boolean;
}

/**
 * CategorySlug
 * 
 * Union type of all valid category slugs.
 * This provides type safety when working with category routes.
 */
export type CategorySlug =
    | 'sanitaire'
    | 'meubles-sdb'
    | 'carrelage'
    | 'luminaire'
    | 'electromenager'
    | 'outillage';

/**
 * CategoryIcon
 * 
 * Maps category slugs to their respective icons.
 * Icons are from the Lucide React icon library.
 */
export type CategoryIconMap = Record<CategorySlug, string>;
