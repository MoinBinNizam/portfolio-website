import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import multer from 'multer';
import { requireAuth } from '../../middleware/requireAuth.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import * as controller from './controller.js';
import { MAX_UPLOAD_BYTES } from './service.js';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_UPLOAD_BYTES },
});

const uploadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: {
      code: 'RATE_LIMITED',
      message: 'Too many uploads. Please wait a few minutes.',
    },
  },
});

export const uploadsAdminRouter = Router();
uploadsAdminRouter.use(requireAuth);
uploadsAdminRouter.post(
  '/',
  uploadLimiter,
  upload.single('file'),
  asyncHandler(controller.uploadFile),
);
uploadsAdminRouter.delete('/:publicId(*)', asyncHandler(controller.deleteFile));
