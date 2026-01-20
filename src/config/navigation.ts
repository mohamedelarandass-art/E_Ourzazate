/**
 * Navigation Configuration
 * 
 * This file contains all navigation-related configuration including:
 * - Main navigation links
 * - Footer navigation
 * - Admin sidebar navigation
 * - Breadcrumb configuration
 * 
 * All navigation items are centralized here for easy maintenance.
 * 
 * @module config/navigation
 * @description Navigation links configuration for Equipement Ouarzazate
 */

/**
 * Navigation item interface
 */
export interface NavItem {
    /** Display label in French */
    label: string;

    /** Route path */
    href: string;

    /** Optional Lucide icon name */
    icon?: string;

    /** Whether this item requires authentication */
    requiresAuth?: boolean;

    /** Whether this is an external link */
    external?: boolean;

    /** Optional badge text (e.g., "Nouveau") */
    badge?: string;

    /** Optional description for mega menus */
    description?: string;

    /** Child navigation items */
    children?: NavItem[];
}

/**
 * Main navigation items for the header
 */
export const mainNavItems: NavItem[] = [
    {
        label: 'Accueil',
        href: '/',
        icon: 'Home',
    },
    {
        label: 'Catalogue',
        href: '/catalogue',
        icon: 'Grid3X3',
        children: [
            {
                label: 'Tous les produits',
                href: '/catalogue',
                description: 'Parcourez l\'ensemble de notre catalogue',
            },
            {
                label: 'Sanitaire',
                href: '/catalogue/sanitaire',
                icon: 'Droplets',
                description: 'Robinetterie, WC, lavabos et accessoires',
            },
            {
                label: 'Meubles SDB',
                href: '/catalogue/meubles-sdb',
                icon: 'Bath',
                description: 'Meubles et rangements pour salle de bain',
            },
            {
                label: 'Carrelage',
                href: '/catalogue/carrelage',
                icon: 'LayoutGrid',
                description: 'Carreaux pour sol et mur',
            },
            {
                label: 'Luminaire',
                href: '/catalogue/luminaire',
                icon: 'Lamp',
                description: 'Éclairage intérieur et extérieur',
            },

            {
                label: 'Outillage',
                href: '/catalogue/outillage',
                icon: 'Wrench',
                description: 'Outils et équipement de bricolage',
            },
        ],
    },
    {
        label: 'À Propos',
        href: '/a-propos',
        icon: 'Info',
    },
    {
        label: 'Contact',
        href: '/contact',
        icon: 'MessageCircle',
    },
    {
        label: 'FAQ',
        href: '/faq',
        icon: 'HelpCircle',
    },
];

/**
 * Footer navigation sections
 */
export const footerNavSections = [
    {
        title: 'Navigation',
        items: [
            { label: 'Accueil', href: '/' },
            { label: 'Catalogue', href: '/catalogue' },
            { label: 'À Propos', href: '/a-propos' },
            { label: 'Contact', href: '/contact' },
            { label: 'FAQ', href: '/faq' },
        ],
    },
    {
        title: 'Catégories',
        items: [
            { label: 'Sanitaire', href: '/catalogue/sanitaire' },
            { label: 'Meubles SDB', href: '/catalogue/meubles-sdb' },
            { label: 'Carrelage', href: '/catalogue/carrelage' },
            { label: 'Luminaire', href: '/catalogue/luminaire' },

            { label: 'Outillage', href: '/catalogue/outillage' },
        ],
    },
    {
        title: 'Informations',
        items: [
            { label: 'Mentions Légales', href: '/mentions-legales' },
            { label: 'Politique de Confidentialité', href: '/confidentialite' },
            { label: 'Plan du Site', href: '/sitemap' },
        ],
    },
] as const;

/**
 * Admin sidebar navigation items
 */
