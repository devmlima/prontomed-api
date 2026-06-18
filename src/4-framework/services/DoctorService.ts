import { Service, Inject } from 'typedi';
import bcrypt from 'bcrypt';
import { IDoctorService } from '../../3-business/interfaces/services/IDoctorService';
import { IDoctorRepository } from '../../3-business/interfaces/repositories/IDoctorRepository';
import { CreateDoctorRequestDTO, CreateDoctorResponseDTO } from '../../2-domain/dtos/doctor.dto';
import { AppError } from '../../2-domain/errors/AppError';
import { DOCTOR_REPOSITORY_TOKEN } from '../../tokens';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

@Service()
export class DoctorService implements IDoctorService {
  constructor(
    @Inject(DOCTOR_REPOSITORY_TOKEN) private repository: IDoctorRepository
  ) {}

  async registerDoctor(data: CreateDoctorRequestDTO): Promise<CreateDoctorResponseDTO> {
    const { name, email, password, crm } = data;

    if (!name || !email || !password || !crm) {
      throw new AppError('Fields name, email, password and crm are required');
    }

    if (!EMAIL_REGEX.test(email)) {
      throw new AppError('Invalid email format');
    }

    if (password.length < 6) {
      throw new AppError('Password must be at least 6 characters');
    }

    const [existingEmail, existingCrm] = await Promise.all([
      this.repository.findByEmail(email),
      this.repository.findByCrm(crm),
    ]);

    if (existingEmail) throw new AppError('Email already in use');
    if (existingCrm) throw new AppError('CRM already in use');

    const id = crypto.randomUUID();
    const hashedPassword = await bcrypt.hash(password, 10);

    const doctor = await this.repository.create({ id, name, email, password: hashedPassword, crm });

    return {
      id: doctor.id,
      name: doctor.name,
      email: doctor.email,
      crm: doctor.crm,
      createdAt: doctor.createdAt!.toISOString(),
    };
  }
}
