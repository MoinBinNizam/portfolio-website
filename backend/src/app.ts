import express, { type Express } from 'express';
import mongoose from 'mongoose';
import { errorHandler } from './middleware/errorHandler.js';
import { notFoundHandler } from './middleware/notFound.js';
import { applySecurityMiddleware } from './middleware/security.js';
import { publicRouter } from './modules/public/routes.js';

export function createApp(): Express {
  const app = express();

  applySecurityMiddleware(app);

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

  app.use('/api', publicRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
