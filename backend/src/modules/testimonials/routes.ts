import { Router } from 'express';
import { requireAuth } from '../../middleware/requireAuth.js';
import { validateBody } from '../../middleware/validate.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import * as controller from './controller.js';
import { ReorderSchema, TestimonialInputSchema, TestimonialUpdateSchema } from './schema.js';

export const testimonialsPublicRouter = Router();
testimonialsPublicRouter.get('/', asyncHandler(controller.listPublic));

export const testimonialsAdminRouter = Router();
testimonialsAdminRouter.use(requireAuth);
testimonialsAdminRouter.get('/', asyncHandler(controller.listAdmin));
testimonialsAdminRouter.patch(
  '/reorder',
  validateBody(ReorderSchema),
  asyncHandler(controller.reorderAdmin),
);
testimonialsAdminRouter.get('/:id', asyncHandler(controller.getAdmin));
testimonialsAdminRouter.post(
  '/',
  validateBody(TestimonialInputSchema),
  asyncHandler(controller.createAdmin),
);
testimonialsAdminRouter.put(
  '/:id',
  validateBody(TestimonialUpdateSchema),
  asyncHandler(controller.updateAdmin),
);
testimonialsAdminRouter.delete('/:id', asyncHandler(controller.removeAdmin));
