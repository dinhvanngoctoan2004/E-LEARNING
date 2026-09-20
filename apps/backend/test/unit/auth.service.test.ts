import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import { AuthService } from '../../src/modules/auth/authe.service';
import { UserRepository } from '../../src/modules/auth/user.repository';
import { RegisterSchema } from '@repo/contracts';

describe('AuthService', () => {
  let authService: AuthService;

  let mocUserRepo: {
    createUser: Mock;
  };

  beforeEach(() => {
    mocUserRepo = {
      createUser: vi.fn(),
    };
    authService = new AuthService(mocUserRepo as unknown as UserRepository);
  });

  describe('register()', () => {
    it('Successfully created an account', async () => {
      const fakeDataInput: RegisterSchema = {
        // id: '0123456789',
        email: 'dinhvanngoctoan@gmail.com',
        phone_number: '0123456789',
        password: 'Toan2004@',
        year_of_birth: 2004,
        name: 'toan',
        // role: 'student',
        // job: 'student',
      };
      const fakeDataResporn = {
        id: '0123456789',
        email: 'dinhvanngoctoan@gmail.com',
        phone_number: '0123456789',
        password: 'Toan2004@',
        year_of_birth: 2004,
        name: 'toan',
        role: 'student',
        job: 'student',
      };
      mocUserRepo.createUser.mockResolvedValue(fakeDataResporn);
      const result = await authService.register(fakeDataInput);
      expect(result).toHaveProperty('safeUser');
      expect(result.safeUser).not.toHaveProperty('password');
      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('referenceToken');
      expect(result.safeUser).toMatchObject({
        email: 'dinhvanngoctoan@gmail.com',
        phone_number: '0123456789',
        year_of_birth: 2004,
        name: 'toan',
      });
      expect(result.safeUser).not.toHaveProperty('password');
    });
  });
});
