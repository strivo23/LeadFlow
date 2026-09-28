"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCampaignSchema = exports.createCampaignSchema = exports.updateLeadSchema = exports.createLeadSchema = exports.campaignStatusEnum = exports.leadStatusEnum = exports.loginSchema = exports.registerSchema = void 0;
const zod_1 = require("zod");
exports.registerSchema = zod_1.z.object({
    name: zod_1.z.string().min(2, 'Name must be at least 2 characters'),
    email: zod_1.z.string().email('Please provide a valid email address'),
    password: zod_1.z.string().min(6, 'Password must be at least 6 characters'),
});
exports.loginSchema = zod_1.z.object({
    email: zod_1.z.string().email('Please provide a valid email address'),
    password: zod_1.z.string().min(1, 'Password is required'),
});
exports.leadStatusEnum = zod_1.z.enum(['NEW', 'CONTACTED', 'QUALIFIED', 'CONVERTED', 'LOST']);
exports.campaignStatusEnum = zod_1.z.enum(['DRAFT', 'ACTIVE', 'PAUSED', 'COMPLETED']);
exports.createLeadSchema = zod_1.z.object({
    firstName: zod_1.z.string().min(1, 'First name is required'),
    lastName: zod_1.z.string().min(1, 'Last name is required'),
    email: zod_1.z.string().email('Please enter a valid email address'),
    company: zod_1.z.string().min(1, 'Company name is required'),
    jobTitle: zod_1.z.string().min(1, 'Job title is required'),
    industry: zod_1.z.string().min(1, 'Industry is required'),
    phone: zod_1.z.string().optional().nullable(),
    website: zod_1.z.string().optional().nullable(),
    status: exports.leadStatusEnum.optional().default('NEW'),
    source: zod_1.z.string().optional().nullable(),
    notes: zod_1.z.string().optional().nullable(),
});
exports.updateLeadSchema = exports.createLeadSchema.partial();
exports.createCampaignSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, 'Campaign name is required'),
    description: zod_1.z.string().optional().nullable(),
    status: exports.campaignStatusEnum.optional().default('DRAFT'),
    leadIds: zod_1.z.array(zod_1.z.string()).optional(),
});
exports.updateCampaignSchema = exports.createCampaignSchema.partial();
