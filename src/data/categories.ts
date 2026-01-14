/**
 * Mock Categories Data
 * 
 * Temporary mock data for categories until database is connected.
 * 
 * @module data/categories
 */

import type { Category } from '@/types';

/**
 * All product categories for Equipement Ouarzazate.
 * 
 * The 5 core categories covering construction and home improvement materials.
 */
export const categories: Category[] = [
    {
        id: 'cat-sanitaire',
        name: 'Sanitaire',
        slug: 'sanitaire',
        description: 'Robinetterie, WC, lavabos, douches et accessoires de salle de bain. Qualité premium pour votre confort quotidien.',
        icon: '🚿',
        imageUrl: '/images/categories/sanitaire.jpg',
        order: 1,
        isActive: true,
    },
    {
        id: 'cat-meubles-sdb',
        name: 'Meubles SDB',
        slug: 'meubles-sdb',
        description: 'Meubles de salle de bain, rangements, miroirs et accessoires. Design moderne et fonctionnel.',
        icon: '🛁',
        imageUrl: '/images/categories/meubles-sdb.jpg',
        order: 2,
        isActive: true,
    },
    {
        id: 'cat-carrelage',
        name: 'Carrelage',
        slug: 'carrelage',
        description: 'Carreaux pour sol et mur, mosaïques, faïences. Large choix de styles et dimensions.',
        icon: '🔲',
        imageUrl: '/images/categories/carrelage.jpg',
        order: 3,
        isActive: true,
    },
    {
        id: 'cat-luminaire',
        name: 'Luminaire',
        slug: 'luminaire',
        description: 'Éclairage intérieur et extérieur, lustres, appliques, spots. Illuminez votre espace avec style.',
        icon: '💡',
        imageUrl: '/images/categories/luminaire.jpg',
        order: 4,
        isActive: true,
    },
    // SUPPRIMÉ: Catégorie 'cat-electromenager' (Électroménager) - La société ne vend plus les électroménagers
    {
        id: 'cat-outillage',
        name: 'Outillage',
        slug: 'outillage',
        description: 'Outils manuels et électriques, équipement de bricolage. Tout pour vos projets de construction.',
        icon: '🔧',
        imageUrl: '/images/categories/outillage.jpg',
        order: 5,
        isActive: true,
    },
];

/**
 * Get a category by its slug.
 */
export function getCategoryBySlug(slug: string): Category | undefined {
    return categories.find((cat) => cat.slug === slug);
}

/**
 * Get a category by its ID.
 */
export function getCategoryById(id: string): Category | undefined {
    return categories.find((cat) => cat.id === id);
}

/**
 * Get all active categories.
 */
export function getActiveCategories(): Category[] {
    return categories.filter((cat) => cat.isActive).sort((a, b) => a.order - b.order);
}
