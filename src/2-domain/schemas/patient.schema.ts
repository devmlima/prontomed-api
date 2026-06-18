import { z } from 'zod';

export const createPatientSchema = z.object({
  name: z.string().min(2, 'Name must have at least 2 characters').max(255),
  email: z.string().email('Invalid email format'),
  phone: z.string().min(8, 'Invalid phone number').max(20),
  birthDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'birthDate must be in YYYY-MM-DD format'),
  gender: z.enum(['M', 'F', 'O'], { message: 'gender must be M, F or O' }),
  height: z.number().positive('Height must be positive').max(3, 'Height must be in meters (e.g. 1.75)'),
  weight: z.number().positive('Weight must be positive').max(500, 'Weight seems too high'),
});

export const updatePatientSchema = createPatientSchema.partial();

export type CreatePatientInput = z.infer<typeof createPatientSchema>;
export type UpdatePatientInput = z.infer<typeof updatePatientSchema>;
