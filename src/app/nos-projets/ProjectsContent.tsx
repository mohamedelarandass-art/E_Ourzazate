/**
 * Projects Content Component
 * 
 * Client component for the Nos Projets page.
 * 
 * Design: Clean grid layout with image carousels per project,
 * organized by category sections with gold underlined titles.
 * Hero features a prominent "12" centerpiece with secondary stats.
 * 
 * Based on client reference design.
 * 
 * @module app/nos-projets/ProjectsContent
 */

'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { CountUp } from '@/components/ui';
import {
    projects,
    projectCategories,
    type Project,
    type ProjectCategory,
} from '@/data';
import styles from './page.module.css';

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
 * ProjectCard Component
 * 
 * Displays a project with image carousel and navigation arrows.
 * Based on client reference design.
 */
interface ProjectCardProps {
    project: Project;
    index: number;
    isVisible: boolean;
}

function ProjectCard({ project, index, isVisible }: ProjectCardProps) {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const images = project.images;
    const hasMultipleImages = images.length > 1;

    const nextImage = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
        setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, [images.length]);

    const prevImage = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
        setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    }, [images.length]);

    return (
        <article
            className={styles.projectCard}
            data-visible={isVisible}
            style={{ animationDelay: `${index * 100}ms` }}
        >
            {/* Image Container */}
            <div className={styles.projectImageContainer}>
                <Image
                    src={images[currentImageIndex]}
                    alt={project.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className={styles.projectImage}
                    unoptimized // For external Unsplash images
                />

                {/* Navigation Arrows */}
                {hasMultipleImages && (
                    <>
                        <button
                            className={`${styles.carouselArrow} ${styles.carouselArrowLeft}`}
                            onClick={prevImage}
                            aria-label="Image précédente"
                        >
                            <ChevronLeft size={20} />
                        </button>
                        <button
                            className={`${styles.carouselArrow} ${styles.carouselArrowRight}`}
                            onClick={nextImage}
                            aria-label="Image suivante"
                        >
                            <ChevronRight size={20} />
                        </button>

                        {/* Dot Indicators */}
                        <div className={styles.carouselDots}>
                            {images.map((_, i) => (
                                <button
                                    key={i}
                                    className={`${styles.carouselDot} ${i === currentImageIndex ? styles.carouselDotActive : ''}`}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setCurrentImageIndex(i);
                                    }}
                                    aria-label={`Aller à l'image ${i + 1}`}
                                />
                            ))}
                        </div>
                    </>
                )}
            </div>

            {/* Project Name */}
            <h3 className={styles.projectName}>{project.name}</h3>
        </article>
    );
}

/**
 * CategorySection Component
 * 
 * Displays a category with title and grid of projects.
 */
interface CategorySectionProps {
    category: ProjectCategory;
    categoryProjects: Project[];
    isVisible: boolean;
}

function CategorySection({ category, categoryProjects, isVisible }: CategorySectionProps) {
    const categoryInfo = projectCategories[category];

    return (
        <section className={styles.categorySection} data-visible={isVisible}>
            {/* Category Title with Gold Underline */}
            <header className={styles.categoryHeader}>
                <h2 className={styles.categoryTitle}>{categoryInfo.label}</h2>
                <div className={styles.categoryUnderline} aria-hidden="true" />
            </header>

            {/* Projects Grid */}
            <div className={styles.projectsGrid}>
                {categoryProjects.map((project, index) => (
                    <ProjectCard
                        key={project.id}
                        project={project}
                        index={index}
                        isVisible={isVisible}
                    />
                ))}
            </div>
        </section>
    );
}

/* ==========================================================================
   Main Component
   ========================================================================== */

