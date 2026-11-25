import { Router } from 'express';
import { requireAuth } from '../../middleware/requireAuth.js';
import { validateBody } from '../../middleware/validate.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import * as controller from './controller.js';
import { CertificationInputSchema, CertificationUpdateSchema, ReorderSchema } from './schema.js';

export const certificationsPublicRouter = Router();
certificationsPublicRouter.get('/', asyncHandler(controller.listPublic));

export const certificationsAdminRouter = Router();
certificationsAdminRouter.use(requireAuth);
certificationsAdminRouter.get('/', asyncHandler(controller.listAdmin));
certificationsAdminRouter.patch(
  '/reorder',
  validateBody(ReorderSchema),
  asyncHandler(controller.reorderAdmin),
);
certificationsAdminRouter.get('/:id', asyncHandler(controller.getAdmin));
certificationsAdminRouter.post(
  '/',
  validateBody(CertificationInputSchema),
  asyncHandler(controller.createAdmin),
);
certificationsAdminRouter.put(
  '/:id',
  validateBody(CertificationUpdateSchema),
  asyncHandler(controller.updateAdmin),
);
certificationsAdminRouter.delete('/:id', asyncHandler(controller.removeAdmin));
