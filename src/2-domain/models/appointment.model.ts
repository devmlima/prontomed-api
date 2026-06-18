import { AppointmentStatusEnum } from '../enums/appointment-status.enum';

export interface AppointmentModel {
  id: string;
  doctorId: string;
  patientId: string;
  scheduledAt: Date | string;
  durationMinutes: number;
  status: AppointmentStatusEnum;
  notes?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}
