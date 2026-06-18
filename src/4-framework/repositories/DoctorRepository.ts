import { IDoctorRepository } from '../../3-business/interfaces/repositories/IDoctorRepository';
import { DoctorModel } from '../../2-domain/models/doctor.model';
import { DoctorEntity } from '../database/entities/DoctorEntity';

export class DoctorRepository implements IDoctorRepository {
  async create(data: Omit<DoctorModel, 'createdAt' | 'updatedAt' | 'deletedAt'>): Promise<DoctorModel> {
    const doctor = await DoctorEntity.create(data as never);
    return doctor.toJSON() as DoctorModel;
  }

  async findByEmail(email: string): Promise<DoctorModel | null> {
    const doctor = await DoctorEntity.findOne({ where: { email } });
    return doctor ? (doctor.toJSON() as DoctorModel) : null;
  }

  async findByCrm(crm: string): Promise<DoctorModel | null> {
    const doctor = await DoctorEntity.findOne({ where: { crm } });
    return doctor ? (doctor.toJSON() as DoctorModel) : null;
  }
}
