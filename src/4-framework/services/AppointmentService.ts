import { Service, Inject } from 'typedi';
import { IAppointmentService } from '../../3-business/interfaces/services/IAppointmentService';
import { IAppointmentRepository } from '../../3-business/interfaces/repositories/IAppointmentRepository';
import { CreateAppointmentDTO, UpdateAppointmentDTO, AppointmentResponseDTO, ListAppointmentsResponseDTO } from '../../2-domain/dtos/appointment.dto';
import { AppointmentModel } from '../../2-domain/models/appointment.model';
import { AppError } from '../../2-domain/errors/AppError';
import { APPOINTMENT_REPOSITORY_TOKEN } from '../../tokens';

@Service()
export class AppointmentService implements IAppointmentService {
  constructor(
    @Inject(APPOINTMENT_REPOSITORY_TOKEN) private repository: IAppointmentRepository
  ) {}

  private toDTO(a: AppointmentModel): AppointmentResponseDTO {
    return {
      id: a.id,
      doctorId: a.doctorId,
      patientId: a.patientId,
      scheduledAt: a.scheduledAt instanceof Date
        ? a.scheduledAt.toISOString()
        : String(a.scheduledAt),
      durationMinutes: Number(a.durationMinutes),
      status: a.status,
      notes: a.notes ?? null,
      createdAt: a.createdAt?.toISOString(),
      updatedAt: a.updatedAt?.toISOString(),
    };
  }

  async listAppointments(doctorId: string): Promise<ListAppointmentsResponseDTO> {
    const appointments = await this.repository.findAll(doctorId);
    const data = appointments.map((a) => this.toDTO(a));
    return { data, total: data.length };
  }

  async getAppointmentById(id: string, doctorId: string): Promise<AppointmentResponseDTO> {
    const appointment = await this.repository.findById(id);
    if (!appointment) throw new AppError('Appointment not found', 404);
    if (appointment.doctorId !== doctorId) throw new AppError('Forbidden', 403);
    return this.toDTO(appointment);
  }

  async createAppointment(data: CreateAppointmentDTO): Promise<AppointmentResponseDTO> {
    const scheduledAt = new Date(data.scheduledAt);

    const conflict = await this.repository.findOverlapping(
      data.doctorId,
      scheduledAt,
      data.durationMinutes,
    );

    if (conflict) {
      throw new AppError('Doctor already has an appointment in this time slot', 409);
    }

    const appointment = await this.repository.create(data);
    return this.toDTO(appointment);
  }

  async updateAppointment(id: string, doctorId: string, data: UpdateAppointmentDTO): Promise<AppointmentResponseDTO> {
    const appointment = await this.repository.findById(id);
    if (!appointment) throw new AppError('Appointment not found', 404);
    if (appointment.doctorId !== doctorId) throw new AppError('Forbidden', 403);

    if (data.scheduledAt || data.durationMinutes) {
      const scheduledAt = new Date(data.scheduledAt ?? String(appointment.scheduledAt));
      const durationMinutes = data.durationMinutes ?? appointment.durationMinutes;

      const conflict = await this.repository.findOverlapping(doctorId, scheduledAt, durationMinutes, id);
      if (conflict) {
        throw new AppError('Doctor already has an appointment in this time slot', 409);
      }
    }

    const updated = await this.repository.update(id, data);
    return this.toDTO(updated!);
  }

  async cancelAppointment(id: string, doctorId: string): Promise<void> {
    const appointment = await this.repository.findById(id);
    if (!appointment) throw new AppError('Appointment not found', 404);
    if (appointment.doctorId !== doctorId) throw new AppError('Forbidden', 403);

    await this.repository.cancel(id);
  }
}
