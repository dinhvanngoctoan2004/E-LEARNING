import { z } from 'zod';

const noXssRegex = /^[^<>]*$/;

export const registerSchema = z.object({
  email: z.string().email({ message: 'Invalid email' }).trim().toLowerCase(),
  phone_number: z
    .string()
    .trim()
    .min(8)
    .max(15)
    .regex(/^[0-9]+$/, 'Số điện thoại chỉ được chứa các chữ số'),
  password: z.string().trim().min(8, 'The password must be at least 8 characters long.'),
  year_of_birth: z.number(),
  name: z
    .string()
    .trim()
    .min(1, 'The name must contain at least one character.')
    .regex(noXssRegex, 'The name must not contain special characters such as < or >.'),
  role: z.enum(['student', 'teacher', 'admin']).default('student').optional(),
  job: z.string().default('student').optional(),
});

export type RegisterSchema = z.infer<typeof registerSchema>;
