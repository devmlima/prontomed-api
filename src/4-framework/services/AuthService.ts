import { Service, Inject } from 'typedi';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { IAuthService } from '../../3-business/interfaces/services/IAuthService';
import { IDoctorRepository } from '../../3-business/interfaces/repositories/IDoctorRepository';
import { LoginRequestDTO, LoginResponseDTO } from '../../2-domain/dtos/auth.dto';
import { AppError } from '../../2-domain/errors/AppError';
import { DOCTOR_REPOSITORY_TOKEN } from '../../tokens';

@Service()
export class AuthService implements IAuthService {
  constructor(
    @Inject(DOCTOR_REPOSITORY_TOKEN) private doctorRepository: IDoctorRepository
  ) {}

  async login(data: LoginRequestDTO): Promise<LoginResponseDTO> {
    const { email, password } = data;

    if (!email || !password) {
      throw new AppError('Email and password are required');
    }

    const doctor = await this.doctorRepository.findByEmail(email);

    if (!doctor) {
      throw new AppError('Invalid credentials', 401);
    }

    const passwordMatch = await bcrypt.compare(password, doctor.password);

    if (!passwordMatch) {
      throw new AppError('Invalid credentials', 401);
    }

    const secret = process.env.JWT_SECRET!;
    const token = jwt.sign(
      { id: doctor.id, name: doctor.name, email: doctor.email, crm: doctor.crm },
      secret,
      { expiresIn: '24h' }
    );

    return {
      token,
      doctor: {
        id: doctor.id,
        name: doctor.name,
        email: doctor.email,
        crm: doctor.crm,
      },
    };
  }
}
