import { Router } from 'express';
import { requireAuth } from '../../middleware/requireAuth.js';
import { validateBody } from '../../middleware/validate.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import * as controller from './controller.js';
import { ReorderSchema, ServiceInputSchema, ServiceUpdateSchema } from './schema.js';

export const servicesPublicRouter = Router();
servicesPublicRouter.get('/', asyncHandler(controller.listPublic));

export const servicesAdminRouter = Router();
servicesAdminRouter.use(requireAuth);
servicesAdminRouter.get('/', asyncHandler(controller.listAdmin));
servicesAdminRouter.patch(
  '/reorder',
  validateBody(ReorderSchema),
  asyncHandler(controller.reorderAdmin),
);
servicesAdminRouter.get('/:id', asyncHandler(controller.getAdmin));
servicesAdminRouter.post(
  '/',
  validateBody(ServiceInputSchema),
  asyncHandler(controller.createAdmin),
);
servicesAdminRouter.put(
  '/:id',
  validateBody(ServiceUpdateSchema),
  asyncHandler(controller.updateAdmin),
);
servicesAdminRouter.delete('/:id', asyncHandler(controller.removeAdmin));
