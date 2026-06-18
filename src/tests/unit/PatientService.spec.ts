import { PatientService } from '../../4-framework/services/PatientService';
import { IPatientRepository } from '../../3-business/interfaces/repositories/IPatientRepository';
import { PatientModel } from '../../2-domain/models/patient.model';
import { SexEnum } from '../../2-domain/enums/sex.enum';
import { AppError } from '../../2-domain/errors/AppError';

const makePatient = (overrides: Partial<PatientModel> = {}): PatientModel => ({
  id: 'patient-uuid',
  doctorId: 'doctor-uuid',
  name: 'Pedro Lima',
  email: 'pedro@email.com',
  phone: '(11) 99999-9999',
  birthDate: '1987-01-01',
  gender: SexEnum.MALE,
  height: 1.68,
  weight: 75,
  ...overrides,
});

const makeRepository = (overrides: Partial<IPatientRepository> = {}): IPatientRepository => ({
  findAll: jest.fn(),
  findById: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  anonymize: jest.fn(),
  ...overrides,
});

describe('PatientService', () => {
  describe('listPatients', () => {
    it('returns empty list when no patients exist', async () => {
      const repo = makeRepository({ findAll: jest.fn().mockResolvedValue([]) });
      const service = new PatientService(repo);

      const result = await service.listPatients('doctor-uuid');

      expect(result).toEqual({ data: [], total: 0 });
    });

    it('returns formatted list of patients', async () => {
      const patient = makePatient();
      const repo = makeRepository({ findAll: jest.fn().mockResolvedValue([patient]) });
      const service = new PatientService(repo);

      const result = await service.listPatients('doctor-uuid');

      expect(result.total).toBe(1);
      expect(result.data[0]).toMatchObject({
        id: patient.id,
        name: patient.name,
        email: patient.email,
        height: 1.68,
        weight: 75,
      });
    });
  });

  describe('createPatient', () => {
    it('creates and returns a patient', async () => {
      const patient = makePatient();
      const repo = makeRepository({ create: jest.fn().mockResolvedValue(patient) });
      const service = new PatientService(repo);

      const result = await service.createPatient({
        doctorId: 'doctor-uuid',
        name: 'Pedro Lima',
        email: 'pedro@email.com',
        phone: '(11) 99999-9999',
        birthDate: '1987-01-01',
        gender: SexEnum.MALE,
        height: 1.68,
        weight: 75,
      });

      expect(result.id).toBe(patient.id);
      expect(repo.create).toHaveBeenCalledTimes(1);
    });
  });

  describe('updatePatient', () => {
    it('throws 404 when patient is not found', async () => {
      const repo = makeRepository({ findById: jest.fn().mockResolvedValue(null) });
      const service = new PatientService(repo);

      await expect(service.updatePatient('any-id', 'doctor-uuid', { name: 'Novo' }))
        .rejects.toMatchObject({ statusCode: 404, message: 'Patient not found' });
    });

    it('throws 403 when patient belongs to another doctor', async () => {
      const patient = makePatient({ doctorId: 'other-doctor' });
      const repo = makeRepository({ findById: jest.fn().mockResolvedValue(patient) });
      const service = new PatientService(repo);

      await expect(service.updatePatient(patient.id, 'doctor-uuid', { name: 'X' }))
        .rejects.toMatchObject({ statusCode: 403, message: 'Forbidden' });
    });

    it('updates and returns the patient', async () => {
      const patient = makePatient();
      const updated = makePatient({ name: 'Pedro Atualizado' });
      const repo = makeRepository({
        findById: jest.fn().mockResolvedValue(patient),
        update: jest.fn().mockResolvedValue(updated),
      });
      const service = new PatientService(repo);

      const result = await service.updatePatient(patient.id, 'doctor-uuid', { name: 'Pedro Atualizado' });

      expect(result.name).toBe('Pedro Atualizado');
      expect(repo.update).toHaveBeenCalledWith(patient.id, { name: 'Pedro Atualizado' });
    });
  });

  describe('deletePatient', () => {
    it('throws 404 when patient is not found', async () => {
      const repo = makeRepository({ findById: jest.fn().mockResolvedValue(null) });
      const service = new PatientService(repo);

      await expect(service.deletePatient('any-id', 'doctor-uuid'))
        .rejects.toMatchObject({ statusCode: 404, message: 'Patient not found' });
    });

    it('throws 403 when patient belongs to another doctor', async () => {
      const patient = makePatient({ doctorId: 'other-doctor' });
      const repo = makeRepository({ findById: jest.fn().mockResolvedValue(patient) });
      const service = new PatientService(repo);

      await expect(service.deletePatient(patient.id, 'doctor-uuid'))
        .rejects.toMatchObject({ statusCode: 403, message: 'Forbidden' });
    });

    it('calls anonymize with a 16-char hash and a Date', async () => {
      const patient = makePatient();
      const anonymize = jest.fn().mockResolvedValue(undefined);
      const repo = makeRepository({
        findById: jest.fn().mockResolvedValue(patient),
        anonymize,
      });
      const service = new PatientService(repo);

      await service.deletePatient(patient.id, 'doctor-uuid');

      expect(anonymize).toHaveBeenCalledTimes(1);
      const [id, hash, deletedAt] = anonymize.mock.calls[0];
      expect(id).toBe(patient.id);
      expect(hash).toHaveLength(16);
      expect(deletedAt).toBeInstanceOf(Date);
    });

    it('does not expose original patient data after deletion', async () => {
      const patient = makePatient();
      const anonymize = jest.fn().mockResolvedValue(undefined);
      const repo = makeRepository({
        findById: jest.fn().mockResolvedValue(patient),
        anonymize,
      });
      const service = new PatientService(repo);

      await service.deletePatient(patient.id, 'doctor-uuid');

      const [, hash] = anonymize.mock.calls[0];
      expect(hash).not.toContain(patient.name);
      expect(hash).not.toContain(patient.email);
    });
  });

  describe('AppError type', () => {
    it('AppError has correct statusCode', () => {
      const err = new AppError('test', 422);
      expect(err.statusCode).toBe(422);
      expect(err.message).toBe('test');
      expect(err.name).toBe('AppError');
    });

    it('AppError defaults statusCode to 400', () => {
      const err = new AppError('bad request');
      expect(err.statusCode).toBe(400);
    });
  });
});
