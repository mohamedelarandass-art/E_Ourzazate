/**
 * FAQ Page
 * 
 * Frequently Asked Questions page with collapsible accordions organized by category.
 * Features:
 * - Hero section with title and subtitle
 * - Category tabs for filtering
 * - Accordion-based FAQ items
 * - CTA section for unanswered questions
 * 
 * @module app/faq
 */

import type { Metadata } from 'next';
import Link from 'next/link';
import { Home, ChevronRight } from 'lucide-react';
import { Header, Footer } from '@/components';
import { FAQContent } from './FAQContent';
import styles from './page.module.css';

/**
 * SEO Metadata
 */
export const metadata: Metadata = {
    title: 'Questions Fréquentes | Equipement Ouarzazate',
    description: 'Trouvez rapidement les réponses à vos questions sur les prix, commandes, livraison et services d\'Equipement Ouarzazate. FAQ complète sur nos matériaux de construction.',
    openGraph: {
        title: 'Questions Fréquentes | Equipement Ouarzazate',
        description: 'Tout ce que vous devez savoir sur nos produits, prix, livraison et services. Réponses rapides à vos questions.',
        type: 'website',
    },
};

/**
 * FAQ Page Component (Server)
 */
export default function FAQPage() {
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
                            <span className={styles.breadcrumbCurrent}>FAQ</span>
                        </li>
                    </ol>
                </nav>

                {/* Hero Section */}
                <header className={styles.hero}>
                    <h1 className={styles.heroTitle}>Questions Fréquentes</h1>
                    <p className={styles.heroSubtitle}>
                        Trouvez rapidement les réponses à vos questions
                    </p>
                </header>

                {/* FAQ Content (Client Component) */}
                <FAQContent />
            </main>

            <Footer />
        </div>
    );
}
