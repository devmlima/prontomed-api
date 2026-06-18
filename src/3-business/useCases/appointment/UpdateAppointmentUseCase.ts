import { Request, Response } from 'express';
import { IAppointmentService } from '../../interfaces/services/IAppointmentService';
import { AppError } from '../../../2-domain/errors/AppError';

interface RequestWithUser extends Request {
  user?: { id: string; name: string; email: string; crm: string };
}

export class UpdateAppointmentUseCase {
  constructor(private service: IAppointmentService) {}

  async execute(req: RequestWithUser, res: Response): Promise<void> {
    try {
      const result = await this.service.updateAppointment(req.params.id, req.user!.id, req.body);
      res.status(200).json(result);
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ message: error.message });
        return;
      }
      res.status(500).json({ message: 'Internal server error' });
    }
  }
}
