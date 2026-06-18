import { Request, Response } from 'express';
import { IDoctorService } from '../../interfaces/services/IDoctorService';
import { AppError } from '../../../2-domain/errors/AppError';

export class RegisterDoctorUseCase {
  constructor(private service: IDoctorService) {}

  async execute(req: Request, res: Response): Promise<void> {
    try {
      const result = await this.service.registerDoctor(req.body);
      res.status(201).json(result);
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ message: error.message });
        return;
      }
      res.status(500).json({ message: 'Internal server error' });
    }
  }
}
