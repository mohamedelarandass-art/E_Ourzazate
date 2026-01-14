/**
 * Admin Dashboard Page
 * 
 * Placeholder admin page for future backend implementation.
 * Shows welcome message and placeholder cards for future features.
 * 
 * @module app/admin/page
 */

import { Metadata } from 'next';
import Link from 'next/link';
import { Package, Grid3x3, MessageSquare, Settings, ArrowLeft, ExternalLink } from 'lucide-react';
import { getSeoMetadata } from '@/config/site';
import { getWhatsAppLink } from '@/config/contact';
import { Button } from '@/components/ui/Button';
import styles from './page.module.css';

/**
 * Metadata for the admin page
 * - noIndex to prevent search engine indexing
 */
export const metadata: Metadata = getSeoMetadata({
    title: 'Administration',
    description: 'Espace d\'administration - Equipement Ouarzazate',
    noIndex: true,
});

/**
 * Placeholder cards for future admin features
 */
const adminFeatures = [
    {
        id: 'products',
        title: 'Produits',
        description: 'Gérer le catalogue de produits',
        icon: Package,
        comingSoon: true,
    },
    {
        id: 'categories',
        title: 'Catégories',
        description: 'Organiser les catégories',
        icon: Grid3x3,
        comingSoon: true,
    },
    {
        id: 'messages',
        title: 'Messages',
        description: 'Messages reçus via le formulaire',
        icon: MessageSquare,
        comingSoon: true,
    },
    {
        id: 'settings',
        title: 'Paramètres',
        description: 'Configuration du site',
        icon: Settings,
        comingSoon: true,
    },
];

/**
 * Quick access links
 */
const quickLinks = [
    {
        id: 'whatsapp',
        title: 'WhatsApp Business',
        description: 'Consulter les messages WhatsApp',
        url: getWhatsAppLink(),
        icon: ExternalLink,
    },
    {
        id: 'gmb',
        title: 'Google My Business',
        description: 'Gérer votre fiche d\'entreprise',
        url: 'https://business.google.com',
        icon: ExternalLink,
    },
];

/**
 * Admin Dashboard Page Component
 */
export default function AdminPage() {
    return (
        <div className={styles.container}>
            {/* Header */}
            <header className={styles.header}>
                <div className={styles.headerContent}>
                    <div className={styles.branding}>
                        <h1 className={styles.brandName}>
                            Equipement Ouarzazate
                            <span className={styles.adminBadge}>Administration</span>
                        </h1>
                    </div>

                    <Button
                        as="a"
                        href="/"
                        variant="outline"
                        size="sm"
                        leftIcon={<ArrowLeft size={18} />}
                        className={styles.backButton}
                    >
                        Retour au site
                    </Button>
                </div>
            </header>

            {/* Main Content */}
            <main className={styles.main}>
                {/* Welcome Section */}
                <section className={styles.welcome}>
                    <div className={styles.welcomeGlow} aria-hidden="true" />
                    <h2 className={styles.welcomeTitle}>
                        Bienvenue dans l'espace d'administration
                    </h2>
                    <p className={styles.welcomeText}>
                        Cette section sera disponible prochainement avec l'intégration du backend.
                    </p>
                </section>

                {/* Feature Cards Grid */}
                <section className={styles.features}>
                    <h3 className={styles.sectionTitle}>Fonctionnalités à venir</h3>

                    <div className={styles.grid}>
                        {adminFeatures.map((feature) => {
                            const Icon = feature.icon;

                            return (
                                <div
                                    key={feature.id}
                                    className={styles.card}
                                    aria-disabled="true"
                                >
                                    <div className={styles.cardIcon}>
                                        <Icon size={32} strokeWidth={1.5} />
                                    </div>

                                    <h4 className={styles.cardTitle}>{feature.title}</h4>
                                    <p className={styles.cardDescription}>{feature.description}</p>

                                    {feature.comingSoon && (
                                        <span className={styles.comingSoonBadge}>
                                            Bientôt disponible
                                        </span>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </section>

                {/* Quick Access Section */}
                <section className={styles.quickAccess}>
                    <h3 className={styles.sectionTitle}>Accès rapide</h3>

                    <div className={styles.quickLinks}>
                        {quickLinks.map((link) => {
                            const Icon = link.icon;

                            return (
                                <a
                                    key={link.id}
                                    href={link.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={styles.quickLink}
                                >
                                    <div className={styles.quickLinkContent}>
                                        <h4 className={styles.quickLinkTitle}>
                                            {link.title}
                                            <Icon size={16} className={styles.quickLinkIcon} />
                                        </h4>
                                        <p className={styles.quickLinkDescription}>
                                            {link.description}
                                        </p>
                                    </div>
                                </a>
                            );
                        })}
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className={styles.footer}>
                <p className={styles.footerText}>
                    Equipement Ouarzazate © {new Date().getFullYear()} • Espace Administrateur
                </p>
            </footer>
        </div>
    );
}
