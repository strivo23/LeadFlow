"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = exports.notFoundHandler = void 0;
const response_1 = require("../utils/response");
const logger_1 = require("../utils/logger");
const notFoundHandler = (req, res) => {
    (0, response_1.sendError)(res, `Cannot ${req.method} ${req.originalUrl}`, 404);
};
exports.notFoundHandler = notFoundHandler;
const errorHandler = (err, req, res, next) => {
    logger_1.logger.error(`Unhandled Error [${req.method} ${req.url}]:`, err.stack || err.message || err);
    // Prisma unique constraint violation (P2002)
    if (err.code === 'P2002') {
        const target = Array.isArray(err.meta?.target) ? err.meta.target.join(', ') : 'field';
        (0, response_1.sendError)(res, `A record with this ${target} already exists.`, 409);
        return;
    }
    // Prisma record not found (P2025)
    if (err.code === 'P2025') {
        (0, response_1.sendError)(res, 'Record not found.', 404);
        return;
    }
    // Generic syntax or JSON parse error
    if (err instanceof SyntaxError && 'body' in err) {
        (0, response_1.sendError)(res, 'Malformed JSON in request body', 400);
        return;
    }
    const statusCode = err.statusCode || err.status || 500;
    const message = process.env.NODE_ENV === 'production' && statusCode === 500
        ? 'Internal server error. Please try again later.'
        : err.message || 'Internal server error';
    (0, response_1.sendError)(res, message, statusCode);
};
exports.errorHandler = errorHandler;
