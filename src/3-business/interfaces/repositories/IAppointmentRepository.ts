import { AppointmentModel } from '../../../2-domain/models/appointment.model';
import { CreateAppointmentDTO, UpdateAppointmentDTO } from '../../../2-domain/dtos/appointment.dto';

export interface IAppointmentRepository {
  findAll(doctorId: string): Promise<AppointmentModel[]>;
  findById(id: string): Promise<AppointmentModel | null>;
  findOverlapping(doctorId: string, scheduledAt: Date, durationMinutes: number, excludeId?: string): Promise<AppointmentModel | null>;
  create(data: CreateAppointmentDTO): Promise<AppointmentModel>;
  update(id: string, data: UpdateAppointmentDTO): Promise<AppointmentModel | null>;
  cancel(id: string): Promise<void>;
}
