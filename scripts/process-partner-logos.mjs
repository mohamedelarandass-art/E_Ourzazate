/**
 * Partner Logos Processing Script
 * 
 * This script renames and converts all partner logos to a consistent format:
 * - PNG format with transparent background where possible
 * - Consistent naming convention (lowercase, hyphenated)
 * - Organized output
 */

import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const INPUT_DIR = path.join(__dirname, '../public/images/real/partners');
const OUTPUT_DIR = path.join(__dirname, '../public/images/real/partners-processed');

// Logo mapping: original filename -> new name and metadata
const LOGO_MAPPING = {
    '1-1.webp': {
        newName: 'ciments-du-maroc',
        brand: 'Ciments du Maroc',
        category: 'Matériaux de construction',
        hasWhiteBg: true
    },
    '10-3.webp': {
        newName: 'sonasid',
        brand: 'Sonasid',
        category: 'Acier et métallurgie',
        hasWhiteBg: true
    },
    '11-2.webp': {
        newName: 'gadimat',
        brand: 'Gadimat',
        category: 'Bois et panneaux',
        hasWhiteBg: true
    },
    '11-3.webp': {
        newName: 'ariston',
        brand: 'Ariston',
        category: 'Chauffage et eau chaude',
        hasWhiteBg: true
    },
    '13-1.webp': {
        newName: 'etaf',
        brand: 'ETAF',
        category: 'Équipement',
        hasWhiteBg: false // Has a corner fold effect
    },
    '2.0-1.webp': {
        newName: 'nova-gnd',
        brand: 'Nova GND',
        category: 'Équipement',
        hasWhiteBg: false // Has dark background
    },
    '3-1.webp': {
        newName: 'socodam-davum',
        brand: 'Socodam Davum',
        category: 'Distribution',
        hasWhiteBg: true
    },
    '4-1.webp': {
        newName: 'cifre-ceramica',
        brand: 'Cifre Ceramica',
        category: 'Carrelage et céramique',
        hasWhiteBg: true
    },
    'Logo-ingelec.png': {
        newName: 'ingelec',
        brand: 'Ingelec',
        category: 'Électricité',
        hasWhiteBg: true
    },
    'Sika_logo.png': {
        newName: 'sika',
        brand: 'Sika',
        category: 'Chimie du bâtiment',
        hasWhiteBg: true
    },
    'atlas-logo-DE598A2E14-seeklogo.com_.png': {
        newName: 'atlas-peintures',
        brand: 'Atlas Peintures',
        category: 'Peintures et revêtements',
        hasWhiteBg: true
    },
    'images (1).png': {
        newName: 'kadir-distribution',
        brand: 'Kadir Distribution',
        category: 'Distribution sanitaire',
        hasWhiteBg: true
    },
    'images.jpeg': {
        newName: 'sofa',
        brand: 'SOFA',
        category: 'Matériel électrique',
        hasWhiteBg: true
    },
    'images.png': {
        newName: 'olap',
        brand: 'OLAP',
        category: 'Électricité',
        hasWhiteBg: false // Has red background
    },
    'vitra-logo-png_seeklogo-150018.png': {
        newName: 'vitra',
        brand: 'VitrA',
        category: 'Sanitaire et céramique',
        hasWhiteBg: true
    }
};

/**
 * Remove white/near-white background from an image
 */
async function removeWhiteBackground(inputBuffer) {
    const image = sharp(inputBuffer);
    const metadata = await image.metadata();

    // Get raw pixel data
    const { data, info } = await image
        .ensureAlpha()
        .raw()
        .toBuffer({ resolveWithObject: true });

    // Process each pixel
    const pixels = new Uint8Array(data);
    const threshold = 240; // Pixels with R,G,B all above this are considered white

    for (let i = 0; i < pixels.length; i += 4) {
        const r = pixels[i];
        const g = pixels[i + 1];
        const b = pixels[i + 2];

        // Check if pixel is close to white
        if (r > threshold && g > threshold && b > threshold) {
            pixels[i + 3] = 0; // Set alpha to 0 (transparent)
        }
    }

    return sharp(Buffer.from(pixels), {
        raw: {
            width: info.width,
            height: info.height,
            channels: 4
        }
    }).png().toBuffer();
}

/**
 * Process a single logo
 */
