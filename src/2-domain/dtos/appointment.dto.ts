import { AppointmentStatusEnum } from '../enums/appointment-status.enum';

export interface CreateAppointmentDTO {
  doctorId: string;
  patientId: string;
  scheduledAt: string;
  durationMinutes: number;
  notes?: string | null;
}

export interface UpdateAppointmentDTO {
  patientId?: string;
  scheduledAt?: string;
  durationMinutes?: number;
  status?: AppointmentStatusEnum;
  notes?: string | null;
}

export interface AppointmentResponseDTO {
  id: string;
  doctorId: string;
  patientId: string;
  scheduledAt: string;
  durationMinutes: number;
  status: AppointmentStatusEnum;
  notes?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface ListAppointmentsResponseDTO {
  data: AppointmentResponseDTO[];
  total: number;
}
