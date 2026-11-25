import { Router } from 'express';
import { requireAuth } from '../../middleware/requireAuth.js';
import { validateBody } from '../../middleware/validate.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import * as controller from './controller.js';
import { ExperienceInputSchema, ExperienceUpdateSchema, ReorderSchema } from './schema.js';

export const experiencePublicRouter = Router();
experiencePublicRouter.get('/', asyncHandler(controller.listPublic));

export const experienceAdminRouter = Router();
experienceAdminRouter.use(requireAuth);
experienceAdminRouter.get('/', asyncHandler(controller.listAdmin));
experienceAdminRouter.patch(
  '/reorder',
  validateBody(ReorderSchema),
  asyncHandler(controller.reorderAdmin),
);
experienceAdminRouter.get('/:id', asyncHandler(controller.getAdmin));
experienceAdminRouter.post(
  '/',
  validateBody(ExperienceInputSchema),
  asyncHandler(controller.createAdmin),
);
experienceAdminRouter.put(
  '/:id',
  validateBody(ExperienceUpdateSchema),
  asyncHandler(controller.updateAdmin),
);
experienceAdminRouter.delete('/:id', asyncHandler(controller.removeAdmin));
