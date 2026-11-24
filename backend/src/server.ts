import { createApp } from './app.js';
import { connectDatabase } from './config/db.js';
import { env } from './config/env.js';

async function start(): Promise<void> {
  try {
    await connectDatabase();
    console.log('Connected to MongoDB');
  } catch (err) {
    console.warn('MongoDB connection failed at startup, starting API without DB:', err);
  }

  const app = createApp();
  app.listen(env.PORT, () => {
    console.log(`API server listening on http://localhost:${env.PORT}`);
  });
}

void start();
