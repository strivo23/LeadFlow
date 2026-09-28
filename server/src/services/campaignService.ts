import { prisma } from '../config/db';

export interface CreateCampaignDTO {
  name: string;
  description?: string | null;
  status?: string;
  leadIds?: string[];
}

export interface UpdateCampaignDTO {
  name?: string;
  description?: string | null;
  status?: string;
}

export class CampaignService {
  public static async getCampaigns(userId: string) {
    const campaigns = await prisma.campaign.findMany({
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

  public static async getCampaignById(id: string, userId: string) {
    const campaign = await prisma.campaign.findFirst({
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

  public static async createCampaign(userId: string, dto: CreateCampaignDTO) {
    const campaign = await prisma.campaign.create({
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

  public static async updateCampaign(id: string, userId: string, dto: UpdateCampaignDTO) {
    const existing = await prisma.campaign.findFirst({
      where: { id, createdById: userId },
    });

    if (!existing) {
      throw new Error('Campaign not found.');
    }

    const updated = await prisma.campaign.update({
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

  public static async launchCampaign(id: string, userId: string) {
    const existing = await prisma.campaign.findFirst({
      where: { id, createdById: userId },
    });

    if (!existing) {
      throw new Error('Campaign not found.');
    }

    const updated = await prisma.campaign.update({
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

  public static async addLeadToCampaign(campaignId: string, leadId: string, userId: string) {
    const [campaign, lead] = await Promise.all([
      prisma.campaign.findFirst({ where: { id: campaignId, createdById: userId } }),
      prisma.lead.findFirst({ where: { id: leadId, createdById: userId } }),
    ]);

    if (!campaign) throw new Error('Campaign not found.');
    if (!lead) throw new Error('Lead not found.');

    const existing = await prisma.campaignLead.findUnique({
      where: {
        campaignId_leadId: { campaignId, leadId },
      },
    });

    if (existing) {
      return existing;
    }

    return prisma.campaignLead.create({
      data: {
        campaignId,
        leadId,
      },
    });
  }

  public static async removeLeadFromCampaign(campaignId: string, leadId: string, userId: string) {
    const campaign = await prisma.campaign.findFirst({
      where: { id: campaignId, createdById: userId },
    });

    if (!campaign) throw new Error('Campaign not found.');

    await prisma.campaignLead.deleteMany({
      where: {
        campaignId,
        leadId,
      },
    });

    return { campaignId, leadId };
  }

  public static async deleteCampaign(id: string, userId: string) {
    const existing = await prisma.campaign.findFirst({
      where: { id, createdById: userId },
    });

    if (!existing) {
      throw new Error('Campaign not found.');
    }

    await prisma.campaign.delete({
      where: { id },
    });

    return { id };
  }
}
