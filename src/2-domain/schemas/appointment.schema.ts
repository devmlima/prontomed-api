import { z } from 'zod';
import { AppointmentStatusEnum } from '../enums/appointment-status.enum';

export const createAppointmentSchema = z.object({
  patientId: z.string().uuid('patientId must be a valid UUID'),
  scheduledAt: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2})?$/, 'scheduledAt must be in ISO 8601 format (YYYY-MM-DDTHH:MM)'),
  durationMinutes: z
    .number()
    .int('durationMinutes must be an integer')
    .min(5, 'Minimum duration is 5 minutes')
    .max(480, 'Maximum duration is 480 minutes'),
  notes: z.string().max(2000).nullable().optional(),
});

export const updateAppointmentSchema = z.object({
  patientId: z.string().uuid('patientId must be a valid UUID').optional(),
  scheduledAt: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2})?$/, 'scheduledAt must be in ISO 8601 format (YYYY-MM-DDTHH:MM)')
    .optional(),
  durationMinutes: z
    .number()
    .int('durationMinutes must be an integer')
    .min(5, 'Minimum duration is 5 minutes')
    .max(480, 'Maximum duration is 480 minutes')
    .optional(),
  status: z.nativeEnum(AppointmentStatusEnum).optional(),
  notes: z.string().max(2000).nullable().optional(),
});

export type CreateAppointmentInput = z.infer<typeof createAppointmentSchema>;
export type UpdateAppointmentInput = z.infer<typeof updateAppointmentSchema>;
