import type { ApiError, ApiSuccess, FileAsset } from '@portfolio/shared';
import { ApiClientError } from './api';

const BASE_URL = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api` : '/api';

export async function uploadAsset(file: File, alt: string): Promise<FileAsset> {
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

  return (payload as ApiSuccess<FileAsset>).data;
}
