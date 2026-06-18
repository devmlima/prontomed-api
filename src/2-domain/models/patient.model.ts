import { SexEnum } from '../enums/sex.enum';

export interface PatientModel {
  id: string;
  doctorId: string;
  name: string;
  phone: string;
  email: string;
  birthDate: Date | string;
  gender: SexEnum;
  height: number;
  weight: number;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}
