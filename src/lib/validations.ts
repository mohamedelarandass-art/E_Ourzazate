/**
 * Zod Validation Schemas
 *
 * Centralized request validation for all API routes.
 * Each schema validates and transforms incoming data before
 * it reaches the business logic layer.
 *
 * @module lib/validations
 */

import { z } from 'zod';

// ──────────────────────────────────────────────
// Auth
// ──────────────────────────────────────────────

/** Login request: username + password. */
export const loginSchema = z.object({
  username: z
    .string()
    .min(3, 'Le nom d\'utilisateur doit contenir au moins 3 caracteres'),
  password: z
    .string()
    .min(8, 'Le mot de passe doit contenir au moins 8 caracteres'),
});

export type LoginInput = z.infer<typeof loginSchema>;

// ──────────────────────────────────────────────
// Contact
// ──────────────────────────────────────────────

/** Contact form submission. */
export const contactFormSchema = z.object({
  name: z
    .string()
    .min(2, 'Le nom doit contenir au moins 2 caracteres')
    .max(100, 'Le nom ne doit pas depasser 100 caracteres'),
  email: z
    .string()
    .email('Adresse email invalide'),
  phone: z
    .string()
    .max(20, 'Numero de telephone invalide')
    .optional(),
  subject: z
    .string()
    .min(1, 'Le sujet est requis')
    .max(200, 'Le sujet ne doit pas depasser 200 caracteres'),
  message: z
    .string()
    .min(10, 'Le message doit contenir au moins 10 caracteres')
    .max(5000, 'Le message ne doit pas depasser 5000 caracteres'),
});

export type ContactFormInput = z.infer<typeof contactFormSchema>;

// ──────────────────────────────────────────────
// Newsletter
// ──────────────────────────────────────────────

/** Newsletter subscription. */
export const newsletterSchema = z.object({
  email: z
    .string()
    .email('Adresse email invalide'),
  source: z
    .string()
    .optional(),
});

export type NewsletterInput = z.infer<typeof newsletterSchema>;

// ──────────────────────────────────────────────
// Products
// ──────────────────────────────────────────────

/** Image sub-schema for product creation. */
const productImageSchema = z.object({
  url: z.string().min(1, 'L\'URL de l\'image est requise'),
  alt: z.string().min(1, 'Le texte alternatif est requis'),
  order: z.number().int().min(0),
  isFeatured: z.boolean(),
});

/** Variation sub-schema for product creation. */
const productVariationSchema = z.object({
  type: z.enum(['color', 'size', 'material'], {
    message: 'Type de variation invalide',
  }),
  name: z.string().min(1, 'Le nom de la variation est requis'),
  value: z.string().min(1, 'La valeur de la variation est requise'),
});

/**
 * Create a new product.
 *
 * Note on slug (I6): slug is NOT in this schema because it is auto-generated
 * from the product name by the API route handler using `slugify()` from
 * `src/lib/utils.ts`. This ensures slug uniqueness and consistent formatting.
 */
export const createProductSchema = z.object({
  name: z
    .string()
    .min(2, 'Le nom du produit doit contenir au moins 2 caracteres')
    .max(200, 'Le nom du produit ne doit pas depasser 200 caracteres'),
  description: z
    .string()
    .min(10, 'La description doit contenir au moins 10 caracteres'),
  categoryId: z
    .string()
    .min(1, 'La categorie est requise'),
  isNew: z.boolean().optional().default(false),
  isFeatured: z.boolean().optional().default(false),
  isPublished: z.boolean().optional().default(false),
  images: z.array(productImageSchema).optional().default([]),
  variations: z.array(productVariationSchema).optional().default([]),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;

// ──────────────────────────────────────────────
// Categories
// ──────────────────────────────────────────────

/** Create a new category. */
export const createCategorySchema = z.object({
  name: z
    .string()
    .min(2, 'Le nom de la categorie doit contenir au moins 2 caracteres')
    .max(100, 'Le nom de la categorie ne doit pas depasser 100 caracteres'),
  description: z
    .string()
    .min(10, 'La description doit contenir au moins 10 caracteres'),
  icon: z
    .string()
    .min(1, 'L\'icone est requise'),
  imageUrl: z
    .string()
    .url('URL d\'image invalide')
    .optional(),
  order: z
    .number()
    .int()
    .min(0)
    .optional()
    .default(0),
});

export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
