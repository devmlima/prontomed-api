export interface CreateDoctorRequestDTO {
  name: string;
  email: string;
  password: string;
  crm: string;
}

export interface CreateDoctorResponseDTO {
  id: string;
  name: string;
  email: string;
  crm: string;
  createdAt: string;
}
