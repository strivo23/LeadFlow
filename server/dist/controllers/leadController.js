"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeadController = void 0;
const leadService_1 = require("../services/leadService");
const response_1 = require("../utils/response");
class LeadController {
    static async getLeads(req, res, next) {
        try {
            const userId = req.user.id;
            const { search, status, industry, sortBy, sortOrder, page, limit } = req.query;
            const result = await leadService_1.LeadService.getLeads(userId, {
                search: search,
                status: status,
                industry: industry,
                sortBy: sortBy,
                sortOrder: sortOrder,
                page: page ? parseInt(page, 10) : 1,
                limit: limit ? parseInt(limit, 10) : 20,
            });
            (0, response_1.sendSuccess)(res, result.leads, 200, result.meta);
        }
        catch (error) {
            next(error);
        }
    }
    static async getLeadById(req, res, next) {
        try {
            const userId = req.user.id;
            const { id } = req.params;
            const lead = await leadService_1.LeadService.getLeadById(id, userId);
            (0, response_1.sendSuccess)(res, lead);
        }
        catch (error) {
            if (error.message?.includes('not found')) {
                (0, response_1.sendError)(res, error.message, 404);
                return;
            }
            next(error);
        }
    }
    static async createLead(req, res, next) {
        try {
            const userId = req.user.id;
            const lead = await leadService_1.LeadService.createLead(userId, req.body);
            (0, response_1.sendSuccess)(res, lead, 201);
        }
        catch (error) {
            next(error);
        }
    }
    static async updateLead(req, res, next) {
        try {
            const userId = req.user.id;
            const { id } = req.params;
            const updated = await leadService_1.LeadService.updateLead(id, userId, req.body);
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
    static async deleteLead(req, res, next) {
        try {
            const userId = req.user.id;
            const { id } = req.params;
            const result = await leadService_1.LeadService.deleteLead(id, userId);
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
    static async getIndustries(req, res, next) {
        try {
            const userId = req.user.id;
            const industries = await leadService_1.LeadService.getDistinctIndustries(userId);
            (0, response_1.sendSuccess)(res, industries);
        }
        catch (error) {
            next(error);
        }
    }
}
exports.LeadController = LeadController;
