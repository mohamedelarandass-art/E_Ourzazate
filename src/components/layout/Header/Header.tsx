/**
 * Header Component
 * 
 * Main site header with logo, navigation, search, and actions.
 * Responsive with mobile menu support.
 * 
 * @module components/layout/Header
 */

'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    Search,
    Menu,
    X,
    Moon,
    Sun,
    MessageCircle,
    User
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { siteConfig, mainNavItems } from '@/config';
import { getWhatsAppUrl } from '@/lib/whatsapp';
import { useThemeContext } from '@/context';
import { Button } from '@/components/ui';
import styles from './Header.module.css';

export function Header() {
    const pathname = usePathname();
    const { resolvedTheme, toggleTheme, mounted } = useThemeContext();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isHidden, setIsHidden] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const lastScrollY = useRef(0);

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            // Determine if page is scrolled (for visual changes)
            setIsScrolled(currentScrollY > 20);

            // Hide/show based on scroll direction
            // Only hide if scrolled down more than 50px and not at top
            if (currentScrollY > 50) {
                if (currentScrollY > lastScrollY.current) {
                    // Scrolling down - hide navbar
                    setIsHidden(true);
                } else {
                    // Scrolling up - show navbar immediately
                    setIsHidden(false);
                }
            } else {
                // Near top - always show
                setIsHidden(false);
            }

            lastScrollY.current = currentScrollY;
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close mobile menu on route change
    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [pathname]);

    // Prevent body scroll when mobile menu is open
    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isMobileMenuOpen]);

    const isActive = (href: string) => {
        if (href === '/') return pathname === '/';
        return pathname.startsWith(href);
    };

    return (
        <header className={cn(styles.header, isScrolled && styles.scrolled, isHidden && styles.hidden)}>
            <div className={cn(styles.container, 'container')}>
                {/* Logo */}
                <Link href="/" className={styles.logo}>
                    <span className={styles.logoText}>{siteConfig.name}</span>
                    <span className={styles.logoTagline}>{siteConfig.tagline}</span>
                </Link>

                {/* Desktop Navigation */}
                <nav className={styles.nav} aria-label="Navigation principale">
                    <ul className={styles.navList}>
                        {mainNavItems.map((item) => (
                            <li key={item.href}>
                                <Link
                                    href={item.href}
                                    className={cn(styles.navLink, isActive(item.href) && styles.active)}
                                >
                                    {item.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>

                {/* Actions */}
                <div className={styles.actions}>
                    {/* Search Button */}
                    <button
                        type="button"
                        className={styles.actionButton}
                        onClick={() => setIsSearchOpen(!isSearchOpen)}
                        aria-label="Rechercher"
                    >
                        <Search size={20} />
                    </button>

                    {/* Theme Toggle */}
                    {mounted && (
                        <button
                            type="button"
                            className={styles.actionButton}
                            onClick={toggleTheme}
                            aria-label={resolvedTheme === 'dark' ? 'Mode clair' : 'Mode sombre'}
                        >
                            {resolvedTheme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                        </button>
                    )}

                    {/* WhatsApp Button (Desktop) */}
                    <a
                        href={getWhatsAppUrl()}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.whatsappButton}
                    >
                        <MessageCircle size={18} />
                        <span>WhatsApp</span>
                    </a>

                    {/* Admin Link */}
                    <Link href="/admin" className={styles.actionButton} aria-label="Administration">
                        <User size={20} />
                    </Link>

                    {/* Mobile Menu Toggle */}
                    <button
                        type="button"
                        className={styles.menuButton}
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        aria-label={isMobileMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
                        aria-expanded={isMobileMenuOpen}
                    >
                        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Search Bar */}
            {isSearchOpen && (
                <div className={styles.searchBar}>
                    <div className="container">
                        <div className={styles.searchWrapper}>
                            <Search size={20} className={styles.searchIcon} />
                            <input
                                type="text"
                                placeholder="Rechercher un produit..."
                                className={styles.searchInput}
                                autoFocus
                            />
                            <button
                                type="button"
                                className={styles.searchClose}
                                onClick={() => setIsSearchOpen(false)}
                            >
                                <X size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Mobile Menu */}
            <div className={cn(styles.mobileMenu, isMobileMenuOpen && styles.mobileMenuOpen)}>
                <nav className={styles.mobileNav}>
                    <ul className={styles.mobileNavList}>
                        {mainNavItems.map((item) => (
                            <li key={item.href}>
                                <Link
                                    href={item.href}
                                    className={cn(styles.mobileNavLink, isActive(item.href) && styles.active)}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    {item.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>

                <div className={styles.mobileActions}>
                    <Button
                        variant="whatsapp"
                        fullWidth
                        leftIcon={<MessageCircle size={18} />}
                        onClick={() => window.open(getWhatsAppUrl(), '_blank')}
                    >
                        Nous contacter sur WhatsApp
                    </Button>
                </div>
            </div>
        </header>
    );
}
