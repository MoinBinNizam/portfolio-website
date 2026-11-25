import { v2 as cloudinary } from 'cloudinary';
import { httpError } from '../utils/httpError.js';
import { env } from './env.js';

function ensureConfigured(): void {
  if (!env.CLOUDINARY_CLOUD_NAME || !env.CLOUDINARY_API_KEY || !env.CLOUDINARY_API_SECRET) {
    throw httpError(
      500,
      'UPLOAD_ERROR',
      'Cloudinary is not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in .env.',
    );
  }
  cloudinary.config({
    cloud_name: env.CLOUDINARY_CLOUD_NAME,
    api_key: env.CLOUDINARY_API_KEY,
    api_secret: env.CLOUDINARY_API_SECRET,
    secure: true,
  });
}

export interface UploadedCloudAsset {
  url: string;
  publicId: string;
  width?: number;
  height?: number;
  mimeType: string;
}

export async function uploadBufferToCloudinary(
  buffer: Buffer,
  mimeType: string,
  folder = 'portfolio',
): Promise<UploadedCloudAsset> {
  ensureConfigured();
  const isPdf = mimeType === 'application/pdf';

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: isPdf ? 'raw' : 'image',
        ...(isPdf
          ? {}
          : {
              transformation: [{ width: 2000, crop: 'limit' }],
              format: 'webp',
            }),
      },
      (error, result) => {
        if (error || !result) {
          reject(httpError(502, 'UPLOAD_ERROR', error?.message ?? 'Cloudinary upload failed'));
          return;
        }
        resolve({
          url: result.secure_url,
          publicId: result.public_id,
          width: result.width,
          height: result.height,
          mimeType: isPdf ? 'application/pdf' : 'image/webp',
        });
      },
    );
    stream.end(buffer);
  });
}

export async function deleteFromCloudinary(publicId: string): Promise<void> {
  if (!env.CLOUDINARY_CLOUD_NAME || !env.CLOUDINARY_API_KEY || !env.CLOUDINARY_API_SECRET) {
    return;
  }
  ensureConfigured();
  await cloudinary.uploader.destroy(publicId, { resource_type: 'image' }).catch(() => undefined);
  await cloudinary.uploader.destroy(publicId, { resource_type: 'raw' }).catch(() => undefined);
}
