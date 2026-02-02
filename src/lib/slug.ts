import { prisma } from '@/lib/prisma';
import { slugify } from '@/lib/utils';

const MAX_SLUG_ATTEMPTS = 100;

/**
 * Generate a unique slug for a product.
 * Appends -2, -3, etc. if the base slug already exists.
 * Throws after MAX_SLUG_ATTEMPTS to prevent unbounded loops.
 *
 * @param name — The product name to slugify
 * @param excludeId — Optional product ID to exclude (for updates)
 */
export async function generateUniqueSlug(
  name: string,
  excludeId?: string,
): Promise<string> {
  const baseSlug = slugify(name);
  let slug = baseSlug;
  let counter = 1;

  while (counter <= MAX_SLUG_ATTEMPTS) {
    const existing = await prisma.product.findUnique({
      where: { slug },
      select: { id: true },
    });
    if (!existing || (excludeId && existing.id === excludeId)) return slug;
    counter++;
    slug = `${baseSlug}-${counter}`;
  }

  throw new Error(
    `Impossible de générer un slug unique pour "${name}" après ${MAX_SLUG_ATTEMPTS} tentatives`,
  );
}
