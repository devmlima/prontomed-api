import { Request, Response } from 'express';
import { IPatientService } from '../../interfaces/services/IPatientService';
import { AppError } from '../../../2-domain/errors/AppError';

interface RequestWithUser extends Request {
  user?: { id: string; name: string; email: string; crm: string };
}

export class DeletePatientUseCase {
  constructor(private service: IPatientService) {}

  async execute(req: RequestWithUser, res: Response): Promise<void> {
    try {
      await this.service.deletePatient(req.params.id, req.user!.id);
      res.status(204).send();
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ message: error.message });
        return;
      }
      res.status(500).json({ message: 'Internal server error' });
    }
  }
}
