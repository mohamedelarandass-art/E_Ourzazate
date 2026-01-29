/**
 * About Page Data
 * 
 * Contains all data for the À Propos page including:
 * - Company timeline milestones (10 étapes - COMPLET)
 * - Core values (Qualité, Service Client, Innovation)
 * - Prestigious projects (12 projets)
 * - Director message
 * - Company metrics
 * - Differentiation message
 * 
 * ✅ DONNÉES FINALES — Version 29 janvier 2026
 * 
 * @module data/about
 */

/* ==========================================================================
   Type Definitions
   ========================================================================== */

/**
 * Timeline milestone item
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
    /** Full project name */
    name: string;
    /** Short name for compact display */
    shortName: string;
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

/**
 * Company key metrics
 */
export interface CompanyMetrics {
    /** Years of experience */
    yearsExperience: number;
    /** Number of collaborators */
    collaborators: number;
    /** Total site surface in m² */
    siteSurface: number;
    /** Showroom surface in m² */
    showroomSurface: number;
    /** Founding year */
    foundingYear: number;
    /** Founder name */
    founder: string;
    /** First location */
    firstLocation: string;
    /** Current director */
    currentDirector: string;
}

/* ==========================================================================
   Timeline Data — 10 Étapes Complètes
   ========================================================================== */

/**
 * Company history timeline
 * ✅ COMPLET — 10 étapes fournies par le client
 */
export const timeline: TimelineItem[] = [
    {
        id: 'creation',
        year: '1975',
        title: 'Création de l\'entreprise',
        description: 'L\'entreprise a été fondée avec une activité centrée sur la vente de matériaux de base, notamment le fer et le ciment.',
    },
    {
        id: 'developpement',
        year: '1980',
        title: 'Développement de l\'activité',
        description: 'L\'entreprise élargit son offre en intégrant la vente de produits sanitaires, d\'électricité, de bois et de quincaillerie.',
    },
    {
        id: 'production',
        year: '1988',
        title: 'Lancement de la production',
        description: 'Début de la production de matériaux de construction avec l\'acquisition d\'une pondeuse d\'agglos.',
    },
    {
        id: 'expansion',
        year: '2004',
        title: 'Expansion industrielle',
        description: 'Acquisition d\'une machine d\'agglos et hourdis semi-automatique de plus grande capacité, accompagnée du lancement d\'une nouvelle ligne de production de poutrelles enrobées.',
    },
    {
        id: 'renforcement',
        year: '2007',
        title: 'Renforcement de la capacité',
        description: 'Face à la forte demande, l\'entreprise acquiert une machine Sigma 1000 pour la production d\'agglos et lance un concasseur d\'agrégats afin de mieux contrôler la qualité des matériaux.',
    },
    {
        id: 'beton',
        year: '2009',
        title: 'Béton prêt à l\'emploi',
        description: 'Acquisition de deux centrales à béton, de dix camions malaxeurs et d\'une pompe à béton, faisant de l\'entreprise la première de la région à proposer le béton prêt à l\'emploi.',
    },
    {
        id: 'nouveau-site',
        year: '2009',
        title: 'Nouveau site',
        description: 'Déménagement vers un nouveau site de 61 000 m² comprenant un showroom de 1 500 m², permettant de faciliter la livraison aux clients grâce au regroupement des usines, du showroom et de la zone de livraison en un seul lieu.',
    },
    {
        id: 'sigma-1205',
        year: '2010',
        title: 'Renforcement de la production',
        description: 'Acquisition d\'une machine Sigma 1205 afin de répondre à la forte demande en agglos et hourdis.',
    },
    {
        id: 'modernisation',
        year: '2020',
        title: 'Modernisation de la production',
        description: 'Acquisition d\'une machine Quadra 5 automatique afin d\'améliorer la capacité de production et la qualité des produits.',
    },
    {
        id: 'poutrelles',
        year: '2025',
        title: 'Une première dans la région',
        description: 'Lancement de la première usine de poutrelles précontraintes dans la région Drâa-Tafilalet.',
    },
];

/**
 * Flag indicating timeline is complete
 * ✅ Timeline maintenant complète
 */
export const timelinePending = false;

/* ==========================================================================
   Values Data — Confirmé par Client
   ========================================================================== */

/**
 * Company core values
 * ✅ Confirmé: Qualité, Service Client, Innovation
 * Descriptions fournies par le client
 */
