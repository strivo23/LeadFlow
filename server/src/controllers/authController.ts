import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/authService';
import { sendSuccess, sendError } from '../utils/response';
import { AuthenticatedRequest } from '../middleware/auth';

export class AuthController {
  public static async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { name, email, password } = req.body;
      const result = await AuthService.register({ name, email, password });
      sendSuccess(res, result, 201);
    } catch (error: any) {
      if (error.message?.includes('already exists')) {
        sendError(res, error.message, 409);
        return;
      }
      next(error);
    }
  }

  public static async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password } = req.body;
      const result = await AuthService.login({ email, password });
      sendSuccess(res, result, 200);
    } catch (error: any) {
      if (error.message?.includes('Invalid email or password')) {
        sendError(res, error.message, 401);
        return;
      }
      next(error);
    }
  }

  public static async getMe(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        sendError(res, 'Unauthorized', 401);
        return;
      }
      const profile = await AuthService.getProfile(req.user.id);
      sendSuccess(res, profile);
    } catch (error) {
      next(error);
    }
  }
}
