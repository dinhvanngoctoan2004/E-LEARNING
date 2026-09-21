import type { Request, Response, NextFunction } from 'express';
import { logger } from '../config/logger.js';
import { AppError } from '../utils/AppError.utils.js';

export const errorHandler = (err: Error, _req: Request, res: Response, next: NextFunction) => {
  logger.error(err);

  if (res.headersSent) {
    return next(err);
  }

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      error: {
        code: err.code,
        message: err.message,
      },
    });
  }

  if (
    err instanceof SyntaxError &&
    'status' in err &&
    (err as any).status === 400 &&
    'body' in err
  ) {
    return res.status(400).json({
      error: {
        code: 'INVALID_JSON',
        message: 'The submitted JSON data is not in the correct format.',
      },
    });
  }

  return res.status(500).json({
    error: {
      code: 'INTERNAL_ERROR',
      message: 'Server error',
    },
  });
};

export const error404 = (_req: Request, _res: Response, next: NextFunction) => {
  next(new AppError(404, 'NOT_FOUND', 'API not found'));
};
