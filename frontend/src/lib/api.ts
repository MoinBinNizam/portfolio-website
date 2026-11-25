import type { ApiError, ApiSuccess } from '@portfolio/shared';

const BASE_URL = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api` : '/api';

export class ApiClientError extends Error {
  public readonly status: number;
  public readonly code: string;

  constructor(status: number, code: string, message: string) {
    super(message);
    this.name = 'ApiClientError';
    this.status = status;
    this.code = code;
  }
}

export async function apiRequest<T, M = Record<string, unknown>>(
  path: string,
  init?: RequestInit,
): Promise<ApiSuccess<T, M>> {
  const response = await fetch(`${BASE_URL}${path}`, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
    ...init,
  });

  const payload = (await response.json().catch(() => null)) as ApiSuccess<T, M> | ApiError | null;

  if (!response.ok || (payload && 'error' in payload)) {
    const err = payload && 'error' in payload ? payload.error : null;
    throw new ApiClientError(
      response.status,
      err?.code ?? 'INTERNAL_ERROR',
      err?.message ?? `Request failed (${response.status})`,
    );
  }

  return payload as ApiSuccess<T, M>;
}
