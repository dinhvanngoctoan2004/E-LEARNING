import type { Request, Response, NextFunction } from 'express';
import { autheServices, type AuthService } from './authe.service.js';
import { env } from '../../config/env.js';

class AuthController {
  constructor(private autheServ: AuthService = autheServices) {}
  async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = req.body;
      const result = await this.autheServ.register(user);
      res
        .status(201)
        .cookie('access_token', result.token, {
          httpOnly: true,
          secure: env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 24 * 60 * 60 * 1000,
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
