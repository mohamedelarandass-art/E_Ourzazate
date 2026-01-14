import type { NextConfig } from "next";

/**
 * Next.js Configuration
 * 
 * Performance optimizations:
 * - Modern image formats (AVIF, WebP)
 * - Image caching for 30 days
 * - Compression enabled
 * - Static asset cache headers
 */
const nextConfig: NextConfig = {
  // ==========================================================================
  // Image Optimization
  // ==========================================================================
  images: {
    // Enable modern formats - AVIF is smallest, WebP as fallback
    formats: ['image/avif', 'image/webp'],

    // Device sizes for srcset generation
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],

    // Image sizes for srcset (thumbnails, icons)
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],

    // Cache optimized images for 30 days
    minimumCacheTTL: 60 * 60 * 24 * 30,

    // Allow images from these domains (if using external images)
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.cloudinary.com',
      },
    ],
  },

  // ==========================================================================
  // Compression
  // ==========================================================================
  compress: true,

  // ==========================================================================
  // Experimental Features
  // ==========================================================================
  experimental: {
    // Optimize CSS (tree-shaking unused styles)
    optimizeCss: true,
  },

  // ==========================================================================
  // Cache Headers for Static Assets
  // ==========================================================================
  async headers() {
    return [
      // Images - long-term cache (immutable)
      {
        source: '/images/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      // Next.js static files - long-term cache
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      // Fonts - long-term cache
      {
        source: '/fonts/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
