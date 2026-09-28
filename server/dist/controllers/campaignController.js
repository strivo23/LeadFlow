"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CampaignController = void 0;
const campaignService_1 = require("../services/campaignService");
const response_1 = require("../utils/response");
class CampaignController {
    static async getCampaigns(req, res, next) {
        try {
            const userId = req.user.id;
            const campaigns = await campaignService_1.CampaignService.getCampaigns(userId);
            (0, response_1.sendSuccess)(res, campaigns);
        }
        catch (error) {
            next(error);
        }
    }
    static async getCampaignById(req, res, next) {
        try {
            const userId = req.user.id;
            const { id } = req.params;
            const campaign = await campaignService_1.CampaignService.getCampaignById(id, userId);
            (0, response_1.sendSuccess)(res, campaign);
        }
        catch (error) {
            if (error.message?.includes('not found')) {
                (0, response_1.sendError)(res, error.message, 404);
                return;
            }
            next(error);
        }
    }
    static async createCampaign(req, res, next) {
        try {
            const userId = req.user.id;
            const campaign = await campaignService_1.CampaignService.createCampaign(userId, req.body);
            (0, response_1.sendSuccess)(res, campaign, 201);
        }
        catch (error) {
            next(error);
        }
    }
    static async updateCampaign(req, res, next) {
        try {
            const userId = req.user.id;
            const { id } = req.params;
            const updated = await campaignService_1.CampaignService.updateCampaign(id, userId, req.body);
            (0, response_1.sendSuccess)(res, updated);
        }
        catch (error) {
            if (error.message?.includes('not found')) {
                (0, response_1.sendError)(res, error.message, 404);
                return;
            }
            next(error);
        }
    }
    static async launchCampaign(req, res, next) {
        try {
            const userId = req.user.id;
            const { id } = req.params;
            const launched = await campaignService_1.CampaignService.launchCampaign(id, userId);
            (0, response_1.sendSuccess)(res, launched);
        }
        catch (error) {
            if (error.message?.includes('not found')) {
                (0, response_1.sendError)(res, error.message, 404);
                return;
            }
            next(error);
        }
    }
    static async addLeadToCampaign(req, res, next) {
        try {
            const userId = req.user.id;
            const { id } = req.params;
            const { leadId } = req.body;
            if (!leadId) {
                (0, response_1.sendError)(res, 'leadId is required', 400);
                return;
            }
            const association = await campaignService_1.CampaignService.addLeadToCampaign(id, leadId, userId);
            (0, response_1.sendSuccess)(res, association, 201);
        }
        catch (error) {
            if (error.message?.includes('not found')) {
                (0, response_1.sendError)(res, error.message, 404);
                return;
            }
            next(error);
        }
    }
    static async removeLeadFromCampaign(req, res, next) {
        try {
            const userId = req.user.id;
            const { id, leadId } = req.params;
            const result = await campaignService_1.CampaignService.removeLeadFromCampaign(id, leadId, userId);
            (0, response_1.sendSuccess)(res, result);
        }
        catch (error) {
            if (error.message?.includes('not found')) {
                (0, response_1.sendError)(res, error.message, 404);
                return;
            }
            next(error);
        }
    }
    static async deleteCampaign(req, res, next) {
        try {
            const userId = req.user.id;
            const { id } = req.params;
            const result = await campaignService_1.CampaignService.deleteCampaign(id, userId);
            (0, response_1.sendSuccess)(res, result);
        }
        catch (error) {
            if (error.message?.includes('not found')) {
                (0, response_1.sendError)(res, error.message, 404);
                return;
            }
            next(error);
        }
    }
}
exports.CampaignController = CampaignController;
