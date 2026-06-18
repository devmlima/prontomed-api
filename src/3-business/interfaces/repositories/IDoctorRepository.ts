import { DoctorModel } from '../../../2-domain/models/doctor.model';

export interface IDoctorRepository {
  create(data: Omit<DoctorModel, 'createdAt' | 'updatedAt' | 'deletedAt'>): Promise<DoctorModel>;
  findByEmail(email: string): Promise<DoctorModel | null>;
  findByCrm(crm: string): Promise<DoctorModel | null>;
}
