import { Router } from 'express';
import { requireAuth } from '../../middleware/requireAuth.js';
import { validateBody } from '../../middleware/validate.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import * as controller from './controller.js';
import { ReorderSchema, SkillInputSchema, SkillUpdateSchema } from './schema.js';

export const skillsPublicRouter = Router();
skillsPublicRouter.get('/', asyncHandler(controller.listPublic));

export const skillsAdminRouter = Router();
skillsAdminRouter.use(requireAuth);
skillsAdminRouter.get('/', asyncHandler(controller.listAdmin));
skillsAdminRouter.patch(
  '/reorder',
  validateBody(ReorderSchema),
  asyncHandler(controller.reorderAdmin),
);
skillsAdminRouter.get('/:id', asyncHandler(controller.getAdmin));
skillsAdminRouter.post('/', validateBody(SkillInputSchema), asyncHandler(controller.createAdmin));
skillsAdminRouter.put(
  '/:id',
  validateBody(SkillUpdateSchema),
  asyncHandler(controller.updateAdmin),
);
skillsAdminRouter.delete('/:id', asyncHandler(controller.removeAdmin));
