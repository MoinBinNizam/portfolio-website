import type { RequestHandler } from 'express';
import type { ZodTypeAny } from 'zod';
import { httpError } from '../utils/httpError.js';

export function validateBody(schema: ZodTypeAny): RequestHandler {
  return (req, _res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const details = result.error.issues.map((issue) => ({
        field: issue.path.join('.') || undefined,
        message: issue.message,
      }));
      next(httpError(422, 'VALIDATION_ERROR', 'Validation failed', details));
      return;
    }
    req.body = result.data;
    next();
  };
}
