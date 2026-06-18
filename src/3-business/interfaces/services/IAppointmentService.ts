import { CreateAppointmentDTO, UpdateAppointmentDTO, AppointmentResponseDTO, ListAppointmentsResponseDTO } from '../../../2-domain/dtos/appointment.dto';

export interface IAppointmentService {
  listAppointments(doctorId: string): Promise<ListAppointmentsResponseDTO>;
  getAppointmentById(id: string, doctorId: string): Promise<AppointmentResponseDTO>;
  createAppointment(data: CreateAppointmentDTO): Promise<AppointmentResponseDTO>;
  updateAppointment(id: string, doctorId: string, data: UpdateAppointmentDTO): Promise<AppointmentResponseDTO>;
  cancelAppointment(id: string, doctorId: string): Promise<void>;
}
