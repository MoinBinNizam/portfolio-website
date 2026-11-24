export type ErrorCode =
  | 'VALIDATION_ERROR'
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'CONFLICT'
  | 'RATE_LIMITED'
  | 'ACCOUNT_LOCKED'
  | 'UPLOAD_ERROR'
  | 'INTERNAL_ERROR';

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiSuccess<T, M = Record<string, unknown>> {
  data: T;
  meta?: M;
}

export interface ApiErrorDetail {
  field?: string;
  message: string;
}

export interface ApiError {
  error: {
    code: ErrorCode;
    message: string;
    details?: ApiErrorDetail[];
  };
}

export type ApiResponse<T, M = Record<string, unknown>> = ApiSuccess<T, M> | ApiError;
