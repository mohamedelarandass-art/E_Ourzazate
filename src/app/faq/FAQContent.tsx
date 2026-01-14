/**
 * FAQ Content Component
 * 
 * Client component handling category tabs and accordion interactions.
 * 
 * @module app/faq/FAQContent
 */

'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
    ShoppingCart,
    Truck,
    Wrench,
    MessageCircle,
    Phone,
    HelpCircle
} from 'lucide-react';
import { Accordion, AccordionItem } from '@/components/ui/Accordion';
import { contactConfig, getWhatsAppLink } from '@/config';
import styles from './page.module.css';

/**
 * FAQ Categories and Questions
 */
const faqCategories = [
    {
        id: 'commandes-prix',
        label: 'Commandes & Prix',
        icon: ShoppingCart,
        questions: [
            {
                id: 'prix-produit',
                question: 'Comment connaître le prix d\'un produit ?',
                answer: 'Pour obtenir le prix d\'un article, contactez-nous sur WhatsApp ou par téléphone. Nos conseillers vous répondent rapidement avec un devis personnalisé.',
            },
            {
                id: 'prix-non-affiches',
                question: 'Pourquoi les prix ne sont-ils pas affichés en ligne ?',
                answer: 'Nos prix varient selon les quantités et les promotions en cours. Nous préférons vous offrir un conseil personnalisé pour le meilleur tarif possible.',
            },
            {
                id: 'passer-commande',
                question: 'Comment passer une commande ?',
                answer: 'Contactez-nous via WhatsApp, téléphone ou venez directement en magasin. Nous vous guidons dans votre choix et préparons votre commande.',
            },
        ],
    },
    {
        id: 'livraison-retrait',
        label: 'Livraison & Retrait',
        icon: Truck,
        questions: [
            {
                id: 'livraison-domicile',
                question: 'Livrez-vous à domicile ?',
                answer: 'Oui, nous livrons dans Ouarzazate et ses environs. Les conditions de livraison vous seront communiquées lors de votre commande.',
            },
            {
                id: 'retrait-magasin',
                question: 'Puis-je retirer ma commande en magasin ?',
                answer: 'Absolument ! Le retrait en magasin est gratuit. Nous vous prévenons dès que votre commande est prête.',
            },
        ],
    },
    {
        id: 'produits-services',
        label: 'Produits & Services',
        icon: Wrench,
        questions: [
            {
                id: 'conseils-projets',
                question: 'Proposez-vous des conseils pour mes projets ?',
                answer: 'Oui, nos experts sont à votre disposition pour vous conseiller sur le choix des matériaux adaptés à vos projets de construction ou rénovation.',
            },
            {
                id: 'garantie-produits',
                question: 'Les produits sont-ils garantis ?',
                answer: 'Nos produits bénéficient des garanties constructeur. Les détails vous sont communiqués à l\'achat.',
            },
            {
                id: 'devis-professionnels',
                question: 'Faites-vous des devis pour les professionnels ?',
                answer: 'Oui, nous travaillons régulièrement avec des professionnels (architectes, entrepreneurs). Contactez-nous pour un devis adapté.',
            },
        ],
    },
];

/**
 * FAQ Content Component
 */
export function FAQContent() {
    const [activeCategory, setActiveCategory] = useState<string | null>(null);

    // Filter questions based on selected category
    const displayedCategories = activeCategory
        ? faqCategories.filter(cat => cat.id === activeCategory)
        : faqCategories;

    return (
        <div className={styles.content}>
            {/* Category Tabs */}
            <div className={styles.categoryTabs} role="tablist" aria-label="Catégories FAQ">
                <button
                    type="button"
                    role="tab"
                    aria-selected={activeCategory === null}
                    className={`${styles.categoryTab} ${activeCategory === null ? styles.categoryTabActive : ''}`}
                    onClick={() => setActiveCategory(null)}
                >
                    <HelpCircle size={18} />
                    <span>Toutes</span>
                </button>
                {faqCategories.map((category) => {
                    const Icon = category.icon;
                    return (
                        <button
                            key={category.id}
                            type="button"
                            role="tab"
                            aria-selected={activeCategory === category.id}
                            className={`${styles.categoryTab} ${activeCategory === category.id ? styles.categoryTabActive : ''}`}
                            onClick={() => setActiveCategory(category.id)}
                        >
                            <Icon size={18} />
                            <span>{category.label}</span>
                        </button>
                    );
                })}
            </div>

            {/* FAQ Sections */}
            <div className={styles.faqSections}>
                {displayedCategories.map((category) => {
                    const Icon = category.icon;
                    return (
                        <section key={category.id} className={styles.faqSection}>
                            <div className={styles.sectionHeader}>
                                <div className={styles.sectionIcon}>
                                    <Icon size={24} />
                                </div>
                                <h2 className={styles.sectionTitle}>{category.label}</h2>
                            </div>

                            <Accordion allowMultiple={false} className={styles.accordion}>
                                {category.questions.map((item) => (
                                    <AccordionItem
                                        key={item.id}
                                        id={item.id}
                                        title={item.question}
                                    >
                                        <p className={styles.answerText}>{item.answer}</p>
                                    </AccordionItem>
                                ))}
                            </Accordion>
                        </section>
                    );
                })}
            </div>

            {/* CTA Section */}
            <section className={styles.ctaSection}>
                <div className={styles.ctaContent}>
                    <MessageCircle size={48} className={styles.ctaIcon} />
                    <h2 className={styles.ctaTitle}>Vous n&apos;avez pas trouvé votre réponse ?</h2>
                    <p className={styles.ctaSubtitle}>
                        Notre équipe est disponible pour répondre à toutes vos questions
                    </p>
                    <div className={styles.ctaButtons}>
                        <a
                            href={getWhatsAppLink('Bonjour ! J\'ai une question concernant vos produits et services.')}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.ctaWhatsApp}
                        >
                            <MessageCircle size={20} />
                            Contacter sur WhatsApp
                        </a>
                        <Link href="/contact" className={styles.ctaContact}>
                            <Phone size={20} />
                            Page Contact
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
