import type { RegisterSchema } from '@repo/contracts';
import type { IUser } from './user.model.js';
import { AppError } from '../../utils/AppError.utils.js';
import pool from '../../config/postgres.js';

export class UserRepository {
  async createUser(input: RegisterSchema): Promise<IUser> {
    const query = `INSERT INTO users (email,phone_number,password,year_of_birth,name,role,job)
VALUES ($1,$2,$3,$4,$5,$6,$7)
RETURNING *;`;
    try {
      const result = await pool.query<IUser>(query, [
        input.email,
        input.phone_number,
        input.password,
        input.year_of_birth,
        input.name,
        input.role || 'student',
        input.job || 'student',
      ]);
      return result.rows[0]!;
    } catch (err) {
      if (err instanceof Error && 'code' in err && err.code === '23505') {
        throw new AppError(409, 'CONFLICT', 'Account already exists.');
      }
      throw err;
    }
  }
}

export const userRepository = new UserRepository();
