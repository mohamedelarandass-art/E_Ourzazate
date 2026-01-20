'use client';

/**
 * Privacy Policy Content Component
 * 
 * Interactive client component rendering the privacy policy sections
 * with smooth animations and table of contents navigation.
 * 
 * ============================================================================
 * ⚠️  TODO: DEVELOPER REMINDER - REVIEW ALL SECTIONS BELOW
 * ============================================================================
 * 
 * Each section is marked with TODO comments where business-specific
 * information should be reviewed and potentially updated.
 * 
 * IMPORTANT: This policy uses DEFAULT/PLACEHOLDER values. Before going
 * live, ensure all sections accurately reflect actual business practices.
 * 
 * ============================================================================
 * 
 * @module app/confidentialite/PrivacyContent
 */

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import {
    Shield,
    Database,
    Lock,
    Eye,
    Cookie,
    Clock,
    UserCheck,
    Share2,
    AlertTriangle,
    Mail,
    FileText,
    ChevronRight,
    ExternalLink,
    CheckCircle2
} from 'lucide-react';
import { companyInfo } from '@/config/company';
import { contactConfig } from '@/config/contact';
import styles from './page.module.css';

/**
 * Section interface for table of contents
 */
interface PolicySection {
    id: string;
    icon: React.ReactNode;
    title: string;
    shortTitle: string;
}

/**
 * Policy sections definition
 */
const policySections: PolicySection[] = [
    { id: 'responsable', icon: <Shield size={20} />, title: 'Responsable du Traitement', shortTitle: 'Responsable' },
    { id: 'donnees-collectees', icon: <Database size={20} />, title: 'Données Collectées', shortTitle: 'Données' },
    { id: 'finalites', icon: <Eye size={20} />, title: 'Finalités du Traitement', shortTitle: 'Finalités' },
    { id: 'base-legale', icon: <FileText size={20} />, title: 'Base Légale', shortTitle: 'Base Légale' },
    { id: 'cookies', icon: <Cookie size={20} />, title: 'Cookies et Technologies', shortTitle: 'Cookies' },
    { id: 'conservation', icon: <Clock size={20} />, title: 'Durée de Conservation', shortTitle: 'Conservation' },
    { id: 'droits', icon: <UserCheck size={20} />, title: 'Vos Droits', shortTitle: 'Vos Droits' },
    { id: 'partage', icon: <Share2 size={20} />, title: 'Partage des Données', shortTitle: 'Partage' },
    { id: 'securite', icon: <Lock size={20} />, title: 'Sécurité', shortTitle: 'Sécurité' },
    { id: 'modifications', icon: <AlertTriangle size={20} />, title: 'Modifications', shortTitle: 'Modifications' },
    { id: 'contact', icon: <Mail size={20} />, title: 'Contact', shortTitle: 'Contact' },
];

/**
 * Table of Contents Component
 */
function TableOfContents({
    sections,
    activeSection
}: {
    sections: PolicySection[];
    activeSection: string;
}) {
    return (
        <nav className={styles.toc} aria-label="Table des matières">
            <h2 className={styles.tocTitle}>Sommaire</h2>
            <ul className={styles.tocList}>
                {sections.map((section) => (
                    <li key={section.id} className={styles.tocItem}>
                        <a
                            href={`#${section.id}`}
                            className={`${styles.tocLink} ${activeSection === section.id ? styles.tocLinkActive : ''}`}
                        >
                            <span className={styles.tocIcon}>{section.icon}</span>
                            <span className={styles.tocText}>{section.shortTitle}</span>
                        </a>
                    </li>
                ))}
            </ul>
        </nav>
    );
}

/**
 * Section Component
 */
