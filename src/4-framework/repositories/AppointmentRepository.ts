import { Op, literal } from 'sequelize';
import { IAppointmentRepository } from '../../3-business/interfaces/repositories/IAppointmentRepository';
import { AppointmentModel } from '../../2-domain/models/appointment.model';
import { CreateAppointmentDTO, UpdateAppointmentDTO } from '../../2-domain/dtos/appointment.dto';
import { AppointmentEntity } from '../database/entities/AppointmentEntity';
import { AppointmentStatusEnum } from '../../2-domain/enums/appointment-status.enum';

export class AppointmentRepository implements IAppointmentRepository {
  async findAll(doctorId: string): Promise<AppointmentModel[]> {
    const appointments = await AppointmentEntity.findAll({
      where: { doctorId, deletedAt: null },
      order: [['scheduledAt', 'ASC']],
    });
    return appointments.map((a) => a.toJSON() as AppointmentModel);
  }

  async findById(id: string): Promise<AppointmentModel | null> {
    const appointment = await AppointmentEntity.findOne({
      where: { id, deletedAt: null },
    });
    return appointment ? (appointment.toJSON() as AppointmentModel) : null;
  }

  async findOverlapping(
    doctorId: string,
    scheduledAt: Date,
    durationMinutes: number,
    excludeId?: string,
  ): Promise<AppointmentModel | null> {
    const newEnd = new Date(scheduledAt.getTime() + durationMinutes * 60_000);
    const fmt = (d: Date) => d.toISOString().replace('T', ' ').substring(0, 19);

    const where: Record<string, unknown> = {
      doctorId,
      deletedAt: null,
      status: { [Op.ne]: AppointmentStatusEnum.CANCELLED },
      scheduledAt: { [Op.lt]: newEnd },
      [Op.and]: literal(
        `DATE_ADD(scheduled_at, INTERVAL duration_minutes MINUTE) > '${fmt(scheduledAt)}'`,
      ),
    };

    if (excludeId) {
      where['id'] = { [Op.ne]: excludeId };
    }

    const found = await AppointmentEntity.findOne({ where: where as never });
    return found ? (found.toJSON() as AppointmentModel) : null;
  }

  async create(data: CreateAppointmentDTO): Promise<AppointmentModel> {
    const appointment = await AppointmentEntity.create(data as never);
    return appointment.toJSON() as AppointmentModel;
  }

  async update(id: string, data: UpdateAppointmentDTO): Promise<AppointmentModel | null> {
    const appointment = await AppointmentEntity.findOne({
      where: { id, deletedAt: null },
    });
    if (!appointment) return null;
    await appointment.update(data);
    return appointment.toJSON() as AppointmentModel;
  }

  async cancel(id: string): Promise<void> {
    const appointment = await AppointmentEntity.findByPk(id);
    if (!appointment) return;
    await appointment.update({ status: AppointmentStatusEnum.CANCELLED });
  }
}
