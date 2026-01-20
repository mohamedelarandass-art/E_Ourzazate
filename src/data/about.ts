/**
 * About Page Data
 * 
 * Contains all data for the À Propos page including:
 * - Company timeline milestones
 * - Core values
 * - Testimonials
 * - Founder information
 * 
 * [MOCKUP DATA] - All content marked with [MOCKUP] should be
 * replaced with actual client information when available.
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
    icon: 'Award' | 'MapPin' | 'Users' | 'Shield' | 'Heart' | 'Star';
    /** Value title */
    title: string;
    /** Value description */
    description: string;
}

/**
 * Customer testimonial
 */
export interface Testimonial {
    /** Unique identifier */
    id: string;
    /** Customer name */
    name: string;
    /** Customer company or role */
    company: string;
    /** Testimonial quote */
    quote: string;
    /** Optional avatar image path */
    avatar?: string;
}

/**
 * Founder information
 */
export interface FounderInfo {
    /** Founder's name */
    name: string;
    /** Founder's title */
    title: string;
    /** Inspirational quote */
    quote: string;
    /** Optional portrait image path */
    image?: string;
}

/* ==========================================================================
   Timeline Data
   ========================================================================== */

/**
 * Company history timeline
 * [MOCKUP] - Replace with client's actual history
 */
export const timeline: TimelineItem[] = [
    {
        id: 'founding',
        year: '1975',
        title: 'Les Fondations', // [MOCKUP]
        description: 'Ouverture du premier magasin à Ouarzazate par Hassan Ait. Une vision simple: fournir des matériaux de qualité aux artisans et constructeurs de la région.', // [MOCKUP]
        image: '/images/about/timeline-1975.jpg', // [MOCKUP] - Placeholder
    },
    {
        id: 'expansion',
        year: '1985',
        title: 'Expansion Régionale', // [MOCKUP]
        description: 'Equipement Ouarzazate devient un acteur clé dans le Sud marocain. Élargissement de la gamme de produits et premiers partenariats avec des marques internationales.', // [MOCKUP]
        image: '/images/about/timeline-1985.jpg', // [MOCKUP] - Placeholder
    },
    {
        id: 'generation',
        year: '1995',
        title: 'Nouvelle Génération', // [MOCKUP]
        description: 'Intégration de la deuxième génération et modernisation de l\'entreprise. Introduction de nouvelles catégories: luminaires et électroménager.', // [MOCKUP]
        image: '/images/about/timeline-1995.jpg', // [MOCKUP] - Placeholder
    },
    {
        id: 'showroom',
        year: '2010',
        title: 'La Vision d\'Aujourd\'hui', // [MOCKUP]
        description: 'Inauguration du nouveau showroom dédié au design et à l\'aménagement intérieur. Plus de 17 500 références disponibles.', // [MOCKUP]
        image: '/images/about/timeline-2010.jpg', // [MOCKUP] - Placeholder
    },
    {
        id: 'innovation',
        year: '2023',
        title: 'L\'Innovation Continue', // [MOCKUP]
        description: 'Partenaire de confiance pour les architectes et designers. Plus de 300 marques partenaires et une équipe de 185 collaborateurs dévoués.', // [MOCKUP]
        image: '/images/about/timeline-2023.jpg', // [MOCKUP] - Placeholder
    },
] as const;

/* ==========================================================================
   Values Data
   ========================================================================== */

/**
 * Company core values
 * [MOCKUP] - Replace with client's actual values
 */
export const values: Value[] = [
    {
        id: 'quality',
        icon: 'Award',
        title: 'Qualité', // [MOCKUP]
        description: 'Notre engagement pour l\'excellence se reflète dans chaque produit que nous sélectionnons. Nous ne proposons que des matériaux qui répondent à nos standards exigeants.', // [MOCKUP]
    },
    {
        id: 'expertise',
        icon: 'MapPin',
        title: 'Expertise Locale', // [MOCKUP]
        description: 'Une connaissance approfondie du marché marocain et des besoins spécifiques de la région. 50 ans d\'expérience au service de vos projets.', // [MOCKUP]
    },
    {
        id: 'service',
        icon: 'Users',
        title: 'Service Client', // [MOCKUP]
        description: 'Accompagnement personnalisé de A à Z. Notre équipe de 185 collaborateurs est à votre écoute pour vous guider dans vos choix.', // [MOCKUP]
    },
] as const;

