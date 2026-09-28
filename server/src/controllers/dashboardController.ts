import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import { DashboardService } from '../services/dashboardService';
import { sendSuccess } from '../utils/response';

export class DashboardController {
  public static async getStats(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const stats = await DashboardService.getStats(userId);
      sendSuccess(res, stats);
    } catch (error) {
      next(error);
    }
  }
}
