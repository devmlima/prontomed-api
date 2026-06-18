export interface DoctorModel {
  id: string;
  name: string;
  email: string;
  password: string;
  crm: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}
