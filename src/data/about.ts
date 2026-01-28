/**
 * About Page Data
 * 
 * Contains all data for the À Propos page including:
 * - Company timeline milestones (pending client data)
 * - Core values
 * - Prestigious projects
 * - Director message
 * 
 * @module data/about
 */

/* ==========================================================================
   Type Definitions
   ========================================================================== */

/**
 * Timeline milestone item
 * NOTE: Timeline data pending from client
 */
export interface TimelineItem {
    /** Unique identifier */
    id: string;
    /** Year of the milestone */
    year: string;
    /** Title of the milestone */
    title: string;
    /** Description of what happened */
    description: string;
    /** Optional image path */
    image?: string;
}

/**
 * Company value item
 */
export interface Value {
    /** Unique identifier */
    id: string;
    /** Lucide icon name */
    icon: 'Award' | 'Users' | 'Lightbulb' | 'Heart' | 'Star' | 'Shield';
    /** Value title */
    title: string;
    /** Value description */
    description: string;
}

/**
 * Project category
 */
export type ProjectCategory = 'energie' | 'hotellerie' | 'infrastructure' | 'commerce';

/**
 * Prestigious project reference
 */
export interface Project {
    /** Unique identifier */
    id: string;
    /** Project name */
    name: string;
    /** Category of the project */
    category: ProjectCategory;
    /** Short description (optional) */
    description?: string;
}

/**
 * Director/Leader information
 */
export interface DirectorInfo {
    /** Director's name */
    name: string;
    /** Director's title */
    title: string;
    /** Generation info */
    generation: string;
    /** Welcome message - personal and warm tone */
    message: string;
    /** Signature text */
    signature: string;
}

/* ==========================================================================
   Timeline Data
   ========================================================================== */

/**
 * Company history timeline
 * ⏳ PENDING: Client will provide detailed timeline/milestones later
 * Using minimal placeholder for now
 */
export const timeline: TimelineItem[] = [
    {
        id: 'founding',
        year: '1975',
        title: 'La Naissance',
        description: 'Création d\'Equipement Ouarzazate par Brahim Amcassou. Une vision: devenir le partenaire qualité de la région.',
    },
    {
        id: 'today',
        year: '2024',
        title: 'Votre Partenaire Qualité',
        description: 'Aujourd\'hui, avec 120 collaborateurs dévoués et plus de 300 marques partenaires, nous continuons à façonner l\'excellence.',
    },
];

/**
 * Flag indicating timeline is pending detailed data from client
 */
export const timelinePending = true;

/* ==========================================================================
   Values Data - Confirmed by Client
   ========================================================================== */

/**
 * Company core values
 * ✅ Confirmed: Qualité, Service Client, Innovation
 */
export const values: Value[] = [
    {
        id: 'quality',
        icon: 'Award',
        title: 'Qualité',
        description: 'Notre engagement envers l\'excellence se reflète dans chaque produit que nous sélectionnons. Nous ne proposons que des matériaux qui répondent à nos standards les plus exigeants.',
    },
    {
        id: 'service',
        icon: 'Users',
        title: 'Service Client',
        description: 'Accompagnement personnalisé et chaleureux à chaque étape. Notre équipe de 120 collaborateurs passionnés est à votre écoute pour transformer vos projets en réalité.',
    },
    {
        id: 'innovation',
        icon: 'Lightbulb',
        title: 'Innovation',
        description: 'Toujours à la recherche des meilleures solutions et des dernières tendances. Nous évoluons constamment pour vous offrir le meilleur du marché.',
    },
];

/* ==========================================================================
   Prestigious Projects Data - Confirmed by Client
   ========================================================================== */

/**
 * Category display information
 */
export const projectCategories: Record<ProjectCategory, { label: string; icon: string }> = {
    energie: { label: 'Énergie', icon: 'Zap' },
    hotellerie: { label: 'Hôtellerie', icon: 'Building' },
    infrastructure: { label: 'Infrastructure', icon: 'Construction' },
    commerce: { label: 'Commerce', icon: 'ShoppingCart' },
};

/**
 * 12 Prestigious projects
 * ✅ Confirmed by client
 */
