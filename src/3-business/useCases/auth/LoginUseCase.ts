import { Request, Response } from 'express';
import { IAuthService } from '../../interfaces/services/IAuthService';
import { AppError } from '../../../2-domain/errors/AppError';

export class LoginUseCase {
  constructor(private service: IAuthService) {}

  async execute(req: Request, res: Response): Promise<void> {
    try {
      const result = await this.service.login(req.body);
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
