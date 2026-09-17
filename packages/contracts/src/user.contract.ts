import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().email({ message: 'Invalid email' }).trim().toLowerCase(),
  phone_number: z.string().trim().min(10),
  password: z.string().trim().min(8, 'The password must be at least 8 characters long.'),
  year_of_birth: z.number(),
  name: z.string().min(1, 'The name must contain at least one character.'),
  role: z.enum(['student', 'teacher', 'admin']).default('student'),
  job: z.string().default('student'),
});

export type RegisterSchema = z.infer<typeof registerSchema>;
