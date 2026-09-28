import { prisma } from '../config/db';
import { LeadScoringService } from './leadScoringService';

export class DashboardService {
  public static async getStats(userId: string) {
    const [
      totalLeads,
      convertedLeads,
      activeCampaigns,
      totalCampaigns,
      statusCounts,
      leadsForScoring,
      recentLeadsRaw,
      topScoringLeadsRaw,
      recentCampaignsRaw,
    ] = await Promise.all([
      // Total leads
      prisma.lead.count({ where: { createdById: userId } }),

      // Converted leads
      prisma.lead.count({ where: { createdById: userId, status: 'CONVERTED' } }),

      // Active campaigns
      prisma.campaign.count({ where: { createdById: userId, status: 'ACTIVE' } }),

      // Total campaigns
      prisma.campaign.count({ where: { createdById: userId } }),

      // Status distribution
      prisma.lead.groupBy({
        by: ['status'],
        where: { createdById: userId },
        _count: { status: true },
      }),

      // Leads for scoring classification count
      prisma.lead.findMany({
        where: { createdById: userId },
        select: { score: true },
      }),

      // Recent leads (5)
      prisma.lead.findMany({
        where: { createdById: userId },
        take: 5,
        orderBy: { createdAt: 'desc' },
      }),

      // Top scoring leads (5)
      prisma.lead.findMany({
        where: { createdById: userId },
        take: 5,
        orderBy: { score: 'desc' },
      }),

      // Recent campaigns (4)
      prisma.campaign.findMany({
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
      } else if (lead.score >= 60) {
        warmLeads++;
      } else {
        coldLeads++;
      }
    });

    // Structure status distribution
    const statusMap: Record<string, number> = {
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
      classification: LeadScoringService.getClassification(l.score),
    }));

    const topScoringLeads = topScoringLeadsRaw.map((l) => ({
      ...l,
      classification: LeadScoringService.getClassification(l.score),
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
