/**
 * Mentions Légales (Legal Notices) Page
 * 
 * Displays all legal information required for a Moroccan commercial website.
 * Includes company details, legal info, hosting, intellectual property, and data protection.
 * 
 * @module app/mentions-legales/page
 */

import type { Metadata } from 'next';
import Link from 'next/link';
import {
    Scale,
    Building2,
    Server,
    Shield,
    FileText,
    ChevronRight,
    Home
} from 'lucide-react';
import { Header, Footer } from '@/components';
import { companyInfo, getLegalInfoList, contactConfig, siteConfig } from '@/config';
import styles from './page.module.css';

/**
 * Page metadata
 */
export const metadata: Metadata = {
    title: 'Mentions Légales | Equipement Ouarzazate',
    description: 'Mentions légales et informations juridiques concernant Equipement Ouarzazate SARL, leader de la distribution de matériaux de construction au Maroc.',
};

/**
 * Section component for legal content
 */
interface LegalSectionProps {
    id: string;
    icon: React.ReactNode;
    title: string;
    children: React.ReactNode;
}

function LegalSection({ id, icon, title, children }: LegalSectionProps) {
    return (
        <section id={id} className={styles.section}>
            <div className={styles.sectionHeader}>
                <div className={styles.sectionIcon}>{icon}</div>
                <h2 className={styles.sectionTitle}>{title}</h2>
            </div>
            <div className={styles.sectionContent}>
                {children}
            </div>
        </section>
    );
}

/**
 * Mentions Légales Page
 */
