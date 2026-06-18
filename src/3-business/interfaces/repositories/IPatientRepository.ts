import { PatientModel } from '../../../2-domain/models/patient.model';
import { CreatePatientDTO, UpdatePatientDTO } from '../../../2-domain/dtos/patient.dto';

export interface IPatientRepository {
  findAll(doctorId: string): Promise<PatientModel[]>;
  findById(id: string): Promise<PatientModel | null>;
  create(data: CreatePatientDTO): Promise<PatientModel>;
  update(id: string, data: UpdatePatientDTO): Promise<PatientModel | null>;
  anonymize(id: string, hash: string, deletedAt: Date): Promise<void>;
}
