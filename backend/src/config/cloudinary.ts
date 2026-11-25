import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { v2 as cloudinary } from 'cloudinary';
import { httpError } from '../utils/httpError.js';
import { env } from './env.js';

const here = path.dirname(fileURLToPath(import.meta.url));
export const LOCAL_UPLOADS_DIR = path.resolve(here, '../../uploads');

function hasCloudinaryConfig(): boolean {
  return Boolean(env.CLOUDINARY_CLOUD_NAME && env.CLOUDINARY_API_KEY && env.CLOUDINARY_API_SECRET);
}

function configureCloudinary(): void {
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

const MIME_TO_EXT: Record<string, string> = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/webp': 'webp',
  'application/pdf': 'pdf',
};

async function saveLocally(buffer: Buffer, mimeType: string): Promise<UploadedCloudAsset> {
  await fs.mkdir(LOCAL_UPLOADS_DIR, { recursive: true });
  const ext = MIME_TO_EXT[mimeType] ?? 'bin';
  const filename = `${Date.now()}-${crypto.randomBytes(6).toString('hex')}.${ext}`;
  await fs.writeFile(path.join(LOCAL_UPLOADS_DIR, filename), buffer);

  return {
    url: `http://localhost:${env.PORT}/uploads/${filename}`,
    publicId: `local:${filename}`,
    mimeType,
  };
}

export async function uploadBufferToCloudinary(
  buffer: Buffer,
  mimeType: string,
  folder = 'portfolio',
): Promise<UploadedCloudAsset> {
  if (!hasCloudinaryConfig()) {
    return saveLocally(buffer, mimeType);
  }

  configureCloudinary();
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
  if (publicId.startsWith('local:')) {
    const filename = path.basename(publicId.slice('local:'.length));
    await fs.unlink(path.join(LOCAL_UPLOADS_DIR, filename)).catch(() => undefined);
    return;
  }

  if (!hasCloudinaryConfig()) {
    return;
  }

  configureCloudinary();
  await cloudinary.uploader.destroy(publicId, { resource_type: 'image' }).catch(() => undefined);
  await cloudinary.uploader.destroy(publicId, { resource_type: 'raw' }).catch(() => undefined);
}
