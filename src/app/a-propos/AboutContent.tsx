/**
 * About Content Component
 * 
 * Client component containing all interactive sections for the À Propos page.
 * 
 * Sections:
 * 1. Hero - Company tagline with slogan "Votre Partenaire Qualité"
 * 2. Timeline - Minimal timeline (pending detailed data from client)
 * 3. Director Message - Text-centric message from Brahim Amcassou
 * 4. Values - Core company values (Qualité, Service Client, Innovation)
 * 5. Projects - Nos Réalisations: 12 prestigious projects
 * 6. CTA - Call to action for catalogue/contact
 * 
 * @module app/a-propos/AboutContent
 */

'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
    Award,
    Users,
    Lightbulb,
    ArrowRight,
    MessageCircle,
    Quote,
    Building2,
    CheckCircle,
    Star,
    Zap,
    Building,
    Construction,
    ShoppingCart,
    LucideIcon,
    Heart,
    Calendar,
} from 'lucide-react';
import { Button, SpotlightCard } from '@/components/ui';
import { getWhatsAppLink } from '@/config';
import {
    timeline,
    timelinePending,
    values,
    projects,
    projectCategories,
    director,
    socialProofStats,
    certifications,
    heroContent,
    ctaContent,
    type TimelineItem,
    type Value,
    type Project,
    type ProjectCategory,
} from '@/data';
import styles from './page.module.css';

/* ==========================================================================
   Icon Mapping
   ========================================================================== */

const valueIconMap: Record<Value['icon'], LucideIcon> = {
    Award,
    Users,
    Lightbulb,
    Heart,
    Star,
    Shield: Award,
};

const projectCategoryIconMap: Record<ProjectCategory, LucideIcon> = {
    energie: Zap,
    hotellerie: Building,
    infrastructure: Construction,
    commerce: ShoppingCart,
};

/* ==========================================================================
   Custom Hooks
   ========================================================================== */

/**
 * Hook for scroll-triggered visibility animations
 */
function useScrollAnimation(threshold = 0.2) {
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef<HTMLElement>(null);

    useEffect(() => {
        const element = ref.current;
        if (!element) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect();
                }
            },
            { threshold }
        );

        observer.observe(element);
        return () => observer.disconnect();
    }, [threshold]);

    return { ref, isVisible };
}

/* ==========================================================================
   Sub-Components
   ========================================================================== */

/**
 * Timeline Item Component
 */
interface TimelineItemProps {
    item: TimelineItem;
    index: number;
    isVisible: boolean;
}

function TimelineItemCard({ item, index, isVisible }: TimelineItemProps) {
    const position = index % 2 === 0 ? 'left' : 'right';

    return (
        <article
            className={styles.timelineItem}
            data-position={position}
            data-visible={isVisible}
            style={{ animationDelay: `${index * 150}ms` }}
        >
            {/* Year Badge */}
            <div className={styles.timelineYearBadge}>
                <span>{item.year}</span>
            </div>

            {/* Content Card */}
            <div className={styles.timelineCard}>
                {/* Icon Placeholder */}
                <div className={styles.timelineImageWrapper}>
                    <div className={styles.timelineImagePlaceholder}>
                        <Calendar size={28} />
                    </div>
                </div>

                {/* Text Content */}
                <div className={styles.timelineContent}>
                    <h3 className={styles.timelineTitle}>{item.title}</h3>
                    <p className={styles.timelineDescription}>{item.description}</p>
                </div>
            </div>
        </article>
    );
}

/**
 * Value Card Component
 */
interface ValueCardProps {
    value: Value;
    index: number;
    isVisible: boolean;
}

function ValueCard({ value, index, isVisible }: ValueCardProps) {
    const Icon = valueIconMap[value.icon] || Award;

    return (
        <article
            className={styles.valueCard}
            data-visible={isVisible}
            style={{ animationDelay: `${index * 100}ms` }}
        >
            <div className={styles.valueCardInner}>
                {/* Icon */}
                <div className={styles.valueIconWrapper}>
                    <div className={styles.valueIconGlow} aria-hidden="true" />
                    <Icon size={28} className={styles.valueIcon} aria-hidden="true" />
                </div>

                {/* Content */}
                <h3 className={styles.valueTitle}>{value.title}</h3>
                <p className={styles.valueDescription}>{value.description}</p>
            </div>

            {/* Decorative border */}
            <div className={styles.valueBorderGradient} aria-hidden="true" />
        </article>
    );
}

