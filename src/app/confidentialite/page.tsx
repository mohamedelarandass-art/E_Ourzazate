/**
 * Politique de Confidentialité (Privacy Policy) Page
 * 
 * Complete privacy policy page compliant with Moroccan Law 09-08
 * regarding the protection of personal data.
 * 
 * ============================================================================
 * ⚠️  TODO: DEVELOPER REMINDER - THIS PAGE REQUIRES COMPLETION
 * ============================================================================
 * 
 * The following sections contain placeholder/default values that MUST be
 * reviewed and updated according to actual business practices:
 * 
 * 1. [ ] Data collection methods (forms, cookies, analytics)
 * 2. [ ] Third-party services used (Google Analytics, Facebook Pixel, etc.)
 * 3. [ ] Data retention periods (currently set to 3 years as default)
 * 4. [ ] Marketing practices (newsletters, promotional emails)
 * 5. [ ] Cookie policy details
 * 6. [ ] Data sharing with partners
 * 
 * Search for "TODO:", "REVIEW:", or "PLACEHOLDER:" comments to find areas
 * requiring attention.
 * 
 * Last reviewed: January 2026
 * ============================================================================
 * 
 * @module app/confidentialite
 */

import type { Metadata } from 'next';
import Link from 'next/link';
import { Home, ChevronRight } from 'lucide-react';
import { Header, Footer } from '@/components';
import { PrivacyContent } from './PrivacyContent';
import styles from './page.module.css';

/**
 * SEO Metadata
 */
export const metadata: Metadata = {
    title: 'Politique de Confidentialité | Equipement Ouarzazate',
    description: 'Politique de confidentialité et protection des données personnelles d\'Equipement Ouarzazate. Conformité Loi 09-08 Maroc. Découvrez comment nous protégeons vos informations.',
    openGraph: {
        title: 'Politique de Confidentialité | Equipement Ouarzazate',
        description: 'Notre engagement pour la protection de vos données personnelles. Conformité à la législation marocaine.',
        type: 'website',
    },
    keywords: [
        'politique de confidentialité',
        'protection données',
        'RGPD Maroc',
        'Loi 09-08',
        'CNDP',
        'Equipement Ouarzazate',
        'vie privée',
    ],
};

/**
 * Privacy Policy Page Component (Server)
 * 
 * Server component that handles metadata and layout.
 * All content is delegated to the PrivacyContent client component.
 */
export default function PrivacyPolicyPage() {
    return (
        <div className={styles.page}>
            <Header />

            <main className={styles.main}>
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
                            <span className={styles.breadcrumbCurrent}>Politique de Confidentialité</span>
                        </li>
                    </ol>
                </nav>

                {/* Page Header */}
                <header className={styles.header}>
                    <div className={styles.headerIcon}>
                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className={styles.shieldIcon}
                        >
                            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                            <path d="M9 12l2 2 4-4" />
                        </svg>
                    </div>
                    <h1 className={styles.title}>Politique de Confidentialité</h1>
                    <p className={styles.subtitle}>
                        Notre engagement pour la protection de vos données personnelles
                    </p>
                    <div className={styles.headerMeta}>
                        <span className={styles.metaItem}>
                            <span className={styles.metaBadge}>Loi 09-08</span>
                            Conforme à la législation marocaine
                        </span>
                    </div>
                </header>

                {/* Privacy Content */}
                <PrivacyContent />
            </main>

            <Footer />
        </div>
    );
}
