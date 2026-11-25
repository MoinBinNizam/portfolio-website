import { Router } from 'express';
import { requireAuth } from '../../middleware/requireAuth.js';
import { validateBody } from '../../middleware/validate.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import * as controller from './controller.js';
import { PostInputSchema, PostUpdateSchema } from './schema.js';

export const blogPublicRouter = Router();
blogPublicRouter.get('/', asyncHandler(controller.listPublic));
blogPublicRouter.get('/tags', asyncHandler(controller.listTags));
blogPublicRouter.get('/:slug', asyncHandler(controller.getPublicBySlug));

export const blogAdminRouter = Router();
blogAdminRouter.use(requireAuth);
blogAdminRouter.get('/', asyncHandler(controller.listAdmin));
blogAdminRouter.get('/:id', asyncHandler(controller.getAdmin));
blogAdminRouter.post('/', validateBody(PostInputSchema), asyncHandler(controller.createAdmin));
blogAdminRouter.put('/:id', validateBody(PostUpdateSchema), asyncHandler(controller.updateAdmin));
blogAdminRouter.post('/:id/publish', asyncHandler(controller.publishAdmin));
blogAdminRouter.post('/:id/unpublish', asyncHandler(controller.unpublishAdmin));
blogAdminRouter.delete('/:id', asyncHandler(controller.removeAdmin));
