import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

// Fix __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Correct path relative to where script is run (root)
const SRC_DIR = path.join(process.cwd(), 'public', 'images', 'real', 'showroom');
const MAX_WIDTH = 1600;
const QUALITY = 85;

async function optimize() {
    try {
        console.log(`📂 Scanning directory: ${SRC_DIR}`);
        const files = await fs.readdir(SRC_DIR);
        const pngs = files.filter(f => f.toLowerCase().endsWith('.png'));

        if (pngs.length === 0) {
            console.log('⚠️ No PNG files found to optimize.');
            return;
        }

        console.log(`📸 Found ${pngs.length} PNG images to optimize...`);
        let totalOriginalSize = 0;
        let totalNewSize = 0;

        for (const file of pngs) {
            const inputPath = path.join(SRC_DIR, file);
            const outputPath = inputPath.replace('.png', '.webp');

            const stat = await fs.stat(inputPath);
            totalOriginalSize += stat.size;

            console.log(`⚙️ Processing: ${file} (${(stat.size / 1024 / 1024).toFixed(2)} MB)...`);

            await sharp(inputPath)
                .resize({ width: MAX_WIDTH, withoutEnlargement: true })
                .webp({ quality: QUALITY })
                .toFile(outputPath);

            const newStat = await fs.stat(outputPath);
            totalNewSize += newStat.size;

            console.log(`   ✅ Saved: ${path.basename(outputPath)} (${(newStat.size / 1024).toFixed(2)} KB) - Ratio: ${((newStat.size / stat.size) * 100).toFixed(1)}%`);
        }

        const savedMB = (totalOriginalSize - totalNewSize) / 1024 / 1024;
        console.log(`\n🎉 Optimization Complete!`);
        console.log(`📉 Saved ${savedMB.toFixed(2)} MB`);
        console.log(`🚀 Total Size: ${(totalOriginalSize / 1024 / 1024).toFixed(2)} MB -> ${(totalNewSize / 1024 / 1024).toFixed(2)} MB`);

    } catch (error) {
        console.error('❌ Error during optimization:', error);
    }
}

optimize();