export const adminNavItems: NavItem[] = [
    {
        label: 'Tableau de Bord',
        href: '/admin',
        icon: 'LayoutDashboard',
    },
    {
        label: 'Produits',
        href: '/admin/produits',
        icon: 'Package',
        children: [
            {
                label: 'Tous les Produits',
                href: '/admin/produits',
            },
            {
                label: 'Ajouter un Produit',
                href: '/admin/produits/nouveau',
            },
        ],
    },
    {
        label: 'Catégories',
        href: '/admin/categories',
        icon: 'FolderTree',
    },
    {
        label: 'Statistiques',
        href: '/admin/statistiques',
        icon: 'BarChart3',
    },
    {
        label: 'Newsletter',
        href: '/admin/newsletter',
        icon: 'Mail',
    },
    {
        label: 'Paramètres',
        href: '/admin/parametres',
        icon: 'Settings',
    },
];

/**
 * Quick action buttons for the header
 */
export const headerActions = [
    {
        label: 'Rechercher',
        icon: 'Search',
        action: 'search',
    },
    {
        label: 'WhatsApp',
        icon: 'MessageCircle',
        action: 'whatsapp',
    },
    {
        label: 'Thème',
        icon: 'Moon',
        action: 'theme',
    },
] as const;

/**
 * Social media links for header/footer
 */
export const socialLinks = [
    {
        label: 'Facebook',
        href: 'https://facebook.com/equipement.ouarzazate',
        icon: 'Facebook',
    },
    {
        label: 'Instagram',
        href: 'https://instagram.com/equipementouarzazate',
        icon: 'Instagram',
    },
    {
        label: 'WhatsApp',
        href: 'https://wa.me/212662425703',
        icon: 'MessageCircle',
    },
] as const;

/**
 * Breadcrumb home item
 */
export const breadcrumbHome: NavItem = {
    label: 'Accueil',
    href: '/',
    icon: 'Home',
};

/**
 * Get breadcrumbs for a given path
 * 
 * @param pathname - The current pathname
 * @returns Array of breadcrumb items
 */
export function getBreadcrumbs(pathname: string): NavItem[] {
    const segments = pathname.split('/').filter(Boolean);
    const breadcrumbs: NavItem[] = [breadcrumbHome];

    let currentPath = '';

    for (const segment of segments) {
        currentPath += `/${segment}`;

        // Find matching nav item
        const navItem = findNavItem(segment, currentPath);
        if (navItem) {
            breadcrumbs.push(navItem);
        } else {
            // Generate breadcrumb from segment
            breadcrumbs.push({
                label: formatSegmentLabel(segment),
                href: currentPath,
            });
        }
    }

    return breadcrumbs;
}

/**
 * Find a navigation item by segment or path
 */
function findNavItem(segment: string, path: string): NavItem | undefined {
    const allItems = [
        ...mainNavItems,
        ...mainNavItems.flatMap((item) => item.children || []),
        ...adminNavItems,
        ...adminNavItems.flatMap((item) => item.children || []),
    ];

    return allItems.find(
        (item) => item.href === path || item.href.endsWith(`/${segment}`)
    );
}

/**
 * Format a URL segment into a readable label
 */
function formatSegmentLabel(segment: string): string {
    // Handle special cases
    const specialLabels: Record<string, string> = {
        'a-propos': 'À Propos',
        'meubles-sdb': 'Meubles SDB',
        'electromenager': 'Électroménager',
        'produit': 'Produit',
        'produits': 'Produits',
        'admin': 'Administration',
        'statistiques': 'Statistiques',
        'parametres': 'Paramètres',
    };

    if (specialLabels[segment]) {
        return specialLabels[segment];
    }

    // Capitalize first letter
    return segment.charAt(0).toUpperCase() + segment.slice(1);
}

/**
 * Check if a path is active
 * 
 * @param currentPath - The current pathname
 * @param itemPath - The navigation item path
 * @param exact - Whether to match exactly or as prefix
 * @returns Whether the path is active
 */
export function isPathActive(
    currentPath: string,
    itemPath: string,
    exact = false
): boolean {
    if (exact) {
        return currentPath === itemPath;
    }

    // Home is only active when exactly at /
    if (itemPath === '/') {
        return currentPath === '/';
    }

    return currentPath.startsWith(itemPath);
}
