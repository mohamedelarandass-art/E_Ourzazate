/**
 * Mock Products Data
 * 
 * Temporary mock data for products until database is connected.
 * 
 * @module data/products
 */

import type { Product } from '@/types';

/**
 * Sample products across all categories.
 */
export const products: Product[] = [
    // Sanitaire
    {
        id: 'prod-001',
        name: 'Robinet Mitigeur Cascade Chrome',
        slug: 'robinet-mitigeur-cascade-chrome',
        description: 'Robinet mitigeur design cascade avec finition chrome brillante. Cartouche céramique 35mm pour une durabilité maximale. Installation facile, eau chaude et froide.',
        categoryId: 'cat-sanitaire',
        images: [
            { id: 'img-001-1', url: '/images/products/robinet-cascade-1.jpg', alt: 'Robinet Mitigeur Cascade - Vue principale', order: 1, isFeatured: true },
            { id: 'img-001-2', url: '/images/products/robinet-cascade-2.jpg', alt: 'Robinet Mitigeur Cascade - Vue côté', order: 2, isFeatured: false },
        ],
        variations: [
            { id: 'var-001-1', type: 'color', name: 'Chrome', value: '#C0C0C0' },
            { id: 'var-001-2', type: 'color', name: 'Noir Mat', value: '#2C2C2C' },
        ],
        isNew: true,
        isFeatured: true,
        isPublished: true,
        createdAt: new Date('2024-12-15'),
        updatedAt: new Date('2024-12-15'),
    },
    {
        id: 'prod-002',
        name: 'WC Suspendu Rimless Premium',
        slug: 'wc-suspendu-rimless-premium',
        description: 'WC suspendu sans bride pour un nettoyage facile et une hygiène optimale. Céramique haute qualité, chasse d\'eau économique 3/6L.',
        categoryId: 'cat-sanitaire',
        images: [
            { id: 'img-002-1', url: '/images/products/wc-suspendu-1.jpg', alt: 'WC Suspendu Rimless - Vue principale', order: 1, isFeatured: true },
        ],
        isNew: false,
        isFeatured: true,
        isPublished: true,
        createdAt: new Date('2024-11-20'),
        updatedAt: new Date('2024-11-20'),
    },
    {
        id: 'prod-003',
        name: 'Lavabo Vasque Rectangulaire',
        slug: 'lavabo-vasque-rectangulaire',
        description: 'Vasque à poser rectangulaire en céramique blanche. Design moderne et épuré. Dimensions: 60x40cm.',
        categoryId: 'cat-sanitaire',
        images: [
            { id: 'img-003-1', url: '/images/products/lavabo-vasque-1.jpg', alt: 'Lavabo Vasque Rectangulaire', order: 1, isFeatured: true },
        ],
        isNew: true,
        isFeatured: false,
        isPublished: true,
        createdAt: new Date('2024-12-20'),
        updatedAt: new Date('2024-12-20'),
    },

    // Meubles SDB
    {
        id: 'prod-004',
        name: 'Meuble Vasque Chêne Naturel 80cm',
        slug: 'meuble-vasque-chene-naturel-80cm',
        description: 'Meuble sous-vasque en chêne naturel avec finition mate. 2 tiroirs à fermeture douce. Vasque céramique incluse.',
        categoryId: 'cat-meubles-sdb',
        images: [
            { id: 'img-004-1', url: '/images/products/meuble-vasque-chene-1.jpg', alt: 'Meuble Vasque Chêne', order: 1, isFeatured: true },
        ],
        variations: [
            { id: 'var-004-1', type: 'size', name: '60cm', value: '60cm' },
            { id: 'var-004-2', type: 'size', name: '80cm', value: '80cm' },
            { id: 'var-004-3', type: 'size', name: '100cm', value: '100cm' },
        ],
        isNew: true,
        isFeatured: true,
        isPublished: true,
        createdAt: new Date('2024-12-10'),
        updatedAt: new Date('2024-12-10'),
    },
    {
        id: 'prod-005',
        name: 'Miroir LED Antibuée 70x50cm',
        slug: 'miroir-led-antibuee-70x50cm',
        description: 'Miroir de salle de bain avec éclairage LED intégré et fonction antibuée. Interrupteur tactile, lumière blanche.',
        categoryId: 'cat-meubles-sdb',
        images: [
            { id: 'img-005-1', url: '/images/products/miroir-led-1.jpg', alt: 'Miroir LED Antibuée', order: 1, isFeatured: true },
        ],
        isNew: false,
        isFeatured: true,
        isPublished: true,
        createdAt: new Date('2024-10-15'),
        updatedAt: new Date('2024-10-15'),
    },

    // Carrelage
    {
        id: 'prod-006',
        name: 'Carrelage Imitation Bois Naturel 20x120cm',
        slug: 'carrelage-imitation-bois-naturel-20x120cm',
        description: 'Carrelage grès cérame imitation parquet chêne naturel. Surface antidérapante R10. Parfait pour sols et murs.',
        categoryId: 'cat-carrelage',
        images: [
            { id: 'img-006-1', url: '/images/products/carrelage-bois-1.jpg', alt: 'Carrelage Imitation Bois', order: 1, isFeatured: true },
        ],
        variations: [
            { id: 'var-006-1', type: 'color', name: 'Chêne Naturel', value: '#C4A77D' },
            { id: 'var-006-2', type: 'color', name: 'Chêne Gris', value: '#8B8B8B' },
            { id: 'var-006-3', type: 'color', name: 'Noyer', value: '#5C4033' },
        ],
        isNew: false,
        isFeatured: true,
        isPublished: true,
        createdAt: new Date('2024-09-01'),
        updatedAt: new Date('2024-09-01'),
    },
    {
        id: 'prod-007',
        name: 'Carrelage Marbre Blanc Brillant 60x60cm',
        slug: 'carrelage-marbre-blanc-brillant-60x60cm',
        description: 'Carrelage effet marbre blanc Carrara. Finition brillante luxueuse. Rectifié pour joints fins.',
        categoryId: 'cat-carrelage',
        images: [
            { id: 'img-007-1', url: '/images/products/carrelage-marbre-1.jpg', alt: 'Carrelage Marbre Blanc', order: 1, isFeatured: true },
        ],
        isNew: true,
        isFeatured: true,
        isPublished: true,
        createdAt: new Date('2024-12-01'),
        updatedAt: new Date('2024-12-01'),
    },

    // Luminaire
    {
        id: 'prod-008',
        name: 'Lustre Cristal Moderne 5 Branches',
        slug: 'lustre-cristal-moderne-5-branches',
        description: 'Lustre contemporain avec cristaux de verre soufflé. 5 ampoules E14. Finition chrome. Ø60cm.',
        categoryId: 'cat-luminaire',
        images: [
            { id: 'img-008-1', url: '/images/products/lustre-cristal-1.jpg', alt: 'Lustre Cristal Moderne', order: 1, isFeatured: true },
        ],
        isNew: false,
        isFeatured: true,
        isPublished: true,
        createdAt: new Date('2024-08-15'),
        updatedAt: new Date('2024-08-15'),
    },
    {
        id: 'prod-009',
        name: 'Spot Encastrable LED 7W Blanc',
        slug: 'spot-encastrable-led-7w-blanc',
        description: 'Spot LED encastrable pour faux plafond. 7W équivalent 50W halogène. Blanc chaud 3000K. IP44 pour salle de bain.',
        categoryId: 'cat-luminaire',
        images: [
            { id: 'img-009-1', url: '/images/products/spot-led-1.jpg', alt: 'Spot Encastrable LED', order: 1, isFeatured: true },
        ],
        isNew: true,
        isFeatured: false,
        isPublished: true,
        createdAt: new Date('2024-12-05'),
        updatedAt: new Date('2024-12-05'),
    },

    // SUPPRIMÉ: Catégorie 'Électroménager' (prod-010: Four Encastrable, prod-011: Hotte Aspirante)
    // La société ne vend plus les électroménagers

    // Outillage
    {
        id: 'prod-012',
        name: 'Perceuse Visseuse Sans Fil 18V',
        slug: 'perceuse-visseuse-sans-fil-18v',
        description: 'Perceuse-visseuse professionnelle batterie lithium 18V 2Ah. 50Nm couple. 2 vitesses. Livrée en coffret avec 2 batteries.',
        categoryId: 'cat-outillage',
        images: [
            { id: 'img-012-1', url: '/images/products/perceuse-18v-1.jpg', alt: 'Perceuse Visseuse 18V', order: 1, isFeatured: true },
        ],
        isNew: false,
        isFeatured: true,
        isPublished: true,
        createdAt: new Date('2024-06-10'),
        updatedAt: new Date('2024-06-10'),
    },
    {
        id: 'prod-013',
        name: 'Niveau Laser Croix Automatique',
        slug: 'niveau-laser-croix-automatique',
        description: 'Niveau laser auto-nivelant. Projection croix rouge. Portée 15m. Support magnétique inclus.',
        categoryId: 'cat-outillage',
        images: [
            { id: 'img-013-1', url: '/images/products/niveau-laser-1.jpg', alt: 'Niveau Laser Croix', order: 1, isFeatured: true },
        ],
        isNew: true,
        isFeatured: false,
        isPublished: true,
        createdAt: new Date('2024-12-08'),
        updatedAt: new Date('2024-12-08'),
    },
];

