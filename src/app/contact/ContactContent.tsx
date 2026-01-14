/**
 * Contact Content Component - Restructured
 * 
 * New hierarchy:
 * 1. Hero with WhatsApp Mega-CTA
 * 2. Quick Contact Strip (horizontal)
 * 3. Image + Form section
 * 4. Google Maps
 * 
 * @module app/contact/ContactContent
 */

'use client';

import { useState, useEffect, FormEvent } from 'react';
import {
    Phone,
    MessageCircle,
    Mail,
    MapPin,
    Clock,
    ArrowRight,
    Send,
    ChevronDown,
    ChevronUp,
    CheckCircle,
    XCircle,
    Award,
    Zap,
    Users,
    ExternalLink
} from 'lucide-react';
import { Button, Input } from '@/components/ui';
import { useToast } from '@/components/ui/Toast/Toast';
import {
    contactConfig,
    getWhatsAppLink,
    getPhoneLink,
    getEmailLink,
    isBusinessOpen
} from '@/config';
import styles from './page.module.css';

/**
 * Form data interface
 */
interface FormData {
    name: string;
    email: string;
    phone: string;
    subject: string;
    message: string;
}

interface FormErrors {
    name?: string;
    email?: string;
    message?: string;
}

const subjectOptions = [
    { value: '', label: 'Sélectionnez un sujet' },
    { value: 'quote', label: 'Demande de devis' },
    { value: 'product', label: 'Question sur un produit' },
    { value: 'order', label: 'Suivi de commande' },
    { value: 'other', label: 'Autre demande' },
];

