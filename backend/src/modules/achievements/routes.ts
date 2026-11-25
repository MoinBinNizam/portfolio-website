import { Router } from 'express';
import { requireAuth } from '../../middleware/requireAuth.js';
import { validateBody } from '../../middleware/validate.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import * as controller from './controller.js';
import { AchievementInputSchema, AchievementUpdateSchema, ReorderSchema } from './schema.js';

export const achievementsPublicRouter = Router();
achievementsPublicRouter.get('/', asyncHandler(controller.listPublic));

export const achievementsAdminRouter = Router();
achievementsAdminRouter.use(requireAuth);
achievementsAdminRouter.get('/', asyncHandler(controller.listAdmin));
achievementsAdminRouter.patch(
  '/reorder',
  validateBody(ReorderSchema),
  asyncHandler(controller.reorderAdmin),
);
achievementsAdminRouter.get('/:id', asyncHandler(controller.getAdmin));
achievementsAdminRouter.post(
  '/',
  validateBody(AchievementInputSchema),
  asyncHandler(controller.createAdmin),
);
achievementsAdminRouter.put(
  '/:id',
  validateBody(AchievementUpdateSchema),
  asyncHandler(controller.updateAdmin),
);
achievementsAdminRouter.delete('/:id', asyncHandler(controller.removeAdmin));
