export type LeadStatus = 'NEW' | 'CONTACTED' | 'QUALIFIED' | 'CONVERTED' | 'LOST';
export type CampaignStatus = 'DRAFT' | 'ACTIVE' | 'PAUSED' | 'COMPLETED';
export type LeadClassification = 'Hot' | 'Warm' | 'Cold';

export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  _count?: {
    leads: number;
    campaigns: number;
  };
}

export interface ScoreFactor {
  factor: string;
  points: number;
  maxPoints: number;
  reason: string;
}

export interface CampaignSummary {
  id: string;
  name: string;
  status: CampaignStatus;
  createdAt?: string;
}

export interface Lead {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  company: string;
  jobTitle: string;
  phone?: string | null;
  website?: string | null;
  industry: string;
  status: LeadStatus;
  source?: string | null;
  score: number;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
  createdById: string;
  classification?: LeadClassification;
  scoreBreakdown?: ScoreFactor[];
  campaigns?: CampaignSummary[];
}

export interface Campaign {
  id: string;
  name: string;
  description?: string | null;
  status: CampaignStatus;
  createdAt: string;
  updatedAt: string;
  createdById: string;
  leadCount: number;
  leads?: Lead[];
}

export interface DashboardStats {
  totalLeads: number;
  hotLeads: number;
  warmLeads: number;
  coldLeads: number;
  convertedLeads: number;
  activeCampaigns: number;
  totalCampaigns: number;
  conversionRate: number;
  statusDistribution: Record<LeadStatus, number>;
  recentLeads: Lead[];
  topScoringLeads: Lead[];
  recentCampaigns: {
    id: string;
    name: string;
    status: CampaignStatus;
    createdAt: string;
    leadCount: number;
  }[];
}

export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
  meta?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
