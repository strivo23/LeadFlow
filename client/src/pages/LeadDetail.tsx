import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Navbar } from '../components/common/Navbar';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { Badge } from '../components/common/Badge';
import { ScoreBadge } from '../components/common/ScoreBadge';
import { LeadFormModal } from '../components/leads/LeadFormModal';
import { leadService } from '../services/api';
import { Lead, LeadStatus, ScoreFactor, CampaignSummary } from '../types';
import { useToast } from '../hooks/useToast';
import {
  ArrowLeft,
  Building2,
  Mail,
  Phone,
  Globe,
  Briefcase,
  Sparkles,
  CheckCircle2,
  Calendar,
  Send,
  Edit2,
  Tag,
  FileText,
} from 'lucide-react';

export const LeadDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { success, error } = useToast();

  const [lead, setLead] = useState<Lead | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  const fetchLead = async () => {
    if (!id) return;
    setIsLoading(true);
    try {
      const res = await leadService.getLeadById(id);
      if (res.success && res.data) {
        setLead(res.data);
      }
    } catch (err: any) {
      error('Error', err.response?.data?.message || 'Lead not found');
      navigate('/leads');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLead();
  }, [id]);

  const handleStatusChange = async (newStatus: LeadStatus) => {
    if (!lead || !id) return;
    setIsUpdatingStatus(true);
    try {
      const res = await leadService.updateLead(id, { status: newStatus });
      if (res.success && res.data) {
        setLead(res.data);
        success('Status Updated', `Lead status updated to ${newStatus}`);
      }
    } catch (err: any) {
      error('Failed to update status', err.response?.data?.message || err.message);
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col pb-16">
      <Navbar
        title="Lead Intelligence Dossier"
        subtitle={lead ? `${lead.firstName} ${lead.lastName} · ${lead.company}` : 'Lead Details'}
        actionButton={
          <div className="flex items-center gap-3">
            <Link
              to="/leads"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-700 bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Directory</span>
            </Link>
            {lead && (
              <button
                onClick={() => setIsEditModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-all shadow-md shadow-indigo-600/30"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Edit Profile</span>
              </button>
            )}
          </div>
        }
      />

      {isLoading ? (
        <LoadingSpinner label="Compiling lead intelligence..." fullHeight />
      ) : !lead ? (
        <div className="p-8 text-center text-slate-400">Lead record could not be loaded.</div>
      ) : (
        <div className="p-8 max-w-6xl mx-auto w-full space-y-6 animate-in fade-in duration-300">
          {/* Main Profile Header Card */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-indigo-600/30 shrink-0">
                {lead.firstName.charAt(0)}
                {lead.lastName.charAt(0)}
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2.5">
                  <h2 className="text-2xl font-bold text-white tracking-tight">
                    {lead.firstName} {lead.lastName}
                  </h2>
                  <Badge status={lead.status} />
                  <ScoreBadge score={lead.score} classification={lead.classification} size="lg" />
                </div>
                <p className="text-sm text-slate-300 font-medium mt-1">
                  {lead.jobTitle} at <span className="text-white font-semibold">{lead.company}</span>
                </p>
                <div className="flex flex-wrap items-center gap-4 mt-2 text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <Briefcase className="w-3.5 h-3.5 text-slate-500" />
                    {lead.industry}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-500" />
                    Added {new Date(lead.createdAt).toLocaleDateString()}
                  </span>
                  <span className="flex items-center gap-1">
                    <Tag className="w-3.5 h-3.5 text-slate-500" />
                    Source: {lead.source || 'Direct Website'}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Status Stage Selector */}
            <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800/80 w-full md:w-auto">
              <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                Pipeline Deal Stage
              </label>
              <select
                value={lead.status}
                disabled={isUpdatingStatus}
                onChange={(e) => handleStatusChange(e.target.value as LeadStatus)}
                className="w-full px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-xs font-semibold text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
              >
                <option value="NEW">NEW (Uncontacted)</option>
                <option value="CONTACTED">CONTACTED (Initial Touch)</option>
                <option value="QUALIFIED">QUALIFIED (Sales Accepted)</option>
                <option value="CONVERTED">CONVERTED (Won Deal)</option>
                <option value="LOST">LOST (Disqualified)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Contact Details & Metadata */}
            <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-5">
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider border-b border-slate-800 pb-3">
                Direct Contact Channels
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="text-[11px] text-slate-400 uppercase tracking-wider block mb-1">
                    Email Address
                  </label>
                  <a
                    href={`mailto:${lead.email}`}
                    className="text-sm font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-2"
                  >
                    <Mail className="w-4 h-4 text-slate-500" />
                    {lead.email}
                  </a>
                </div>

                <div>
                  <label className="text-[11px] text-slate-400 uppercase tracking-wider block mb-1">
                    Phone Number
                  </label>
                  {lead.phone ? (
                    <a
                      href={`tel:${lead.phone}`}
                      className="text-sm font-medium text-slate-200 hover:text-white flex items-center gap-2"
                    >
                      <Phone className="w-4 h-4 text-slate-500" />
                      {lead.phone}
                    </a>
                  ) : (
                    <span className="text-xs text-slate-500 italic">Not provided</span>
                  )}
                </div>

                <div>
                  <label className="text-[11px] text-slate-400 uppercase tracking-wider block mb-1">
                    Corporate Domain / Website
                  </label>
                  {lead.website ? (
                    <a
                      href={lead.website.startsWith('http') ? lead.website : `https://${lead.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-medium text-indigo-400 hover:text-indigo-300 flex items-center gap-2 truncate"
                    >
                      <Globe className="w-4 h-4 text-slate-500 shrink-0" />
                      {lead.website}
                    </a>
                  ) : (
                    <span className="text-xs text-slate-500 italic">Not provided</span>
                  )}
                </div>

                <div>
                  <label className="text-[11px] text-slate-400 uppercase tracking-wider block mb-1">
                    Company
                  </label>
                  <div className="text-sm font-medium text-slate-200 flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-slate-500" />
                    {lead.company}
                  </div>
                </div>
              </div>

              {/* Notes Section */}
              <div className="pt-4 border-t border-slate-800">
                <label className="text-[11px] text-slate-400 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                  <FileText className="w-3.5 h-3.5 text-slate-500" />
                  Contextual Qualification Notes
                </label>
                <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 text-xs text-slate-300 leading-relaxed min-h-[70px]">
                  {lead.notes || <span className="text-slate-500 italic">No notes recorded yet.</span>}
                </div>
              </div>
            </div>

            {/* AI Score Breakdown & Associated Campaigns */}
            <div className="lg:col-span-2 space-y-6">
              {/* Score Factor Breakdown Card */}
              <div className="glass-panel p-6 rounded-2xl border border-slate-800">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-white tracking-tight">
                        AI Lead Qualification Breakdown
                      </h3>
                      <p className="text-xs text-slate-400">
                        Total Confidence Score: <strong className="text-white font-mono">{lead.score}/100</strong> ({lead.classification})
                      </p>
                    </div>
                  </div>
                </div>

                {/* Factors List */}
                <div className="space-y-2.5">
                  {lead.scoreBreakdown?.map((factor: ScoreFactor, idx: number) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-center justify-between gap-4"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-slate-200">
                            {factor.factor}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            (max +{factor.maxPoints} pts)
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">{factor.reason}</p>
                      </div>

                      <div className="shrink-0 text-right">
                        <span
                          className={`font-mono text-sm font-bold ${
                            factor.points > 0 ? 'text-emerald-400' : 'text-slate-500'
                          }`}
                        >
                          +{factor.points}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Outreach Campaigns Card */}
              <div className="glass-panel p-6 rounded-2xl border border-slate-800">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-base font-semibold text-white tracking-tight flex items-center gap-2">
                      <Send className="w-4 h-4 text-indigo-400" />
                      Associated Outreach Campaigns
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">Active sequences engaging this lead</p>
                  </div>
                  <Link
                    to="/campaigns"
                    className="text-xs font-semibold text-indigo-400 hover:text-indigo-300"
                  >
                    Manage Campaigns
                  </Link>
                </div>

                {lead.campaigns && lead.campaigns.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {lead.campaigns.map((camp: CampaignSummary) => (
                      <Link
                        key={camp.id}
                        to={`/campaigns/${camp.id}`}
                        className="p-3 rounded-xl bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800/80 transition-all flex items-center justify-between group"
                      >
                        <span className="text-xs font-semibold text-white group-hover:text-indigo-300 transition-colors truncate">
                          {camp.name}
                        </span>
                        <Badge status={camp.status} />
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="p-6 text-center rounded-xl bg-slate-900/40 border border-dashed border-slate-800 text-xs text-slate-400">
                    Not currently enrolled in any campaigns. You can add this lead from the Campaigns page.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      <LeadFormModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSuccess={(updated) => setLead(updated)}
        initialLead={lead}
      />
    </div>
  );
};