/**
 * Spotlight Project Card Component
 * 
 * Uses SpotlightCard for an interactive hover effect.
 * Category-specific spotlight colors for visual grouping.
 */
interface SpotlightProjectCardProps {
    project: Project;
    index: number;
    isVisible: boolean;
    featured?: boolean;
}

// Category-specific spotlight colors (all gold-tinted for cohesion)
const categorySpotlightColors: Record<ProjectCategory, string> = {
    energie: 'rgba(255, 193, 7, 0.25)',      // Amber gold (solar energy)
    hotellerie: 'rgba(176, 141, 87, 0.28)',  // Wood gold (luxury)
    infrastructure: 'rgba(139, 119, 101, 0.25)', // Earthy gold (construction)
    commerce: 'rgba(212, 184, 122, 0.25)',   // Light gold (retail)
};

function SpotlightProjectCard({ project, index, isVisible, featured = false }: SpotlightProjectCardProps) {
    const categoryInfo = projectCategories[project.category];
    const Icon = projectCategoryIconMap[project.category];
    const spotlightColor = categorySpotlightColors[project.category];

    return (
        <div
            className={styles.spotlightProjectWrapper}
            data-visible={isVisible}
            data-featured={featured}
            style={{ animationDelay: `${index * 80}ms` }}
        >
            <SpotlightCard
                className={styles.spotlightProjectCard}
                spotlightColor={spotlightColor}
                spotlightIntensity={featured ? 0.7 : 0.55}
                featured={featured}
                radius={featured ? '2xl' : 'xl'}
                size={featured ? 'large' : 'default'}
                glowBorder={featured}
            >
                {/* Category Icon */}
                <div className={styles.spotlightProjectIcon}>
                    <Icon
                        size={featured ? 32 : 24}
                        strokeWidth={1.5}
                        aria-hidden="true"
                    />
                </div>

                {/* Project Name */}
                <h4 className={styles.spotlightProjectName}>
                    {project.name}
                </h4>

                {/* Description (if exists) */}
                {project.description && (
                    <p className={styles.spotlightProjectDescription}>
                        {project.description}
                    </p>
                )}

                {/* Category Label */}
                <span className={styles.spotlightProjectCategory}>
                    {categoryInfo.label}
                </span>

                {/* Featured Badge */}
                {featured && (
                    <div className={styles.featuredBadge}>
                        <Star size={12} fill="currentColor" />
                        <span>Projet Phare</span>
                    </div>
                )}
            </SpotlightCard>
        </div>
    );
}

/* ==========================================================================
   Main Component
   ========================================================================== */