async function processLogo(filename, config) {
    const inputPath = path.join(INPUT_DIR, filename);
    const outputPath = path.join(OUTPUT_DIR, `${config.newName}.png`);

    console.log(`\n📦 Processing: ${filename} -> ${config.newName}.png`);
    console.log(`   Brand: ${config.brand}`);
    console.log(`   Category: ${config.category}`);

    try {
        // Read input file
        const inputBuffer = await fs.readFile(inputPath);

        let outputBuffer;

        if (config.hasWhiteBg) {
            // Remove white background
            console.log('   Removing white background...');
            outputBuffer = await removeWhiteBackground(inputBuffer);
        } else {
            // Just convert to PNG with alpha
            console.log('   Converting to PNG...');
            outputBuffer = await sharp(inputBuffer)
                .ensureAlpha()
                .png()
                .toBuffer();
        }

        // Save the processed image
        await fs.writeFile(outputPath, outputBuffer);

        // Get file sizes for comparison
        const inputStats = await fs.stat(inputPath);
        const outputStats = await fs.stat(outputPath);

        console.log(`   ✅ Success! ${(inputStats.size / 1024).toFixed(1)}KB -> ${(outputStats.size / 1024).toFixed(1)}KB`);

        return {
            success: true,
            filename: config.newName,
            brand: config.brand,
            category: config.category,
            originalSize: inputStats.size,
            newSize: outputStats.size
        };
    } catch (error) {
        console.error(`   ❌ Error: ${error.message}`);
        return {
            success: false,
            filename: config.newName,
            error: error.message
        };
    }
}

/**
 * Generate a TypeScript data file for the partners
 */
async function generatePartnersData(results) {
    const successfulLogos = results.filter(r => r.success);

    const tsContent = `/**
 * Partner Logos Data
 * Auto-generated by process-partner-logos.mjs
 * Generated on: ${new Date().toISOString()}
 */

export interface Partner {
  id: string;
  name: string;
  category: string;
  logo: string;
}

export const partners: Partner[] = [
${successfulLogos.map(logo => `  {
    id: '${logo.filename}',
    name: '${logo.brand}',
    category: '${logo.category}',
    logo: '/images/real/partners-processed/${logo.filename}.png'
  }`).join(',\n')}
];

export const partnerCategories = [
  'Matériaux de construction',
  'Acier et métallurgie',
  'Bois et panneaux',
  'Chauffage et eau chaude',
  'Électricité',
  'Distribution',
  'Carrelage et céramique',
  'Chimie du bâtiment',
  'Peintures et revêtements',
  'Distribution sanitaire',
  'Matériel électrique',
  'Sanitaire et céramique',
  'Équipement'
] as const;

export type PartnerCategory = typeof partnerCategories[number];

export default partners;
`;

    const outputPath = path.join(__dirname, '../src/data/partners.ts');
    await fs.writeFile(outputPath, tsContent);
    console.log(`\n📄 Generated partners data file: ${outputPath}`);
}

/**
 * Main execution
 */
async function main() {
    console.log('🎨 Partner Logos Processing Script');
    console.log('===================================');
    console.log(`Input directory: ${INPUT_DIR}`);
    console.log(`Output directory: ${OUTPUT_DIR}`);

    // Ensure output directory exists
    await fs.mkdir(OUTPUT_DIR, { recursive: true });

    // Process all logos
    const results = [];

    for (const [filename, config] of Object.entries(LOGO_MAPPING)) {
        const result = await processLogo(filename, config);
        results.push(result);
    }

    // Generate summary
    console.log('\n\n📊 Processing Summary');
    console.log('=====================');

    const successful = results.filter(r => r.success);
    const failed = results.filter(r => !r.success);

    console.log(`✅ Successful: ${successful.length}`);
    console.log(`❌ Failed: ${failed.length}`);

    if (failed.length > 0) {
        console.log('\nFailed logos:');
        failed.forEach(f => console.log(`  - ${f.filename}: ${f.error}`));
    }

    // Generate TypeScript data file
    await generatePartnersData(results);

    // Generate mapping documentation
    console.log('\n\n📋 Logo Mapping Reference');
    console.log('=========================');
    successful.forEach(logo => {
        console.log(`${logo.brand.padEnd(25)} -> ${logo.filename}.png`);
    });

    console.log('\n✨ Done!');
}

main().catch(console.error);
