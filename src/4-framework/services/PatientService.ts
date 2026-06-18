import { Service, Inject } from 'typedi';
import crypto from 'crypto';
import { IPatientService } from '../../3-business/interfaces/services/IPatientService';
import { IPatientRepository } from '../../3-business/interfaces/repositories/IPatientRepository';
import { CreatePatientDTO, UpdatePatientDTO, ListPatientsResponseDTO, PatientResponseDTO } from '../../2-domain/dtos/patient.dto';
import { PatientModel } from '../../2-domain/models/patient.model';
import { AppError } from '../../2-domain/errors/AppError';
import { PATIENT_REPOSITORY_TOKEN } from '../../tokens';

@Service()
export class PatientService implements IPatientService {
  constructor(
    @Inject(PATIENT_REPOSITORY_TOKEN) private repository: IPatientRepository
  ) {}

  private toDTO(p: PatientModel): PatientResponseDTO {
    return {
      id: p.id,
      doctorId: p.doctorId,
      name: p.name,
      phone: p.phone,
      email: p.email,
      birthDate: p.birthDate instanceof Date
        ? p.birthDate.toISOString().split('T')[0]
        : String(p.birthDate),
      gender: p.gender,
      height: Number(p.height),
      weight: Number(p.weight),
      createdAt: p.createdAt?.toISOString(),
      updatedAt: p.updatedAt?.toISOString(),
    };
  }

  async listPatients(doctorId: string): Promise<ListPatientsResponseDTO> {
    const patients = await this.repository.findAll(doctorId);
    const data = patients.map((p) => this.toDTO(p));
    return { data, total: data.length };
  }

  async getPatientById(id: string, doctorId: string): Promise<PatientResponseDTO> {
    const patient = await this.repository.findById(id);
    if (!patient) throw new AppError('Patient not found', 404);
    if (patient.doctorId !== doctorId) throw new AppError('Forbidden', 403);
    return this.toDTO(patient);
  }

  async createPatient(data: CreatePatientDTO): Promise<PatientResponseDTO> {
    const patient = await this.repository.create(data);
    return this.toDTO(patient);
  }

  async updatePatient(id: string, doctorId: string, data: UpdatePatientDTO): Promise<PatientResponseDTO> {
    const patient = await this.repository.findById(id);
    if (!patient) throw new AppError('Patient not found', 404);
    if (patient.doctorId !== doctorId) throw new AppError('Forbidden', 403);

    const updated = await this.repository.update(id, data);
    return this.toDTO(updated!);
  }

  async deletePatient(id: string, doctorId: string): Promise<void> {
    const patient = await this.repository.findById(id);
    if (!patient) throw new AppError('Patient not found', 404);
    if (patient.doctorId !== doctorId) throw new AppError('Forbidden', 403);

    const deletedAt = new Date();
    const hash = crypto
      .createHash('sha256')
      .update(`${id}-${deletedAt.getTime()}`)
      .digest('hex')
      .substring(0, 16);

    await this.repository.anonymize(id, hash, deletedAt);
  }
}
