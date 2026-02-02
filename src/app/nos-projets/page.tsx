/**
 * Nos Projets Page
 * 
 * Dedicated page showcasing 12 prestigious projects.
 * Features:
 * - Hero section with animated stats
 * - Featured project (NOOR)
 * - Projects grouped by category
 * - Trust badges and certifications
 * 
 * @module app/nos-projets
 */

import type { Metadata } from 'next';
import { Header, Footer } from '@/components';
import { ProjectsContent } from './ProjectsContent';
import styles from './page.module.css';

/**
 * SEO Metadata
 */
export const metadata: Metadata = {
    title: 'Nos Projets | Equipement Ouarzazate',
    description: 'Découvrez nos 12 projets prestigieux: du Complexe Solaire NOOR aux plus beaux hôtels de la région. Plus de 50 ans d\'expertise au service des grands projets.',
    openGraph: {
        title: 'Nos Projets | Equipement Ouarzazate',
        description: 'Nos réalisations emblématiques: NOOR, Berber Palace, Aéroport Ouarzazate et plus encore.',
        type: 'website',
    },
    keywords: [
        'projets Ouarzazate',
        'NOOR solaire',
        'Berber Palace',
        'construction Maroc',
        'matériaux BTP',
        'réalisations prestigieuses',
    ],
};

/**
 * Nos Projets Page Component (Server)
 * 
 * Server component that handles metadata and layout.
 * All interactive content is delegated to the ProjectsContent client component.
 */
export default function ProjectsPage() {
    return (
        <div className={styles.page}>
            <Header />
            <main className={styles.main}>
                <ProjectsContent />
            </main>
            <Footer />
        </div>
    );
}
