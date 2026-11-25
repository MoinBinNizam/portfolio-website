import { Router } from 'express';
import { requireAuth } from '../../middleware/requireAuth.js';
import { validateBody } from '../../middleware/validate.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import * as controller from './controller.js';
import { EducationInputSchema, EducationUpdateSchema, ReorderSchema } from './schema.js';

export const educationPublicRouter = Router();
educationPublicRouter.get('/', asyncHandler(controller.listPublic));

export const educationAdminRouter = Router();
educationAdminRouter.use(requireAuth);
educationAdminRouter.get('/', asyncHandler(controller.listAdmin));
educationAdminRouter.patch(
  '/reorder',
  validateBody(ReorderSchema),
  asyncHandler(controller.reorderAdmin),
);
educationAdminRouter.get('/:id', asyncHandler(controller.getAdmin));
educationAdminRouter.post(
  '/',
  validateBody(EducationInputSchema),
  asyncHandler(controller.createAdmin),
);
educationAdminRouter.put(
  '/:id',
  validateBody(EducationUpdateSchema),
  asyncHandler(controller.updateAdmin),
);
educationAdminRouter.delete('/:id', asyncHandler(controller.removeAdmin));
