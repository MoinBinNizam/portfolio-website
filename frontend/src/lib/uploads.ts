import type { ApiError, ApiSuccess, FileAsset } from '@portfolio/shared';
import { ApiClientError } from './api';

const BASE_URL = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api` : '/api';
const MAX_IMAGE_WIDTH = 2000;

async function compressImageIfNeeded(
  file: File,
): Promise<{ file: File; width?: number; height?: number }> {
  if (!file.type.startsWith('image/') || file.type === 'image/svg+xml') {
    return { file };
  }

  const bitmap = await createImageBitmap(file).catch(() => null);
  if (!bitmap) {
    return { file };
  }

  const scale = bitmap.width > MAX_IMAGE_WIDTH ? MAX_IMAGE_WIDTH / bitmap.width : 1;
  const targetWidth = Math.max(1, Math.round(bitmap.width * scale));
  const targetHeight = Math.max(1, Math.round(bitmap.height * scale));

  const canvas = document.createElement('canvas');
  canvas.width = targetWidth;
  canvas.height = targetHeight;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    bitmap.close();
    return { file };
  }

  ctx.drawImage(bitmap, 0, 0, targetWidth, targetHeight);
  bitmap.close();

  const blob = await new Promise<Blob | null>((resolve) => {
    canvas.toBlob((result) => resolve(result), 'image/webp', 0.85);
  });

  if (!blob) {
    return { file };
  }

  const baseName = file.name.replace(/\.[^.]+$/, '') || 'image';
  const compressed = new File([blob], `${baseName}.webp`, { type: 'image/webp' });
  return { file: compressed, width: targetWidth, height: targetHeight };
}

export async function uploadAsset(rawFile: File, alt: string): Promise<FileAsset> {
  const { file, width, height } = await compressImageIfNeeded(rawFile);

  const formData = new FormData();
  formData.append('file', file);
  formData.append('alt', alt);

  const response = await fetch(`${BASE_URL}/admin/uploads`, {
    method: 'POST',
    credentials: 'include',
    body: formData,
  });

  const payload = (await response.json().catch(() => null)) as
    ApiSuccess<FileAsset> | ApiError | null;

  if (!response.ok || (payload && 'error' in payload)) {
    const err = payload && 'error' in payload ? payload.error : null;
    throw new ApiClientError(
      response.status,
      err?.code ?? 'UPLOAD_ERROR',
      err?.message ?? 'Upload failed',
    );
  }

  const asset = (payload as ApiSuccess<FileAsset>).data;
  return {
    ...asset,
    width: asset.width ?? width,
    height: asset.height ?? height,
  };
}
