import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import { LeadService } from '../services/leadService';
import { sendSuccess, sendError } from '../utils/response';

export class LeadController {
  public static async getLeads(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const { search, status, industry, sortBy, sortOrder, page, limit } = req.query;

      const result = await LeadService.getLeads(userId, {
        search: search as string | undefined,
        status: status as string | undefined,
        industry: industry as string | undefined,
        sortBy: sortBy as any,
        sortOrder: sortOrder as any,
        page: page ? parseInt(page as string, 10) : 1,
        limit: limit ? parseInt(limit as string, 10) : 20,
      });

      sendSuccess(res, result.leads, 200, result.meta);
    } catch (error) {
      next(error);
    }
  }

  public static async getLeadById(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const { id } = req.params;

      const lead = await LeadService.getLeadById(id, userId);
      sendSuccess(res, lead);
    } catch (error: any) {
      if (error.message?.includes('not found')) {
        sendError(res, error.message, 404);
        return;
      }
      next(error);
    }
  }

  public static async createLead(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const lead = await LeadService.createLead(userId, req.body);
      sendSuccess(res, lead, 201);
    } catch (error) {
      next(error);
    }
  }

  public static async updateLead(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const { id } = req.params;

      const updated = await LeadService.updateLead(id, userId, req.body);
      sendSuccess(res, updated);
    } catch (error: any) {
      if (error.message?.includes('not found')) {
        sendError(res, error.message, 404);
        return;
      }
      next(error);
    }
  }

  public static async deleteLead(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const { id } = req.params;

      const result = await LeadService.deleteLead(id, userId);
      sendSuccess(res, result);
    } catch (error: any) {
      if (error.message?.includes('not found')) {
        sendError(res, error.message, 404);
        return;
      }
      next(error);
    }
  }

  public static async getIndustries(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const industries = await LeadService.getDistinctIndustries(userId);
      sendSuccess(res, industries);
    } catch (error) {
      next(error);
    }
  }
}
