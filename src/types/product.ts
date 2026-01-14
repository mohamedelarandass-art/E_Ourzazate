/**
 * Product Types
 * 
 * This file contains all TypeScript interfaces related to products.
 * Products are the core entity of the catalogue - they represent
 * items displayed to customers without prices (catalogue-only model).
 * 
 * @module types/product
 * @description Core product type definitions for Equipement Ouarzazate
 */

/**
 * ProductImage
 * 
 * Represents a single image associated with a product.
 * Products can have multiple images displayed in a gallery.
 * The order field determines the display sequence.
 * The isFeatured flag indicates the main/hero image.
 */
export interface ProductImage {
  /** Unique identifier for the image */
  id: string;
  
  /** URL path to the image (can be relative or absolute) */
  url: string;
  
  /** Alt text for accessibility and SEO */
  alt: string;
  
  /** Display order in the gallery (lower numbers first) */
  order: number;
  
  /** Whether this is the featured/main image shown in cards */
  isFeatured: boolean;
}

/**
 * ProductVariation
 * 
 * Represents a product variant such as different colors, sizes, or materials.
 * These are displayed as options on the product detail page.
 * Note: Since this is a catalogue (no checkout), variations are informational only.
 */
export interface ProductVariation {
  /** Unique identifier for the variation */
  id: string;
  
  /** Type of variation - determines how it's displayed */
  type: 'color' | 'size' | 'material';
  
  /** Human-readable name of the variation (e.g., "Blanc Cassé") */
  name: string;
  
  /** Value of the variation (e.g., "#F5F5DC" for colors, "60x120cm" for sizes) */
  value: string;
}

/**
 * Product
 * 
 * The main product entity representing an item in the catalogue.
 * Products are organized by categories and can be filtered/searched.
 * 
 * Important: No price field exists because this is a catalogue-only platform.
 * Customers contact via WhatsApp to get pricing information.
 */
export interface Product {
  /** Unique identifier (UUID format recommended) */
  id: string;
  
  /** Product name in French */
  name: string;
  
  /** URL-friendly slug generated from the name */
  slug: string;
  
  /** Detailed product description in French */
  description: string;
  
  /** Reference to the parent category */
  categoryId: string;
  
  /** Array of product images for the gallery */
  images: ProductImage[];
  
  /** Optional array of product variations */
  variations?: ProductVariation[];
  
  /** Flag indicating if this is a new product (shows "Nouveau" badge) */
  isNew: boolean;
  
  /** Flag indicating if this is featured (shown on homepage) */
  isFeatured: boolean;
  
  /** Flag indicating if the product is visible in the catalogue */
  isPublished: boolean;
  
  /** When the product was added to the catalogue */
  createdAt: Date;
  
  /** When the product was last updated */
  updatedAt: Date;
}

/**
 * ProductWithCategory
 * 
 * Extended product interface that includes the full category object.
 * Used when displaying product details where category info is needed.
 */
export interface ProductWithCategory extends Product {
  /** The full category object instead of just the ID */
  category: import('./category').Category;
}

/**
 * ProductFilters
 * 
 * Represents the filter state for the catalogue page.
 * Used to filter products by various criteria.
 */
export interface ProductFilters {
  /** Filter by category ID (optional) */
  categoryId?: string;
  
  /** Search query for name/description matching */
  search?: string;
  
  /** Filter only new products */
  isNew?: boolean;
  
  /** Filter only featured products */
  isFeatured?: boolean;
}

/**
 * ProductSortOption
 * 
 * Available sorting options for the product grid.
 */
export type ProductSortOption = 
  | 'newest'     // Sort by createdAt descending
  | 'oldest'     // Sort by createdAt ascending
  | 'name-asc'   // Sort by name A-Z
  | 'name-desc'; // Sort by name Z-A

/**
 * ProductCardProps
 * 
 * Props interface for the ProductCard component.
 * Defines what data is needed to render a product card.
 */
export interface ProductCardProps {
  /** The product to display */
  product: Product;
  
  /** Optional category name for display */
  categoryName?: string;
  
  /** Whether to show the category badge */
  showCategory?: boolean;
  
  /** Whether to enable hover animations */
  enableHover?: boolean;
}
