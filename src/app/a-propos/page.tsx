/**
 * À Propos Page
 * 
 * Company history, values, and team presentation.
 * Features:
 * - Company heritage story (1975-present)
 * - Core values presentation
 * - Founder/team section
 * - Customer testimonials
 * - Social proof statistics
 * 
 * [MOCKUP DATA] - All placeholder content is marked with [MOCKUP]
 * comments in the data files for easy replacement.
 * 
 * @module app/a-propos
 */

import type { Metadata } from 'next';
import { Header, Footer } from '@/components';
import { AboutContent } from './AboutContent';
import styles from './page.module.css';

/**
 * SEO Metadata
 */
export const metadata: Metadata = {
    title: 'À Propos | Equipement Ouarzazate',
    description: 'Découvrez l\'histoire d\'Equipement Ouarzazate, votre partenaire en matériaux de construction depuis 1975. Plus de 50 ans d\'expertise au service de vos projets dans la région de Ouarzazate.',
    openGraph: {
        title: 'À Propos | Equipement Ouarzazate',
        description: 'Notre histoire, nos valeurs, notre équipe. Depuis 1975, nous façonnons l\'excellence dans les matériaux de construction.',
        type: 'website',
    },
    keywords: [
        'Equipement Ouarzazate',
        'histoire',
        'à propos',
        'matériaux construction',
        'depuis 1975',
        'Ouarzazate',
        'Maroc',
    ],
};

/**
 * À Propos Page Component (Server)
 * 
 * Server component that handles metadata and layout.
 * All interactive content is delegated to the AboutContent client component.
 */
export default function AboutPage() {
    return (
        <div className={styles.page}>
            <Header />
            <main className={styles.main}>
                <AboutContent />
            </main>
            <Footer />
        </div>
    );
}
