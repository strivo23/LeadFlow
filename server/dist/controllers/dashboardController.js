"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardController = void 0;
const dashboardService_1 = require("../services/dashboardService");
const response_1 = require("../utils/response");
class DashboardController {
    static async getStats(req, res, next) {
        try {
            const userId = req.user.id;
            const stats = await dashboardService_1.DashboardService.getStats(userId);
            (0, response_1.sendSuccess)(res, stats);
        }
        catch (error) {
            next(error);
        }
    }
}
exports.DashboardController = DashboardController;
