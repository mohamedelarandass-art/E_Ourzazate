/**
 * Plan du Site (Sitemap) Page
 * 
 * A visually stunning, professionally designed sitemap page that showcases
 * the complete structure of the Equipement Ouarzazate platform.
 * 
 * Features:
 * - Blueprint-inspired design aesthetic
 * - Animated section cards with glassmorphism
 * - Interactive hover effects
 * - Responsive grid layout
 * - Full dark mode support
 * 
 * @module app/sitemap
 */

import type { Metadata } from 'next';
import Link from 'next/link';
import { Home, ChevronRight } from 'lucide-react';
import { Header, Footer } from '@/components';
import { SitemapContent } from './SitemapContent';
import styles from './page.module.css';

/**
 * SEO Metadata
 */
export const metadata: Metadata = {
    title: 'Plan du Site | Equipement Ouarzazate',
    description: 'Découvrez la structure complète du site Equipement Ouarzazate. Naviguez facilement vers toutes nos pages : catalogue, catégories, contact, FAQ et informations légales.',
    openGraph: {
        title: 'Plan du Site | Equipement Ouarzazate',
        description: 'Accédez rapidement à toutes les sections de notre site. Navigation claire et organisée.',
        type: 'website',
    },
    keywords: [
        'plan du site',
        'sitemap',
        'Equipement Ouarzazate',
        'navigation',
        'catalogue',
        'matériaux construction',
    ],
};

/**
 * Sitemap Page Component (Server)
 * 
 * Server component that handles metadata and layout.
 * All interactive content is delegated to the SitemapContent client component.
 */
export default function SitemapPage() {
    return (
        <div className={styles.page}>
            <Header />

            <main className={styles.main}>
                {/* Blueprint Grid Background */}
                <div className={styles.blueprintGrid} aria-hidden="true" />

                {/* Breadcrumb */}
                <nav className={styles.breadcrumb} aria-label="Fil d'Ariane">
                    <ol className={styles.breadcrumbList}>
                        <li className={styles.breadcrumbItem}>
                            <Link href="/" className={styles.breadcrumbLink}>
                                <Home size={14} />
                                Accueil
                            </Link>
                        </li>
                        <li className={styles.breadcrumbSeparator}>
                            <ChevronRight size={14} />
                        </li>
                        <li className={styles.breadcrumbItem}>
                            <span className={styles.breadcrumbCurrent}>Plan du Site</span>
                        </li>
                    </ol>
                </nav>

                {/* Hero Section */}
                <header className={styles.hero}>
                    <div className={styles.heroIcon}>
                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className={styles.compassIcon}
                        >
                            <circle cx="12" cy="12" r="10" />
                            <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
                        </svg>
                    </div>
                    <h1 className={styles.heroTitle}>Plan du Site</h1>
                    <p className={styles.heroSubtitle}>
                        Naviguez facilement à travers notre univers
                    </p>
                    <div className={styles.heroStats}>
                        <span className={styles.statItem}>
                            <span className={styles.statNumber}>12</span>
                            <span className={styles.statLabel}>Pages</span>
                        </span>
                        <span className={styles.statDivider} />
                        <span className={styles.statItem}>
                            <span className={styles.statNumber}>5</span>
                            <span className={styles.statLabel}>Catégories</span>
                        </span>
                        <span className={styles.statDivider} />
                        <span className={styles.statItem}>
                            <span className={styles.statNumber}>+50</span>
                            <span className={styles.statLabel}>Produits</span>
                        </span>
                    </div>
                </header>

                {/* Sitemap Content (Client Component) */}
                <SitemapContent />

                {/* Footer Note */}
                <footer className={styles.pageFooter}>
                    <p className={styles.footerNote}>
                        Dernière mise à jour : Janvier 2026
                    </p>
                </footer>
            </main>

            <Footer />
        </div>
    );
}
