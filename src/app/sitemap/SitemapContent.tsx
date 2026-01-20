'use client';

/**
 * Sitemap Content Component
 * 
 * Interactive client component that renders the sitemap sections
 * with animations and hover effects.
 * 
 * @module app/sitemap/SitemapContent
 */

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import {
    Home,
    Package,
    HelpCircle,
    FileText,
    ChevronRight,
    Droplets,
    Bath,
    LayoutGrid,
    Lamp,
    Wrench,
    Phone,
    Users,
    MessageCircle,
    Scale,
    Shield,
    Map,
    ExternalLink
} from 'lucide-react';
import styles from './page.module.css';

/**
 * Sitemap section data structure
 */
interface SitemapLink {
    label: string;
    href: string;
    icon?: React.ReactNode;
    isNew?: boolean;
    isExternal?: boolean;
    children?: SitemapLink[];
}

interface SitemapSection {
    id: string;
    icon: React.ReactNode;
    title: string;
    description: string;
    accentColor: 'bronze' | 'emerald' | 'neutral';
    links: SitemapLink[];
}

/**
 * Sitemap sections data
 */
const sitemapSections: SitemapSection[] = [
    {
        id: 'navigation',
        icon: <Home size={28} />,
        title: 'Navigation Principale',
        description: 'Pages essentielles du site',
        accentColor: 'bronze',
        links: [
            { label: 'Accueil', href: '/', icon: <Home size={16} /> },
            { label: 'Catalogue', href: '/catalogue', icon: <Package size={16} /> },
            { label: 'À Propos', href: '/a-propos', icon: <Users size={16} /> },
            { label: 'Contact', href: '/contact', icon: <Phone size={16} /> },
        ],
    },
    {
        id: 'catalogue',
        icon: <Package size={28} />,
        title: 'Catalogue & Catégories',
        description: 'Explorez nos produits par catégorie',
        accentColor: 'emerald',
        links: [
            { label: 'Tous les Produits', href: '/catalogue', icon: <Package size={16} /> },
            {
                label: 'Sanitaire',
                href: '/catalogue/sanitaire',
                icon: <Droplets size={16} />,
            },
            {
                label: 'Meubles SDB',
                href: '/catalogue/meubles-sdb',
                icon: <Bath size={16} />,
            },
            {
                label: 'Carrelage',
                href: '/catalogue/carrelage',
                icon: <LayoutGrid size={16} />,
            },
            {
                label: 'Luminaire',
                href: '/catalogue/luminaire',
                icon: <Lamp size={16} />,
            },
            {
                label: 'Outillage',
                href: '/catalogue/outillage',
                icon: <Wrench size={16} />,
            },
        ],
    },
    {
        id: 'ressources',
        icon: <HelpCircle size={28} />,
        title: 'Ressources & Aide',
        description: 'Trouvez les réponses à vos questions',
        accentColor: 'bronze',
        links: [
            { label: 'Questions Fréquentes', href: '/faq', icon: <HelpCircle size={16} /> },
            { label: 'Contactez-nous', href: '/contact', icon: <MessageCircle size={16} /> },
            { label: 'Notre Histoire', href: '/a-propos', icon: <Users size={16} /> },
            { label: 'Plan du Site', href: '/sitemap', icon: <Map size={16} /> },
        ],
    },
    {
        id: 'legal',
        icon: <FileText size={28} />,
        title: 'Informations Légales',
        description: 'Documents juridiques et mentions',
        accentColor: 'neutral',
        links: [
            { label: 'Mentions Légales', href: '/mentions-legales', icon: <Scale size={16} /> },
            { label: 'Politique de Confidentialité', href: '/confidentialite', icon: <Shield size={16} /> },
        ],
    },
];

/**
 * Section Card Component
 */
function SectionCard({ section, index }: { section: SitemapSection; index: number }) {
    const cardRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const card = cardRef.current;
        if (!card) return;

        // Intersection Observer for staggered animations
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setTimeout(() => {
                            card.classList.add(styles.visible);
                        }, index * 100);
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.1 }
        );

        observer.observe(card);
        return () => observer.disconnect();
    }, [index]);

    return (
        <div
            ref={cardRef}
            className={`${styles.sectionCard} ${styles[section.accentColor]}`}
        >
            {/* Card Header */}
            <div className={styles.cardHeader}>
                <div className={styles.iconContainer}>
                    {section.icon}
                </div>
                <div className={styles.cardInfo}>
                    <h2 className={styles.cardTitle}>{section.title}</h2>
                    <p className={styles.cardDescription}>{section.description}</p>
                </div>
                <span className={styles.linkCount}>{section.links.length}</span>
            </div>

            {/* Card Links */}
            <ul className={styles.linkList}>
                {section.links.map((link, linkIndex) => (
                    <li key={link.href + linkIndex} className={styles.linkItem}>
                        <Link
                            href={link.href}
                            className={styles.link}
                            {...(link.isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                        >
                            <span className={styles.linkIcon}>
                                {link.icon || <ChevronRight size={16} />}
                            </span>
                            <span className={styles.linkLabel}>{link.label}</span>
                            {link.isNew && (
                                <span className={styles.newBadge}>Nouveau</span>
                            )}
                            {link.isExternal && (
                                <ExternalLink size={12} className={styles.externalIcon} />
                            )}
                            <ChevronRight size={14} className={styles.linkArrow} />
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}

/**
 * Sitemap Content Component
 */
export function SitemapContent() {
    return (
        <div className={styles.content}>
            {/* Section Grid */}
            <div className={styles.sectionGrid}>
                {sitemapSections.map((section, index) => (
                    <SectionCard
                        key={section.id}
                        section={section}
                        index={index}
                    />
                ))}
            </div>

            {/* Quick Access Tip */}
            <div className={styles.tipContainer}>
                <div className={styles.tip}>
                    <span className={styles.tipIcon}>💡</span>
                    <p className={styles.tipText}>
                        <strong>Astuce :</strong> Utilisez <kbd>Ctrl</kbd> + <kbd>K</kbd> pour une recherche rapide sur le site.
                    </p>
                </div>
            </div>
        </div>
    );
}
