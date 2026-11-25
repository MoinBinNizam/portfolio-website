import type { RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { httpError } from '../utils/httpError.js';

export interface AuthPayload {
  sub: string;
  email: string;
}

export const AUTH_COOKIE_NAME = 'portfolio_token';

export const requireAuth: RequestHandler = (req, res, next) => {
  const token = req.cookies?.[AUTH_COOKIE_NAME] as string | undefined;
  if (!token) {
    next(httpError(401, 'UNAUTHORIZED', 'Authentication required'));
    return;
  }

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as AuthPayload;
    res.locals.auth = decoded;
    next();
  } catch {
    next(httpError(401, 'UNAUTHORIZED', 'Invalid or expired session'));
  }
};
