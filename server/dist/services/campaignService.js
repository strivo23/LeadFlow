"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CampaignService = void 0;
const db_1 = require("../config/db");
class CampaignService {
    static async getCampaigns(userId) {
        const campaigns = await db_1.prisma.campaign.findMany({
            where: { createdById: userId },
            orderBy: { createdAt: 'desc' },
            include: {
                _count: {
                    select: { campaignLeads: true },
                },
            },
        });
        return campaigns.map((c) => ({
            id: c.id,
            name: c.name,
            description: c.description,
            status: c.status,
            createdAt: c.createdAt,
            updatedAt: c.updatedAt,
            createdById: c.createdById,
            leadCount: c._count.campaignLeads,
        }));
    }
    static async getCampaignById(id, userId) {
        const campaign = await db_1.prisma.campaign.findFirst({
            where: { id, createdById: userId },
            include: {
                campaignLeads: {
                    include: {
                        lead: {
                            select: {
                                id: true,
                                firstName: true,
                                lastName: true,
                                email: true,
                                company: true,
                                jobTitle: true,
                                industry: true,
                                status: true,
                                score: true,
                            },
                        },
                    },
                    orderBy: { createdAt: 'desc' },
                },
            },
        });
        if (!campaign) {
            throw new Error('Campaign not found.');
        }
        return {
            id: campaign.id,
            name: campaign.name,
            description: campaign.description,
            status: campaign.status,
            createdAt: campaign.createdAt,
            updatedAt: campaign.updatedAt,
            createdById: campaign.createdById,
            leadCount: campaign.campaignLeads.length,
            leads: campaign.campaignLeads.map((cl) => cl.lead),
        };
    }
    static async createCampaign(userId, dto) {
        const campaign = await db_1.prisma.campaign.create({
            data: {
                name: dto.name.trim(),
                description: dto.description?.trim() || null,
                status: dto.status || 'DRAFT',
                createdById: userId,
                ...(dto.leadIds && dto.leadIds.length > 0
                    ? {
                        campaignLeads: {
                            create: dto.leadIds.map((leadId) => ({
                                leadId,
                            })),
                        },
                    }
                    : {}),
            },
            include: {
                _count: {
                    select: { campaignLeads: true },
                },
            },
        });
        return {
            ...campaign,
            leadCount: campaign._count.campaignLeads,
        };
    }
    static async updateCampaign(id, userId, dto) {
        const existing = await db_1.prisma.campaign.findFirst({
            where: { id, createdById: userId },
        });
        if (!existing) {
            throw new Error('Campaign not found.');
        }
        const updated = await db_1.prisma.campaign.update({
            where: { id },
            data: {
                ...(dto.name !== undefined && { name: dto.name.trim() }),
                ...(dto.description !== undefined && { description: dto.description?.trim() || null }),
                ...(dto.status !== undefined && { status: dto.status }),
            },
            include: {
                _count: {
                    select: { campaignLeads: true },
                },
            },
        });
        return {
            ...updated,
            leadCount: updated._count.campaignLeads,
        };
    }
    static async launchCampaign(id, userId) {
        const existing = await db_1.prisma.campaign.findFirst({
            where: { id, createdById: userId },
        });
        if (!existing) {
            throw new Error('Campaign not found.');
        }
        const updated = await db_1.prisma.campaign.update({
            where: { id },
            data: { status: 'ACTIVE' },
            include: {
                _count: {
                    select: { campaignLeads: true },
                },
            },
        });
        return {
            ...updated,
            leadCount: updated._count.campaignLeads,
        };
    }
    static async addLeadToCampaign(campaignId, leadId, userId) {
        const [campaign, lead] = await Promise.all([
            db_1.prisma.campaign.findFirst({ where: { id: campaignId, createdById: userId } }),
            db_1.prisma.lead.findFirst({ where: { id: leadId, createdById: userId } }),
        ]);
        if (!campaign)
            throw new Error('Campaign not found.');
        if (!lead)
            throw new Error('Lead not found.');
        const existing = await db_1.prisma.campaignLead.findUnique({
            where: {
                campaignId_leadId: { campaignId, leadId },
            },
        });
        if (existing) {
            return existing;
        }
        return db_1.prisma.campaignLead.create({
            data: {
                campaignId,
                leadId,
            },
        });
    }
    static async removeLeadFromCampaign(campaignId, leadId, userId) {
        const campaign = await db_1.prisma.campaign.findFirst({
            where: { id: campaignId, createdById: userId },
        });
        if (!campaign)
            throw new Error('Campaign not found.');
        await db_1.prisma.campaignLead.deleteMany({
            where: {
                campaignId,
                leadId,
            },
        });
        return { campaignId, leadId };
    }
    static async deleteCampaign(id, userId) {
        const existing = await db_1.prisma.campaign.findFirst({
            where: { id, createdById: userId },
        });
        if (!existing) {
            throw new Error('Campaign not found.');
        }
        await db_1.prisma.campaign.delete({
            where: { id },
        });
        return { id };
    }
}
exports.CampaignService = CampaignService;
