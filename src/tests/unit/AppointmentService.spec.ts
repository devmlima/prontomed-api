import { AppointmentService } from '../../4-framework/services/AppointmentService';
import { IAppointmentRepository } from '../../3-business/interfaces/repositories/IAppointmentRepository';
import { AppointmentModel } from '../../2-domain/models/appointment.model';
import { AppointmentStatusEnum } from '../../2-domain/enums/appointment-status.enum';

const makeAppointment = (overrides: Partial<AppointmentModel> = {}): AppointmentModel => ({
  id: 'appt-uuid',
  doctorId: 'doctor-uuid',
  patientId: 'patient-uuid',
  scheduledAt: '2026-06-20T14:00:00.000Z',
  durationMinutes: 30,
  status: AppointmentStatusEnum.SCHEDULED,
  ...overrides,
});

const makeRepository = (overrides: Partial<IAppointmentRepository> = {}): IAppointmentRepository => ({
  findAll: jest.fn(),
  findById: jest.fn(),
  findOverlapping: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  cancel: jest.fn(),
  ...overrides,
});

describe('AppointmentService', () => {
  describe('listAppointments', () => {
    it('returns empty list when no appointments exist', async () => {
      const repo = makeRepository({ findAll: jest.fn().mockResolvedValue([]) });
      const service = new AppointmentService(repo);

      const result = await service.listAppointments('doctor-uuid');

      expect(result).toEqual({ data: [], total: 0 });
    });

    it('returns formatted list with correct fields', async () => {
      const appt = makeAppointment();
      const repo = makeRepository({ findAll: jest.fn().mockResolvedValue([appt]) });
      const service = new AppointmentService(repo);

      const result = await service.listAppointments('doctor-uuid');

      expect(result.total).toBe(1);
      expect(result.data[0]).toMatchObject({
        id: appt.id,
        doctorId: appt.doctorId,
        patientId: appt.patientId,
        durationMinutes: 30,
        status: AppointmentStatusEnum.SCHEDULED,
      });
    });
  });

  describe('createAppointment', () => {
    it('throws 409 when there is a time conflict', async () => {
      const conflict = makeAppointment();
      const repo = makeRepository({ findOverlapping: jest.fn().mockResolvedValue(conflict) });
      const service = new AppointmentService(repo);

      await expect(
        service.createAppointment({
          doctorId: 'doctor-uuid',
          patientId: 'patient-uuid',
          scheduledAt: '2026-06-20T14:00:00',
          durationMinutes: 30,
        }),
      ).rejects.toMatchObject({ statusCode: 409, message: 'Doctor already has an appointment in this time slot' });
    });

    it('creates and returns appointment when no conflict', async () => {
      const appt = makeAppointment();
      const repo = makeRepository({
        findOverlapping: jest.fn().mockResolvedValue(null),
        create: jest.fn().mockResolvedValue(appt),
      });
      const service = new AppointmentService(repo);

      const result = await service.createAppointment({
        doctorId: 'doctor-uuid',
        patientId: 'patient-uuid',
        scheduledAt: '2026-06-20T14:00:00',
        durationMinutes: 30,
      });

      expect(result.id).toBe(appt.id);
      expect(repo.create).toHaveBeenCalledTimes(1);
    });

    it('calls findOverlapping with a Date object', async () => {
      const findOverlapping = jest.fn().mockResolvedValue(null);
      const repo = makeRepository({
        findOverlapping,
        create: jest.fn().mockResolvedValue(makeAppointment()),
      });
      const service = new AppointmentService(repo);

      await service.createAppointment({
        doctorId: 'doctor-uuid',
        patientId: 'patient-uuid',
        scheduledAt: '2026-06-20T14:00:00',
        durationMinutes: 30,
      });

      expect(findOverlapping.mock.calls[0][1]).toBeInstanceOf(Date);
    });
  });

  describe('updateAppointment', () => {
    it('throws 404 when appointment is not found', async () => {
      const repo = makeRepository({ findById: jest.fn().mockResolvedValue(null) });
      const service = new AppointmentService(repo);

      await expect(service.updateAppointment('any-id', 'doctor-uuid', {}))
        .rejects.toMatchObject({ statusCode: 404, message: 'Appointment not found' });
    });

    it('throws 403 when appointment belongs to another doctor', async () => {
      const appt = makeAppointment({ doctorId: 'other-doctor' });
      const repo = makeRepository({ findById: jest.fn().mockResolvedValue(appt) });
      const service = new AppointmentService(repo);

      await expect(service.updateAppointment(appt.id, 'doctor-uuid', {}))
        .rejects.toMatchObject({ statusCode: 403, message: 'Forbidden' });
    });

    it('throws 409 when rescheduling causes a conflict', async () => {
      const appt = makeAppointment();
      const conflict = makeAppointment({ id: 'other-appt' });
      const repo = makeRepository({
        findById: jest.fn().mockResolvedValue(appt),
        findOverlapping: jest.fn().mockResolvedValue(conflict),
      });
      const service = new AppointmentService(repo);

      await expect(
        service.updateAppointment(appt.id, 'doctor-uuid', { scheduledAt: '2026-06-20T15:00:00' }),
      ).rejects.toMatchObject({ statusCode: 409 });
    });

    it('updates and returns appointment when no conflict', async () => {
      const appt = makeAppointment();
      const updated = makeAppointment({ durationMinutes: 60 });
      const repo = makeRepository({
        findById: jest.fn().mockResolvedValue(appt),
        findOverlapping: jest.fn().mockResolvedValue(null),
        update: jest.fn().mockResolvedValue(updated),
      });
      const service = new AppointmentService(repo);

      const result = await service.updateAppointment(appt.id, 'doctor-uuid', { durationMinutes: 60 });

      expect(result.durationMinutes).toBe(60);
      expect(repo.update).toHaveBeenCalledWith(appt.id, { durationMinutes: 60 });
    });

    it('skips overlap check when only status is updated', async () => {
      const appt = makeAppointment();
      const updated = makeAppointment({ status: AppointmentStatusEnum.COMPLETED });
      const findOverlapping = jest.fn();
      const repo = makeRepository({
        findById: jest.fn().mockResolvedValue(appt),
        findOverlapping,
        update: jest.fn().mockResolvedValue(updated),
      });
      const service = new AppointmentService(repo);

      await service.updateAppointment(appt.id, 'doctor-uuid', { status: AppointmentStatusEnum.COMPLETED });

      expect(findOverlapping).not.toHaveBeenCalled();
    });
  });

  describe('cancelAppointment', () => {
    it('throws 404 when appointment is not found', async () => {
      const repo = makeRepository({ findById: jest.fn().mockResolvedValue(null) });
      const service = new AppointmentService(repo);

      await expect(service.cancelAppointment('any-id', 'doctor-uuid'))
        .rejects.toMatchObject({ statusCode: 404, message: 'Appointment not found' });
    });

    it('throws 403 when appointment belongs to another doctor', async () => {
      const appt = makeAppointment({ doctorId: 'other-doctor' });
      const repo = makeRepository({ findById: jest.fn().mockResolvedValue(appt) });
      const service = new AppointmentService(repo);

      await expect(service.cancelAppointment(appt.id, 'doctor-uuid'))
        .rejects.toMatchObject({ statusCode: 403, message: 'Forbidden' });
    });

    it('calls repository cancel with correct id', async () => {
      const appt = makeAppointment();
      const cancel = jest.fn().mockResolvedValue(undefined);
      const repo = makeRepository({
        findById: jest.fn().mockResolvedValue(appt),
        cancel,
      });
      const service = new AppointmentService(repo);

      await service.cancelAppointment(appt.id, 'doctor-uuid');

      expect(cancel).toHaveBeenCalledWith(appt.id);
      expect(cancel).toHaveBeenCalledTimes(1);
    });
  });
});
