import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { AuthService } from '../../4-framework/services/AuthService';
import { IDoctorRepository } from '../../3-business/interfaces/repositories/IDoctorRepository';
import { DoctorModel } from '../../2-domain/models/doctor.model';

jest.mock('bcrypt');
jest.mock('jsonwebtoken');

const mockBcrypt = jest.mocked(bcrypt);
const mockJwt = jest.mocked(jwt);

const makeDoctor = (overrides: Partial<DoctorModel> = {}): DoctorModel => ({
  id: 'doctor-uuid',
  name: 'Dr. João',
  email: 'joao@email.com',
  password: 'hashed_password',
  crm: 'CRM/SP 123',
  ...overrides,
});

const makeRepository = (overrides: Partial<IDoctorRepository> = {}): IDoctorRepository => ({
  create: jest.fn(),
  findByEmail: jest.fn(),
  findByCrm: jest.fn(),
  ...overrides,
});

describe('AuthService', () => {
  describe('login', () => {
    it('throws 400 when email is missing', async () => {
      const service = new AuthService(makeRepository());

      await expect(service.login({ email: '', password: 'pass' }))
        .rejects.toMatchObject({ statusCode: 400, message: 'Email and password are required' });
    });

    it('throws 400 when password is missing', async () => {
      const service = new AuthService(makeRepository());

      await expect(service.login({ email: 'a@b.com', password: '' }))
        .rejects.toMatchObject({ statusCode: 400, message: 'Email and password are required' });
    });

    it('throws 401 when doctor is not found', async () => {
      const repo = makeRepository({ findByEmail: jest.fn().mockResolvedValue(null) });
      const service = new AuthService(repo);

      await expect(service.login({ email: 'x@x.com', password: '123' }))
        .rejects.toMatchObject({ statusCode: 401, message: 'Invalid credentials' });
    });

    it('throws 401 when password does not match', async () => {
      const repo = makeRepository({ findByEmail: jest.fn().mockResolvedValue(makeDoctor()) });
      mockBcrypt.compare.mockResolvedValue(false as never);
      const service = new AuthService(repo);

      await expect(service.login({ email: 'joao@email.com', password: 'wrong' }))
        .rejects.toMatchObject({ statusCode: 401, message: 'Invalid credentials' });
    });

    it('returns token and doctor on success', async () => {
      const doctor = makeDoctor();
      const repo = makeRepository({ findByEmail: jest.fn().mockResolvedValue(doctor) });
      mockBcrypt.compare.mockResolvedValue(true as never);
      mockJwt.sign.mockReturnValue('jwt-token' as never);
      const service = new AuthService(repo);

      const result = await service.login({ email: doctor.email, password: 'pass' });

      expect(result.token).toBe('jwt-token');
      expect(result.doctor).toMatchObject({
        id: doctor.id,
        name: doctor.name,
        email: doctor.email,
        crm: doctor.crm,
      });
    });

    it('calls jwt.sign with 24h expiration', async () => {
      const doctor = makeDoctor();
      const repo = makeRepository({ findByEmail: jest.fn().mockResolvedValue(doctor) });
      mockBcrypt.compare.mockResolvedValue(true as never);
      mockJwt.sign.mockReturnValue('token' as never);
      const service = new AuthService(repo);

      await service.login({ email: doctor.email, password: 'pass' });

      expect(mockJwt.sign).toHaveBeenCalledWith(
        expect.objectContaining({ id: doctor.id, email: doctor.email }),
        'test-secret',
        { expiresIn: '24h' },
      );
    });
  });
});
