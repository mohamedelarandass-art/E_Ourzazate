/**
 * Newsletter Section Component
 * 
 * Premium newsletter signup section with elegant design.
 * Features gradient background, decorative patterns, and smooth animations.
 * 
 * @module components/sections/Newsletter
 */

'use client';

import { useState, FormEvent, useRef, useEffect } from 'react';
import styles from './Newsletter.module.css';

export interface NewsletterProps {
    /** Custom title */
    title?: string;
    /** Custom subtitle */
    subtitle?: string;
    /** Custom button text */
    buttonText?: string;
    /** Custom class name */
    className?: string;
}

export function Newsletter({
    title = 'Restez Informé',
    subtitle = 'Inscrivez-vous pour recevoir nos nouveautés, offres exclusives et conseils déco directement dans votre boîte mail.',
    buttonText = "S'inscrire",
    className = '',
}: NewsletterProps) {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');
    const [isVisible, setIsVisible] = useState(false);
    const sectionRef = useRef<HTMLElement>(null);

    // Intersection Observer for fade-in animation
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.2 }
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => observer.disconnect();
    }, []);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (!email.trim()) {
            setStatus('error');
            setMessage('Veuillez entrer votre adresse email.');
            return;
        }

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setStatus('error');
            setMessage('Veuillez entrer une adresse email valide.');
            return;
        }

        setStatus('loading');

        // Frontend-only for now - backend integration will come later
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));

            console.log('Newsletter signup:', email);
            setStatus('success');
            setMessage('Merci pour votre inscription ! 🎉');
            setEmail('');

            // Reset after 5 seconds
            setTimeout(() => {
                setStatus('idle');
                setMessage('');
            }, 5000);
        } catch {
            setStatus('error');
            setMessage('Une erreur est survenue. Veuillez réessayer.');
        }
    };

    return (
        <section
            ref={sectionRef}
            className={`${styles.newsletter} ${isVisible ? styles.visible : ''} ${className}`}
            aria-labelledby="newsletter-title"
        >
            {/* Decorative background patterns */}
            <div className={styles.patterns} aria-hidden="true">
                <div className={styles.pattern1} />
                <div className={styles.pattern2} />
                <div className={styles.pattern3} />
                <div className={styles.patternGrid} />
            </div>

            <div className={styles.container}>
                <div className={styles.content}>
                    {/* Icon */}
                    <div className={styles.iconWrapper}>
                        <svg
                            className={styles.icon}
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-hidden="true"
                        >
                            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                            <polyline points="22,6 12,13 2,6" />
                        </svg>
                    </div>

                    {/* Title */}
                    <h2 id="newsletter-title" className={styles.title}>
                        {title}
                    </h2>

                    {/* Subtitle */}
                    <p className={styles.subtitle}>
                        {subtitle}
                    </p>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className={styles.form} noValidate>
                        <div className={styles.inputGroup}>
                            <label htmlFor="newsletter-email" className={styles.srOnly}>
                                Adresse email
                            </label>
                            <input
                                type="email"
                                id="newsletter-email"
                                name="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Votre adresse email"
                                className={styles.input}
                                disabled={status === 'loading' || status === 'success'}
                                aria-describedby={message ? 'newsletter-message' : undefined}
                            />
                            <button
                                type="submit"
                                className={styles.button}
                                disabled={status === 'loading' || status === 'success'}
                            >
                                {status === 'loading' ? (
                                    <span className={styles.spinner} aria-hidden="true" />
                                ) : (
                                    buttonText
                                )}
                                <span className={styles.srOnly}>
                                    {status === 'loading' ? 'Envoi en cours...' : buttonText}
                                </span>
                            </button>
                        </div>

                        {/* Status Message */}
                        {message && (
                            <p
                                id="newsletter-message"
                                className={`${styles.message} ${status === 'success' ? styles.messageSuccess : styles.messageError
                                    }`}
                                role={status === 'error' ? 'alert' : 'status'}
                            >
                                {message}
                            </p>
                        )}
                    </form>

                    {/* Privacy Note */}
                    <p className={styles.privacy}>
                        <svg
                            className={styles.privacyIcon}
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-hidden="true"
                        >
                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                        </svg>
                        Nous respectons votre vie privée. Pas de spam.
                    </p>
                </div>
            </div>
        </section>
    );
}
