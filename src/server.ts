import 'reflect-metadata';
import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import { Container } from 'typedi';
import { PatientRepository } from './4-framework/repositories/PatientRepository';
import { DoctorRepository } from './4-framework/repositories/DoctorRepository';
import { AppointmentRepository } from './4-framework/repositories/AppointmentRepository';
import { PATIENT_REPOSITORY_TOKEN, DOCTOR_REPOSITORY_TOKEN, APPOINTMENT_REPOSITORY_TOKEN } from './tokens';
import authRoutes from './4-framework/routes/auth.routes';
import patientRoutes from './4-framework/routes/patient.routes';
import appointmentRoutes from './4-framework/routes/appointment.routes';

Container.set(PATIENT_REPOSITORY_TOKEN, new PatientRepository());
Container.set(DOCTOR_REPOSITORY_TOKEN, new DoctorRepository());
Container.set(APPOINTMENT_REPOSITORY_TOKEN, new AppointmentRepository());

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/appointments', appointmentRoutes);

const PORT = process.env.PORT ?? 3000;
app.listen(PORT, () => {
  console.log(`
  ╔══════════════════════════════════════╗
  ║       ProntoMed API is running       ║
  ║   http://localhost:${PORT}               ║
  ╚══════════════════════════════════════╝
  `);
});

export default app;
