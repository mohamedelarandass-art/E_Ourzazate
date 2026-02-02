/**
 * POST /api/upload/image
 *
 * Accepts multipart/form-data with an image file.
 * Validates type + size, resizes to max 1200px width,
 * converts to WebP quality 85, saves to public/uploads/products/.
 *
 * TECH DEBT: Migrate to Vercel Blob for production deployment.
 */

import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import sharp from 'sharp';
import { requireRole } from '@/lib/auth-utils';
import { validateOrigin } from '@/lib/request-utils';
import { ValidationError, apiErrorResponse } from '@/lib/errors';
import type { ApiResponse } from '@/types';

const ALLOWED_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/avif',
]);

const MAX_SIZE = 5 * 1024 * 1024; // 5MB
const MIN_SIZE = 100; // Reject trivially small files (< 100 bytes)

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads', 'products');

/**
 * Validate actual file content via magic bytes.
 * Prevents MIME type spoofing attacks.
 */
function validateMagicBytes(buffer: Buffer): boolean {
  if (buffer.length < 12) return false;

  // JPEG: FF D8 FF
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) return true;

  // PNG: 89 50 4E 47
  if (buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4e && buffer[3] === 0x47) return true;

  // WebP: RIFF....WEBP
  if (
    buffer[0] === 0x52 && buffer[1] === 0x49 && buffer[2] === 0x46 && buffer[3] === 0x46 &&
    buffer[8] === 0x57 && buffer[9] === 0x45 && buffer[10] === 0x42 && buffer[11] === 0x50
  ) return true;

  // AVIF: ....ftypavif or ....ftypavis (ISOBMFF with AVIF brand at offset 8–11)
  if (
    buffer[4] === 0x66 && buffer[5] === 0x74 && buffer[6] === 0x79 && buffer[7] === 0x70 &&
    buffer[8] === 0x61 && buffer[9] === 0x76 && buffer[10] === 0x69 &&
    (buffer[11] === 0x66 || buffer[11] === 0x73) // 'avif' or 'avis'
  ) return true;

  return false;
}

export async function POST(request: NextRequest) {
  try {
    await requireRole(['OWNER', 'MANAGER']);
    validateOrigin(request);

    const formData = await request.formData();
    const file = formData.get('file');

    if (!file || !(file instanceof File)) {
      throw new ValidationError('Aucun fichier fourni');
    }

    if (!ALLOWED_TYPES.has(file.type)) {
      throw new ValidationError(
        'Type de fichier non autorisé. Formats acceptés : JPEG, PNG, WebP, AVIF',
      );
    }

    if (file.size > MAX_SIZE) {
      throw new ValidationError(
        'Le fichier est trop volumineux. Taille maximale : 5 Mo',
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    if (buffer.length < MIN_SIZE) {
      throw new ValidationError('Le fichier est trop petit ou vide');
    }

    if (buffer.length > MAX_SIZE) {
      throw new ValidationError(
        'Le fichier est trop volumineux. Taille maximale : 5 Mo',
      );
    }

    if (!validateMagicBytes(buffer)) {
      throw new ValidationError(
        'Le contenu du fichier ne correspond pas à un format image valide',
      );
    }

    const processed = await sharp(buffer)
      .resize({ width: 1200, withoutEnlargement: true })
      .webp({ quality: 85 })
      .toBuffer();

    if (!existsSync(UPLOAD_DIR)) {
      await mkdir(UPLOAD_DIR, { recursive: true });
    }

    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    const filename = `${timestamp}-${random}.webp`;
    const filePath = path.join(UPLOAD_DIR, filename);

    await writeFile(filePath, processed);

    const url = `/uploads/products/${filename}`;

    return NextResponse.json<ApiResponse<{ url: string }>>(
      {
        success: true,
        data: { url },
      },
      { status: 201 },
    );
  } catch (error) {
    return apiErrorResponse(error);
  }
}