export default function MentionsLegalesPage() {
    const legalInfo = getLegalInfoList();
    const currentYear = new Date().getFullYear();

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
                            <span className={styles.breadcrumbCurrent}>Mentions Légales</span>
                        </li>
                    </ol>
                </nav>

                {/* Page Header */}
                <header className={styles.header}>
                    <h1 className={styles.title}>Mentions Légales</h1>
                    <p className={styles.subtitle}>
                        Informations légales et réglementaires conformément à la législation marocaine
                    </p>
                </header>

                {/* Content */}
                <div className={styles.content}>
                    {/* Éditeur */}
                    <LegalSection
                        id="editeur"
                        icon={<Building2 size={24} />}
                        title="Éditeur du Site"
                    >
                        <div className={styles.infoGrid}>
                            <div className={styles.infoItem}>
                                <span className={styles.infoLabel}>Raison sociale</span>
                                <span className={styles.infoValue}>{companyInfo.legalName}</span>
                            </div>
                            <div className={styles.infoItem}>
                                <span className={styles.infoLabel}>Forme juridique</span>
                                <span className={styles.infoValue}>Société à Responsabilité Limitée (SARL)</span>
                            </div>
                            <div className={styles.infoItem}>
                                <span className={styles.infoLabel}>Siège social</span>
                                <span className={styles.infoValue}>{contactConfig.address.full}</span>
                            </div>
                            <div className={styles.infoItem}>
                                <span className={styles.infoLabel}>Téléphone</span>
                                <span className={styles.infoValue}>
                                    <a href={`tel:${contactConfig.phoneRaw}`}>{contactConfig.phone}</a>
                                </span>
                            </div>
                            <div className={styles.infoItem}>
                                <span className={styles.infoLabel}>Email</span>
                                <span className={styles.infoValue}>
                                    <a href={`mailto:${contactConfig.email}`}>{contactConfig.email}</a>
                                </span>
                            </div>
                            <div className={styles.infoItem}>
                                <span className={styles.infoLabel}>Site web</span>
                                <span className={styles.infoValue}>{siteConfig.url}</span>
                            </div>
                        </div>
                    </LegalSection>

                    {/* Informations Légales */}
                    <LegalSection
                        id="informations-legales"
                        icon={<Scale size={24} />}
                        title="Informations Légales"
                    >
                        <div className={styles.legalGrid}>
                            {legalInfo.map((info) => (
                                <div key={info.label} className={styles.legalItem}>
                                    <span className={styles.legalLabel}>{info.label}</span>
                                    <span className={styles.legalValue}>{info.value}</span>
                                </div>
                            ))}
                        </div>
                    </LegalSection>

                    {/* Hébergement */}
                    <LegalSection
                        id="hebergement"
                        icon={<Server size={24} />}
                        title="Hébergement"
                    >
                        <p className={styles.paragraph}>
                            Le site est hébergé par :
                        </p>
                        <div className={styles.hostingInfo}>
                            <p><strong>Vercel Inc.</strong></p>
                            <p>340 S Lemon Ave #4133</p>
                            <p>Walnut, CA 91789, États-Unis</p>
                            <p>
                                Site web : <a href="https://vercel.com" target="_blank" rel="noopener noreferrer">
                                    vercel.com
                                </a>
                            </p>
                        </div>
                    </LegalSection>

                    {/* Propriété Intellectuelle */}
                    <LegalSection
                        id="propriete-intellectuelle"
                        icon={<FileText size={24} />}
                        title="Propriété Intellectuelle"
                    >
                        <p className={styles.paragraph}>
                            L'ensemble du contenu de ce site (textes, images, graphismes, logos, icônes,
                            sons, logiciels, etc.) est la propriété exclusive de <strong>{companyInfo.legalName}</strong> ou
                            de ses partenaires, et est protégé par les lois marocaines et internationales
                            relatives au droit d'auteur et à la propriété intellectuelle.
                        </p>
                        <p className={styles.paragraph}>
                            Toute reproduction, représentation, modification, publication, transmission,
                            dénaturation, totale ou partielle du site ou de son contenu, par quelque
                            procédé que ce soit, et sur quelque support que ce soit, est interdite sans
                            l'autorisation écrite préalable de {companyInfo.name}.
                        </p>
                        <p className={styles.paragraph}>
                            Les marques et logos présents sur le site sont des marques déposées par leurs
                            propriétaires respectifs. Leur utilisation sans autorisation préalable est interdite.
                        </p>
                    </LegalSection>

                    {/* Protection des Données */}
                    <LegalSection
                        id="protection-donnees"
                        icon={<Shield size={24} />}
                        title="Protection des Données Personnelles"
                    >
                        <p className={styles.paragraph}>
                            Conformément à la <strong>Loi 09-08</strong> relative à la protection des personnes
                            physiques à l'égard du traitement des données à caractère personnel, vous
                            disposez d'un droit d'accès, de rectification, de suppression et d'opposition
                            sur les données vous concernant.
                        </p>
                        <p className={styles.paragraph}>
                            Les informations collectées sur ce site sont utilisées dans le cadre légal
                            prévu au Maroc. Le responsable du traitement s'engage à respecter les
                            dispositions légales en vigueur et à assurer la protection et la sécurité
                            des données collectées.
                        </p>
                        <div className={styles.legalNotice}>
                            <h3>Responsable du traitement</h3>
                            <p>{companyInfo.legalName}</p>
                            <p>{contactConfig.address.full}</p>
                            <p>Email : <a href={`mailto:${contactConfig.email}`}>{contactConfig.email}</a></p>
                        </div>
                        <p className={styles.paragraph}>
                            Pour exercer vos droits ou pour toute question relative à la protection de
                            vos données personnelles, vous pouvez nous contacter à l'adresse email
                            ci-dessus ou par courrier postal à notre siège social.
                        </p>
                        <p className={styles.paragraph}>
                            Vous pouvez également adresser une réclamation auprès de la
                            <strong> Commission Nationale de contrôle de la protection des Données à
                                caractère Personnel (CNDP)</strong>.
                        </p>
                    </LegalSection>

                    {/* Date */}
                    <div className={styles.updateInfo}>
                        <p>
                            Dernière mise à jour : Janvier {currentYear}
                        </p>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
