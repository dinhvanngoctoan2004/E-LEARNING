import type { RegisterSchema } from '@repo/contracts';
import { generateToken } from '../../utils/jwt.unit.js';
import { userRepository, UserRepository } from './user.repository.js';
import bcrypt from 'bcryptjs';

export class AuthService {
  constructor(private userRepo: UserRepository = userRepository) {}

  async register(input: RegisterSchema) {
    const hashedPassword = await bcrypt.hash(input.password, 10);
    const result = await this.userRepo.createUser({ ...input, password: hashedPassword });
    const { password: _password, ...safeUser } = result;
    const token = generateToken({ userId: safeUser.id.toString(), role: safeUser.role });
    return { safeUser, token };
  }
}
export const autheServices = new AuthService();
