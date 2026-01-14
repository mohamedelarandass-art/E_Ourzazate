/**
 * Company Statistics Data
 * 
 * Statistics from client data - January 2026
 * These are key figures to display on the homepage
 * 
 * @module data/statistics
 */

export interface Statistic {
    id: string;
    value: number;
    prefix?: string;
    suffix?: string;
    label: string;
    icon: 'Award' | 'Truck' | 'Users' | 'Package' | 'Boxes' | 'Building';
}

/**
 * Year the company was founded
 * Used to calculate years of experience dynamically
 */
export const FOUNDING_YEAR = 1970;

/**
 * Calculate current years of experience
 */
export const getYearsOfExperience = (): number => {
    return new Date().getFullYear() - FOUNDING_YEAR;
};

/**
 * Company statistics for display on homepage
 * Source: Client administrative documents
 */
export const companyStatistics: Statistic[] = [
    {
        id: 'experience',
        value: getYearsOfExperience(),
        prefix: '+',
        suffix: ' ans',
        label: "d'expérience",
        icon: 'Award',
    },
    {
        id: 'vehicles',
        value: 100,
        prefix: '+',
        label: 'Véhicules de transport',
        icon: 'Truck',
    },
    {
        id: 'clients',
        value: 16,
        prefix: '+',
        suffix: 'k',
        label: 'clients actifs',
        icon: 'Users',
    },
    {
        id: 'products',
        value: 17.5,
        prefix: '+',
        suffix: 'K',
        label: 'produits',
        icon: 'Package',
    },
    {
        id: 'brands',
        value: 300,
        prefix: '+',
        label: 'marques partenaires',
        icon: 'Boxes',
    },
    {
        id: 'employees',
        value: 185,
        prefix: '+',
        label: 'collaborateurs',
        icon: 'Users',
    },
];

/**
 * Format a statistic value for display
 * @param stat - The statistic to format
 * @returns Formatted string like "+50 ans"
 */
export const formatStatValue = (stat: Statistic): string => {
    const prefix = stat.prefix || '';
    const suffix = stat.suffix || '';
    return `${prefix}${stat.value}${suffix}`;
};

export default companyStatistics;
