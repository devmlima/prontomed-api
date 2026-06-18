import { Op } from 'sequelize';
import { IPatientRepository } from '../../3-business/interfaces/repositories/IPatientRepository';
import { PatientModel } from '../../2-domain/models/patient.model';
import { CreatePatientDTO, UpdatePatientDTO } from '../../2-domain/dtos/patient.dto';
import { PatientEntity } from '../database/entities/PatientEntity';

export class PatientRepository implements IPatientRepository {
  async findAll(doctorId: string): Promise<PatientModel[]> {
    const patients = await PatientEntity.findAll({
      where: { doctorId, deletedAt: null },
    });
    return patients.map((p) => p.toJSON() as PatientModel);
  }

  async findById(id: string): Promise<PatientModel | null> {
    const patient = await PatientEntity.findOne({
      where: { id, deletedAt: { [Op.is]: null } },
    });
    return patient ? (patient.toJSON() as PatientModel) : null;
  }

  async create(data: CreatePatientDTO): Promise<PatientModel> {
    const patient = await PatientEntity.create(data as never);
    return patient.toJSON() as PatientModel;
  }

  async update(id: string, data: UpdatePatientDTO): Promise<PatientModel | null> {
    const patient = await PatientEntity.findOne({
      where: { id, deletedAt: { [Op.is]: null } },
    });
    if (!patient) return null;
    await patient.update(data);
    return patient.toJSON() as PatientModel;
  }

  async anonymize(id: string, hash: string, deletedAt: Date): Promise<void> {
    const patient = await PatientEntity.findByPk(id);
    if (!patient) return;
    await patient.update({ name: hash, email: hash, phone: hash, deletedAt });
  }
}