/* ==========================================================================
   Testimonials Data
   ========================================================================== */

/**
 * Customer testimonials
 * [MOCKUP] - Replace with real customer testimonials
 */
export const testimonials: Testimonial[] = [
    {
        id: 'testimonial-1',
        name: 'Mohammed El Fassi', // [MOCKUP]
        company: 'Architecte DPLG', // [MOCKUP]
        quote: 'Partenaire incontournable pour tous mes projets dans la région. Leur expertise et la qualité de leurs produits font la différence.', // [MOCKUP]
        avatar: '/images/about/avatar-1.jpg', // [MOCKUP] - Placeholder
    },
    {
        id: 'testimonial-2',
        name: 'Fatima Benali', // [MOCKUP]
        company: 'Hôtel Kasbah Rose', // [MOCKUP]
        quote: 'Nous avons entièrement équipé notre hôtel avec Equipement Ouarzazate. Service impeccable et suivi exemplaire.', // [MOCKUP]
        avatar: '/images/about/avatar-2.jpg', // [MOCKUP] - Placeholder
    },
    {
        id: 'testimonial-3',
        name: 'Ahmed Tazi', // [MOCKUP]
        company: 'Promoteur Immobilier', // [MOCKUP]
        quote: 'Plus de 15 ans de collaboration. Leur gamme complète et leurs prix compétitifs en font un allié précieux pour nos chantiers.', // [MOCKUP]
        avatar: '/images/about/avatar-3.jpg', // [MOCKUP] - Placeholder
    },
] as const;

/* ==========================================================================
   Founder Data
   ========================================================================== */

/**
 * Founder information
 * [MOCKUP] - Replace with actual founder information
 */
export const founder: FounderInfo = {
    name: 'Hassan Ait', // [MOCKUP]
    title: 'Fondateur', // [MOCKUP]
    quote: 'La qualité n\'est pas un acte, c\'est une habitude. Depuis 1975, nous construisons chaque jour sur cette conviction.', // [MOCKUP]
    image: '/images/about/founder.jpg', // [MOCKUP] - Placeholder
};

/* ==========================================================================
   Social Proof Data
   ========================================================================== */

/**
 * Key statistics for social proof
 */
export const socialProofStats = [
    {
        id: 'clients',
        value: '+16 000',
        label: 'clients satisfaits',
    },
    {
        id: 'experience',
        value: '+50',
        label: 'ans d\'expérience',
    },
    {
        id: 'brands',
        value: '+300',
        label: 'marques partenaires',
    },
] as const;

/**
 * Company certifications/legal info for trust badges
 */
export const certifications = {
    rc: '4433', // Registre de Commerce
    ice: '000125028000047', // ICE
} as const;

/* ==========================================================================
   Hero Data
   ========================================================================== */

/**
 * Hero section content
 * [MOCKUP] - Adjust messaging as needed
 */
export const heroContent = {
    eyebrow: 'Notre Histoire',
    title: 'Depuis 1975, nous façonnons l\'excellence',
    subtitle: 'Plus qu\'un fournisseur, un partenaire de confiance pour tous vos projets de construction et d\'aménagement dans la région de Ouarzazate.',
} as const;

/**
 * CTA section content
 */
export const ctaContent = {
    title: 'Prêt à concrétiser votre projet ?',
    subtitle: 'Découvrez notre catalogue de plus de 17 500 produits ou contactez notre équipe pour un accompagnement personnalisé.',
    primaryCta: {
        text: 'Explorer le Catalogue',
        href: '/catalogue',
    },
    secondaryCta: {
        text: 'Nous Contacter',
        href: '/contact',
    },
} as const;
