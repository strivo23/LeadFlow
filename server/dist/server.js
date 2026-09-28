"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const env_1 = require("./config/env");
const logger_1 = require("./utils/logger");
const server = app_1.default.listen(env_1.env.PORT, () => {
    logger_1.logger.info(`🚀 LeadFlow Server running in ${env_1.env.NODE_ENV} mode on port ${env_1.env.PORT}`);
    logger_1.logger.info(`📚 API Documentation available at http://localhost:${env_1.env.PORT}/api-docs`);
});
process.on('SIGTERM', () => {
    logger_1.logger.info('SIGTERM signal received: closing HTTP server');
    server.close(() => {
        logger_1.logger.info('HTTP server closed');
    });
});
