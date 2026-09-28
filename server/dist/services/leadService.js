"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeadService = void 0;
const db_1 = require("../config/db");
const leadScoringService_1 = require("./leadScoringService");
class LeadService {
    static async getLeads(userId, filters) {
        const page = Math.max(1, Number(filters.page) || 1);
        const limit = Math.min(100, Math.max(1, Number(filters.limit) || 20));
        const skip = (page - 1) * limit;
        const where = {
            createdById: userId,
        };
        if (filters.status && filters.status !== 'ALL') {
            where.status = filters.status;
        }
        if (filters.industry && filters.industry !== 'ALL') {
            where.industry = filters.industry;
        }
        if (filters.search && filters.search.trim()) {
            const q = filters.search.trim();
            where.OR = [
                { firstName: { contains: q } },
                { lastName: { contains: q } },
                { company: { contains: q } },
                { email: { contains: q } },
                { jobTitle: { contains: q } },
            ];
        }
        let orderBy = { createdAt: 'desc' };
        if (filters.sortBy === 'score') {
            orderBy = { score: filters.sortOrder || 'desc' };
        }
        else if (filters.sortBy === 'name') {
            orderBy = { lastName: filters.sortOrder || 'asc' };
        }
        else if (filters.sortBy === 'company') {
            orderBy = { company: filters.sortOrder || 'asc' };
        }
        else if (filters.sortBy === 'createdAt') {
            orderBy = { createdAt: filters.sortOrder || 'desc' };
        }
        const [total, leads] = await Promise.all([
            db_1.prisma.lead.count({ where }),
            db_1.prisma.lead.findMany({
                where,
                skip,
                take: limit,
                orderBy,
                include: {
                    campaignLeads: {
                        include: {
                            campaign: {
                                select: { id: true, name: true, status: true },
                            },
                        },
                    },
                },
            }),
        ]);
        const enrichedLeads = leads.map((lead) => {
            const scoringResult = leadScoringService_1.LeadScoringService.calculate(lead);
            return {
                ...lead,
                classification: scoringResult.classification,
                campaigns: lead.campaignLeads.map((cl) => cl.campaign),
            };
        });
        return {
            leads: enrichedLeads,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    static async getLeadById(id, userId) {
        const lead = await db_1.prisma.lead.findFirst({
            where: { id, createdById: userId },
            include: {
                campaignLeads: {
                    include: {
                        campaign: {
                            select: { id: true, name: true, status: true, createdAt: true },
                        },
                    },
                },
            },
        });
        if (!lead) {
            throw new Error('Lead not found.');
        }
        const scoringResult = leadScoringService_1.LeadScoringService.calculate(lead);
        return {
            ...lead,
            classification: scoringResult.classification,
            scoreBreakdown: scoringResult.breakdown,
            campaigns: lead.campaignLeads.map((cl) => cl.campaign),
        };
    }
    static async createLead(userId, dto) {
        const scoringResult = leadScoringService_1.LeadScoringService.calculate(dto);
        const lead = await db_1.prisma.lead.create({
            data: {
                firstName: dto.firstName.trim(),
                lastName: dto.lastName.trim(),
                email: dto.email.toLowerCase().trim(),
                company: dto.company.trim(),
                jobTitle: dto.jobTitle.trim(),
                phone: dto.phone?.trim() || null,
                website: dto.website?.trim() || null,
                industry: dto.industry.trim(),
                status: dto.status || 'NEW',
                source: dto.source?.trim() || 'Website',
                score: scoringResult.score,
                notes: dto.notes?.trim() || null,
                createdById: userId,
            },
        });
        return {
            ...lead,
            classification: scoringResult.classification,
            scoreBreakdown: scoringResult.breakdown,
        };
    }
    static async updateLead(id, userId, dto) {
        const existing = await db_1.prisma.lead.findFirst({
            where: { id, createdById: userId },
        });
        if (!existing) {
            throw new Error('Lead not found.');
        }
        const merged = {
            ...existing,
            ...dto,
        };
        const scoringResult = leadScoringService_1.LeadScoringService.calculate(merged);
        const updated = await db_1.prisma.lead.update({
            where: { id },
            data: {
                ...(dto.firstName !== undefined && { firstName: dto.firstName.trim() }),
                ...(dto.lastName !== undefined && { lastName: dto.lastName.trim() }),
                ...(dto.email !== undefined && { email: dto.email.toLowerCase().trim() }),
                ...(dto.company !== undefined && { company: dto.company.trim() }),
                ...(dto.jobTitle !== undefined && { jobTitle: dto.jobTitle.trim() }),
                ...(dto.phone !== undefined && { phone: dto.phone?.trim() || null }),
                ...(dto.website !== undefined && { website: dto.website?.trim() || null }),
                ...(dto.industry !== undefined && { industry: dto.industry.trim() }),
                ...(dto.status !== undefined && { status: dto.status }),
                ...(dto.source !== undefined && { source: dto.source?.trim() || null }),
                ...(dto.notes !== undefined && { notes: dto.notes?.trim() || null }),
                score: scoringResult.score,
            },
        });
        return {
            ...updated,
            classification: scoringResult.classification,
            scoreBreakdown: scoringResult.breakdown,
        };
    }
    static async deleteLead(id, userId) {
        const existing = await db_1.prisma.lead.findFirst({
            where: { id, createdById: userId },
        });
        if (!existing) {
            throw new Error('Lead not found.');
        }
        await db_1.prisma.lead.delete({
            where: { id },
        });
        return { id };
    }
    static async getDistinctIndustries(userId) {
        const leads = await db_1.prisma.lead.findMany({
            where: { createdById: userId },
            select: { industry: true },
            distinct: ['industry'],
            orderBy: { industry: 'asc' },
        });
        return leads.map((l) => l.industry);
    }
}
exports.LeadService = LeadService;