export function ContactContent() {
    const toast = useToast();
    const [isOpen, setIsOpen] = useState(false);
    const [showMorePhones, setShowMorePhones] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState<FormData>({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
    });
    const [errors, setErrors] = useState<FormErrors>({});

    useEffect(() => {
        setIsOpen(isBusinessOpen());
    }, []);

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};
        if (!formData.name.trim()) newErrors.name = 'Nom requis';
        if (!formData.email.trim()) {
            newErrors.email = 'Email requis';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Email invalide';
        }
        if (!formData.message.trim()) {
            newErrors.message = 'Message requis';
        } else if (formData.message.trim().length < 20) {
            newErrors.message = 'Minimum 20 caractères';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!validateForm()) {
            toast.error('Veuillez corriger les erreurs');
            return;
        }
        setIsSubmitting(true);
        await new Promise((resolve) => setTimeout(resolve, 1500));
        console.log('Form submitted:', formData);
        toast.success('Message envoyé !', 'Nous vous répondrons sous 24h.');
        setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
        setErrors({});
        setIsSubmitting(false);
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (errors[name as keyof FormErrors]) {
            setErrors((prev) => ({ ...prev, [name]: undefined }));
        }
    };

    const scrollToMap = () => {
        document.getElementById('map-section')?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <>
            {/* ============================================
                SECTION 1: HERO WITH WHATSAPP MEGA-CTA
            ============================================ */}
            <section className={styles.hero}>
                <div className={styles.heroContent}>
                    {/* Status Badge */}
                    <div className={styles.statusBadge} data-open={isOpen}>
                        {isOpen ? (
                            <>
                                <span className={styles.statusDot} />
                                <span>Ouvert maintenant</span>
                            </>
                        ) : (
                            <>
                                <XCircle size={14} />
                                <span>Fermé</span>
                            </>
                        )}
                    </div>

                    {/* Title */}
                    <h1 className={styles.heroTitle}>
                        Parlons de Votre Projet
                    </h1>
                    <p className={styles.heroSubtitle}>
                        Une question ? Un devis ? Notre équipe vous répond en moins de 2 heures
                    </p>

                    {/* MEGA WhatsApp CTA */}
                    <a
                        href={getWhatsAppLink('Bonjour ! Je souhaite des informations sur vos produits.')}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.megaWhatsApp}
                    >
                        <span className={styles.megaWhatsAppIcon}>
                            <MessageCircle size={28} />
                        </span>
                        <span className={styles.megaWhatsAppText}>
                            <span className={styles.megaWhatsAppTitle}>Contacter par WhatsApp</span>
                            <span className={styles.megaWhatsAppSubtitle}>Réponse instantanée</span>
                        </span>
                        <ArrowRight size={24} className={styles.megaWhatsAppArrow} />
                    </a>

                    {/* Trust Signals */}
                    <div className={styles.trustSignals}>
                        <div className={styles.trustItem}>
                            <Award size={18} className={styles.trustIcon} />
                            <span><strong>+50 ans</strong> d&apos;expérience</span>
                        </div>
                        <div className={styles.trustDivider} />
                        <div className={styles.trustItem}>
                            <Users size={18} className={styles.trustIcon} />
                            <span><strong>+16 000</strong> clients</span>
                        </div>
                        <div className={styles.trustDivider} />
                        <div className={styles.trustItem}>
                            <Zap size={18} className={styles.trustIcon} />
                            <span>Réponse <strong>&lt;2h</strong></span>
                        </div>
                    </div>
                </div>
            </section>

            {/* ============================================
                SECTION 2: QUICK CONTACT STRIP
            ============================================ */}
            <section className={styles.quickContactStrip}>
                <div className={styles.quickContactGrid}>
                    {/* Phone Card */}
                    <div className={styles.quickCard}>
                        <div className={styles.quickCardHeader}>
                            <div className={styles.quickCardIcon}>
                                <Phone size={20} />
                            </div>
                            <div className={styles.quickCardInfo}>
                                <span className={styles.quickCardLabel}>Téléphone</span>
                                <a href={getPhoneLink()} className={styles.quickCardValue}>
                                    {contactConfig.phone}
                                </a>
                            </div>
                        </div>
                        {contactConfig.phones.length > 1 && (
                            <>
                                <button
                                    className={styles.quickCardExpand}
                                    onClick={() => setShowMorePhones(!showMorePhones)}
                                >
                                    {showMorePhones ? (
                                        <>Masquer <ChevronUp size={16} /></>
                                    ) : (
                                        <>+{contactConfig.phones.length - 1} autres lignes <ChevronDown size={16} /></>
                                    )}
                                </button>
                                {showMorePhones && (
                                    <div className={styles.quickCardExtra}>
                                        {contactConfig.phones.slice(1).map((phone, i) => (
                                            <a key={i} href={`tel:${phone.raw}`} className={styles.extraPhone}>
                                                <span>{phone.label}</span>
                                                <span>{phone.number}</span>
                                            </a>
                                        ))}
                                        <div className={styles.extraPhone}>
                                            <span>Fax</span>
                                            <span>{contactConfig.fax}</span>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </div>

                    {/* Email Card */}
                    <a href={getEmailLink('Demande de renseignements')} className={styles.quickCard}>
                        <div className={styles.quickCardHeader}>
                            <div className={styles.quickCardIcon}>
                                <Mail size={20} />
                            </div>
                            <div className={styles.quickCardInfo}>
                                <span className={styles.quickCardLabel}>Email</span>
                                <span className={styles.quickCardValue}>{contactConfig.email}</span>
                            </div>
                        </div>
                        <span className={styles.quickCardAction}>
                            Envoyer un email <ExternalLink size={14} />
                        </span>
                    </a>

                    {/* Address Card */}
                    <button onClick={scrollToMap} className={styles.quickCard}>
                        <div className={styles.quickCardHeader}>
                            <div className={styles.quickCardIcon}>
                                <MapPin size={20} />
                            </div>
                            <div className={styles.quickCardInfo}>
                                <span className={styles.quickCardLabel}>Adresse</span>
                                <span className={styles.quickCardValue}>{contactConfig.address.short}</span>
                            </div>
                        </div>
                        <span className={styles.quickCardAction}>
                            Voir sur la carte <ChevronDown size={14} />
                        </span>
                    </button>
                </div>
            </section>

            {/* ============================================
                SECTION 3: IMAGE + FORM
            ============================================ */}
            <section className={styles.mainSection}>
                <div className={styles.mainGrid}>
                    {/* Left: Image with Hours Overlay */}
                    <div className={styles.imageColumn}>
                        <div className={styles.imageWrapper}>
                            {/* Placeholder image - can be replaced with real photo */}
                            <div className={styles.imagePlaceholder}>
                                <div className={styles.imagePlaceholderContent}>
                                    <MapPin size={48} />
                                    <span>Equipement Ouarzazate</span>
                                    <span className={styles.imagePlaceholderSub}>Votre partenaire depuis 1970</span>
                                </div>
                            </div>

                            {/* Hours Overlay */}
                            <div className={styles.hoursOverlay}>
                                <div className={styles.hoursHeader}>
                                    <Clock size={18} />
                                    <span>Horaires d&apos;ouverture</span>
                                </div>
                                <div className={styles.hoursContent}>
                                    <div className={styles.hoursRow}>
                                        <span>Lun - Ven</span>
                                        <span>09:00 - 19:00</span>
                                    </div>
                                    <div className={styles.hoursRow}>
                                        <span>Samedi</span>
                                        <span>09:00 - 18:00</span>
                                    </div>
                                    <div className={styles.hoursRow}>
                                        <span>Dimanche</span>
                                        <span className={styles.hoursClosed}>Fermé</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Contact Form */}
                    <div className={styles.formColumn}>
                        <div className={styles.formCard}>
                            <div className={styles.formHeader}>
                                <h2 className={styles.formTitle}>Préférez un devis détaillé ?</h2>
                                <p className={styles.formSubtitle}>
                                    Décrivez votre projet et recevez une réponse personnalisée sous 24h
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} className={styles.form}>
                                <div className={styles.formGrid}>
                                    <Input
                                        label="Nom complet"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        error={errors.name}
                                        required
                                        placeholder="Votre nom"
                                    />
                                    <Input
                                        label="Email"
                                        name="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        error={errors.email}
                                        required
                                        placeholder="votre@email.com"
                                    />
                                </div>

                                <div className={styles.formGrid}>
                                    <Input
                                        label="Téléphone"
                                        name="phone"
                                        type="tel"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        placeholder="Optionnel"
                                    />
                                    <div className={styles.selectWrapper}>
                                        <label className={styles.selectLabel}>Sujet</label>
                                        <select
                                            name="subject"
                                            value={formData.subject}
                                            onChange={handleChange}
                                            className={styles.select}
                                        >
                                            {subjectOptions.map((opt) => (
                                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className={styles.formRow}>
                                    <label className={styles.textareaLabel}>
                                        Votre message <span className={styles.required}>*</span>
                                    </label>
                                    <textarea
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        className={`${styles.textarea} ${errors.message ? styles.textareaError : ''}`}
                                        rows={4}
                                        placeholder="Décrivez votre projet ou posez votre question..."
                                    />
                                    {errors.message && (
                                        <span className={styles.errorText}>{errors.message}</span>
                                    )}
                                </div>

                                <div className={styles.formActions}>
                                    <Button
                                        type="submit"
                                        variant="primary"
                                        disabled={isSubmitting}
                                        className={styles.submitButton}
                                    >
                                        {isSubmitting ? 'Envoi...' : (
                                            <>
                                                <Send size={18} />
                                                Envoyer ma demande
                                            </>
                                        )}
                                    </Button>

                                    <span className={styles.formOr}>ou</span>

                                    <Button
                                        as="a"
                                        href={getWhatsAppLink('Bonjour, je souhaite un devis pour...')}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        variant="whatsapp"
                                        className={styles.whatsappButton}
                                    >
                                        <MessageCircle size={18} />
                                        Réponse plus rapide
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </section>

            {/* ============================================
                SECTION 4: GOOGLE MAPS
            ============================================ */}
            <section id="map-section" className={styles.mapSection}>
                <div className={styles.mapWrapper}>
                    <iframe
                        src={contactConfig.maps.embedUrl}
                        className={styles.map}
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        title="Localisation Equipement Ouarzazate"
                        allowFullScreen
                    />
                    <div className={styles.mapOverlay}>
                        <div className={styles.mapInfo}>
                            <MapPin size={20} />
                            <div>
                                <strong>{contactConfig.address.street}</strong>
                                <span>{contactConfig.address.city}, {contactConfig.address.country}</span>
                            </div>
                        </div>
                        <Button
                            as="a"
                            href={contactConfig.maps.directionsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            variant="primary"
                            size="sm"
                        >
                            Itinéraire <ArrowRight size={16} />
                        </Button>
                    </div>
                </div>
            </section>
        </>
    );
}
