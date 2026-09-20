import { Router } from 'express';
import { authController } from './auth.controller.js';

import { registerSchema } from '@repo/contracts';
import { validate } from '../../middlewares/validate.js';
import { authLimiter } from '../../middlewares/rateLimiter.middleware.js';

const router: Router = Router();

router.post('/register', authLimiter, validate(registerSchema), (req, res, next) => {
  authController.register(req, res, next);
});

export default router;
