import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '../components/common/Navbar';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { ScoreBadge } from '../components/common/ScoreBadge';
import { Badge } from '../components/common/Badge';
import { LeadFormModal } from '../components/leads/LeadFormModal';
import { CampaignFormModal } from '../components/campaigns/CampaignFormModal';
import { dashboardService } from '../services/api';
import { DashboardStats, Lead, Campaign } from '../types';
import {
  Users,
  Flame,
  SunMedium,
  Snowflake,
  Send,
  CheckCircle2,
  TrendingUp,
  Plus,
  ArrowRight,
  Sparkles,
  BarChart2,
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
  const [isCampaignModalOpen, setIsCampaignModalOpen] = useState(false);

  const loadDashboardData = async () => {
    try {
      const res = await dashboardService.getStats();
      if (res.success && res.data) {
        setStats(res.data);
      }
    } catch (err) {
      console.error('Failed to load dashboard stats:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const handleLeadSaved = (lead: Lead) => {
    loadDashboardData();
  };

  const handleCampaignSaved = (campaign: Campaign) => {
    loadDashboardData();
  };

  return (
    <div className="flex-1 flex flex-col pb-16">
      <Navbar
        title="Intelligence Dashboard"
        subtitle="Real-time pipeline metrics and AI lead scoring insights"
        actionButton={
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setIsCampaignModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold transition-all hover:scale-[1.02]"
            >
              <Send className="w-3.5 h-3.5" />
              <span>New Campaign</span>
            </button>
            <button
              onClick={() => setIsLeadModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold transition-all shadow-md shadow-indigo-600/30 hover:scale-[1.02]"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Lead</span>
            </button>
          </div>
        }
      />

      {isLoading ? (
        <LoadingSpinner label="Crunching pipeline statistics..." fullHeight />
      ) : !stats ? (
        <div className="p-8 text-center text-slate-400">Unable to retrieve statistics.</div>
      ) : (
        <div className="p-8 max-w-7xl mx-auto w-full space-y-8 animate-in fade-in duration-300">
          {/* Top 6 KPI Metric Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {/* Total Leads */}
            <div className="glass-card p-4 rounded-2xl border border-slate-800 flex flex-col justify-between">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-medium uppercase tracking-wider">Total Leads</span>
                <Users className="w-4 h-4 text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white tracking-tight">{stats.totalLeads}</p>
                <p className="text-[11px] text-slate-400 mt-1">In CRM Pipeline</p>
              </div>
            </div>

            {/* Hot Leads */}
            <div className="glass-card p-4 rounded-2xl border border-slate-800/80 bg-rose-950/15 flex flex-col justify-between">
              <div className="flex items-center justify-between text-rose-300 mb-2">
                <span className="text-xs font-medium uppercase tracking-wider">Hot Leads</span>
                <Flame className="w-4 h-4 text-rose-400 fill-rose-500/20" />
              </div>
              <div>
                <p className="text-2xl font-bold text-rose-100 tracking-tight">{stats.hotLeads}</p>
                <p className="text-[11px] text-rose-300/70 mt-1">Score 80–100</p>
              </div>
            </div>

            {/* Warm Leads */}
            <div className="glass-card p-4 rounded-2xl border border-slate-800/80 bg-amber-950/15 flex flex-col justify-between">
              <div className="flex items-center justify-between text-amber-300 mb-2">
                <span className="text-xs font-medium uppercase tracking-wider">Warm Leads</span>
                <SunMedium className="w-4 h-4 text-amber-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-amber-100 tracking-tight">{stats.warmLeads}</p>
                <p className="text-[11px] text-amber-300/70 mt-1">Score 60–79</p>
              </div>
            </div>

            {/* Cold Leads */}
            <div className="glass-card p-4 rounded-2xl border border-slate-800/80 bg-sky-950/15 flex flex-col justify-between">
              <div className="flex items-center justify-between text-sky-300 mb-2">
                <span className="text-xs font-medium uppercase tracking-wider">Cold Leads</span>
                <Snowflake className="w-4 h-4 text-sky-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-sky-100 tracking-tight">{stats.coldLeads}</p>
                <p className="text-[11px] text-sky-300/70 mt-1">Score 0–59</p>
              </div>
            </div>

            {/* Active Campaigns */}
            <div className="glass-card p-4 rounded-2xl border border-slate-800 flex flex-col justify-between">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-medium uppercase tracking-wider">Active Sequences</span>
                <Send className="w-4 h-4 text-emerald-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white tracking-tight">{stats.activeCampaigns}</p>
                <p className="text-[11px] text-emerald-400 font-medium mt-1">Running Live</p>
              </div>
            </div>

            {/* Converted Leads */}
            <div className="glass-card p-4 rounded-2xl border border-slate-800 flex flex-col justify-between">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-medium uppercase tracking-wider">Converted</span>
                <CheckCircle2 className="w-4 h-4 text-teal-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white tracking-tight">{stats.convertedLeads}</p>
                <p className="text-[11px] text-teal-400 font-medium mt-1">
                  {stats.conversionRate}% Win Rate
                </p>
              </div>
            </div>
          </div>

          {/* Status Distribution & AI Lead Scoring Funnel */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Status Distribution Visual Bar */}
            <div className="lg:col-span-2 glass-panel p-6 rounded-2xl border border-slate-800">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-semibold text-white tracking-tight flex items-center gap-2">
                    <BarChart2 className="w-4 h-4 text-indigo-400" />
                    Pipeline Status Distribution
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Breakdown of {stats.totalLeads} leads across active deal stages
                  </p>
                </div>
                <Link
                  to="/leads"
                  className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                >
                  View All Leads <ArrowRight className="w-3 h-3" />
                </Link>
              </div>

              {/* Progress Distribution Bar */}
              <div className="h-4 w-full bg-slate-900 rounded-full overflow-hidden flex my-5 p-0.5 border border-slate-800">
                {stats.totalLeads > 0 && (
                  <>
                    <div
                      style={{
                        width: `${((stats.statusDistribution.NEW || 0) / stats.totalLeads) * 100}%`,
                      }}
                      className="bg-blue-500 rounded-l transition-all duration-500"
                      title={`New: ${stats.statusDistribution.NEW || 0}`}
                    />
                    <div
                      style={{
                        width: `${((stats.statusDistribution.CONTACTED || 0) / stats.totalLeads) * 100}%`,
                      }}
                      className="bg-purple-500 transition-all duration-500"
                      title={`Contacted: ${stats.statusDistribution.CONTACTED || 0}`}
                    />
                    <div
                      style={{
                        width: `${((stats.statusDistribution.QUALIFIED || 0) / stats.totalLeads) * 100}%`,
                      }}
                      className="bg-emerald-500 transition-all duration-500"
                      title={`Qualified: ${stats.statusDistribution.QUALIFIED || 0}`}
                    />
                    <div
                      style={{
                        width: `${((stats.statusDistribution.CONVERTED || 0) / stats.totalLeads) * 100}%`,
                      }}
                      className="bg-teal-400 transition-all duration-500"
                      title={`Converted: ${stats.statusDistribution.CONVERTED || 0}`}
                    />
                    <div
                      style={{
                        width: `${((stats.statusDistribution.LOST || 0) / stats.totalLeads) * 100}%`,
                      }}
                      className="bg-rose-500 rounded-r transition-all duration-500"
                      title={`Lost: ${stats.statusDistribution.LOST || 0}`}
                    />
                  </>
                )}
              </div>

              {/* Legend with Counts */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
                <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80">
                  <div className="flex items-center gap-1.5 text-xs text-blue-400 font-semibold mb-1">
                    <span className="w-2 h-2 rounded-full bg-blue-500" />
                    NEW
                  </div>
                  <p className="text-lg font-bold text-white">{stats.statusDistribution.NEW || 0}</p>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80">
                  <div className="flex items-center gap-1.5 text-xs text-purple-400 font-semibold mb-1">
                    <span className="w-2 h-2 rounded-full bg-purple-500" />
                    CONTACTED
                  </div>
                  <p className="text-lg font-bold text-white">{stats.statusDistribution.CONTACTED || 0}</p>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80">
                  <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold mb-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    QUALIFIED
                  </div>
                  <p className="text-lg font-bold text-white">{stats.statusDistribution.QUALIFIED || 0}</p>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80">
                  <div className="flex items-center gap-1.5 text-xs text-teal-300 font-semibold mb-1">
                    <span className="w-2 h-2 rounded-full bg-teal-400" />
                    CONVERTED
                  </div>
                  <p className="text-lg font-bold text-white">{stats.statusDistribution.CONVERTED || 0}</p>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80">
                  <div className="flex items-center gap-1.5 text-xs text-rose-400 font-semibold mb-1">
                    <span className="w-2 h-2 rounded-full bg-rose-500" />
                    LOST
                  </div>
                  <p className="text-lg font-bold text-white">{stats.statusDistribution.LOST || 0}</p>
                </div>
              </div>
            </div>

            {/* AI Scoring Engine Card */}
            <div className="glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2 text-indigo-400">
                  <Sparkles className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-wider">Scoring Intelligence</span>
                </div>
                <h3 className="text-base font-semibold text-white tracking-tight">AI Lead Categorization</h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Deterministic algorithm evaluating decision-maker title authority, domain credibility, and industry budget propensity.
                </p>

                <div className="space-y-3 mt-4">
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-rose-950/20 border border-rose-900/30">
                    <div className="flex items-center gap-2">
                      <Flame className="w-4 h-4 text-rose-400 fill-rose-500/20" />
                      <span className="text-xs font-medium text-rose-200">Hot Leads (80–100)</span>
                    </div>
                    <span className="text-sm font-bold text-rose-100">{stats.hotLeads}</span>
                  </div>

                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-amber-950/20 border border-amber-900/30">
                    <div className="flex items-center gap-2">
                      <SunMedium className="w-4 h-4 text-amber-400" />
                      <span className="text-xs font-medium text-amber-200">Warm Leads (60–79)</span>
                    </div>
                    <span className="text-sm font-bold text-amber-100">{stats.warmLeads}</span>
                  </div>

                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-sky-950/20 border border-sky-900/30">
                    <div className="flex items-center gap-2">
                      <Snowflake className="w-4 h-4 text-sky-400" />
                      <span className="text-xs font-medium text-sky-200">Cold Leads (0–59)</span>
                    </div>
                    <span className="text-sm font-bold text-sky-100">{stats.coldLeads}</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800/80 mt-4 text-[11px] text-slate-400">
                Rule-based MVP architecture designed for drop-in LLM / ML embedding replacement.
              </div>
            </div>
          </div>

          {/* Dual Lists: Top Scoring Leads & Recent Campaigns */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Scoring Leads */}
            <div className="glass-panel p-6 rounded-2xl border border-slate-800">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-semibold text-white tracking-tight flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-indigo-400" />
                    Top Scoring Decision Makers
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">Highest conversion propensity leads</p>
                </div>
                <Link
                  to="/leads?sortBy=score&sortOrder=desc"
                  className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                >
                  View Ranked <ArrowRight className="w-3 h-3" />
                </Link>
              </div>

              <div className="space-y-2.5">
                {stats.topScoringLeads.map((lead) => (
                  <Link
                    key={lead.id}
                    to={`/leads/${lead.id}`}
                    className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800/80 transition-all group"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-white group-hover:text-indigo-300 transition-colors truncate">
                          {lead.firstName} {lead.lastName}
                        </span>
                        <Badge status={lead.status} />
                      </div>
                      <p className="text-xs text-slate-400 truncate mt-0.5">
                        {lead.jobTitle} · <span className="text-slate-300">{lead.company}</span>
                      </p>
                    </div>

                    <div className="shrink-0 ml-3">
                      <ScoreBadge score={lead.score} classification={lead.classification} size="sm" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Recent Campaigns */}
            <div className="glass-panel p-6 rounded-2xl border border-slate-800">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-semibold text-white tracking-tight flex items-center gap-2">
                    <Send className="w-4 h-4 text-indigo-400" />
                    Recent Outreach Campaigns
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">Active sequences and targeted cohorts</p>
                </div>
                <Link
                  to="/campaigns"
                  className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                >
                  All Campaigns <ArrowRight className="w-3 h-3" />
                </Link>
              </div>

              <div className="space-y-2.5">
                {stats.recentCampaigns.map((c) => (
                  <Link
                    key={c.id}
                    to={`/campaigns/${c.id}`}
                    className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800/80 transition-all group"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-white group-hover:text-indigo-300 transition-colors truncate">
                          {c.name}
                        </span>
                        <Badge status={c.status} />
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">
                        <Users className="w-3 h-3 inline mr-1 text-slate-500" />
                        {c.leadCount} Associated Leads
                      </p>
                    </div>

                    <div className="shrink-0 ml-3 text-xs font-medium text-slate-400">
                      {new Date(c.createdAt).toLocaleDateString()}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      <LeadFormModal
        isOpen={isLeadModalOpen}
        onClose={() => setIsLeadModalOpen(false)}
        onSuccess={handleLeadSaved}
      />
      <CampaignFormModal
        isOpen={isCampaignModalOpen}
        onClose={() => setIsCampaignModalOpen(false)}
        onSuccess={handleCampaignSaved}
      />
    </div>
  );
};
