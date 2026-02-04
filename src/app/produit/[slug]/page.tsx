/**
 * Product Detail Page
 *
 * Individual product page with gallery, full description, variations, and WhatsApp CTA.
 * Features:
 * - Breadcrumb navigation (using Next.js Link for client-side transitions)
 * - Image gallery with thumbnails and zoom
 * - Product badges (New, Featured)
 * - Variation selectors (colors, sizes)
 * - WhatsApp CTA button
 * - Similar products section
 *
 * Performance:
 * - generateMetadata and ProductPage share a single Prisma round-trip
 *   via React.cache() on getPublicProductBySlugWithCategory.
 * - Similar products use a dedicated query with `take` + `NOT` (no over-fetching).
 * - Similar products fetch is wrapped in try/catch so a transient failure
 *   only hides the section instead of crashing the entire page.
 *
 * @module app/produit/[slug]
 */

import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { unstable_cache } from 'next/cache';
import { Header, Footer } from '@/components';
import {
    getPublishedProductSlugs,
    getPublicProductBySlugWithCategory,
    getPublicSimilarProducts,
} from '@/lib/public-queries';
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
    const slugs = await getPublishedProductSlugs();
    return slugs.map((slug) => ({ slug }));
}

/**
 * Generate dynamic metadata for SEO.
 * Uses the same React.cache()-wrapped function as the page component
 * so both resolve from a single Prisma query per request.
 */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    const result = await getPublicProductBySlugWithCategory(slug);

    if (!result) {
        return {
            title: 'Produit non trouvé | Equipement Ouarzazate',
            description: 'Le produit demandé n\'existe pas.',
        };
    }

    const { product } = result;
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
 * Cross-request cache for product page data (I4).
 * Complements React.cache() (per-request dedup) with unstable_cache
 * (cross-request TTL). Uses the same 60s TTL + tags as the API routes,
 * so admin mutations bust it instantly via revalidateTag.
 *
 * Factory pattern used because the cache key includes the dynamic slug.
 */
function getCachedProductPageData(slug: string) {
    return unstable_cache(
        async () => {
            const result = await getPublicProductBySlugWithCategory(slug);
            if (!result) return null;

            const { product, category } = result;

            let similarProducts: Awaited<ReturnType<typeof getPublicSimilarProducts>> = [];
            try {
                similarProducts = await getPublicSimilarProducts(product.categoryId, product.id);
            } catch (error) {
                console.error('[produit] Failed to load similar products:', error);
            }

            return { product, category, similarProducts };
        },
        ['product-page', slug],
        { revalidate: 60, tags: ['products'] },
    )();
}

/**
 * Product Detail Page Component
 */
export default async function ProductPage({ params }: PageProps) {
    const { slug } = await params;
    const result = await getCachedProductPageData(slug);

    // 404 if product not found or not published
    if (!result) {
        notFound();
    }

    const { product, category, similarProducts } = result;

    return (
        <div className={styles.page}>
            {/* Header */}
            <Header />

            <main className={styles.main}>
                {/* Breadcrumb — using Link for client-side navigation (M8) */}
                <nav className={styles.breadcrumb} aria-label="Fil d'Ariane">
                    <ol className={styles.breadcrumbList}>
                        <li className={styles.breadcrumbItem}>
                            <Link href="/" className={styles.breadcrumbLink}>Accueil</Link>
                            <span className={styles.breadcrumbSeparator}>/</span>
                        </li>
                        <li className={styles.breadcrumbItem}>
                            <Link href="/catalogue" className={styles.breadcrumbLink}>Catalogue</Link>
                            <span className={styles.breadcrumbSeparator}>/</span>
                        </li>
                        {category && (
                            <li className={styles.breadcrumbItem}>
                                <Link
                                    href={`/catalogue?category=${encodeURIComponent(category.slug)}`}
                                    className={styles.breadcrumbLink}
                                >
                                    {category.name}
                                </Link>
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
