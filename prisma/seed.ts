/**
 * Database Seed Script
 *
 * Populates the database with:
 * 1. A SUPER_ADMIN user account
 * 2. All 5 product categories (from src/data/categories.ts)
 * 3. All 13 products with images and variations (from src/data/products.ts)
 *
 * Uses upsert throughout so the script is idempotent — safe to run multiple times.
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
  // 1. Super Admin
  // ──────────────────────────────────────────────
  console.log('[1/3] Creating SUPER_ADMIN user...');

  const passwordHash = await hash('Admin@EqOuarz2025!', { type: 2 });

  const admin = await prisma.user.upsert({
    where: { username: 'admin' },
    update: {
      email: 'equipementouarzazate@gmail.com',
      displayName: 'Administrateur',
      passwordHash,
      role: 'SUPER_ADMIN',
      isActive: true,
    },
    create: {
      username: 'admin',
      email: 'equipementouarzazate@gmail.com',
      displayName: 'Administrateur',
      passwordHash,
      role: 'SUPER_ADMIN',
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
  // ──────────────────────────────────────────────
  console.log('[3/3] Seeding products...');

  for (const prod of products) {
    // Find the category by the mock categoryId (e.g., "cat-sanitaire")
    // We stored categories by slug, and the slug matches the part after "cat-"
    const categorySlug = prod.categoryId.replace('cat-', '');
    const category = await prisma.category.findUnique({
      where: { slug: categorySlug },
    });

    if (!category) {
      console.warn(`  !! Skipping "${prod.name}" — category "${prod.categoryId}" not found.`);
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

    // Sync images: delete existing and re-create (upsert on images is complex with no stable unique key)
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
  }

  console.log(`  -> ${products.length} products seeded.\n`);
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