export const values: Value[] = [
    {
        id: 'quality',
        icon: 'Award',
        title: 'Qualité',
        description: 'Nous plaçons la qualité au cœur de notre engagement, en garantissant des produits fiables, conformes aux normes et répondant aux exigences de nos clients.',
    },
    {
        id: 'service',
        icon: 'Users',
        title: 'Service Client',
        description: 'La satisfaction de nos clients est une priorité. Nous offrons un accompagnement personnalisé, une écoute attentive et des solutions adaptées à chaque besoin.',
    },
    {
        id: 'innovation',
        icon: 'Lightbulb',
        title: 'Innovation',
        description: 'Nous investissons continuellement dans les nouvelles technologies et les équipements modernes afin d\'améliorer nos performances et proposer des solutions durables.',
    },
];

/* ==========================================================================
   Prestigious Projects Data — 12 Projets Complets
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
 * ✅ Confirmé par client — Noms complets
 */
export const projects: Project[] = [
    // Énergie (2 projets)
    {
        id: 'noor',
        name: 'Complexe Solaire NOOR Ouarzazate',
        shortName: 'NOOR',
        category: 'energie',
        description: 'Centrale solaire',
    },
    {
        id: 'pompage',
        name: 'Station de Pompage NOOR Ouarzazate',
        shortName: 'Station de Pompage',
        category: 'energie',
    },

    // Hôtellerie (4 projets)
    {
        id: 'berber-palace',
        name: 'Hôtel Berber Palace',
        shortName: 'Berber Palace',
        category: 'hotellerie',
    },
    {
        id: 'ibis',
        name: 'Hôtel Ibis Ouarzazate',
        shortName: 'Ibis',
        category: 'hotellerie',
    },
    {
        id: 'rs-karam',
        name: 'Hôtel RS Karam Ouarzazate',
        shortName: 'RS Karam',
        category: 'hotellerie',
    },
    {
        id: 'kenzi-azghor',
        name: 'Hôtel Kenzi Azghor',
        shortName: 'Kenzi Azghor',
        category: 'hotellerie',
    },

    // Infrastructure (4 projets)
    {
        id: 'pont-ait-ben-haddou',
        name: 'Pont Ait Ben Haddou',
        shortName: 'Pont Ait Ben Haddou',
        category: 'infrastructure',
    },
    {
        id: 'pont-agdez',
        name: 'Pont Agdez',
        shortName: 'Pont Agdez',
        category: 'infrastructure',
    },
    {
        id: 'col-tichka',
        name: 'Travaux de Renforcement du Col Tichka',
        shortName: 'Col Tichka',
        category: 'infrastructure',
    },
    {
        id: 'aeroport',
        name: 'Aéroport Ouarzazate',
        shortName: 'Aéroport',
        category: 'infrastructure',
    },

    // Commerce (2 projets)
    {
        id: 'marjane',
        name: 'Marjane Ouarzazate',
        shortName: 'Marjane',
        category: 'commerce',
    },
    {
        id: 'atacadao',
        name: 'Atacadao Ouarzazate',
        shortName: 'Atacadao',
        category: 'commerce',
    },
];

/* ==========================================================================
   Director Data — Message Final Client
   ========================================================================== */

/**
 * Director information
 * ✅ Confirmé: Brahim Amcassou, 2ème génération
 * Message personnalisé fourni par le client
 * Ton: Chaleureux et familial
 */
export const director: DirectorInfo = {
    name: 'Brahim Amcassou',
    title: 'Directeur Général',
    generation: '2ème génération',
    message: `Chers clients et partenaires,

Depuis 1975, notre famille s'engage à vos côtés pour concrétiser vos projets les plus ambitieux. Ce qui a commencé comme une petite entreprise familiale dans le Quartier 3 Mars est devenu, grâce à votre confiance, un acteur incontournable de la région Drâa-Tafilalet.

Je tiens à vous transmettre un message de confiance et de proximité, en vous remerciant pour votre fidélité et en réaffirmant mon engagement à vous offrir des produits de qualité, un bon service et un accompagnement sérieux pour chaque projet.

Notre philosophie reste simple : vous offrir la qualité, le service et l'innovation que vous méritez. Chaque jour, nos 140 collaborateurs se lèvent avec cette mission en tête.

Des projets emblématiques comme le Complexe Solaire NOOR, l'Hôtel Berber Palace ou les Travaux du Col Tichka témoignent de cette relation de confiance que nous avons bâtie ensemble.

Merci de faire partie de notre histoire.`,
    signature: 'Brahim Amcassou',
};

