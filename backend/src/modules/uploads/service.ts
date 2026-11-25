import { deleteFromCloudinary, uploadBufferToCloudinary } from '../../config/cloudinary.js';
import { httpError } from '../../utils/httpError.js';

export const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;

export const ALLOWED_MIME_TYPES = new Set([
  'image/png',
  'image/jpeg',
  'image/webp',
  'application/pdf',
]);

export function detectMagicMime(buffer: Buffer): string | null {
  if (buffer.length < 12) return null;

  // PNG: 89 50 4E 47 0D 0A 1A 0A
  if (buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4e && buffer[3] === 0x47) {
    return 'image/png';
  }

  // JPEG: FF D8 FF
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return 'image/jpeg';
  }

  // WebP: RIFF....WEBP
  if (
    buffer.subarray(0, 4).toString('ascii') === 'RIFF' &&
    buffer.subarray(8, 12).toString('ascii') === 'WEBP'
  ) {
    return 'image/webp';
  }

  // PDF: %PDF
  if (buffer.subarray(0, 4).toString('ascii') === '%PDF') {
    return 'application/pdf';
  }

  return null;
}

export async function handleUpload(file: Express.Multer.File | undefined, alt: string | undefined) {
  if (!file) {
    throw httpError(422, 'VALIDATION_ERROR', 'File is required');
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    throw httpError(422, 'UPLOAD_ERROR', 'File exceeds 10 MB limit');
  }
  if (!ALLOWED_MIME_TYPES.has(file.mimetype)) {
    throw httpError(422, 'UPLOAD_ERROR', 'Unsupported file type. Allowed: PNG, JPG, WebP, PDF');
  }

  const detected = detectMagicMime(file.buffer);
  if (!detected || detected !== file.mimetype) {
    throw httpError(422, 'UPLOAD_ERROR', 'File contents do not match declared MIME type');
  }

  const uploaded = await uploadBufferToCloudinary(file.buffer, detected);
  const safeAlt = (alt ?? '').trim() || file.originalname || 'Uploaded asset';

  return {
    ...uploaded,
    alt: safeAlt.slice(0, 200),
  };
}

export async function handleDelete(publicId: string): Promise<void> {
  if (!publicId.trim()) {
    throw httpError(422, 'VALIDATION_ERROR', 'publicId is required');
  }
  await deleteFromCloudinary(publicId);
}
