import { SexEnum } from '../enums/sex.enum';

export interface CreatePatientDTO {
  doctorId: string;
  name: string;
  phone: string;
  email: string;
  birthDate: string;
  gender: SexEnum;
  height: number;
  weight: number;
}

export interface UpdatePatientDTO {
  name?: string;
  phone?: string;
  email?: string;
  birthDate?: string;
  gender?: SexEnum;
  height?: number;
  weight?: number;
}

export interface PatientResponseDTO {
  id: string;
  doctorId: string;
  name: string;
  phone: string;
  email: string;
  birthDate: string;
  gender: SexEnum;
  height: number;
  weight: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface ListPatientsResponseDTO {
  data: PatientResponseDTO[];
  total: number;
}
