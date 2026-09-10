import pino from 'pino';
import { env } from './env.js';

const isProduction = env.NODE_ENV === 'production';

export const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  ...(isProduction
    ? {}
    : {
        transport: {
          target: 'pino-pretty',
          options: {
            colorize: true,
            translateTim: 'SYS:standard',
            ignore: 'pip,hostname',
          },
        },
      }),
});