export function ProjectsContent() {
    // Section visibility states for animations
    const heroSection = useScrollAnimation(0.1);
    const energieSection = useScrollAnimation(0.15);
    const hotellerieSection = useScrollAnimation(0.15);
    const infrastructureSection = useScrollAnimation(0.15);
    const commerceSection = useScrollAnimation(0.15);

    // Group projects by category
    const energieProjects = projects.filter(p => p.category === 'energie');
    const hotellerieProjects = projects.filter(p => p.category === 'hotellerie');
    const infrastructureProjects = projects.filter(p => p.category === 'infrastructure');
    const commerceProjects = projects.filter(p => p.category === 'commerce');

    return (
        <>
            {/* ============================================
                SECTION 1: HERO with Centerpiece "12"
            ============================================ */}
            <section
                ref={heroSection.ref as React.RefObject<HTMLElement>}
                className={styles.hero}
                aria-labelledby="projects-hero-title"
            >
                <div className={styles.heroContent} data-visible={heroSection.isVisible}>
                    {/* Page Title */}
                    <h1 id="projects-hero-title" className={styles.heroTitle}>
                        Nos Réalisations
                    </h1>

                    {/* Centerpiece: The "12" */}
                    <div className={styles.centerpiece}>
                        <div className={styles.centerpieceNumber}>
                            <CountUp
                                to={12}
                                from={0}
                                duration={1.2}
                                delay={0.3}
                                startWhen={heroSection.isVisible}
                            />
                        </div>
                        <div className={styles.centerpieceLabel}>
                            Projets d&apos;Exception
                        </div>
                    </div>

                    {/* Subtitle */}
                    <p className={styles.heroSubtitle}>
                        De la centrale solaire NOOR aux plus beaux hôtels de la région
                    </p>

                    {/* Secondary Stats Row */}
                    <div className={styles.statsRow}>
                        {/* Experience */}
                        <div className={styles.statItem}>
                            <div className={styles.statValue}>
                                <CountUp
                                    to={50}
                                    from={0}
                                    duration={1}
                                    delay={0.5}
                                    suffix="+"
                                    startWhen={heroSection.isVisible}
                                />
                            </div>
                            <div className={styles.statLabel}>Ans d&apos;Expérience</div>
                        </div>

                        <div className={styles.statDivider} aria-hidden="true" />

                        {/* Sectors */}
                        <div className={styles.statItem}>
                            <div className={styles.statValue}>
                                <CountUp
                                    to={5}
                                    from={0}
                                    duration={0.8}
                                    delay={0.7}
                                    startWhen={heroSection.isVisible}
                                />
                            </div>
                            <div className={styles.statLabel}>Secteurs d&apos;Activité</div>
                        </div>

                        <div className={styles.statDivider} aria-hidden="true" />

                        {/* Clients */}
                        <div className={styles.statItem}>
                            <div className={styles.statValue}>
                                <CountUp
                                    to={100}
                                    from={0}
                                    duration={1}
                                    delay={0.9}
                                    suffix="%"
                                    startWhen={heroSection.isVisible}
                                />
                            </div>
                            <div className={styles.statLabel}>Clients Satisfaits</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ============================================
                SECTION 2: PROJECTS BY CATEGORY
            ============================================ */}
            <div className={styles.categoriesContainer}>
                {/* Énergie */}
                <div ref={energieSection.ref as React.RefObject<HTMLDivElement>}>
                    <CategorySection
                        category="energie"
                        categoryProjects={energieProjects}
                        isVisible={energieSection.isVisible}
                    />
                </div>

                {/* Hôtellerie */}
                <div ref={hotellerieSection.ref as React.RefObject<HTMLDivElement>}>
                    <CategorySection
                        category="hotellerie"
                        categoryProjects={hotellerieProjects}
                        isVisible={hotellerieSection.isVisible}
                    />
                </div>

                {/* Infrastructure */}
                <div ref={infrastructureSection.ref as React.RefObject<HTMLDivElement>}>
                    <CategorySection
                        category="infrastructure"
                        categoryProjects={infrastructureProjects}
                        isVisible={infrastructureSection.isVisible}
                    />
                </div>

                {/* Commerce */}
                <div ref={commerceSection.ref as React.RefObject<HTMLDivElement>}>
                    <CategorySection
                        category="commerce"
                        categoryProjects={commerceProjects}
                        isVisible={commerceSection.isVisible}
                    />
                </div>
            </div>
        </>
    );
}
