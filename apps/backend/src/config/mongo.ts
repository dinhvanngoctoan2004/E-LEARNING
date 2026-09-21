import mongoose from 'mongoose';
import { logger } from './logger.js';
import { env } from './env.js';

export const connectMongo = async (): Promise<void> => {
  const mongoUri = env.MONGO_URI;
  if (!mongoUri) {
    logger.error('MONGO_URI is not defined in environment variables');
    throw new Error('MONGO_URI is not defined in environment variables');
  }
  try {
    await mongoose.connect(mongoUri, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 4500,
    });
    logger.info('MongoDB Connected successfully');
  } catch (err) {
    logger.error(err, 'MongoDB connection error');
    throw err;
  }
};
