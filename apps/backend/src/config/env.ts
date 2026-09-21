import dotenv from 'dotenv';
import { z } from 'zod';
dotenv.config({ path: `.env.${process.env.NODE_ENV}` || 'development' });

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().default(3000),
  MONGO_URI: z.string().min(1, 'MONGO_URI không được để trống!'),
  ACCESS_TOKEN_SECRET: z
    .string()
    .min(60, 'ACCESS_TOKEN_SECRET must be at least 60 characters long for security purposes!'),
  REFRESH_TOKEN_SECRET: z
    .string()
    .min(100, 'REFRESH_TOKEN_SECRET must be at least 100 characters long for security purposes!'),
  ACCESS_TOKEN_EXPIRES_IN: z.string().default('15m'),
  REFRESH_TOKEN_EXPIRES_IN: z.string().default('7d'),
  LOG_LEVEL: z
    .enum(['trace', 'debug', 'info', 'warn', 'error', 'fatal', 'silent'])
    .default('debug'),
  PG_USER: z.string().default('postgres'),
  PG_HOST: z.string().default('localhost'),
  PG_PORT: z.coerce.number().default(5432),
  PG_DATABASE: z.string().min(1),
  PG_PASSWORD: z.string().min(1),
  PG_MAX_POOL: z.coerce.number().default(10),
});

export const env = envSchema.parse(process.env);
