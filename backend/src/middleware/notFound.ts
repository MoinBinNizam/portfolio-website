import type { RequestHandler } from 'express';
import { httpError } from '../utils/httpError.js';

export const notFoundHandler: RequestHandler = (req, _res, next) => {
  next(httpError(404, 'NOT_FOUND', `Route not found: ${req.method} ${req.originalUrl}`));
};
