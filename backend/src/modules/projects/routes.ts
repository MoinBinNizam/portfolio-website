import { Router } from 'express';
import { requireAuth } from '../../middleware/requireAuth.js';
import { validateBody } from '../../middleware/validate.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import * as controller from './controller.js';
import { ProjectInputSchema, ProjectUpdateSchema, ReorderSchema } from './schema.js';

export const projectsPublicRouter = Router();
projectsPublicRouter.get('/', asyncHandler(controller.listPublic));
projectsPublicRouter.get('/:slug', asyncHandler(controller.getPublicBySlug));

export const projectsAdminRouter = Router();
projectsAdminRouter.use(requireAuth);
projectsAdminRouter.get('/', asyncHandler(controller.listAdmin));
projectsAdminRouter.patch(
  '/reorder',
  validateBody(ReorderSchema),
  asyncHandler(controller.reorderAdmin),
);
projectsAdminRouter.get('/:id', asyncHandler(controller.getAdmin));
projectsAdminRouter.post(
  '/',
  validateBody(ProjectInputSchema),
  asyncHandler(controller.createAdmin),
);
projectsAdminRouter.put(
  '/:id',
  validateBody(ProjectUpdateSchema),
  asyncHandler(controller.updateAdmin),
);
projectsAdminRouter.delete('/:id', asyncHandler(controller.removeAdmin));
