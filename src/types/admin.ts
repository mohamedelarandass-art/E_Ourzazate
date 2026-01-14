/**
 * Admin Types
 * 
 * This file contains all TypeScript interfaces related to admin functionality.
 * The admin dashboard allows the owner to manage products, view analytics,
 * and configure site settings.
 * 
 * @module types/admin
 * @description Admin user and session type definitions for Equipement Ouarzazate
 */

/**
 * AdminUser
 * 
 * Represents an admin user who can access the dashboard.
 * For this project, there will likely be a single admin (the owner).
 */
export interface AdminUser {
    /** Unique identifier for the admin */
    id: string;

    /** Admin username for login */
    username: string;

    /** Admin's email address */
    email: string;

    /** Admin's display name */
    displayName: string;

    /** Admin's role/permission level */
    role: AdminRole;

    /** When the admin account was created */
    createdAt: Date;

    /** When the admin last logged in */
    lastLoginAt?: Date;

    /** Whether the account is active */
    isActive: boolean;
}

/**
 * AdminRole
 * 
 * Role-based access control for admin users.
 * Currently simple, but designed for future expansion.
 */
export type AdminRole =
    | 'owner'    // Full access to everything
    | 'manager'  // Can manage products and categories
    | 'viewer';  // Read-only access to dashboard

/**
 * AdminSession
 * 
 * Represents an active admin session.
 */
export interface AdminSession {
    /** Session ID */
    sessionId: string;

    /** Associated admin user ID */
    userId: string;

    /** When the session was created */
    createdAt: Date;

    /** When the session expires */
    expiresAt: Date;

    /** User agent of the session */
    userAgent?: string;

    /** IP address of the session */
    ipAddress?: string;
}

/**
 * AdminLoginRequest
 * 
 * Request body for admin login.
 */
export interface AdminLoginRequest {
    /** Admin username */
    username: string;

    /** Admin password */
    password: string;

    /** Whether to remember the session (extended expiry) */
    rememberMe?: boolean;
}

/**
 * AdminLoginResponse
 * 
 * Response after login attempt.
 */
export interface AdminLoginResponse {
    /** Whether login was successful */
    success: boolean;

    /** Error message if login failed */
    error?: string;

    /** Admin user data if successful */
    user?: Omit<AdminUser, 'id'>;

    /** Session token if successful */
    token?: string;

    /** When the session expires */
    expiresAt?: Date;
}

/**
 * AdminSidebarItem
 * 
 * Navigation item for the admin sidebar.
 */
export interface AdminSidebarItem {
    /** Unique key for the item */
    key: string;

    /** Display label in French */
    label: string;

    /** Lucide icon name */
    icon: string;

    /** Route path */
    href: string;

    /** Required role to see this item */
    requiredRole?: AdminRole;

    /** Badge count (e.g., pending items) */
    badge?: number;

    /** Sub-items for nested navigation */
    children?: AdminSidebarItem[];
}

/**
 * AdminBreadcrumb
 * 
 * Breadcrumb navigation item.
 */
export interface AdminBreadcrumb {
    /** Display label */
    label: string;

    /** Route path (optional for current page) */
    href?: string;
}

/**
 * AdminPageProps
 * 
 * Common props for admin pages.
 */
export interface AdminPageProps {
    /** Page title for the header */
    title: string;

    /** Optional page description */
    description?: string;

    /** Breadcrumb trail */
    breadcrumbs?: AdminBreadcrumb[];

    /** Actions to show in the header (buttons) */
    actions?: React.ReactNode;
}

/**
 * AdminTableColumn
 * 
 * Column definition for admin data tables.
 */
export interface AdminTableColumn<T> {
    /** Unique key for the column */
    key: string;

    /** Column header label */
    label: string;

    /** Accessor function to get cell value */
    accessor: (item: T) => React.ReactNode;

    /** Whether the column is sortable */
    sortable?: boolean;

    /** Column width */
    width?: string;

    /** Text alignment */
    align?: 'left' | 'center' | 'right';
}

/**
 * AdminActionResult
 * 
 * Result of an admin action (create, update, delete).
 */
export interface AdminActionResult<T = unknown> {
    /** Whether the action was successful */
    success: boolean;

    /** Success or error message */
    message: string;

    /** The affected data (if applicable) */
    data?: T;

    /** Validation errors (if applicable) */
    errors?: Record<string, string>;
}
