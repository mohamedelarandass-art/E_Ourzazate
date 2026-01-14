/**
 * Homepage
 * 
 * Main landing page for Equipement Ouarzazate.
 * Features Hero, Categories, Statistics, Featured Products, Partners, and Newsletter sections.
 * 
 * @module app/page
 */

import {
  Header,
  Footer,
  Hero,
  CategoryGrid,
  FeaturedProducts,
  Newsletter,
  Statistics,
  Partners
} from '@/components';
import styles from './page.module.css';

export default function Home() {
  return (
    <div className={styles.page}>
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className={styles.main}>
        {/* Hero Section */}
        <Hero />

        {/* Categories Section */}
        <CategoryGrid />

        {/* Statistics Section - Company key figures */}
        <Statistics />

        {/* Featured Products Section */}
        <FeaturedProducts limit={6} />

        {/* Partners Section - Trusted brands */}
        <Partners />

        {/* Newsletter Section */}
        <Newsletter />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
