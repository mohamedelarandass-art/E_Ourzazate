/**
 * About Content Component
 * 
 * Client component containing all interactive sections for the À Propos page.
 * 
 * Sections:
 * 1. Hero - Company tagline with slogan "Votre Partenaire Qualité"
 * 2. Timeline - 10 étapes complètes de 1975 à 2025
 * 3. Director Message - Text-centric message from Brahim Amcassou
 * 4. Differentiation - Nouveau bloc différenciation
 * 5. Values - Core company values (Qualité, Service Client, Innovation)
 * 6. Showroom Gallery - 25 photos du showroom
 * 7. CTA - Call to action for catalogue/contact
 * 
 * Note: Projects section moved to dedicated /nos-projets page.
 * 
 * ✅ DONNÉES FINALES — Version 29 janvier 2026
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
    LucideIcon,
    Heart,
    Calendar,
    Sparkles,
    MapPin,
} from 'lucide-react';
import { Button, CountUp } from '@/components/ui';
import { getWhatsAppLink } from '@/config';
import {
    timeline,
    timelinePending,
    values,
    director,
    heroContent,
    ctaContent,
    differentiationMessage,
    companyMetrics,
    showroomImages,
    type TimelineItem,
    type Value,
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
    Star: Award, // Star mapped to Award as fallback
    Shield: Award,
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

/* ==========================================================================
   Main Component
   ========================================================================== */

export function AboutContent() {
    // Section visibility states for animations
    const hero = useScrollAnimation(0.1);
    const timelineSection = useScrollAnimation(0.1);
    const directorSection = useScrollAnimation(0.2);
    const valuesSection = useScrollAnimation(0.2);
    const showroomSection = useScrollAnimation(0.15);
    const ctaSection = useScrollAnimation(0.3);

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
                SECTION 4: NOTRE DIFFÉRENCIATION
            ============================================ */}
            <section
                className={styles.differentiation}
                aria-labelledby="differentiation-title"
            >
                <div className={styles.container}>
                    <div className={styles.differentiationContent}>
                        {/* Icon */}
                        <div className={styles.differentiationIcon}>
                            <Sparkles size={32} strokeWidth={1.5} />
                        </div>

                        {/* Title */}
                        <h2 id="differentiation-title" className={styles.differentiationTitle}>
                            Ce qui nous différencie
                        </h2>

                        {/* Message */}
                        <p className={styles.differentiationText}>
                            {differentiationMessage}
                        </p>

                        {/* Metrics Row */}
                        <div className={styles.differentiationMetrics}>
                            <div className={styles.differentiationMetric}>
                                <MapPin size={20} strokeWidth={1.5} />
                                <span className={styles.metricValue}>
                                    <CountUp
                                        to={companyMetrics.siteSurface}
                                        from={0}
                                        duration={0.8}
                                        delay={0}
                                        separator=" "
                                        className={styles.metricNumber}
                                    />
                                    <span className={styles.metricUnit}>m²</span>
                                </span>
                                <span className={styles.metricLabel}>de site industriel</span>
                            </div>
                            <div className={styles.differentiationMetricDivider} aria-hidden="true" />
                            <div className={styles.differentiationMetric}>
                                <Building2 size={20} strokeWidth={1.5} />
                                <span className={styles.metricValue}>
                                    <CountUp
                                        to={companyMetrics.showroomSurface}
                                        from={0}
                                        duration={0.6}
                                        delay={0.1}
                                        separator=" "
                                        className={styles.metricNumber}
                                    />
                                    <span className={styles.metricUnit}>m²</span>
                                </span>
                                <span className={styles.metricLabel}>de showroom</span>
                            </div>
                            <div className={styles.differentiationMetricDivider} aria-hidden="true" />
                            <div className={styles.differentiationMetric}>
                                <Users size={20} strokeWidth={1.5} />
                                <span className={styles.metricValue}>
                                    <CountUp
                                        to={companyMetrics.collaborators}
                                        from={0}
                                        duration={0.5}
                                        delay={0.15}
                                        className={styles.metricNumber}
                                    />
                                </span>
                                <span className={styles.metricLabel}>collaborateurs</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ============================================
                SECTION 5: VALUES
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
                SECTION 6: SHOWROOM GALLERY
            ============================================ */}
            <section
                ref={showroomSection.ref as React.RefObject<HTMLElement>}
                className={styles.showroom}
                aria-labelledby="showroom-title"
            >
                <div className={styles.container}>
                    {/* Section Header */}
                    <header className={styles.sectionHeader}>
                        <span className={styles.eyebrow}>Notre Espace</span>
                        <h2 id="showroom-title" className={styles.sectionTitle}>
                            Visitez notre showroom
                        </h2>
                        <p className={styles.sectionSubtitle}>
                            Plus de 1 500 m² d&apos;exposition pour découvrir nos matériaux en situation réelle.
                        </p>
                    </header>

                    {/* Showroom Grid */}
                    <div className={styles.showroomGrid}>
                        {showroomImages.map((imagePath, index) => (
                            <div
                                key={index}
                                className={styles.showroomItem}
                                style={{ animationDelay: `${(index % 6) * 100}ms` }}
                            >
                                <Image
                                    src={imagePath}
                                    alt={`Showroom Equipement Ouarzazate - Vue ${index + 1}`}
                                    fill
                                    sizes="(max-width: 768px) 50vw, 33vw"
                                    className={styles.showroomImage}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ============================================
                SECTION 7: CTA - PREMIUM DESIGN
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
            </section >
        </>
    );
}
