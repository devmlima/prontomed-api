import { Router, Request, Response } from 'express';
import { Container } from 'typedi';
import { AppointmentService } from '../services/AppointmentService';
import { authMiddleware } from '../middlewares/auth.middleware';
import { ListAppointmentsUseCase } from '../../3-business/useCases/appointment/ListAppointmentsUseCase';
import { CreateAppointmentUseCase } from '../../3-business/useCases/appointment/CreateAppointmentUseCase';
import { UpdateAppointmentUseCase } from '../../3-business/useCases/appointment/UpdateAppointmentUseCase';
import { CancelAppointmentUseCase } from '../../3-business/useCases/appointment/CancelAppointmentUseCase';
import { GetAppointmentByIdUseCase } from '../../3-business/useCases/appointment/GetAppointmentByIdUseCase';

const router = Router();

router.use(authMiddleware);

router.get('/', async (req: Request, res: Response) => {
  const useCase = new ListAppointmentsUseCase(Container.get(AppointmentService));
  await useCase.execute(req, res);
});

router.post('/', async (req: Request, res: Response) => {
  const useCase = new CreateAppointmentUseCase(Container.get(AppointmentService));
  await useCase.execute(req, res);
});

router.get('/:id', async (req: Request, res: Response) => {
  const useCase = new GetAppointmentByIdUseCase(Container.get(AppointmentService));
  await useCase.execute(req, res);
});

router.put('/:id', async (req: Request, res: Response) => {
  const useCase = new UpdateAppointmentUseCase(Container.get(AppointmentService));
  await useCase.execute(req, res);
});

router.patch('/:id/cancel', async (req: Request, res: Response) => {
  const useCase = new CancelAppointmentUseCase(Container.get(AppointmentService));
  await useCase.execute(req, res);
});

export default router;
