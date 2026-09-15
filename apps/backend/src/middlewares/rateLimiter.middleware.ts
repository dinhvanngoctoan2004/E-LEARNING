import rateLimit from 'express-rate-limit';
import { env } from 'node:process';
import { AppError } from '../utils/AppError.utils.js';

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: env.NODE_ENV === 'test' ? 15 : 5,
  standardHeaders: 'draft-7',
  handler: (_req, _res, _next) => {
    throw new AppError(
      429,
      'TOO_MANY_REQUESTS',
      'Too many requests from this IP, please try again after 1 minutes',
    );
  },
});
