import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

export interface TokenPayload {
  userId: string;
  role: string;
}

export const generateToken = (userData: TokenPayload) => {
  const signature = jwt.sign(userData, env.JWT_KEY, {
    expiresIn: env.JWT_EXPIRES_IN as any,
  });
  return signature;
};
