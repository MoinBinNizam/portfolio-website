import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { requireAuth } from '../../middleware/requireAuth.js';
import { validateBody } from '../../middleware/validate.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import * as controller from './controller.js';
import {
  ContactInputSchema,
  ContactMessageUpdateSchema,
  ContactReplyInputSchema,
} from './schema.js';

const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: {
      code: 'RATE_LIMITED',
      message: 'Too many contact messages from this IP. Please try again in an hour.',
    },
  },
});

export const contactPublicRouter = Router();
contactPublicRouter.post(
  '/',
  contactLimiter,
  validateBody(ContactInputSchema),
  asyncHandler(controller.submit),
);

export const messagesAdminRouter = Router();
messagesAdminRouter.use(requireAuth);
messagesAdminRouter.get('/', asyncHandler(controller.listAdmin));
messagesAdminRouter.patch(
  '/:id',
  validateBody(ContactMessageUpdateSchema),
  asyncHandler(controller.markReadAdmin),
);
messagesAdminRouter.post(
  '/:id/reply',
  validateBody(ContactReplyInputSchema),
  asyncHandler(controller.replyAdmin),
);
