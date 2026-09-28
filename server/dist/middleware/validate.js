"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const zod_1 = require("zod");
const response_1 = require("../utils/response");
const validate = (schema) => async (req, res, next) => {
    try {
        req.body = await schema.parseAsync(req.body);
        next();
    }
    catch (error) {
        if (error instanceof zod_1.ZodError) {
            const issues = error.errors.map((err) => ({
                field: err.path.join('.'),
                message: err.message,
            }));
            (0, response_1.sendError)(res, issues[0]?.message || 'Validation error', 422, issues);
            return;
        }
        (0, response_1.sendError)(res, 'Invalid request payload', 400);
    }
};
exports.validate = validate;
