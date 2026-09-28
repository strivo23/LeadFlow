"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardService = void 0;
const db_1 = require("../config/db");
const leadScoringService_1 = require("./leadScoringService");
class DashboardService {
    static async getStats(userId) {
        const [totalLeads, convertedLeads, activeCampaigns, totalCampaigns, statusCounts, leadsForScoring, recentLeadsRaw, topScoringLeadsRaw, recentCampaignsRaw,] = await Promise.all([
            // Total leads
            db_1.prisma.lead.count({ where: { createdById: userId } }),
            // Converted leads
            db_1.prisma.lead.count({ where: { createdById: userId, status: 'CONVERTED' } }),
            // Active campaigns
            db_1.prisma.campaign.count({ where: { createdById: userId, status: 'ACTIVE' } }),
            // Total campaigns
            db_1.prisma.campaign.count({ where: { createdById: userId } }),
            // Status distribution
            db_1.prisma.lead.groupBy({
                by: ['status'],
                where: { createdById: userId },
                _count: { status: true },
            }),
            // Leads for scoring classification count
            db_1.prisma.lead.findMany({
                where: { createdById: userId },
                select: { score: true },
            }),
            // Recent leads (5)
            db_1.prisma.lead.findMany({
                where: { createdById: userId },
                take: 5,
                orderBy: { createdAt: 'desc' },
            }),
            // Top scoring leads (5)
            db_1.prisma.lead.findMany({
                where: { createdById: userId },
                take: 5,
                orderBy: { score: 'desc' },
            }),
            // Recent campaigns (4)
            db_1.prisma.campaign.findMany({
                where: { createdById: userId },
                take: 4,
                orderBy: { createdAt: 'desc' },
                include: {
                    _count: {
                        select: { campaignLeads: true },
                    },
                },
            }),
        ]);
        // Calculate Hot / Warm / Cold counts based on score
        let hotLeads = 0;
        let warmLeads = 0;
        let coldLeads = 0;
        leadsForScoring.forEach((lead) => {
            if (lead.score >= 80) {
                hotLeads++;
            }
            else if (lead.score >= 60) {
                warmLeads++;
            }
            else {
                coldLeads++;
            }
        });
        // Structure status distribution
        const statusMap = {
            NEW: 0,
            CONTACTED: 0,
            QUALIFIED: 0,
            CONVERTED: 0,
            LOST: 0,
        };
        statusCounts.forEach((item) => {
            statusMap[item.status] = item._count.status;
        });
        const recentLeads = recentLeadsRaw.map((l) => ({
            ...l,
            classification: leadScoringService_1.LeadScoringService.getClassification(l.score),
        }));
        const topScoringLeads = topScoringLeadsRaw.map((l) => ({
            ...l,
            classification: leadScoringService_1.LeadScoringService.getClassification(l.score),
        }));
        const recentCampaigns = recentCampaignsRaw.map((c) => ({
            id: c.id,
            name: c.name,
            status: c.status,
            createdAt: c.createdAt,
            leadCount: c._count.campaignLeads,
        }));
        const conversionRate = totalLeads > 0 ? Math.round((convertedLeads / totalLeads) * 100) : 0;
        return {
            totalLeads,
            hotLeads,
            warmLeads,
            coldLeads,
            convertedLeads,
            activeCampaigns,
            totalCampaigns,
            conversionRate,
            statusDistribution: statusMap,
            recentLeads,
            topScoringLeads,
            recentCampaigns,
        };
    }
}
exports.DashboardService = DashboardService;
