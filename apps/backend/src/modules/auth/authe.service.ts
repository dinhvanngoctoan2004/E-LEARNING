import type { RegisterSchema } from '@repo/contracts';
import { generateAccessToken, generateReferenceToken } from '../../utils/jwt.unit.js';
import { userRepository, UserRepository } from './user.repository.js';
import bcrypt from 'bcryptjs';

export class AuthService {
  constructor(private userRepo: UserRepository = userRepository) {}

  async register(input: RegisterSchema) {
    const hashedPassword = await bcrypt.hash(input.password, 10);
    const result = await this.userRepo.createUser({ ...input, password: hashedPassword });
    const { password: _password, ...safeUser } = result;
    const accessToken = generateAccessToken({
      userId: safeUser.id.toString(),
      role: safeUser.role,
    });
    const referenceToken = generateReferenceToken({
      userId: safeUser.id.toString(),
    });
    return { safeUser, accessToken, referenceToken };
  }
}
export const authServices = new AuthService();
