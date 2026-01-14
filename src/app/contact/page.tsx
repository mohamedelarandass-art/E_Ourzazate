/**
 * Contact Page
 * 
 * Professional contact page with company information, contact form, and interactive map.
 * Features:
 * - Hero section with business status badge
 * - Contact information cards (glassmorphism)
 * - Interactive contact form with validation
 * - Google Maps integration
 * 
 * @module app/contact
 */

import type { Metadata } from 'next';
import { Header, Footer } from '@/components';
import { ContactContent } from './ContactContent';
import styles from './page.module.css';

/**
 * SEO Metadata
 */
export const metadata: Metadata = {
    title: 'Contact | Equipement Ouarzazate',
    description: 'Contactez Equipement Ouarzazate pour toutes vos questions sur nos meubles et équipements hôteliers. Notre équipe est à votre écoute du lundi au samedi.',
    openGraph: {
        title: 'Contact | Equipement Ouarzazate',
        description: 'Contactez-nous pour vos projets d\'ameublement. Service client disponible par téléphone, WhatsApp ou email.',
        type: 'website',
    },
};

/**
 * Contact Page Component (Server)
 */
export default function ContactPage() {
    return (
        <div className={styles.page}>
            <Header />
            <main className={styles.main}>
                <ContactContent />
            </main>
            <Footer />
        </div>
    );
}
