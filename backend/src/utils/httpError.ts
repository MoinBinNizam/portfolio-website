import type { ApiErrorDetail, ErrorCode } from '@portfolio/shared';

export class HttpError extends Error {
  public readonly statusCode: number;
  public readonly code: ErrorCode;
  public readonly details?: ApiErrorDetail[];

  constructor(statusCode: number, code: ErrorCode, message: string, details?: ApiErrorDetail[]) {
    super(message);
    this.name = 'HttpError';
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
  }
}

export function httpError(
  statusCode: number,
  code: ErrorCode,
  message: string,
  details?: ApiErrorDetail[],
): HttpError {
  return new HttpError(statusCode, code, message, details);
}
