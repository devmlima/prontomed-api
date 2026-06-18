import { Token } from 'typedi';
import type { IPatientRepository } from './3-business/interfaces/repositories/IPatientRepository';
import type { IPatientService } from './3-business/interfaces/services/IPatientService';
import type { IDoctorRepository } from './3-business/interfaces/repositories/IDoctorRepository';
import type { IDoctorService } from './3-business/interfaces/services/IDoctorService';
import type { IAppointmentRepository } from './3-business/interfaces/repositories/IAppointmentRepository';
import type { IAppointmentService } from './3-business/interfaces/services/IAppointmentService';

export const PATIENT_REPOSITORY_TOKEN = new Token<IPatientRepository>('IPatientRepository');
export const PATIENT_SERVICE_TOKEN = new Token<IPatientService>('IPatientService');

export const DOCTOR_REPOSITORY_TOKEN = new Token<IDoctorRepository>('IDoctorRepository');
export const DOCTOR_SERVICE_TOKEN = new Token<IDoctorService>('IDoctorService');

export const APPOINTMENT_REPOSITORY_TOKEN = new Token<IAppointmentRepository>('IAppointmentRepository');
export const APPOINTMENT_SERVICE_TOKEN = new Token<IAppointmentService>('IAppointmentService');
