import { prisma } from '../config/db';
import { LeadScoringService } from './leadScoringService';

export interface CreateLeadDTO {
  firstName: string;
  lastName: string;
  email: string;
  company: string;
  jobTitle: string;
  phone?: string | null;
  website?: string | null;
  industry: string;
  status?: string;
  source?: string | null;
  notes?: string | null;
}

export interface UpdateLeadDTO extends Partial<CreateLeadDTO> {}

export interface LeadFilterQuery {
  search?: string;
  status?: string;
  industry?: string;
  sortBy?: 'score' | 'createdAt' | 'name' | 'company';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export class LeadService {
  public static async getLeads(userId: string, filters: LeadFilterQuery) {
    const page = Math.max(1, Number(filters.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(filters.limit) || 20));
    const skip = (page - 1) * limit;

    const where: any = {
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

    let orderBy: any = { createdAt: 'desc' };
    if (filters.sortBy === 'score') {
      orderBy = { score: filters.sortOrder || 'desc' };
    } else if (filters.sortBy === 'name') {
      orderBy = { lastName: filters.sortOrder || 'asc' };
    } else if (filters.sortBy === 'company') {
      orderBy = { company: filters.sortOrder || 'asc' };
    } else if (filters.sortBy === 'createdAt') {
      orderBy = { createdAt: filters.sortOrder || 'desc' };
    }

    const [total, leads] = await Promise.all([
      prisma.lead.count({ where }),
      prisma.lead.findMany({
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
      const scoringResult = LeadScoringService.calculate(lead);
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

  public static async getLeadById(id: string, userId: string) {
    const lead = await prisma.lead.findFirst({
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

    const scoringResult = LeadScoringService.calculate(lead);

    return {
      ...lead,
      classification: scoringResult.classification,
      scoreBreakdown: scoringResult.breakdown,
      campaigns: lead.campaignLeads.map((cl) => cl.campaign),
    };
  }

  public static async createLead(userId: string, dto: CreateLeadDTO) {
    const scoringResult = LeadScoringService.calculate(dto);

    const lead = await prisma.lead.create({
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

  public static async updateLead(id: string, userId: string, dto: UpdateLeadDTO) {
    const existing = await prisma.lead.findFirst({
      where: { id, createdById: userId },
    });

    if (!existing) {
      throw new Error('Lead not found.');
    }

    const merged = {
      ...existing,
      ...dto,
    };

    const scoringResult = LeadScoringService.calculate(merged);

    const updated = await prisma.lead.update({
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

  public static async deleteLead(id: string, userId: string) {
    const existing = await prisma.lead.findFirst({
      where: { id, createdById: userId },
    });

    if (!existing) {
      throw new Error('Lead not found.');
    }

    await prisma.lead.delete({
      where: { id },
    });

    return { id };
  }

  public static async getDistinctIndustries(userId: string) {
    const leads = await prisma.lead.findMany({
      where: { createdById: userId },
      select: { industry: true },
      distinct: ['industry'],
      orderBy: { industry: 'asc' },
    });

    return leads.map((l) => l.industry);
  }
}
