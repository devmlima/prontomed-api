import { CreatePatientDTO, UpdatePatientDTO, ListPatientsResponseDTO, PatientResponseDTO } from '../../../2-domain/dtos/patient.dto';

export interface IPatientService {
  listPatients(doctorId: string): Promise<ListPatientsResponseDTO>;
  getPatientById(id: string, doctorId: string): Promise<PatientResponseDTO>;
  createPatient(data: CreatePatientDTO): Promise<PatientResponseDTO>;
  updatePatient(id: string, doctorId: string, data: UpdatePatientDTO): Promise<PatientResponseDTO>;
  deletePatient(id: string, doctorId: string): Promise<void>;
}
