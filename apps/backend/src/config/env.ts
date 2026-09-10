import dotenv from 'dotenv';
import { z } from 'zod';
dotenv.config({ path: `.env.${process.env.NODE_ENV}` || 'development' });

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().default(3000),
  MONGO_URI: z.string().min(1, 'MONGO_URI không được để trống!'),
  JWT_KEY: z.string().min(32, 'JWT_KEY bắt buộc phải có tối thiểu 32 ký tự để bảo mật!'),
  JWT_EXPIRES_IN: z.string().default('1d'),
  LOG_LEVEL: z
    .enum(['trace', 'debug', 'info', 'warn', 'error', 'fatal', 'silent'])
    .default('debug'),
});

export const env = envSchema.parse(process.env);
