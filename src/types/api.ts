/**
 * API Types
 * 
 * This file contains all TypeScript interfaces for API requests and responses.
 * These types ensure type safety across the frontend-backend boundary.
 * 
 * All API routes follow RESTful conventions:
 * - GET for reading data
 * - POST for creating data
 * - PUT for updating data
 * - DELETE for removing data
 * 
 * @module types/api
 * @description API response wrapper types for Equipement Ouarzazate
 */

/**
 * ApiResponse
 * 
 * Standard wrapper for all API responses.
 * Provides consistent structure for success and error cases.
 * 
 * @template T The type of data returned on success
 */
export interface ApiResponse<T> {
    /** Whether the request was successful */
    success: boolean;

    /** The response data (only present on success) */
    data?: T;

    /** Error message (only present on failure) */
    error?: string;

    /** Additional error details */
    details?: Record<string, string>;
}

/**
 * PaginatedResponse
 * 
 * Wrapper for paginated list responses.
 * Used for product listings, admin tables, etc.
 * 
 * @template T The type of items in the list
 */
export interface PaginatedResponse<T> {
    /** Array of items for the current page */
    items: T[];

    /** Total number of items across all pages */
    total: number;

    /** Current page number (1-indexed) */
    page: number;

    /** Number of items per page */
    pageSize: number;

    /** Total number of pages */
    totalPages: number;

    /** Whether there's a next page */
    hasNextPage: boolean;

    /** Whether there's a previous page */
    hasPreviousPage: boolean;
}

/**
 * ApiError
 * 
 * Structured error response from the API.
 */
export interface ApiError {
    /** Error code for programmatic handling */
    code: string;

    /** Human-readable error message */
    message: string;

    /** Field-specific error details */
    details?: Record<string, string>;

    /** HTTP status code */
    statusCode?: number;
}

/**
 * PaginationParams
 * 
 * Query parameters for paginated requests.
 */
export interface PaginationParams {
    /** Page number (1-indexed, default: 1) */
    page?: number;

    /** Items per page (default: 12) */
    pageSize?: number;

    /** Field to sort by */
    sortBy?: string;

    /** Sort direction */
    sortOrder?: 'asc' | 'desc';
}

/**
 * SearchParams
 * 
 * Query parameters for search requests.
 */
export interface SearchParams extends PaginationParams {
    /** Search query string */
    q?: string;

    /** Category filter */
    category?: string;

    /** Filter for new products only */
    isNew?: boolean;

    /** Filter for featured products only */
    isFeatured?: boolean;
}

/**
 * CreateProductRequest
 * 
 * Request body for creating a new product.
 */
export interface CreateProductRequest {
    /** Product name */
    name: string;

    /** Product description */
    description: string;

    /** Category ID */
    categoryId: string;

    /** Whether the product is new */
    isNew?: boolean;

    /** Whether the product is featured */
    isFeatured?: boolean;

    /** Whether the product is published */
    isPublished?: boolean;

    /** Image data (URLs or base64) */
    images?: Array<{
        url: string;
        alt: string;
        order: number;
        isFeatured: boolean;
    }>;

    /** Product variations */
    variations?: Array<{
        type: 'color' | 'size' | 'material';
        name: string;
        value: string;
    }>;
}

/**
 * UpdateProductRequest
 * 
 * Request body for updating an existing product.
 */
export interface UpdateProductRequest extends Partial<CreateProductRequest> {
    /** Product ID to update */
    id: string;
}

/**
 * CreateCategoryRequest
 * 
 * Request body for creating a new category.
 */
export interface CreateCategoryRequest {
    /** Category name */
    name: string;

    /** Category description */
    description: string;

    /** Icon (emoji or icon name) */
    icon: string;

    /** Category image URL */
    imageUrl?: string;

    /** Display order */
    order?: number;

    /** Whether the category is active */
    isActive?: boolean;
}

/**
 * UpdateCategoryRequest
 * 
 * Request body for updating an existing category.
 */
export interface UpdateCategoryRequest extends Partial<CreateCategoryRequest> {
    /** Category ID to update */
    id: string;
}

/**
 * AnalyticsRequest
 * 
 * Request parameters for analytics data.
 */
export interface AnalyticsRequest {
    /** Start date for the period */
    startDate?: string;

    /** End date for the period */
    endDate?: string;

    /** Predefined period */
    period?: 'today' | 'yesterday' | 'last7days' | 'last30days' | 'thisMonth' | 'lastMonth' | 'thisYear' | 'allTime';

    /** Group results by */
    groupBy?: 'day' | 'week' | 'month';
}

/**
 * ContactFormRequest
 * 
 * Request body for the contact form.
 */
export interface ContactFormRequest {
    /** Sender's name */
    name: string;

    /** Sender's email */
    email: string;

    /** Sender's phone (optional) */
    phone?: string;

    /** Message subject */
    subject: string;

    /** Message content */
    message: string;

    /** Product ID if inquiry is about a specific product */
    productId?: string;
}

/**
 * ContactFormResponse
 * 
 * Response after submitting the contact form.
 */
export interface ContactFormResponse {
    /** Whether the message was sent successfully */
    success: boolean;

    /** Response message to show the user */
    message: string;

    /** Reference ID for the inquiry */
    referenceId?: string;
}

/**
 * UploadImageRequest
 * 
 * Request for uploading product images.
 */
export interface UploadImageRequest {
    /** Image file (base64 encoded) */
    file: string;

    /** Original filename */
    filename: string;

    /** Alt text for the image */
    alt: string;

    /** Product ID to associate with */
    productId?: string;
}

/**
 * UploadImageResponse
 * 
 * Response after image upload.
 */
export interface UploadImageResponse {
    /** Whether upload was successful */
    success: boolean;

    /** URL of the uploaded image */
    url?: string;

    /** Image ID for reference */
    imageId?: string;

    /** Error message if failed */
    error?: string;
}

/**
 * HealthCheckResponse
 * 
 * Response from the health check endpoint.
 */
export interface HealthCheckResponse {
    /** Service status */
    status: 'healthy' | 'degraded' | 'unhealthy';

    /** Current timestamp */
    timestamp: string;

    /** Version of the application */
    version: string;

    /** Database connection status */
    database?: 'connected' | 'disconnected';
}
