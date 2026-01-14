/**
 * Footer Component
 * 
 * Site footer with navigation, contact info, and newsletter signup.
 * 
 * @module components/layout/Footer
 */

import Link from 'next/link';
import {
    Phone,
    Mail,
    MapPin,
    Clock,
    Facebook,
    Instagram,
    MessageCircle
} from 'lucide-react';
import { siteConfig, contactConfig, footerNavSections, socialLinks, getFooterLegalText } from '@/config';
import styles from './Footer.module.css';

export function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className={styles.footer}>
            {/* Main Footer Content */}
            <div className={styles.main}>
                <div className="container">
                    <div className={styles.grid}>
                        {/* Brand Section */}
                        <div className={styles.brand}>
                            <Link href="/" className={styles.logo}>
                                <span className={styles.logoText}>{siteConfig.name}</span>
                                <span className={styles.logoTagline}>{siteConfig.fullTagline}</span>
                            </Link>
                            <p className={styles.description}>
                                Depuis {siteConfig.establishedYear}, nous proposons les meilleurs matériaux
                                de construction et d'équipement de maison à Ouarzazate et ses environs.
                            </p>

                            {/* Social Links */}
                            <div className={styles.socials}>
                                {socialLinks.map((social) => (
                                    <a
                                        key={social.label}
                                        href={social.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={styles.socialLink}
                                        aria-label={social.label}
                                    >
                                        {social.icon === 'Facebook' && <Facebook size={20} />}
                                        {social.icon === 'Instagram' && <Instagram size={20} />}
                                        {social.icon === 'MessageCircle' && <MessageCircle size={20} />}
                                    </a>
                                ))}
                            </div>
                        </div>

                        {/* Navigation Sections */}
                        {footerNavSections.map((section) => (
                            <div key={section.title} className={styles.navSection}>
                                <h3 className={styles.navTitle}>{section.title}</h3>
                                <ul className={styles.navList}>
                                    {section.items.map((item) => (
                                        <li key={item.href}>
                                            <Link href={item.href} className={styles.navLink}>
                                                {item.label}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}

                        {/* Contact Section */}
                        <div className={styles.contact}>
                            <h3 className={styles.navTitle}>Contact</h3>
                            <ul className={styles.contactList}>
                                <li className={styles.contactItem}>
                                    <Phone size={18} />
                                    <a href={`tel:${contactConfig.phoneRaw}`}>
                                        {contactConfig.phone}
                                    </a>
                                </li>
                                <li className={styles.contactItem}>
                                    <Mail size={18} />
                                    <a href={`mailto:${contactConfig.email}`}>
                                        {contactConfig.email}
                                    </a>
                                </li>
                                <li className={styles.contactItem}>
                                    <MapPin size={18} />
                                    <span>{contactConfig.address.short}</span>
                                </li>
                                <li className={styles.contactItem}>
                                    <Clock size={18} />
                                    <span>{contactConfig.hours.compact}</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className={styles.bottom}>
                <div className="container">
                    <div className={styles.bottomContent}>
                        <p className={styles.copyright}>
                            © {currentYear} {siteConfig.name}. Tous droits réservés.
                        </p>
                        <Link href="/mentions-legales" className={styles.legalText}>
                            {getFooterLegalText()}
                        </Link>
                        <p className={styles.expertise}>
                            {siteConfig.yearsOfExperience}+ ans d'expertise
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}
