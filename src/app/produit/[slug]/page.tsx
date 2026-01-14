/**
 * Product Detail Page
 * 
 * Individual product page with gallery, full description, variations, and WhatsApp CTA.
 * Features:
 * - Breadcrumb navigation
 * - Image gallery with thumbnails and zoom
 * - Product badges (New, Featured)
 * - Variation selectors (colors, sizes)
 * - WhatsApp CTA button
 * - Similar products section
 * 
 * @module app/produit/[slug]
 */

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Header, Footer } from '@/components';
import { products, getProductBySlug, getProductsByCategory } from '@/data/products';
import { getCategoryById } from '@/data/categories';
import { ProductDetails } from './ProductDetails';
import { SimilarProducts } from './SimilarProducts';
import styles from './page.module.css';

interface PageProps {
    params: Promise<{ slug: string }>;
}

/**
 * Generate static params for all published products
 */
export async function generateStaticParams() {
    return products
        .filter((p) => p.isPublished)
        .map((p) => ({ slug: p.slug }));
}

/**
 * Generate dynamic metadata for SEO
 */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    const product = getProductBySlug(slug);

    if (!product) {
        return {
            title: 'Produit non trouvé | Equipement Ouarzazate',
            description: 'Le produit demandé n\'existe pas.',
        };
    }

    const featuredImage = product.images?.find((img) => img.isFeatured) || product.images?.[0];

    return {
        title: `${product.name} | Equipement Ouarzazate`,
        description: product.description?.substring(0, 160),
        openGraph: {
            title: `${product.name} | Equipement Ouarzazate`,
            description: product.description?.substring(0, 160),
            type: 'website',
            images: featuredImage ? [{ url: featuredImage.url }] : undefined,
        },
    };
}

/**
 * Product Detail Page Component
 */
export default async function ProductPage({ params }: PageProps) {
    const { slug } = await params;
    const product = getProductBySlug(slug);

    // 404 if product not found or not published
    if (!product || !product.isPublished) {
        notFound();
    }

    // Get category info
    const category = getCategoryById(product.categoryId);

    // Get similar products (same category, excluding current)
    const similarProducts = getProductsByCategory(product.categoryId)
        .filter((p) => p.id !== product.id && p.isPublished)
        .slice(0, 4);

    return (
        <div className={styles.page}>
            {/* Header */}
            <Header />

            <main className={styles.main}>
                {/* Breadcrumb */}
                <nav className={styles.breadcrumb} aria-label="Fil d'Ariane">
                    <ol className={styles.breadcrumbList}>
                        <li className={styles.breadcrumbItem}>
                            <a href="/" className={styles.breadcrumbLink}>Accueil</a>
                            <span className={styles.breadcrumbSeparator}>/</span>
                        </li>
                        <li className={styles.breadcrumbItem}>
                            <a href="/catalogue" className={styles.breadcrumbLink}>Catalogue</a>
                            <span className={styles.breadcrumbSeparator}>/</span>
                        </li>
                        {category && (
                            <li className={styles.breadcrumbItem}>
                                <a
                                    href={`/catalogue?category=${category.slug}`}
                                    className={styles.breadcrumbLink}
                                >
                                    {category.name}
                                </a>
                                <span className={styles.breadcrumbSeparator}>/</span>
                            </li>
                        )}
                        <li className={styles.breadcrumbItem}>
                            <span className={styles.breadcrumbCurrent} aria-current="page">
                                {product.name}
                            </span>
                        </li>
                    </ol>
                </nav>

                {/* Product Details Section */}
                <ProductDetails product={product} category={category} />

                {/* Similar Products Section */}
                {similarProducts.length > 0 && (
                    <SimilarProducts products={similarProducts} />
                )}
            </main>

            {/* Footer */}
            <Footer />
        </div>
    );
}
