import { CreateDoctorRequestDTO, CreateDoctorResponseDTO } from '../../../2-domain/dtos/doctor.dto';

export interface IDoctorService {
  registerDoctor(data: CreateDoctorRequestDTO): Promise<CreateDoctorResponseDTO>;
}
