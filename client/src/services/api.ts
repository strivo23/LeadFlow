import axios, { AxiosError } from 'axios';
import { ApiResponse, DashboardStats, Lead, Campaign, User } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: attach token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('leadflow_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: handle 401
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<any>) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('leadflow_token');
      localStorage.removeItem('leadflow_user');
      // If not already on login or register, redirect
      if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/register')) {
        window.location.href = '/login?expired=true';
      }
    }
    return Promise.reject(error);
  }
);

// Auth Service
export const authService = {
  login: async (credentials: { email: string; password: string }) => {
    const res = await apiClient.post<ApiResponse<{ user: User; token: string }>>('/auth/login', credentials);
    return res.data;
  },
  register: async (data: { name: string; email: string; password: string }) => {
    const res = await apiClient.post<ApiResponse<{ user: User; token: string }>>('/auth/register', data);
    return res.data;
  },
  getMe: async () => {
    const res = await apiClient.get<ApiResponse<User>>('/auth/me');
    return res.data;
  },
};

// Leads Service
export const leadService = {
  getLeads: async (params?: {
    search?: string;
    status?: string;
    industry?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    page?: number;
    limit?: number;
  }) => {
    const res = await apiClient.get<ApiResponse<Lead[]>>('/leads', { params });
    return res.data;
  },
  getLeadById: async (id: string) => {
    const res = await apiClient.get<ApiResponse<Lead>>(`/leads/${id}`);
    return res.data;
  },
  createLead: async (data: Partial<Lead>) => {
    const res = await apiClient.post<ApiResponse<Lead>>('/leads', data);
    return res.data;
  },
  updateLead: async (id: string, data: Partial<Lead>) => {
    const res = await apiClient.put<ApiResponse<Lead>>(`/leads/${id}`, data);
    return res.data;
  },
  deleteLead: async (id: string) => {
    const res = await apiClient.delete<ApiResponse<{ id: string }>>(`/leads/${id}`);
    return res.data;
  },
  getIndustries: async () => {
    const res = await apiClient.get<ApiResponse<string[]>>('/leads/industries');
    return res.data;
  },
};

// Campaigns Service
export const campaignService = {
  getCampaigns: async () => {
    const res = await apiClient.get<ApiResponse<Campaign[]>>('/campaigns');
    return res.data;
  },
  getCampaignById: async (id: string) => {
    const res = await apiClient.get<ApiResponse<Campaign>>(`/campaigns/${id}`);
    return res.data;
  },
  createCampaign: async (data: { name: string; description?: string; status?: string; leadIds?: string[] }) => {
    const res = await apiClient.post<ApiResponse<Campaign>>('/campaigns', data);
    return res.data;
  },
  updateCampaign: async (id: string, data: { name?: string; description?: string; status?: string }) => {
    const res = await apiClient.put<ApiResponse<Campaign>>(`/campaigns/${id}`, data);
    return res.data;
  },
  launchCampaign: async (id: string) => {
    const res = await apiClient.post<ApiResponse<Campaign>>(`/campaigns/${id}/launch`);
    return res.data;
  },
  addLead: async (campaignId: string, leadId: string) => {
    const res = await apiClient.post<ApiResponse<any>>(`/campaigns/${campaignId}/leads`, { leadId });
    return res.data;
  },
  removeLead: async (campaignId: string, leadId: string) => {
    const res = await apiClient.delete<ApiResponse<any>>(`/campaigns/${campaignId}/leads/${leadId}`);
    return res.data;
  },
  deleteCampaign: async (id: string) => {
    const res = await apiClient.delete<ApiResponse<{ id: string }>>(`/campaigns/${id}`);
    return res.data;
  },
};

// Dashboard Service
export const dashboardService = {
  getStats: async () => {
    const res = await apiClient.get<ApiResponse<DashboardStats>>('/dashboard/stats');
    return res.data;
  },
};
