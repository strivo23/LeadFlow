import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import { CampaignService } from '../services/campaignService';
import { sendSuccess, sendError } from '../utils/response';

export class CampaignController {
  public static async getCampaigns(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const campaigns = await CampaignService.getCampaigns(userId);
      sendSuccess(res, campaigns);
    } catch (error) {
      next(error);
    }
  }

  public static async getCampaignById(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const { id } = req.params;
      const campaign = await CampaignService.getCampaignById(id, userId);
      sendSuccess(res, campaign);
    } catch (error: any) {
      if (error.message?.includes('not found')) {
        sendError(res, error.message, 404);
        return;
      }
      next(error);
    }
  }

  public static async createCampaign(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const campaign = await CampaignService.createCampaign(userId, req.body);
      sendSuccess(res, campaign, 201);
    } catch (error) {
      next(error);
    }
  }

  public static async updateCampaign(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const { id } = req.params;
      const updated = await CampaignService.updateCampaign(id, userId, req.body);
      sendSuccess(res, updated);
    } catch (error: any) {
      if (error.message?.includes('not found')) {
        sendError(res, error.message, 404);
        return;
      }
      next(error);
    }
  }

  public static async launchCampaign(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const { id } = req.params;
      const launched = await CampaignService.launchCampaign(id, userId);
      sendSuccess(res, launched);
    } catch (error: any) {
      if (error.message?.includes('not found')) {
        sendError(res, error.message, 404);
        return;
      }
      next(error);
    }
  }

  public static async addLeadToCampaign(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const { id } = req.params;
      const { leadId } = req.body;

      if (!leadId) {
        sendError(res, 'leadId is required', 400);
        return;
      }

      const association = await CampaignService.addLeadToCampaign(id, leadId, userId);
      sendSuccess(res, association, 201);
    } catch (error: any) {
      if (error.message?.includes('not found')) {
        sendError(res, error.message, 404);
        return;
      }
      next(error);
    }
  }

  public static async removeLeadFromCampaign(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const { id, leadId } = req.params;

      const result = await CampaignService.removeLeadFromCampaign(id, leadId, userId);
      sendSuccess(res, result);
    } catch (error: any) {
      if (error.message?.includes('not found')) {
        sendError(res, error.message, 404);
        return;
      }
      next(error);
    }
  }

  public static async deleteCampaign(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const { id } = req.params;

      const result = await CampaignService.deleteCampaign(id, userId);
      sendSuccess(res, result);
    } catch (error: any) {
      if (error.message?.includes('not found')) {
        sendError(res, error.message, 404);
        return;
      }
      next(error);
    }
  }
}
