/**
 * Database Seed Script
 *
 * Populates the database with:
 * 1. An OWNER user account (admin)
 * 2. All 5 product categories (from src/data/categories.ts)
 * 3. All 11 products with images and variations (from src/data/products.ts)
 *
 * Uses upsert throughout so the script is idempotent — safe to run multiple times.
 *
 * Password is read from SEED_ADMIN_PASSWORD env var with a dev-only default (I1 fix).
 * Category lookup uses a pre-built map instead of fragile string replace (I2 fix).
 *
 * Run: npx tsx prisma/seed.ts
 *
 * @module prisma/seed
 */

import { PrismaClient, VariationType } from '@prisma/client';
import { hash } from 'argon2';
import { categories } from '../src/data/categories';
import { products } from '../src/data/products';

const prisma = new PrismaClient();

/** Map frontend variation type strings to Prisma enum values. */
function toVariationType(type: string): VariationType {
  const map: Record<string, VariationType> = {
    color: VariationType.COLOR,
    size: VariationType.SIZE,
    material: VariationType.MATERIAL,
  };
  return map[type] ?? VariationType.COLOR;
}

async function main(): Promise<void> {
  console.log('--- Equipement Ouarzazate — Seed Script ---\n');

  // ──────────────────────────────────────────────
  // 1. Owner Admin (I1: password from env var)
  // ──────────────────────────────────────────────
  console.log('[1/3] Creating OWNER user...');

  const seedPassword = process.env.SEED_ADMIN_PASSWORD ?? 'Admin@EqOuarz2025!';
  const passwordHash = await hash(seedPassword, { type: 2 });

  const admin = await prisma.user.upsert({
    where: { username: 'admin' },
    update: {
      email: 'equipementouarzazate@gmail.com',
      displayName: 'Administrateur',
      // passwordHash intentionally omitted — do not overwrite a password
      // that may have been changed after initial seeding.
      role: 'OWNER',
      isActive: true,
    },
    create: {
      username: 'admin',
      email: 'equipementouarzazate@gmail.com',
      displayName: 'Administrateur',
      passwordHash,
      role: 'OWNER',
      isActive: true,
    },
  });

  console.log(`  -> User "${admin.username}" (${admin.role}) ready.\n`);

  // ──────────────────────────────────────────────
  // 2. Categories
  // ──────────────────────────────────────────────
  console.log('[2/3] Seeding categories...');

  for (const cat of categories) {
    const result = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {
        name: cat.name,
        description: cat.description,
        icon: cat.icon,
        imageUrl: cat.imageUrl ?? null,
        order: cat.order,
        isActive: cat.isActive,
      },
      create: {
        slug: cat.slug,
        name: cat.name,
        description: cat.description,
        icon: cat.icon,
        imageUrl: cat.imageUrl ?? null,
        order: cat.order,
        isActive: cat.isActive,
      },
    });
    console.log(`  -> Category "${result.name}" (${result.slug})`);
  }

  console.log(`  -> ${categories.length} categories seeded.\n`);

  // ──────────────────────────────────────────────
  // 3. Products (with images and variations)
  //    I2 fix: build a lookup map from mock category IDs to DB slugs
  // ──────────────────────────────────────────────
  console.log('[3/3] Seeding products...');

  // Build a stable lookup: mock category id (e.g. "cat-sanitaire") → slug (e.g. "sanitaire")
  const categoryIdToSlug = new Map<string, string>();
  for (const cat of categories) {
    categoryIdToSlug.set(cat.id, cat.slug);
  }

  let productCount = 0;

  for (const prod of products) {
    // Use the explicit map instead of fragile string manipulation
    const categorySlug = categoryIdToSlug.get(prod.categoryId);

    if (!categorySlug) {
      console.warn(`  !! Skipping "${prod.name}" — category "${prod.categoryId}" not found in mock data.`);
      continue;
    }

    const category = await prisma.category.findUnique({
      where: { slug: categorySlug },
    });

    if (!category) {
      console.warn(`  !! Skipping "${prod.name}" — category slug "${categorySlug}" not found in database.`);
      continue;
    }

    // Upsert the product
    const product = await prisma.product.upsert({
      where: { slug: prod.slug },
      update: {
        name: prod.name,
        description: prod.description,
        categoryId: category.id,
        isNew: prod.isNew,
        isFeatured: prod.isFeatured,
        isPublished: prod.isPublished,
      },
      create: {
        slug: prod.slug,
        name: prod.name,
        description: prod.description,
        categoryId: category.id,
        isNew: prod.isNew,
        isFeatured: prod.isFeatured,
        isPublished: prod.isPublished,
      },
    });

    // Sync images: delete existing and re-create
    await prisma.productImage.deleteMany({
      where: { productId: product.id },
    });

    if (prod.images.length > 0) {
      await prisma.productImage.createMany({
        data: prod.images.map((img) => ({
          productId: product.id,
          url: img.url,
          alt: img.alt,
          order: img.order,
          isFeatured: img.isFeatured,
        })),
      });
    }

    // Sync variations: delete existing and re-create
    await prisma.productVariation.deleteMany({
      where: { productId: product.id },
    });

    if (prod.variations && prod.variations.length > 0) {
      await prisma.productVariation.createMany({
        data: prod.variations.map((v) => ({
          productId: product.id,
          type: toVariationType(v.type),
          name: v.name,
          value: v.value,
        })),
      });
    }

    const imgCount = prod.images.length;
    const varCount = prod.variations?.length ?? 0;
    console.log(`  -> "${product.name}" (${imgCount} images, ${varCount} variations)`);
    productCount++;
  }

  console.log(`  -> ${productCount} products seeded.\n`);
  console.log('--- Seed complete! ---');
}

main()
  .catch((error) => {
    console.error('Seed failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
