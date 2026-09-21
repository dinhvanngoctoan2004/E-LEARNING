import app from './app.js';
import './config/env.js';
import { env } from './config/env.js';
import { logger } from './config/logger.js';
import { connectMongo } from './config/mongo.js';
import { connectPostgres } from './config/postgres.js';

const bootstrap = async () => {
  try {
    await connectMongo();
    logger.info('Mongo connected successfully');
    await connectPostgres();
    logger.info('PostSQL connected successfully');
    const PORT = env.PORT;
    app.listen(Number(PORT), () => {
      logger.info(`[server]: Server is running at http://localhost:${PORT}`);
    });
  } catch (err) {
    logger.error(err, 'Application failed to start');
    process.exit(1);
  }
};

bootstrap();