export function AboutContent() {
    // Section visibility states for animations
    const hero = useScrollAnimation(0.1);
    const timelineSection = useScrollAnimation(0.1);
    const directorSection = useScrollAnimation(0.2);
    const valuesSection = useScrollAnimation(0.2);
    const projectsSection = useScrollAnimation(0.15);
    const ctaSection = useScrollAnimation(0.3);

    // Group projects by category for display
    const projectsByCategory = projects.reduce((acc, project) => {
        if (!acc[project.category]) {
            acc[project.category] = [];
        }
        acc[project.category].push(project);
        return acc;
    }, {} as Record<ProjectCategory, Project[]>);

    return (
        <>
            {/* ============================================
                SECTION 1: HERO
            ============================================ */}
            <section
                ref={hero.ref as React.RefObject<HTMLElement>}
                className={styles.hero}
                aria-labelledby="about-title"
            >
                {/* Background */}
                <div className={styles.heroBackground} aria-hidden="true">
                    <Image
                        src="/images/hero/hero-material-texture.png"
                        alt=""
                        fill
                        priority
                        quality={85}
                        sizes="100vw"
                        className={styles.heroBackgroundImage}
                    />
                    <div className={styles.heroOverlay} />
                </div>

                {/* Content */}
                <div className={styles.heroContent} data-visible={hero.isVisible}>
                    {/* Eyebrow */}
                    <span className={styles.eyebrow}>{heroContent.eyebrow}</span>

                    {/* Slogan */}
                    <div className={styles.sloganWrapper}>
                        <span className={styles.slogan}>&quot;{heroContent.slogan}&quot;</span>
                    </div>

                    {/* Gold Accent Line */}
                    <div className={styles.accentLine} aria-hidden="true" />

                    {/* Title */}
                    <h1 id="about-title" className={styles.heroTitle}>
                        {heroContent.title}
                    </h1>

                    {/* Subtitle */}
                    <p className={styles.heroSubtitle}>
                        {heroContent.subtitle}
                    </p>
                </div>
            </section>

            {/* ============================================
                SECTION 2: TIMELINE (Minimal - Pending Data)
            ============================================ */}
            <section
                ref={timelineSection.ref as React.RefObject<HTMLElement>}
                className={styles.timeline}
                aria-labelledby="timeline-title"
            >
                <div className={styles.container}>
                    {/* Section Header */}
                    <header className={styles.sectionHeader}>
                        <span className={styles.eyebrow}>Notre Parcours</span>
                        <h2 id="timeline-title" className={styles.sectionTitle}>
                            Une histoire de famille
                        </h2>
                        <p className={styles.sectionSubtitle}>
                            De notre fondation en 1975 par Brahim Amcassou à aujourd&apos;hui, une passion transmise de génération en génération.
                        </p>
                    </header>

                    {/* Timeline */}
                    <div className={styles.timelineWrapper}>
                        {/* Vertical Line */}
                        <div className={styles.timelineLine} aria-hidden="true" />

                        {/* Timeline Items */}
                        <div className={styles.timelineItems}>
                            {timeline.map((item, index) => (
                                <TimelineItemCard
                                    key={item.id}
                                    item={item}
                                    index={index}
                                    isVisible={timelineSection.isVisible}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Pending Notice */}
                    {timelinePending && (
                        <p className={styles.pendingNotice}>
                            Plus de détails à venir...
                        </p>
                    )}
                </div>
            </section>

            {/* ============================================
                SECTION 3: MESSAGE DU DIRIGEANT (Text Only)
            ============================================ */}
            <section
                ref={directorSection.ref as React.RefObject<HTMLElement>}
                className={styles.director}
                aria-labelledby="director-title"
            >
                <div className={styles.container}>
                    <div className={styles.directorContent} data-visible={directorSection.isVisible}>
                        {/* Section Header */}
                        <header className={styles.sectionHeader}>
                            <span className={styles.eyebrow}>Message du Dirigeant</span>
                            <h2 id="director-title" className={styles.sectionTitle}>
                                Un mot de notre directeur
                            </h2>
                        </header>

                        {/* Message Card */}
                        <div className={styles.directorMessageCard}>
                            <Quote className={styles.directorQuoteIcon} size={48} aria-hidden="true" />

                            {/* Message Text */}
                            <div className={styles.directorMessage}>
                                {director.message.split('\n\n').map((paragraph, index) => (
                                    <p key={index}>{paragraph}</p>
                                ))}
                            </div>

                            {/* Signature */}
                            <footer className={styles.directorSignature}>
                                <div className={styles.directorSignatureLine} aria-hidden="true" />
                                <div className={styles.directorInfo}>
                                    <cite className={styles.directorName}>
                                        {director.name}
                                    </cite>
                                    <span className={styles.directorTitle}>
                                        {director.title}
                                    </span>
                                    <span className={styles.directorGeneration}>
                                        {director.generation}
                                    </span>
                                </div>
                            </footer>
                        </div>
                    </div>
                </div>
            </section>

            {/* ============================================
                SECTION 4: VALUES
            ============================================ */}
            <section
                ref={valuesSection.ref as React.RefObject<HTMLElement>}
                className={styles.values}
                aria-labelledby="values-title"
            >
                {/* Background decoration */}
                <div className={styles.valuesBackground} aria-hidden="true" />

                <div className={styles.container}>
                    {/* Section Header */}
                    <header className={styles.sectionHeader}>
                        <span className={styles.eyebrow}>Nos Valeurs</span>
                        <h2 id="values-title" className={styles.sectionTitle}>
                            Ce qui nous définit
                        </h2>
                        <p className={styles.sectionSubtitle}>
                            Trois piliers fondamentaux guident notre action au quotidien.
                        </p>
                    </header>

                    {/* Values Grid */}
                    <div className={styles.valuesGrid}>
                        {values.map((value, index) => (
                            <ValueCard
                                key={value.id}
                                value={value}
                                index={index}
                                isVisible={valuesSection.isVisible}
                            />
                        ))}
                    </div>
                </div>
            </section>

            {/* ============================================
                SECTION 5: NOS RÉALISATIONS (Projects)
            ============================================ */}
            <section
                ref={projectsSection.ref as React.RefObject<HTMLElement>}
                className={styles.projectsSection}
                aria-labelledby="projects-title"
            >
                <div className={styles.container}>
                    {/* Section Header */}
                    <header className={styles.sectionHeader}>
                        <span className={styles.eyebrow}>Nos Réalisations</span>
                        <h2 id="projects-title" className={styles.sectionTitle}>
                            Des projets prestigieux
                        </h2>
                        <p className={styles.sectionSubtitle}>
                            De la centrale solaire NOOR aux plus beaux hôtels de la région, nous sommes fiers d&apos;avoir contribué à ces réalisations emblématiques.
                        </p>
                    </header>

                    {/* Stats Row */}
                    <div
                        className={styles.statsRow}
                        data-visible={projectsSection.isVisible}
                    >
                        {socialProofStats.map((stat, index) => (
                            <div
                                key={stat.id}
                                className={styles.statItem}
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                <span className={styles.statValue}>{stat.value}</span>
                                <span className={styles.statLabel}>{stat.label}</span>
                            </div>
                        ))}
                    </div>

                    {/* Featured Project - NOOR */}
                    <div className={styles.featuredProjectWrapper}>
                        <SpotlightProjectCard
                            project={projects.find(p => p.id === 'noor')!}
                            index={0}
                            isVisible={projectsSection.isVisible}
                            featured={true}
                        />
                    </div>

                    {/* Projects Grid - All Other Projects */}
                    <div className={styles.spotlightProjectsGrid}>
                        {projects
                            .filter(p => p.id !== 'noor')
                            .map((project, index) => (
                                <SpotlightProjectCard
                                    key={project.id}
                                    project={project}
                                    index={index + 1}
                                    isVisible={projectsSection.isVisible}
                                />
                            ))}
                    </div>

                    {/* Trust Badges */}
                    <div
                        className={styles.trustBadges}
                        data-visible={projectsSection.isVisible}
                    >
                        <div className={styles.trustBadge}>
                            <CheckCircle size={20} />
                            <span>RC: {certifications.rc}</span>
                        </div>
                        <div className={styles.trustBadge}>
                            <CheckCircle size={20} />
                            <span>ICE: {certifications.ice}</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* ============================================
                SECTION 6: CTA - PREMIUM DESIGN
            ============================================ */}
            <section
                ref={ctaSection.ref as React.RefObject<HTMLElement>}
                className={styles.cta}
                aria-labelledby="cta-title"
            >
                {/* Decorative Background */}
                <div className={styles.ctaBackground} aria-hidden="true">
                    <div className={styles.ctaGradientOrb1} />
                    <div className={styles.ctaGradientOrb2} />
                </div>

                <div className={styles.container}>
                    <div
                        className={styles.ctaCard}
                        data-visible={ctaSection.isVisible}
                    >
                        {/* Decorative Corner Accents */}
                        <div className={styles.ctaCornerTL} aria-hidden="true" />
                        <div className={styles.ctaCornerBR} aria-hidden="true" />

                        <div className={styles.ctaContent}>
                            {/* Eyebrow */}
                            <span className={styles.ctaEyebrow}>
                                +17 500 Produits
                            </span>

                            <h2 id="cta-title" className={styles.ctaTitle}>
                                {ctaContent.title}
                            </h2>
                            <p className={styles.ctaSubtitle}>
                                {ctaContent.subtitle}
                            </p>

                            {/* Primary CTA - EMPHASIZED */}
                            <div className={styles.ctaButtonsWrapper}>
                                <Link href={ctaContent.primaryCta.href} className={styles.ctaPrimaryWrapper}>
                                    <button className={styles.ctaPrimaryButton}>
                                        <span className={styles.ctaButtonShimmer} aria-hidden="true" />
                                        <span className={styles.ctaButtonContent}>
                                            <span className={styles.ctaButtonText}>
                                                {ctaContent.primaryCta.text}
                                            </span>
                                            <ArrowRight size={22} className={styles.ctaButtonIcon} />
                                        </span>
                                    </button>
                                </Link>

                                {/* Secondary CTA */}
                                <Button
                                    as="a"
                                    href={getWhatsAppLink('Bonjour ! Je souhaite des informations sur vos produits.')}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    variant="whatsapp"
                                    size="lg"
                                    leftIcon={<MessageCircle size={20} />}
                                    className={styles.ctaSecondaryButton}
                                >
                                    Nous Contacter
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
