/**
 * Analytics Types
 * 
 * This file contains all TypeScript interfaces related to analytics and statistics.
 * Analytics are used in the admin dashboard to track catalogue performance.
 * 
 * Note: Since this is a catalogue-only platform (no sales), analytics focus on:
 * - Product views
 * - WhatsApp click-throughs
 * - Search queries
 * - Category popularity
 * 
 * @module types/analytics
 * @description Analytics type definitions for Equipement Ouarzazate admin dashboard
 */

/**
 * DashboardStats
 * 
 * Summary statistics displayed on the admin dashboard.
 * These are the main KPIs for the catalogue.
 */
export interface DashboardStats {
    /** Total number of products in the catalogue */
    totalProducts: number;

    /** Number of products added in the last 30 days */
    newProductsThisMonth: number;

    /** Total product views (all time) */
    totalViews: number;

    /** Views in the last 30 days */
    viewsThisMonth: number;

    /** Total WhatsApp button clicks (all time) */
    totalWhatsAppClicks: number;

    /** WhatsApp clicks in the last 30 days */
    whatsAppClicksThisMonth: number;

    /** Number of active categories */
    activeCategories: number;
}

/**
 * ProductViewStats
 * 
 * View statistics for a specific product.
 */
export interface ProductViewStats {
    /** Product ID */
    productId: string;

    /** Product name for display */
    productName: string;

    /** Total views for this product */
    views: number;

    /** WhatsApp clicks for this product */
    whatsAppClicks: number;

    /** Conversion rate (clicks / views * 100) */
    conversionRate: number;

    /** Most recent view timestamp */
    lastViewedAt: Date;
}

/**
 * CategoryStats
 * 
 * Statistics grouped by category.
 */
export interface CategoryStats {
    /** Category ID */
    categoryId: string;

    /** Category name for display */
    categoryName: string;

    /** Number of products in this category */
    productCount: number;

    /** Total views across all products in category */
    totalViews: number;

    /** Total WhatsApp clicks across all products */
    totalWhatsAppClicks: number;
}

/**
 * TimeSeriesDataPoint
 * 
 * A single data point in a time series chart.
 */
export interface TimeSeriesDataPoint {
    /** Date string in ISO format (YYYY-MM-DD) */
    date: string;

    /** The value for this date */
    value: number;
}

/**
 * ChartData
 * 
 * Data structure for charts in the dashboard.
 */
export interface ChartData {
    /** Label for the data series */
    label: string;

    /** Array of data points */
    data: TimeSeriesDataPoint[];

    /** Color for the chart line/bar */
    color?: string;
}

/**
 * AnalyticsPeriod
 * 
 * Time period options for filtering analytics.
 */
export type AnalyticsPeriod =
    | 'today'
    | 'yesterday'
    | 'last7days'
    | 'last30days'
    | 'thisMonth'
    | 'lastMonth'
    | 'thisYear'
    | 'allTime';

/**
 * AnalyticsEvent
 * 
 * Represents a single analytics event to be tracked.
 */
export interface AnalyticsEvent {
    /** Type of event */
    eventType: 'view' | 'whatsapp_click' | 'search' | 'category_view';

    /** Related product ID (if applicable) */
    productId?: string;

    /** Related category ID (if applicable) */
    categoryId?: string;

    /** Additional metadata */
    metadata?: Record<string, string | number>;

    /** Timestamp of the event */
    timestamp: Date;

    /** User's IP address (hashed for privacy) */
    visitorHash?: string;
}

/**
 * SearchQuery
 * 
 * Tracked search query for analytics.
 */
export interface SearchQuery {
    /** The search query text */
    query: string;

    /** Number of results returned */
    resultsCount: number;

    /** Whether any result was clicked */
    hadClick: boolean;

    /** Timestamp of the search */
    timestamp: Date;
}

/**
 * TopSearches
 * 
 * Aggregated search statistics.
 */
export interface TopSearches {
    /** The search query */
    query: string;

    /** Number of times this query was searched */
    count: number;

    /** Average number of results returned */
    avgResults: number;
}