/**
 * Get a product by its ID.
 */
export function getProductById(id: string): Product | undefined {
    return products.find((p) => p.id === id);
}

/**
 * Get a product by its slug.
 */
export function getProductBySlug(slug: string): Product | undefined {
    return products.find((p) => p.slug === slug);
}

/**
 * Get all products for a category.
 */
export function getProductsByCategory(categoryId: string): Product[] {
    return products.filter((p) => p.categoryId === categoryId && p.isPublished);
}

/**
 * Get featured products.
 */
export function getFeaturedProducts(limit?: number): Product[] {
    const featured = products.filter((p) => p.isFeatured && p.isPublished);
    return limit ? featured.slice(0, limit) : featured;
}

/**
 * Get new products.
 */
export function getNewProducts(limit?: number): Product[] {
    const newProducts = products.filter((p) => p.isNew && p.isPublished);
    return limit ? newProducts.slice(0, limit) : newProducts;
}

/**
 * Search products by name or description.
 */
export function searchProducts(query: string): Product[] {
    const lowerQuery = query.toLowerCase();
    return products.filter(
        (p) =>
            p.isPublished &&
            (p.name.toLowerCase().includes(lowerQuery) ||
                p.description.toLowerCase().includes(lowerQuery))
    );
}

/**
 * Get all published products.
 */
export function getAllProducts(): Product[] {
    return products.filter((p) => p.isPublished);
}
