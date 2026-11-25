import express, { type Express } from 'express';
import mongoose from 'mongoose';
import { LOCAL_UPLOADS_DIR } from './config/cloudinary.js';
import { errorHandler } from './middleware/errorHandler.js';
import { notFoundHandler } from './middleware/notFound.js';
import { applySecurityMiddleware } from './middleware/security.js';
import {
  achievementsAdminRouter,
  achievementsPublicRouter,
} from './modules/achievements/routes.js';
import { adminCoreRouter } from './modules/admin/routes.js';
import { authRouter } from './modules/auth/routes.js';
import {
  certificationsAdminRouter,
  certificationsPublicRouter,
} from './modules/certifications/routes.js';
import { contactPublicRouter, messagesAdminRouter } from './modules/contact/routes.js';
import { educationAdminRouter, educationPublicRouter } from './modules/education/routes.js';
import { experienceAdminRouter, experiencePublicRouter } from './modules/experience/routes.js';
import { publicRouter } from './modules/public/routes.js';
import { uploadsAdminRouter } from './modules/uploads/routes.js';

export function createApp(): Express {
  const app = express();

  applySecurityMiddleware(app);
  app.use('/uploads', express.static(LOCAL_UPLOADS_DIR));

  app.get('/api/health', (_req, res) => {
    const dbState = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
    res.status(200).json({
      data: {
        status: 'ok',
        db: dbState,
        timestamp: new Date().toISOString(),
      },
    });
  });

  app.use('/api/auth', authRouter);
  app.use('/api/experience', experiencePublicRouter);
  app.use('/api/education', educationPublicRouter);
  app.use('/api/certifications', certificationsPublicRouter);
  app.use('/api/achievements', achievementsPublicRouter);
  app.use('/api/contact', contactPublicRouter);
  app.use('/api/admin', adminCoreRouter);
  app.use('/api/admin/experience', experienceAdminRouter);
  app.use('/api/admin/education', educationAdminRouter);
  app.use('/api/admin/certifications', certificationsAdminRouter);
  app.use('/api/admin/achievements', achievementsAdminRouter);
  app.use('/api/admin/uploads', uploadsAdminRouter);
  app.use('/api/admin/messages', messagesAdminRouter);
  app.use('/api', publicRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
