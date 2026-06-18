export interface LoginRequestDTO {
  email: string;
  password: string;
}

export interface LoginResponseDTO {
  token: string;
  doctor: {
    id: string;
    name: string;
    email: string;
    crm: string;
  };
}
