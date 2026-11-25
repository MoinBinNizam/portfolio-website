import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { env } from '../../config/env.js';
import { requireAuth } from '../../middleware/requireAuth.js';
import { validateBody } from '../../middleware/validate.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import * as controller from './controller.js';
import { LoginInputSchema } from './schema.js';

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 15,
  skip: () => env.NODE_ENV === 'test',
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: {
      code: 'RATE_LIMITED',
      message: 'Too many login requests. Please wait 15 minutes.',
    },
  },
});

export const authRouter = Router();
authRouter.post(
  '/login',
  loginLimiter,
  validateBody(LoginInputSchema),
  asyncHandler(controller.login),
);
authRouter.post('/logout', asyncHandler(controller.logout));
authRouter.get('/me', requireAuth, asyncHandler(controller.me));
