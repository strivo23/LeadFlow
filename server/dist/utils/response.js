"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendError = exports.sendSuccess = void 0;
const sendSuccess = (res, data, statusCode = 200, meta) => {
    const response = {
        success: true,
        data,
        ...(meta ? { meta } : {}),
    };
    return res.status(statusCode).json(response);
};
exports.sendSuccess = sendSuccess;
const sendError = (res, message, statusCode = 400, errors) => {
    const response = {
        success: false,
        message,
        ...(errors ? { errors } : {}),
    };
    return res.status(statusCode).json(response);
};
exports.sendError = sendError;
