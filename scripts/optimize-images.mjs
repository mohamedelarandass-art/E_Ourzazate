/**
 * Image Optimization Script
 * 
 * Converts all PNG/JPG images to WebP format with optimal compression.
 * Creates optimized versions while preserving originals as backup.
 * 
 * Usage: node scripts/optimize-images.mjs
 * 
 * @requires sharp
 */

import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';
import { existsSync, mkdirSync } from 'fs';

// Configuration
const CONFIG = {
    // Source directory
    sourceDir: './public/images',

    // Backup directory for originals
    backupDir: './public/images-backup',

    // Quality settings per image type
    quality: {
        hero: 75,        // Hero images - balance quality/size
        categories: 80,  // Category cards - slightly higher quality
        products: 75,    // Product images - good compression
        default: 75,     // Default quality
    },

    // Maximum dimensions (resize if larger)
    maxDimensions: {
        hero: { width: 1920, height: 1080 },
        categories: { width: 800, height: 600 },
        products: { width: 800, height: 800 },
        default: { width: 1200, height: 1200 },
    },

    // File extensions to process
    extensions: ['.png', '.jpg', '.jpeg'],

    // Directories to skip
    skipDirs: ['real', 'backup', 'images-backup'],
};

// Statistics
const stats = {
    processed: 0,
    skipped: 0,
    errors: 0,
    originalSize: 0,
    optimizedSize: 0,
};

/**
 * Get quality setting based on directory
 */
function getQuality(filePath) {
    if (filePath.includes('/hero/') || filePath.includes('\\hero\\')) {
        return CONFIG.quality.hero;
    }
    if (filePath.includes('/categories/') || filePath.includes('\\categories\\')) {
        return CONFIG.quality.categories;
    }
    if (filePath.includes('/products/') || filePath.includes('\\products\\')) {
        return CONFIG.quality.products;
    }
    return CONFIG.quality.default;
}

/**
 * Get max dimensions based on directory
 */
function getMaxDimensions(filePath) {
    if (filePath.includes('/hero/') || filePath.includes('\\hero\\')) {
        return CONFIG.maxDimensions.hero;
    }
    if (filePath.includes('/categories/') || filePath.includes('\\categories\\')) {
        return CONFIG.maxDimensions.categories;
    }
    if (filePath.includes('/products/') || filePath.includes('\\products\\')) {
        return CONFIG.maxDimensions.products;
    }
    return CONFIG.maxDimensions.default;
}

/**
 * Recursively get all image files
 */
async function getImageFiles(dir, files = []) {
    const entries = await fs.readdir(dir, { withFileTypes: true });

    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);

        if (entry.isDirectory()) {
            // Skip backup and real directories
            if (CONFIG.skipDirs.includes(entry.name)) {
                console.log(`  ⏭️  Skipping directory: ${entry.name}`);
                continue;
            }
            await getImageFiles(fullPath, files);
        } else if (entry.isFile()) {
            const ext = path.extname(entry.name).toLowerCase();
            if (CONFIG.extensions.includes(ext)) {
                files.push(fullPath);
            }
        }
    }

    return files;
}

/**
 * Optimize a single image
 */
async function optimizeImage(filePath) {
    const ext = path.extname(filePath).toLowerCase();
    const baseName = path.basename(filePath, ext);
    const dirName = path.dirname(filePath);
    const webpPath = path.join(dirName, `${baseName}.webp`);

    try {
        // Get original file size
        const originalStats = await fs.stat(filePath);
        stats.originalSize += originalStats.size;

        // Get quality and dimensions for this file
        const quality = getQuality(filePath);
        const maxDims = getMaxDimensions(filePath);

        // Read and process image
        const image = sharp(filePath);
        const metadata = await image.metadata();

        // Resize if larger than max dimensions
        let pipeline = image;
        if (metadata.width > maxDims.width || metadata.height > maxDims.height) {
            pipeline = pipeline.resize(maxDims.width, maxDims.height, {
                fit: 'inside',
                withoutEnlargement: true,
            });
            console.log(`  📐 Resizing: ${metadata.width}x${metadata.height} → max ${maxDims.width}x${maxDims.height}`);
        }

        // Convert to WebP
        await pipeline
            .webp({ quality, effort: 6 })
            .toFile(webpPath);

        // Get optimized file size
        const optimizedStats = await fs.stat(webpPath);
        stats.optimizedSize += optimizedStats.size;

        // Calculate savings
        const savings = ((1 - optimizedStats.size / originalStats.size) * 100).toFixed(1);
        const originalKB = (originalStats.size / 1024).toFixed(1);
        const optimizedKB = (optimizedStats.size / 1024).toFixed(1);

        console.log(`  ✅ ${path.basename(filePath)} → ${baseName}.webp`);
        console.log(`     ${originalKB}KB → ${optimizedKB}KB (${savings}% smaller)`);

        stats.processed++;
        return true;
    } catch (error) {
        console.error(`  ❌ Error processing ${filePath}:`, error.message);
        stats.errors++;
        return false;
    }
}

/**
 * Create backup of original images
 */
async function createBackup(files) {
    console.log('\n📦 Creating backup of original images...\n');

    if (!existsSync(CONFIG.backupDir)) {
        mkdirSync(CONFIG.backupDir, { recursive: true });
    }

    for (const file of files) {
        const relativePath = path.relative(CONFIG.sourceDir, file);
        const backupPath = path.join(CONFIG.backupDir, relativePath);
        const backupDir = path.dirname(backupPath);

        if (!existsSync(backupDir)) {
            mkdirSync(backupDir, { recursive: true });
        }

        await fs.copyFile(file, backupPath);
    }

    console.log(`  ✅ Backed up ${files.length} files to ${CONFIG.backupDir}\n`);
}

/**
 * Main execution
 */
async function main() {
    console.log('\n' + '='.repeat(60));
    console.log('🖼️  Image Optimization Script');
    console.log('='.repeat(60) + '\n');

    // Get all image files
    console.log('📂 Scanning for images...\n');
    const files = await getImageFiles(CONFIG.sourceDir);
    console.log(`\n  Found ${files.length} images to process.\n`);

    if (files.length === 0) {
        console.log('No images found to process.');
        return;
    }

    // Create backup
    await createBackup(files);

    // Process each image
    console.log('🔄 Converting images to WebP...\n');

    for (const file of files) {
        await optimizeImage(file);
    }

    // Print summary
    console.log('\n' + '='.repeat(60));
    console.log('📊 Summary');
    console.log('='.repeat(60));
    console.log(`  ✅ Processed: ${stats.processed} images`);
    console.log(`  ⏭️  Skipped: ${stats.skipped} images`);
    console.log(`  ❌ Errors: ${stats.errors} images`);
    console.log('');
    console.log(`  📦 Original size: ${(stats.originalSize / 1024 / 1024).toFixed(2)} MB`);
    console.log(`  📦 Optimized size: ${(stats.optimizedSize / 1024 / 1024).toFixed(2)} MB`);
    console.log(`  💾 Savings: ${((1 - stats.optimizedSize / stats.originalSize) * 100).toFixed(1)}%`);
    console.log('='.repeat(60) + '\n');

    console.log('⚠️  Next steps:');
    console.log('  1. Update component image paths from .png/.jpg to .webp');
    console.log('  2. Test the website to ensure images load correctly');
    console.log('  3. Delete original PNG/JPG files after verification');
    console.log('  4. Delete backup folder when confident\n');
}

// Run
main().catch(console.error);
