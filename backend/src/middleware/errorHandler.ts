import type { ErrorRequestHandler } from 'express';
import type { ApiError } from '@portfolio/shared';
import { env } from '../config/env.js';
import { HttpError } from '../utils/httpError.js';

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof HttpError) {
    const body: ApiError = {
      error: {
        code: err.code,
        message: err.message,
        ...(err.details ? { details: err.details } : {}),
      },
    };
    res.status(err.statusCode).json(body);
    return;
  }

  if (env.NODE_ENV !== 'production') {
    console.error(err);
  }

  const body: ApiError = {
    error: {
      code: 'INTERNAL_ERROR',
      message: 'An unexpected error occurred',
    },
  };
  res.status(500).json(body);
};