function Section({
    id,
    icon,
    title,
    children
}: {
    id: string;
    icon: React.ReactNode;
    title: string;
    children: React.ReactNode;
}) {
    const sectionRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const section = sectionRef.current;
        if (!section) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        section.classList.add(styles.visible);
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.1 }
        );

        observer.observe(section);
        return () => observer.disconnect();
    }, []);

    return (
        <section ref={sectionRef} id={id} className={styles.section}>
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
 * Privacy Content Component
 */
export function PrivacyContent() {
    const [activeSection, setActiveSection] = useState('responsable');
    const currentYear = new Date().getFullYear();

    // Track active section on scroll
    useEffect(() => {
        const handleScroll = () => {
            const sections = policySections.map(s => document.getElementById(s.id));
            const scrollPosition = window.scrollY + 200;

            for (let i = sections.length - 1; i >= 0; i--) {
                const section = sections[i];
                if (section && section.offsetTop <= scrollPosition) {
                    setActiveSection(policySections[i].id);
                    break;
                }
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className={styles.content}>
            {/* Table of Contents - Desktop Sidebar */}
            <aside className={styles.sidebar}>
                <TableOfContents sections={policySections} activeSection={activeSection} />
            </aside>

            {/* Main Content */}
            <div className={styles.mainContent}>
                {/* Introduction */}
                <div className={styles.introduction}>
                    <p>
                        <strong>{companyInfo.legalName}</strong> accorde une importance primordiale à la
                        protection de vos données personnelles. Cette politique de confidentialité vous
                        informe sur la manière dont nous collectons, utilisons et protégeons vos informations
                        conformément à la <strong>Loi 09-08</strong> relative à la protection des personnes
                        physiques à l'égard du traitement des données à caractère personnel.
                    </p>
                </div>

                {/* ================================================================
                    SECTION 1: RESPONSABLE DU TRAITEMENT
                    ================================================================ */}
                <Section
                    id="responsable"
                    icon={<Shield size={24} />}
                    title="Responsable du Traitement"
                >
                    <p className={styles.paragraph}>
                        Le responsable du traitement des données personnelles collectées sur ce site est :
                    </p>
                    <div className={styles.infoCard}>
                        <div className={styles.infoRow}>
                            <span className={styles.infoLabel}>Raison sociale</span>
                            <span className={styles.infoValue}>{companyInfo.legalName}</span>
                        </div>
                        <div className={styles.infoRow}>
                            <span className={styles.infoLabel}>Adresse</span>
                            <span className={styles.infoValue}>{contactConfig.address.full}</span>
                        </div>
                        <div className={styles.infoRow}>
                            <span className={styles.infoLabel}>Téléphone</span>
                            <span className={styles.infoValue}>
                                <a href={`tel:${contactConfig.phoneRaw}`}>{contactConfig.phone}</a>
                            </span>
                        </div>
                        <div className={styles.infoRow}>
                            <span className={styles.infoLabel}>Email</span>
                            <span className={styles.infoValue}>
                                <a href={`mailto:${contactConfig.email}`}>{contactConfig.email}</a>
                            </span>
                        </div>
                        <div className={styles.infoRow}>
                            <span className={styles.infoLabel}>ICE</span>
                            <span className={styles.infoValue}>{companyInfo.legal.ice}</span>
                        </div>
                    </div>
                </Section>

                {/* ================================================================
                    SECTION 2: DONNÉES COLLECTÉES
                    TODO: Review and update according to actual data collection
                    ================================================================ */}
                <Section
                    id="donnees-collectees"
                    icon={<Database size={24} />}
                    title="Données Collectées"
                >
                    {/* TODO: PLACEHOLDER - Review the data types actually collected */}
                    <p className={styles.paragraph}>
                        Nous collectons uniquement les données nécessaires à nos services.
                        Les catégories de données collectées incluent :
                    </p>

                    <h3 className={styles.subTitle}>Données d'identification</h3>
                    <ul className={styles.list}>
                        <li>Nom et prénom</li>
                        <li>Adresse email</li>
                        <li>Numéro de téléphone</li>
                        {/* TODO: Add or remove items based on actual forms */}
                    </ul>

                    <h3 className={styles.subTitle}>Données de navigation</h3>
                    <ul className={styles.list}>
                        <li>Adresse IP (anonymisée)</li>
                        <li>Type de navigateur et système d'exploitation</li>
                        <li>Pages visitées et durée de visite</li>
                        {/* TODO: REVIEW - Update if using analytics */}
                    </ul>

                    <h3 className={styles.subTitle}>Données de communication</h3>
                    <ul className={styles.list}>
                        <li>Messages envoyés via le formulaire de contact</li>
                        <li>Correspondance email</li>
                        <li>Conversations WhatsApp (si initiées par vous)</li>
                    </ul>

                    <div className={styles.noticeBox}>
                        <AlertTriangle size={18} />
                        <p>
                            {/* TODO: PLACEHOLDER - Update if newsletter is implemented */}
                            <strong>Newsletter :</strong> Si vous vous inscrivez à notre newsletter,
                            nous collectons uniquement votre adresse email avec votre consentement explicite.
                        </p>
                    </div>
                </Section>

                {/* ================================================================
                    SECTION 3: FINALITÉS DU TRAITEMENT
                    TODO: Verify these match actual business practices
                    ================================================================ */}
                <Section
                    id="finalites"
                    icon={<Eye size={24} />}
                    title="Finalités du Traitement"
                >
                    <p className={styles.paragraph}>
                        Vos données personnelles sont collectées et traitées pour les finalités suivantes :
                    </p>

                    <div className={styles.purposeGrid}>
                        {/* TODO: REVIEW - Verify each purpose matches business reality */}
                        <div className={styles.purposeCard}>
                            <CheckCircle2 size={20} className={styles.purposeIcon} />
                            <div>
                                <h4>Traitement des demandes</h4>
                                <p>Répondre à vos demandes d'information et devis via notre formulaire de contact.</p>
                            </div>
                        </div>
                        <div className={styles.purposeCard}>
                            <CheckCircle2 size={20} className={styles.purposeIcon} />
                            <div>
                                <h4>Service client</h4>
                                <p>Assurer le suivi de votre relation commerciale et répondre à vos questions.</p>
                            </div>
                        </div>
                        <div className={styles.purposeCard}>
                            <CheckCircle2 size={20} className={styles.purposeIcon} />
                            <div>
                                <h4>Amélioration du site</h4>
                                <p>Analyser l'utilisation de notre site pour améliorer votre expérience de navigation.</p>
                            </div>
                        </div>
                        <div className={styles.purposeCard}>
                            <CheckCircle2 size={20} className={styles.purposeIcon} />
                            <div>
                                <h4>Communication commerciale</h4>
                                <p>Vous informer de nos offres et promotions (avec votre consentement préalable).</p>
                            </div>
                        </div>
                    </div>
                </Section>

                {/* ================================================================
                    SECTION 4: BASE LÉGALE
                    ================================================================ */}
                <Section
                    id="base-legale"
                    icon={<FileText size={24} />}
                    title="Base Légale du Traitement"
                >
                    <p className={styles.paragraph}>
                        Conformément à la <strong>Loi 09-08</strong>, le traitement de vos données repose sur
                        les bases légales suivantes :
                    </p>

                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Traitement</th>
                                <th>Base légale</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Réponse aux demandes de contact</td>
                                <td>Intérêt légitime / Exécution d'un contrat</td>
                            </tr>
                            <tr>
                                <td>Envoi de newsletters</td>
                                <td>Consentement</td>
                            </tr>
                            <tr>
                                <td>Analyse de navigation</td>
                                <td>Intérêt légitime</td>
                            </tr>
                            <tr>
                                <td>Obligations légales</td>
                                <td>Obligation légale</td>
                            </tr>
                        </tbody>
                    </table>
                </Section>

                {/* ================================================================
                    SECTION 5: COOKIES
                    TODO: Complete when actual cookie policy is defined
                    ================================================================ */}
                <Section
                    id="cookies"
                    icon={<Cookie size={24} />}
                    title="Cookies et Technologies Similaires"
                >
                    {/* TODO: PLACEHOLDER - Update with actual cookie usage */}
                    <p className={styles.paragraph}>
                        Notre site utilise des cookies pour améliorer votre expérience de navigation.
                        Un cookie est un petit fichier texte stocké sur votre appareil.
                    </p>

                    <h3 className={styles.subTitle}>Types de cookies utilisés</h3>

                    <div className={styles.cookieGrid}>
                        <div className={styles.cookieCard}>
                            <h4>🔧 Cookies essentiels</h4>
                            <p>Nécessaires au fonctionnement du site. Ils ne peuvent pas être désactivés.</p>
                            <span className={styles.cookieBadge}>Obligatoires</span>
                        </div>

                        {/* TODO: REVIEW - Remove this section if no analytics are used */}
                        <div className={styles.cookieCard}>
                            <h4>📊 Cookies analytiques</h4>
                            <p>Nous aident à comprendre comment les visiteurs utilisent le site.</p>
                            <span className={styles.cookieBadge}>Optionnels</span>
                        </div>
                    </div>

                    <div className={styles.noticeBox}>
                        <Cookie size={18} />
                        <p>
                            Vous pouvez gérer vos préférences de cookies à tout moment via les paramètres
                            de votre navigateur. La désactivation de certains cookies peut affecter votre
                            expérience sur notre site.
                        </p>
                    </div>

                    {/* TODO: Add banner reference when cookie consent is implemented */}
                </Section>

                {/* ================================================================
                    SECTION 6: DURÉE DE CONSERVATION
                    TODO: Verify retention periods with business requirements
                    ================================================================ */}
                <Section
                    id="conservation"
                    icon={<Clock size={24} />}
                    title="Durée de Conservation"
                >
                    {/* TODO: PLACEHOLDER - 3 years is a default value, adjust if needed */}
                    <p className={styles.paragraph}>
                        Vos données personnelles sont conservées pendant une durée limitée, proportionnelle
                        à leur finalité :
                    </p>

                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Type de données</th>
                                <th>Durée de conservation</th>
                            </tr>
                        </thead>
                        <tbody>
                            {/* TODO: REVIEW - Update these durations based on actual policy */}
                            <tr>
                                <td>Données de contact (prospects)</td>
                                <td>3 ans après le dernier contact</td>
                            </tr>
                            <tr>
                                <td>Données clients</td>
                                <td>5 ans après la fin de la relation commerciale</td>
                            </tr>
                            <tr>
                                <td>Données de navigation</td>
                                <td>13 mois maximum</td>
                            </tr>
                            <tr>
                                <td>Données de newsletter</td>
                                <td>Jusqu'au désabonnement + 3 ans</td>
                            </tr>
                        </tbody>
                    </table>

                    <p className={styles.paragraph}>
                        À l'expiration de ces délais, vos données sont supprimées ou anonymisées de manière
                        irréversible.
                    </p>
                </Section>

                {/* ================================================================
                    SECTION 7: VOS DROITS
                    ================================================================ */}
                <Section
                    id="droits"
                    icon={<UserCheck size={24} />}
                    title="Vos Droits"
                >
                    <p className={styles.paragraph}>
                        Conformément à la <strong>Loi 09-08</strong>, vous disposez des droits suivants
                        concernant vos données personnelles :
                    </p>

                    <div className={styles.rightsGrid}>
                        <div className={styles.rightCard}>
                            <h4>✅ Droit d'accès</h4>
                            <p>Obtenir confirmation que vos données sont traitées et en recevoir une copie.</p>
                        </div>
                        <div className={styles.rightCard}>
                            <h4>✏️ Droit de rectification</h4>
                            <p>Demander la correction de données inexactes ou incomplètes.</p>
                        </div>
                        <div className={styles.rightCard}>
                            <h4>🗑️ Droit de suppression</h4>
                            <p>Demander l'effacement de vos données dans certaines conditions.</p>
                        </div>
                        <div className={styles.rightCard}>
                            <h4>🚫 Droit d'opposition</h4>
                            <p>Vous opposer au traitement de vos données pour des raisons légitimes.</p>
                        </div>
                        <div className={styles.rightCard}>
                            <h4>📦 Droit à la portabilité</h4>
                            <p>Recevoir vos données dans un format structuré et réutilisable.</p>
                        </div>
                        <div className={styles.rightCard}>
                            <h4>⏸️ Droit à la limitation</h4>
                            <p>Demander la suspension temporaire du traitement de vos données.</p>
                        </div>
                    </div>

                    <div className={styles.ctaBox}>
                        <p>
                            Pour exercer vos droits, contactez-nous à :
                            <a href={`mailto:${contactConfig.email}`} className={styles.emailLink}>
                                {contactConfig.email}
                            </a>
                        </p>
                        <p className={styles.smallText}>
                            Nous répondrons dans un délai de <strong>30 jours</strong> maximum.
                        </p>
                    </div>

                    <p className={styles.paragraph}>
                        En cas de litige, vous pouvez également adresser une réclamation à la
                        <strong> Commission Nationale de contrôle de la protection des Données à
                            caractère Personnel (CNDP)</strong> :
                    </p>
                    <div className={styles.externalLink}>
                        <a
                            href="https://www.cndp.ma"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            www.cndp.ma
                            <ExternalLink size={14} />
                        </a>
                    </div>
                </Section>

                {/* ================================================================
                    SECTION 8: PARTAGE DES DONNÉES
                    TODO: Update if data is shared with third parties
                    ================================================================ */}
                <Section
                    id="partage"
                    icon={<Share2 size={24} />}
                    title="Partage des Données"
                >
                    {/* TODO: PLACEHOLDER - Update if data is shared with partners */}
                    <p className={styles.paragraph}>
                        Vos données personnelles ne sont pas vendues, louées ou échangées avec des tiers
                        à des fins commerciales.
                    </p>

                    <p className={styles.paragraph}>
                        Nous pouvons être amenés à partager vos données avec :
                    </p>

                    <ul className={styles.list}>
                        <li>
                            <strong>Hébergeur du site :</strong> Vercel Inc. (États-Unis) - pour
                            l'hébergement technique du site web.
                        </li>
                        {/* TODO: REVIEW - Add other service providers if applicable */}
                        <li>
                            <strong>Autorités légales :</strong> En cas d'obligation légale ou de
                            réquisition judiciaire.
                        </li>
                    </ul>

                    <div className={styles.noticeBox}>
                        <Shield size={18} />
                        <p>
                            Tout partage de données avec des tiers est encadré par des contrats
                            garantissant la protection de vos informations.
                        </p>
                    </div>
                </Section>

                {/* ================================================================
                    SECTION 9: SÉCURITÉ
                    ================================================================ */}
                <Section
                    id="securite"
                    icon={<Lock size={24} />}
                    title="Sécurité des Données"
                >
                    <p className={styles.paragraph}>
                        Nous mettons en œuvre des mesures techniques et organisationnelles appropriées
                        pour protéger vos données contre tout accès non autorisé, modification,
                        divulgation ou destruction.
                    </p>

                    <div className={styles.securityGrid}>
                        <div className={styles.securityItem}>
                            <span className={styles.securityIcon}>🔐</span>
                            <div>
                                <h4>Chiffrement SSL/TLS</h4>
                                <p>Toutes les communications sont chiffrées via HTTPS.</p>
                            </div>
                        </div>
                        <div className={styles.securityItem}>
                            <span className={styles.securityIcon}>🛡️</span>
                            <div>
                                <h4>Accès restreint</h4>
                                <p>Seul le personnel autorisé accède à vos données.</p>
                            </div>
                        </div>
                        <div className={styles.securityItem}>
                            <span className={styles.securityIcon}>💾</span>
                            <div>
                                <h4>Sauvegardes sécurisées</h4>
                                <p>Vos données sont sauvegardées régulièrement.</p>
                            </div>
                        </div>
                        <div className={styles.securityItem}>
                            <span className={styles.securityIcon}>🔍</span>
                            <div>
                                <h4>Surveillance continue</h4>
                                <p>Nos systèmes sont surveillés contre les intrusions.</p>
                            </div>
                        </div>
                    </div>
                </Section>

                {/* ================================================================
                    SECTION 10: MODIFICATIONS
                    ================================================================ */}
                <Section
                    id="modifications"
                    icon={<AlertTriangle size={24} />}
                    title="Modifications de la Politique"
                >
                    <p className={styles.paragraph}>
                        Nous nous réservons le droit de modifier cette politique de confidentialité à
                        tout moment. Toute modification sera publiée sur cette page avec une date de
                        mise à jour.
                    </p>

                    <p className={styles.paragraph}>
                        Nous vous encourageons à consulter régulièrement cette page pour rester informé
                        de nos pratiques en matière de protection des données.
                    </p>

                    <div className={styles.updateBadge}>
                        <Clock size={16} />
                        <span>Dernière mise à jour : Janvier {currentYear}</span>
                    </div>
                </Section>

                {/* ================================================================
                    SECTION 11: CONTACT
                    ================================================================ */}
                <Section
                    id="contact"
                    icon={<Mail size={24} />}
                    title="Nous Contacter"
                >
                    <p className={styles.paragraph}>
                        Pour toute question concernant cette politique de confidentialité ou pour
                        exercer vos droits, vous pouvez nous contacter :
                    </p>

                    <div className={styles.contactGrid}>
                        <div className={styles.contactCard}>
                            <Mail size={24} />
                            <div>
                                <h4>Par email</h4>
                                <a href={`mailto:${contactConfig.email}`}>{contactConfig.email}</a>
                            </div>
                        </div>
                        <div className={styles.contactCard}>
                            <FileText size={24} />
                            <div>
                                <h4>Par courrier</h4>
                                <p>{companyInfo.legalName}<br />{contactConfig.address.full}</p>
                            </div>
                        </div>
                    </div>

                    <div className={styles.finalCta}>
                        <Link href="/contact" className={styles.ctaButton}>
                            Accéder au formulaire de contact
                            <ChevronRight size={18} />
                        </Link>
                    </div>
                </Section>

                {/* Footer Note */}
                <div className={styles.pageFooter}>
                    <p>
                        En utilisant notre site, vous acceptez les termes de cette politique de confidentialité.
                    </p>
                    <Link href="/mentions-legales" className={styles.footerLink}>
                        Consulter les mentions légales
                        <ChevronRight size={14} />
                    </Link>
                </div>
            </div>
        </div>
    );
}