export const projects: Project[] = [
    // Énergie (2 projets)
    {
        id: 'noor',
        name: 'NOOR',
        category: 'energie',
        description: 'Centrale solaire',
    },
    {
        id: 'pompage',
        name: 'Station de Pompage',
        category: 'energie',
    },

    // Hôtellerie (4 projets)
    {
        id: 'berber-palace',
        name: 'Berber Palace',
        category: 'hotellerie',
    },
    {
        id: 'ibis',
        name: 'Ibis',
        category: 'hotellerie',
    },
    {
        id: 'rs-karam',
        name: 'RS Karam',
        category: 'hotellerie',
    },
    {
        id: 'kenzi-azghor',
        name: 'Kenzi Azghor',
        category: 'hotellerie',
    },

    // Infrastructure (4 projets)
    {
        id: 'pont-ait-ben-haddou',
        name: 'Pont d\'Ait Ben Haddou',
        category: 'infrastructure',
    },
    {
        id: 'pont-agdez',
        name: 'Pont d\'Agdez',
        category: 'infrastructure',
    },
    {
        id: 'col-tichka',
        name: 'Col Tichka',
        category: 'infrastructure',
    },
    {
        id: 'aeroport',
        name: 'Aéroport',
        category: 'infrastructure',
    },

    // Commerce (2 projets)
    {
        id: 'marjane',
        name: 'Marjane',
        category: 'commerce',
    },
    {
        id: 'atacadao',
        name: 'Atacadao',
        category: 'commerce',
    },
];

/* ==========================================================================
   Director Data - Confirmed by Client
   ========================================================================== */

/**
 * Director information
 * ✅ Confirmed: Brahim Amcassou, 2ème génération
 * Tone: Chaleureux et familial
 */
export const director: DirectorInfo = {
    name: 'Brahim Amcassou',
    title: 'Directeur Général',
    generation: '2ème génération',
    message: `Chers clients et partenaires,

Depuis 1975, notre famille s'engage à vos côtés pour concrétiser vos projets les plus ambitieux. Ce qui a commencé comme une petite entreprise familiale est devenu, grâce à votre confiance, un acteur incontournable de la région.

Notre philosophie reste simple : vous offrir la qualité, le service et l'innovation que vous méritez. Chaque jour, nos 120 collaborateurs se lèvent avec cette mission en tête.

Des projets emblématiques comme la centrale NOOR, le Berber Palace ou le Col Tichka témoignent de cette relation de confiance que nous avons bâtie ensemble.

Merci de faire partie de notre histoire.`,
    signature: 'Brahim Amcassou',
};

/* ==========================================================================
   Social Proof Data
   ========================================================================== */

/**
 * Key statistics for social proof
 */
export const socialProofStats = [
    {
        id: 'projects',
        value: '12',
        label: 'projets prestigieux',
    },
    {
        id: 'experience',
        value: '+50',
        label: 'ans d\'expérience',
    },
    {
        id: 'team',
        value: '120',
        label: 'collaborateurs',
    },
    {
        id: 'brands',
        value: '+300',
        label: 'marques partenaires',
    },
];

/**
 * Company certifications/legal info for trust badges
 */
export const certifications = {
    rc: '4433', // Registre de Commerce
    ice: '000125028000047', // ICE
    // ⏳ PENDING: Certification béton (client will add later)
};

/* ==========================================================================
   Hero Data
   ========================================================================== */

/**
 * Hero section content
 * ✅ Using confirmed slogan: "Votre Partenaire Qualité"
 */
export const heroContent = {
    eyebrow: 'Notre Histoire',
    slogan: 'Votre Partenaire Qualité',
    title: 'Depuis 1975, une histoire de famille et de confiance',
    subtitle: 'Plus qu\'un fournisseur, nous sommes le partenaire de vos projets depuis près de 50 ans. De la centrale NOOR aux plus beaux hôtels de la région, notre engagement qualité fait la différence.',
};

/**
 * CTA section content
 * ✅ Using confirmed CTA: "Visiter le Catalogue"
 */
export const ctaContent = {
    title: 'Prêt à concrétiser votre projet ?',
    subtitle: 'Rejoignez les centaines d\'entreprises qui nous font confiance. Découvrez notre catalogue de plus de 17 500 produits.',
    primaryCta: {
        text: 'Visiter le Catalogue',
        href: '/catalogue',
    },
    secondaryCta: {
        text: 'Nous Contacter',
        href: '/contact',
    },
};

/* ==========================================================================
   Pending Data (Client will provide later)
   ========================================================================== */

/**
 * Pending items to be added when client provides:
 * - ⏳ Timeline/Étapes clés détaillées
 * - ⏳ Photos showroom (extérieur + intérieur)
 * - ⏳ Certification béton
 */
export const pendingItems = {
    timeline: true,
    showroomPhotos: true,
    certificationBeton: true,
};
