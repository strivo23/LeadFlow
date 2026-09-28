"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateJwt = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../config/env");
const response_1 = require("../utils/response");
const db_1 = require("../config/db");
const authenticateJwt = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            (0, response_1.sendError)(res, 'Authentication token missing or invalid', 401);
            return;
        }
        const token = authHeader.split(' ')[1];
        if (!token) {
            (0, response_1.sendError)(res, 'Authentication token missing', 401);
            return;
        }
        const decoded = jsonwebtoken_1.default.verify(token, env_1.env.JWT_SECRET);
        // Verify user still exists in database
        const user = await db_1.prisma.user.findUnique({
            where: { id: decoded.id },
            select: { id: true, email: true, name: true },
        });
        if (!user) {
            (0, response_1.sendError)(res, 'User no longer exists', 401);
            return;
        }
        req.user = user;
        next();
    }
    catch (error) {
        if (error.name === 'TokenExpiredError') {
            (0, response_1.sendError)(res, 'Authentication token has expired', 401);
            return;
        }
        (0, response_1.sendError)(res, 'Invalid authentication token', 401);
    }
};
exports.authenticateJwt = authenticateJwt;
