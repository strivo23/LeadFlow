"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const authService_1 = require("../services/authService");
const response_1 = require("../utils/response");
class AuthController {
    static async register(req, res, next) {
        try {
            const { name, email, password } = req.body;
            const result = await authService_1.AuthService.register({ name, email, password });
            (0, response_1.sendSuccess)(res, result, 201);
        }
        catch (error) {
            if (error.message?.includes('already exists')) {
                (0, response_1.sendError)(res, error.message, 409);
                return;
            }
            next(error);
        }
    }
    static async login(req, res, next) {
        try {
            const { email, password } = req.body;
            const result = await authService_1.AuthService.login({ email, password });
            (0, response_1.sendSuccess)(res, result, 200);
        }
        catch (error) {
            if (error.message?.includes('Invalid email or password')) {
                (0, response_1.sendError)(res, error.message, 401);
                return;
            }
            next(error);
        }
    }
    static async getMe(req, res, next) {
        try {
            if (!req.user) {
                (0, response_1.sendError)(res, 'Unauthorized', 401);
                return;
            }
            const profile = await authService_1.AuthService.getProfile(req.user.id);
            (0, response_1.sendSuccess)(res, profile);
        }
        catch (error) {
            next(error);
        }
    }
}
exports.AuthController = AuthController;
