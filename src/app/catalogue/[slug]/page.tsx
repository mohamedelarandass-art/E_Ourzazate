/**
 * Category Redirect Page
 * 
 * Redirects /catalogue/[slug] to /catalogue?category=[slug]
 * for backwards compatibility and SEO.
 * 
 * @module app/catalogue/[slug]
 */

import { redirect } from 'next/navigation';
import { getActiveCategories, getCategoryBySlug } from '@/data';

interface PageProps {
    params: Promise<{ slug: string }>;
}

/**
 * Generate static paths for all categories
 */
export async function generateStaticParams() {
    const categories = getActiveCategories();
    return categories.map((cat) => ({ slug: cat.slug }));
}

/**
 * Redirect to main catalogue with category filter
 */
export default async function CategoryRedirectPage({ params }: PageProps) {
    const { slug } = await params;
    const category = getCategoryBySlug(slug);

    if (category) {
        redirect(`/catalogue?category=${slug}`);
    } else {
        redirect('/catalogue');
    }
}
