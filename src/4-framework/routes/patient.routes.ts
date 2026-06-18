import { Router, Request, Response } from 'express';
import { Container } from 'typedi';
import { PatientService } from '../services/PatientService';
import { authMiddleware } from '../middlewares/auth.middleware';
import { ListPatientsUseCase } from '../../3-business/useCases/patient/ListPatientsUseCase';
import { CreatePatientUseCase } from '../../3-business/useCases/patient/CreatePatientUseCase';
import { UpdatePatientUseCase } from '../../3-business/useCases/patient/UpdatePatientUseCase';
import { DeletePatientUseCase } from '../../3-business/useCases/patient/DeletePatientUseCase';
import { GetPatientByIdUseCase } from '../../3-business/useCases/patient/GetPatientByIdUseCase';

const router = Router();

router.use(authMiddleware);

router.get('/', async (req: Request, res: Response) => {
  const useCase = new ListPatientsUseCase(Container.get(PatientService));
  await useCase.execute(req, res);
});

router.post('/', async (req: Request, res: Response) => {
  const useCase = new CreatePatientUseCase(Container.get(PatientService));
  await useCase.execute(req, res);
});

router.get('/:id', async (req: Request, res: Response) => {
  const useCase = new GetPatientByIdUseCase(Container.get(PatientService));
  await useCase.execute(req, res);
});

router.put('/:id', async (req: Request, res: Response) => {
  const useCase = new UpdatePatientUseCase(Container.get(PatientService));
  await useCase.execute(req, res);
});

router.delete('/:id', async (req: Request, res: Response) => {
  const useCase = new DeletePatientUseCase(Container.get(PatientService));
  await useCase.execute(req, res);
});

export default router;
