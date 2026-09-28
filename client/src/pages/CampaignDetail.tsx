import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Navbar } from '../components/common/Navbar';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { Badge } from '../components/common/Badge';
import { ScoreBadge } from '../components/common/ScoreBadge';
import { Modal } from '../components/common/Modal';
import { campaignService, leadService } from '../services/api';
import { Campaign, Lead } from '../types';
import { useToast } from '../hooks/useToast';
import {
  ArrowLeft,
  Users,
  Send,
  Plus,
  Rocket,
  Trash2,
  Calendar,
  Building2,
  Mail,
  UserPlus,
} from 'lucide-react';

export const CampaignDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { success, error } = useToast();

  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddLeadModalOpen, setIsAddLeadModalOpen] = useState(false);
  const [allLeads, setAllLeads] = useState<Lead[]>([]);
  const [selectedLeadId, setSelectedLeadId] = useState('');
  const [isSubmittingLead, setIsSubmittingLead] = useState(false);
  const [isLaunching, setIsLaunching] = useState(false);

  const fetchCampaign = async () => {
    if (!id) return;
    setIsLoading(true);
    try {
      const res = await campaignService.getCampaignById(id);
      if (res.success && res.data) {
        setCampaign(res.data);
      }
    } catch (err: any) {
      error('Campaign not found', err.response?.data?.message || err.message);
      navigate('/campaigns');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaign();
  }, [id]);

  const openAddLeadModal = async () => {
    try {
      const res = await leadService.getLeads({ limit: 100 });
      if (res.success && res.data) {
        // Filter out leads already in this campaign
        const existingIds = new Set(campaign?.leads?.map((l: Lead) => l.id) || []);
        const unassigned = res.data.filter((l: Lead) => !existingIds.has(l.id));
        setAllLeads(unassigned);
        if (unassigned.length > 0) {
          setSelectedLeadId(unassigned[0].id);
        }
        setIsAddLeadModalOpen(true);
      }
    } catch (err: any) {
      error('Error fetching leads', err.message);
    }
  };

  const handleAddLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!campaign || !selectedLeadId) return;
    setIsSubmittingLead(true);
    try {
      await campaignService.addLead(campaign.id, selectedLeadId);
      success('Lead Added', 'Lead enrolled into campaign.');
      setIsAddLeadModalOpen(false);
      fetchCampaign();
    } catch (err: any) {
      error('Failed to add lead', err.response?.data?.message || err.message);
    } finally {
      setIsSubmittingLead(false);
    }
  };

  const handleRemoveLead = async (leadId: string, leadName: string) => {
    if (!campaign) return;
    try {
      await campaignService.removeLead(campaign.id, leadId);
      success('Lead Removed', `${leadName} removed from campaign.`);
      fetchCampaign();
    } catch (err: any) {
      error('Failed to remove lead', err.response?.data?.message || err.message);
    }
  };

  const handleLaunch = async () => {
    if (!campaign) return;
    setIsLaunching(true);
    try {
      const res = await campaignService.launchCampaign(campaign.id);
      if (res.success && res.data) {
        success('Campaign Launched! 🚀', `"${campaign.name}" is now ACTIVE.`);
        fetchCampaign();
      }
    } catch (err: any) {
      error('Launch failed', err.response?.data?.message || err.message);
    } finally {
      setIsLaunching(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col pb-16">
      <Navbar
        title="Outreach Sequence Dossier"
        subtitle={campaign ? campaign.name : 'Campaign'}
        actionButton={
          <div className="flex items-center gap-3">
            <Link
              to="/campaigns"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-700 bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>All Sequences</span>
            </Link>
            {campaign && campaign.status !== 'ACTIVE' && (
              <button
                onClick={handleLaunch}
                disabled={isLaunching}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-all shadow-md shadow-emerald-600/30"
              >
                <Rocket className="w-3.5 h-3.5" />
                <span>{isLaunching ? 'Launching...' : 'Launch Sequence'}</span>
              </button>
            )}
          </div>
        }
      />

      {isLoading ? (
        <LoadingSpinner label="Loading campaign roster..." fullHeight />
      ) : !campaign ? (
        <div className="p-8 text-center text-slate-400">Campaign not found.</div>
      ) : (
        <div className="p-8 max-w-6xl mx-auto w-full space-y-6 animate-in fade-in duration-300">
          {/* Header Card */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-800">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl font-bold text-white tracking-tight">{campaign.name}</h2>
                  <Badge status={campaign.status} />
                </div>
                <p className="text-sm text-slate-300 mt-2 leading-relaxed max-w-3xl">
                  {campaign.description || 'No description provided.'}
                </p>
                <div className="flex items-center gap-4 mt-3 text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-500" />
                    Created {new Date(campaign.createdAt).toLocaleDateString()}
                  </span>
                  <span className="flex items-center gap-1 font-semibold text-indigo-400">
                    <Users className="w-3.5 h-3.5" />
                    {campaign.leadCount} Enrolled Leads
                  </span>
                </div>
              </div>

              <div>
                <button
                  onClick={openAddLeadModal}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold transition-all shadow-md shadow-indigo-600/30 hover:scale-[1.02]"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Enroll Lead to Sequence</span>
                </button>
              </div>
            </div>
          </div>

          {/* Enrolled Leads Roster */}
          <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
            <div className="px-6 py-4 border-b border-slate-800/80 bg-slate-900/50 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Enrolled Target Leads
                </h3>
                <p className="text-xs text-slate-400">
                  Accounts actively targeted by this sequence
                </p>
              </div>
            </div>

            {campaign.leads && campaign.leads.length > 0 ? (
              <div className="divide-y divide-slate-800/60">
                {campaign.leads.map((lead: Lead) => (
                  <div
                    key={lead.id}
                    className="p-4 px-6 flex items-center justify-between hover:bg-slate-800/40 transition-colors"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2.5">
                        <Link
                          to={`/leads/${lead.id}`}
                          className="font-semibold text-white hover:text-indigo-400 transition-colors text-sm"
                        >
                          {lead.firstName} {lead.lastName}
                        </Link>
                        <Badge status={lead.status} />
                        <ScoreBadge score={lead.score} size="sm" />
                      </div>
                      <p className="text-xs text-slate-400 mt-1 flex items-center gap-3">
                        <span className="flex items-center gap-1">
                          <Building2 className="w-3.5 h-3.5 text-slate-500" />
                          {lead.company} · {lead.jobTitle}
                        </span>
                        <span className="flex items-center gap-1">
                          <Mail className="w-3.5 h-3.5 text-slate-500" />
                          {lead.email}
                        </span>
                      </p>
                    </div>

                    <button
                      onClick={() => handleRemoveLead(lead.id, `${lead.firstName} ${lead.lastName}`)}
                      title="Remove from campaign"
                      className="text-slate-400 hover:text-rose-400 p-2 rounded-lg hover:bg-rose-500/10 transition-colors ml-4"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-12 text-center text-slate-400">
                <Users className="w-8 h-8 mx-auto text-slate-600 mb-2" />
                <p className="text-sm font-semibold text-slate-300">No leads enrolled yet</p>
                <p className="text-xs text-slate-400 mt-1">
                  Click "Enroll Lead to Sequence" to attach targeted prospects.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Add Lead to Campaign Modal */}
      <Modal
        isOpen={isAddLeadModalOpen}
        onClose={() => setIsAddLeadModalOpen(false)}
        title="Enroll Lead to Campaign"
        description="Select a prospect to include in this outbound sequence."
        maxWidth="md"
      >
        <form onSubmit={handleAddLeadSubmit} className="space-y-4">
          {allLeads.length > 0 ? (
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Choose Prospect
              </label>
              <select
                value={selectedLeadId}
                onChange={(e) => setSelectedLeadId(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-indigo-500"
              >
                {allLeads.map((l) => (
                  <option key={l.id} value={l.id} className="bg-slate-900">
                    {l.firstName} {l.lastName} — {l.company} ({l.jobTitle}) · Score: {l.score}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <p className="text-xs text-slate-400">
              All existing leads in your CRM are already enrolled in this sequence!
            </p>
          )}

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setIsAddLeadModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmittingLead || allLeads.length === 0}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl text-xs font-semibold transition-all shadow-md shadow-indigo-600/30"
            >
              {isSubmittingLead ? 'Enrolling...' : 'Enroll Prospect'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
