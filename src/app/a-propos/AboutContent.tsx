/**
 * About Content Component
 * 
 * Client component containing all interactive sections for the À Propos page.
 * 
 * Sections:
 * 1. Hero - Company tagline and heritage message
 * 2. Timeline - Vertical timeline of company history
 * 3. Founder - Founder portrait and quote
 * 4. Values - Core company values (3 cards)
 * 5. Social Proof - Statistics and testimonials
 * 6. CTA - Call to action for catalogue/contact
 * 
 * All mockup data is imported from @/data/about and marked
 * with [MOCKUP] comments for easy replacement.
 * 
 * @module app/a-propos/AboutContent
 */

'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
    Award,
    MapPin,
    Users,
    ArrowRight,
    MessageCircle,
    Quote,
    Building2,
    CheckCircle,
    Star,
    LucideIcon,
} from 'lucide-react';
import { Button } from '@/components/ui';
import { getWhatsAppLink } from '@/config';
import {
    timeline,
    values,
    testimonials,
    founder,
    socialProofStats,
    certifications,
    heroContent,
    ctaContent,
    type TimelineItem,
    type Value,
    type Testimonial,
} from '@/data';
import styles from './page.module.css';

/* ==========================================================================
   Icon Mapping
   ========================================================================== */

const iconMap: Record<Value['icon'], LucideIcon> = {
    Award,
    MapPin,
    Users,
    Shield: Award, // Fallback
    Heart: Star,   // Fallback
    Star,
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
                {/* Image Placeholder */}
                <div className={styles.timelineImageWrapper}>
                    <div className={styles.timelineImagePlaceholder}>
                        <Building2 size={32} />
                        <span>{item.year}</span>
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
    const Icon = iconMap[value.icon] || Award;

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
 * Testimonial Card Component
 */
interface TestimonialCardProps {
    testimonial: Testimonial;
    index: number;
    isVisible: boolean;
}

function TestimonialCard({ testimonial, index, isVisible }: TestimonialCardProps) {
    return (
        <article
            className={styles.testimonialCard}
            data-visible={isVisible}
            style={{ animationDelay: `${index * 100}ms` }}
        >
            <Quote className={styles.testimonialQuoteIcon} size={24} aria-hidden="true" />

            <blockquote className={styles.testimonialQuote}>
                "{testimonial.quote}"
            </blockquote>

            <footer className={styles.testimonialFooter}>
                {/* Avatar Placeholder */}
                <div className={styles.testimonialAvatar}>
                    <span>{testimonial.name.charAt(0)}</span>
                </div>

                <div className={styles.testimonialAuthor}>
                    <cite className={styles.testimonialName}>{testimonial.name}</cite>
                    <span className={styles.testimonialCompany}>{testimonial.company}</span>
                </div>
            </footer>
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
    const founderSection = useScrollAnimation(0.2);
    const valuesSection = useScrollAnimation(0.2);
    const socialProofSection = useScrollAnimation(0.2);
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
                SECTION 2: TIMELINE
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
                            50 ans d'histoire et d'engagement
                        </h2>
                        <p className={styles.sectionSubtitle}>
                            De notre fondation en 1975 à aujourd'hui, découvrez les moments clés qui ont façonné notre entreprise.
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
                </div>
            </section>

            {/* ============================================
                SECTION 3: FOUNDER
            ============================================ */}
            <section
                ref={founderSection.ref as React.RefObject<HTMLElement>}
                className={styles.founder}
                aria-labelledby="founder-title"
            >
                <div className={styles.container}>
                    <div className={styles.founderGrid} data-visible={founderSection.isVisible}>
                        {/* Image Column */}
                        <div className={styles.founderImageColumn}>
                            <div className={styles.founderImageWrapper}>
                                {/* Placeholder for founder image */}
                                <div className={styles.founderImagePlaceholder}>
                                    <Users size={64} />
                                    <span>Portrait</span>
                                </div>

                                {/* Decorative frame */}
                                <div className={styles.founderImageFrame} aria-hidden="true" />
                            </div>
                        </div>

                        {/* Quote Column */}
                        <div className={styles.founderQuoteColumn}>
                            <div className={styles.founderQuoteCard}>
                                <Quote className={styles.founderQuoteIcon} size={48} aria-hidden="true" />

                                <blockquote className={styles.founderQuote}>
                                    <p>{founder.quote}</p>
                                </blockquote>

                                <footer className={styles.founderSignature}>
                                    <div className={styles.founderSignatureLine} aria-hidden="true" />
                                    <cite className={styles.founderName}>
                                        {founder.name}
                                    </cite>
                                    <span className={styles.founderTitle}>
                                        {founder.title}
                                    </span>
                                </footer>
                            </div>
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
                SECTION 5: SOCIAL PROOF
            ============================================ */}
            <section
                ref={socialProofSection.ref as React.RefObject<HTMLElement>}
                className={styles.socialProof}
                aria-labelledby="social-proof-title"
            >
                <div className={styles.container}>
                    {/* Section Header */}
                    <header className={styles.sectionHeader}>
                        <span className={styles.eyebrow}>Ils nous font confiance</span>
                        <h2 id="social-proof-title" className={styles.sectionTitle}>
                            Des chiffres qui parlent
                        </h2>
                    </header>

                    {/* Stats Row */}
                    <div
                        className={styles.statsRow}
                        data-visible={socialProofSection.isVisible}
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

                    {/* Testimonials Grid */}
                    <div className={styles.testimonialsGrid}>
                        {testimonials.map((testimonial, index) => (
                            <TestimonialCard
                                key={testimonial.id}
                                testimonial={testimonial}
                                index={index}
                                isVisible={socialProofSection.isVisible}
                            />
                        ))}
                    </div>

                    {/* Trust Badges */}
                    <div
                        className={styles.trustBadges}
                        data-visible={socialProofSection.isVisible}
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
                SECTION 6: CTA
            ============================================ */}
            <section
                ref={ctaSection.ref as React.RefObject<HTMLElement>}
                className={styles.cta}
                aria-labelledby="cta-title"
            >
                <div className={styles.container}>
                    <div
                        className={styles.ctaContent}
                        data-visible={ctaSection.isVisible}
                    >
                        <h2 id="cta-title" className={styles.ctaTitle}>
                            {ctaContent.title}
                        </h2>
                        <p className={styles.ctaSubtitle}>
                            {ctaContent.subtitle}
                        </p>

                        <div className={styles.ctaButtons}>
                            <Link href={ctaContent.primaryCta.href}>
                                <Button
                                    variant="primary"
                                    size="lg"
                                    rightIcon={<ArrowRight size={20} />}
                                    className={styles.ctaPrimaryButton}
                                >
                                    {ctaContent.primaryCta.text}
                                </Button>
                            </Link>

                            <Button
                                as="a"
                                href={getWhatsAppLink('Bonjour ! Je souhaite des informations sur vos produits.')}
                                target="_blank"
                                rel="noopener noreferrer"
                                variant="whatsapp"
                                size="lg"
                                leftIcon={<MessageCircle size={20} />}
                            >
                                Contacter par WhatsApp
                            </Button>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
