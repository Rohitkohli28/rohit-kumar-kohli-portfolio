import app from './app.js';
import { env } from './config/env.js';
import { connectDB } from './config/db.js';
import { logger } from './utils/logger.js';

async function startServer() {
  // Connect to MongoDB
  await connectDB();

  const PORT = env.PORT || 5000;
  app.listen(PORT, '0.0.0.0', () => {
    logger.info(`🚀 [Portfolio Backend] Running in ${env.NODE_ENV} mode on http://localhost:${PORT}`);
  });
}

startServer();
