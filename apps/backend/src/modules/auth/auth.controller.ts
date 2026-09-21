import type { Request, Response, NextFunction } from 'express';
import { authServices, type AuthService } from './authe.service.js';
import { env } from '../../config/env.js';

class AuthController {
  constructor(private authSer: AuthService = authServices) {}
  async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = req.body;
      const result = await this.authSer.register(user);
      res
        .status(201)
        .cookie('access_token', result.accessToken, {
          httpOnly: true,
          secure: env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 15 * 60 * 1000,
          path: '/',
        })
        .cookie('reference_token', result.referenceToken, {
          httpOnly: true,
          secure: env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 7 * 24 * 60 * 60 * 1000,
          path: '/api/auth/refresh',
        })
        .json({
          status: 'success',
          data: result,
        });
    } catch (err) {
      next(err);
    }
  }
}

export const authController = new AuthController();
