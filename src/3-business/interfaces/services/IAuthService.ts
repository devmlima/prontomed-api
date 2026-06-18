import { LoginRequestDTO, LoginResponseDTO } from '../../../2-domain/dtos/auth.dto';

export interface IAuthService {
  login(data: LoginRequestDTO): Promise<LoginResponseDTO>;
}
