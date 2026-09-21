import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

export interface AccessTokenPayload {
  userId: string;
  role: string;
}
export interface ReferencePayload {
  userId: string;
}

export const generateAccessToken = (userData: AccessTokenPayload) => {
  const signature = jwt.sign(userData, env.ACCESS_TOKEN_SECRET, {
    expiresIn: env.ACCESS_TOKEN_EXPIRES_IN as any,
  });
  return signature;
};

export const generateReferenceToken = (userData: ReferencePayload) => {
  const signature = jwt.sign(userData, env.REFRESH_TOKEN_SECRET, {
    expiresIn: env.REFRESH_TOKEN_EXPIRES_IN as any,
  });
  return signature;
};
