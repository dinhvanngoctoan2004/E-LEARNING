import { describe, it, expect, beforeEach, beforeAll, afterAll } from 'vitest';
import pool, { connectPostgres, disconnectPostgres } from '../../src/config/postgres';
import request from 'supertest';
import app from '../../src/app';

describe('Auth API - Integration Test', () => {
  beforeAll(async () => {
    await connectPostgres();
  });
  afterAll(async () => {
    await disconnectPostgres();
  });
  beforeEach(async () => {
    await pool.query(`DELETE FROM users WHERE email = 'test123@gmail.com';`);
  });

  describe('/api/auth/register', () => {
    it('Happy Path - Successfully registered with all request data fields valid.', async () => {
      const result = await request(app).post('/api/auth/register').send({
        email: 'test123@gmail.com',
        phone_number: '0123456789',
        password: 'Password123!',
        year_of_birth: 2004,
        name: 'toàn',
        role: 'student',
        job: 'student',
      });
      expect(result.status).toBe(201);
      expect(result.body.data.safeUser).toHaveProperty('id');
      expect(result.body.data.safeUser).toHaveProperty('email');
      expect(result.body.data.safeUser).toHaveProperty('phone_number');
      expect(result.body.data.safeUser).toHaveProperty('name');
      expect(result.body.data.safeUser).toHaveProperty('year_of_birth');
      expect(result.body.data.safeUser).toHaveProperty('role');
      expect(result.body.data.safeUser).toHaveProperty('job');
      expect(result.body.data.safeUser).toHaveProperty('created_at');
      expect(result.body.data.safeUser).toHaveProperty('updated_at');
      expect(result.body.data.safeUser).not.toHaveProperty('password');
      const cookies = result.header['set-cookie'];
      expect(cookies).toEqual(
        expect.arrayContaining([
          expect.stringContaining('access_token='),
          expect.stringContaining('reference_token='),
        ]),
      );
    });

    it('Happy Path - Successful registration with only the resultuired fields (without passing role or job).', async () => {
      const result = await request(app).post('/api/auth/register').send({
        email: 'test123@gmail.com',
        phone_number: '0123456789',
        password: 'Password123!',
        year_of_birth: 2004,
        name: 'toàn',
      });
      expect(result.status).toBe(201);
      expect(result.body.data.safeUser).toHaveProperty('id');
      expect(result.body.data.safeUser).toHaveProperty('email');
      expect(result.body.data.safeUser).toHaveProperty('phone_number');
      expect(result.body.data.safeUser).toHaveProperty('name');
      expect(result.body.data.safeUser).toHaveProperty('year_of_birth');
      expect(result.body.data.safeUser).toHaveProperty('role');
      expect(result.body.data.safeUser).toHaveProperty('job');
      expect(result.body.data.safeUser).toHaveProperty('created_at');
      expect(result.body.data.safeUser).toHaveProperty('updated_at');
      expect(result.body.data.safeUser).not.toHaveProperty('password');
    });

    it('Data Cleaning - The input contains extra whitespace in the name and phone_number fields, and the email contains uppercase letters.', async () => {
      const result = await request(app).post('/api/auth/register').send({
        email: 'Test123@gmail.com',
        phone_number: ' 0123456789    ',
        password: 'Password123!  ',
        year_of_birth: 2004,
        name: 'toàn  ',
        role: 'student',
        job: 'student',
      });
      expect(result.status).toBe(201);
      expect(result.body.data.safeUser.email).toBe('test123@gmail.com');
      expect(result.body.data.safeUser.phone_number).toBe('0123456789');
      expect(result.body.data.safeUser.name).toBe('toàn');
    });

    it('Validation - email,phone_number, phone_number', async () => {
      const result = await request(app).post('/api/auth/register').send({
        email: 'test123.gmail.com',
        phone_number: '0123',
        password: 'Pass',
        year_of_birth: '2004',
        name: '',
      });
      expect(result.status).toBe(422);
      expect(result.body.error.details.fieldErrors).toHaveProperty('email');
      expect(result.body.error.details.fieldErrors).toHaveProperty('phone_number');
      expect(result.body.error.details.fieldErrors).toHaveProperty('password');
      expect(result.body.error.details.fieldErrors).toHaveProperty('year_of_birth');
      expect(result.body.error.details.fieldErrors).toHaveProperty('name');
    });

    it('Validation - Missing Fields', async () => {
      const result = await request(app).post('/api/auth/register').send({
        phone_number: ' 0123456789    ',
        password: 'Password123!  ',
        year_of_birth: 2004,
        name: 'toàn  ',
        role: 'student',
        job: 'student',
      });
      expect(result.status).toBe(422);
      expect(result.body.error.details.fieldErrors).toHaveProperty('email');
    });

    it('Validation - Injection vulnerability', async () => {
      const result = await request(app).post('/api/auth/register').send({
        email: 'test123@gmail.com',
        phone_number: '0123456789',
        password: 'Password123!',
        year_of_birth: 2004,
        name: '<script>alert(1)</script>',
      });
      expect(result.status).toBe(422);
      expect(result.body.error.details.fieldErrors).toHaveProperty('name');
    });

    it('Business - Duplicates an email that already exists in the database.', async () => {
      const result = await request(app).post('/api/auth/register').send({
        email: 'toan@gmail.com',
        phone_number: '0123456789',
        password: 'Password123!',
        year_of_birth: 2004,
        name: 'toàn',
        role: 'student',
        job: 'student',
      });
      expect(result.status).toBe(409);
      expect(result.body.error.code).toBe('CONFLICT');
    });
  });
});