/* ==========================================================================
   Differentiation Message — Nouveau Bloc
   ========================================================================== */

/**
 * Message de différenciation
 * ✅ Nouveau — fourni par le client
 */
export const differentiationMessage = `Chez Équipement Ouarzazate, nous construisons bien plus que des matériaux : nous bâtissons des relations durables avec nos clients. Notre engagement repose sur la transparence, la disponibilité et la constance dans la qualité. Grâce à une organisation performante, des équipements modernes et une équipe expérimentée, nous vous garantissons des solutions efficaces, au bon moment et au juste prix.`;

/* ==========================================================================
   Company Metrics — Chiffres Clés
   ========================================================================== */

/**
 * Company key metrics
 * ✅ Confirmé par client
 */
export const companyMetrics: CompanyMetrics = {
    yearsExperience: 50,
    collaborators: 140,
    siteSurface: 61000, // m²
    showroomSurface: 1500, // m²
    foundingYear: 1975,
    founder: 'Brahim Amcassou',
    firstLocation: 'Quartier 3 Mars, Ouarzazate',
    currentDirector: 'Brahim Amcassou',
};

/* ==========================================================================
   Social Proof Data — Mise à jour
   ========================================================================== */

/**
 * Key statistics for social proof
 * ✅ Mise à jour: 140 collaborateurs, 61 000 m²
 */
export const socialProofStats = [
    {
        id: 'projects',
        value: '12',
        numericValue: 12,
        label: 'projets prestigieux',
    },
    {
        id: 'experience',
        value: '+50',
        numericValue: 50,
        label: 'ans d\'expérience',
        suffix: '+',
    },
    {
        id: 'team',
        value: '140',
        numericValue: 140,
        label: 'collaborateurs',
    },
    {
        id: 'surface',
        value: '61 000',
        numericValue: 61000,
        label: 'm² de site',
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
   Showroom Images
   ========================================================================== */

/**
 * Showroom image paths
 * ✅ 25 images disponibles
 */
export const showroomImages = [
    '/images/real/showroom/IMG_9774.png',
    '/images/real/showroom/IMG_9775.png',
    '/images/real/showroom/IMG_9776.png',
    '/images/real/showroom/IMG_9777.png',
    '/images/real/showroom/IMG_9778.png',
    '/images/real/showroom/IMG_9779.png',
    '/images/real/showroom/IMG_9780.png',
    '/images/real/showroom/IMG_9781.png',
    '/images/real/showroom/IMG_9782.png',
    '/images/real/showroom/IMG_9784.png',
    '/images/real/showroom/IMG_9785.png',
    '/images/real/showroom/IMG_9786.png',
    '/images/real/showroom/IMG_9787.png',
    '/images/real/showroom/IMG_9788.png',
    '/images/real/showroom/IMG_9789.png',
    '/images/real/showroom/IMG_9790.png',
    '/images/real/showroom/IMG_9791.png',
    '/images/real/showroom/IMG_9792.png',
    '/images/real/showroom/IMG_9793.png',
    '/images/real/showroom/IMG_9794.png',
    '/images/real/showroom/IMG_9795.png',
    '/images/real/showroom/IMG_9796.png',
    '/images/real/showroom/IMG_9797.png',
    '/images/real/showroom/IMG_9798.png',
    '/images/real/showroom/IMG_9799.png',
];

/* ==========================================================================
   Hero Data
   ========================================================================== */

/**
 * Hero section content
 * ✅ Using confirmed slogan: "Votre Partenaire Qualité"
 * Vision initiale intégrée dans le subtitle
 */
export const heroContent = {
    eyebrow: 'Notre Histoire',
    slogan: 'Votre Partenaire Qualité',
    title: 'Depuis 1975, une histoire de famille et de confiance',
    subtitle: 'Répondre aux besoins croissants des habitants de la région en matière de matériaux de construction, en proposant des produits fiables, durables et accessibles. Notre objectif : être un partenaire de confiance pour les particuliers et les professionnels.',
};

/**
 * CTA section content
 * ✅ Using confirmed CTA: "Visiter le Catalogue"
 */
export const ctaContent = {
    title: 'Prêt à concrétiser votre projet ?',
    subtitle: 'Rejoignez les centaines d\'entreprises qui nous font confiance. Découvrez notre catalogue de produits de qualité.',
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
 * Pending items tracking
 */
export const pendingItems = {
    timeline: false, // ✅ Complété
    showroomPhotos: false, // ✅ 25 images disponibles
    certificationBeton: true, // ⏳ En attente
};
