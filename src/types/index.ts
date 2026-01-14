/**
 * Types Index (Barrel Export)
 * 
 * This file re-exports all types from the types directory.
 * It provides a clean import interface for consumers.
 * 
 * Usage:
 * import { Product, Category, ApiResponse } from '@/types';
 * 
 * @module types
 * @description Central export point for all TypeScript types
 */

// Product types
export type {
    ProductImage,
    ProductVariation,
    Product,
    ProductWithCategory,
    ProductFilters,
    ProductSortOption,
    ProductCardProps,
} from './product';

// Category types
export type {
    Category,
    CategoryWithCount,
    CategoryCardProps,
    CategorySlug,
    CategoryIconMap,
} from './category';

// Analytics types
export type {
    DashboardStats,
    ProductViewStats,
    CategoryStats,
    TimeSeriesDataPoint,
    ChartData,
    AnalyticsPeriod,
    AnalyticsEvent,
    SearchQuery,
    TopSearches,
} from './analytics';

// Newsletter types
export type {
    NewsletterSubscriber,
    NewsletterSource,
    NewsletterSubscribeRequest,
    NewsletterSubscribeResponse,
    NewsletterStats,
    NewsletterFormProps,
} from './newsletter';

// Admin types
export type {
    AdminUser,
    AdminRole,
    AdminSession,
    AdminLoginRequest,
    AdminLoginResponse,
    AdminSidebarItem,
    AdminBreadcrumb,
    AdminPageProps,
    AdminTableColumn,
    AdminActionResult,
} from './admin';

// API types
export type {
    ApiResponse,
    PaginatedResponse,
    ApiError,
    PaginationParams,
    SearchParams,
    CreateProductRequest,
    UpdateProductRequest,
    CreateCategoryRequest,
    UpdateCategoryRequest,
    AnalyticsRequest,
    ContactFormRequest,
    ContactFormResponse,
    UploadImageRequest,
    UploadImageResponse,
    HealthCheckResponse,
} from './api';
