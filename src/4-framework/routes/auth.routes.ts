import { Router, Request, Response } from 'express';
import { Container } from 'typedi';
import { AuthService } from '../services/AuthService';
import { DoctorService } from '../services/DoctorService';
import { LoginUseCase } from '../../3-business/useCases/auth/LoginUseCase';
import { RegisterDoctorUseCase } from '../../3-business/useCases/auth/RegisterDoctorUseCase';

const router = Router();

router.post('/login', async (req: Request, res: Response) => {
  const useCase = new LoginUseCase(Container.get(AuthService));
  await useCase.execute(req, res);
});

router.post('/register', async (req: Request, res: Response) => {
  const useCase = new RegisterDoctorUseCase(Container.get(DoctorService));
  await useCase.execute(req, res);
});

export default router;
