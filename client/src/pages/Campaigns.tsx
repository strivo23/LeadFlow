import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '../components/common/Navbar';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { EmptyState } from '../components/common/EmptyState';
import { Badge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';
import { CampaignFormModal } from '../components/campaigns/CampaignFormModal';
import { campaignService } from '../services/api';
import { Campaign } from '../types';
import { useToast } from '../hooks/useToast';
import {
  Send,
  Plus,
  Play,
  Eye,
  Edit2,
  Trash2,
  Users,
  Calendar,
  AlertTriangle,
  Rocket,
} from 'lucide-react';

export const Campaigns: React.FC = () => {
  const { success, error } = useToast();

  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);
  const [deletingCampaign, setDeletingCampaign] = useState<Campaign | null>(null);
  const [launchingId, setLaunchingId] = useState<string | null>(null);

  const fetchCampaigns = async () => {
    setIsLoading(true);
    try {
      const res = await campaignService.getCampaigns();
      if (res.success && res.data) {
        setCampaigns(res.data);
      }
    } catch (err: any) {
      error('Failed to load campaigns', err.response?.data?.message || err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const handleLaunch = async (campaign: Campaign) => {
    setLaunchingId(campaign.id);
    try {
      const res = await campaignService.launchCampaign(campaign.id);
      if (res.success && res.data) {
        success('Campaign Launched! 🚀', `"${campaign.name}" is now ACTIVE.`);
        fetchCampaigns();
      }
    } catch (err: any) {
      error('Launch failed', err.response?.data?.message || err.message);
    } finally {
      setLaunchingId(null);
    }
  };

  const handleDelete = async () => {
    if (!deletingCampaign) return;
    try {
      await campaignService.deleteCampaign(deletingCampaign.id);
      success('Campaign Removed', `"${deletingCampaign.name}" was deleted.`);
      setDeletingCampaign(null);
      fetchCampaigns();
    } catch (err: any) {
      error('Delete failed', err.response?.data?.message || err.message);
    }
  };

  return (
    <div className="flex-1 flex flex-col pb-16">
      <Navbar
        title="Outreach Sequences"
        subtitle={`Coordinating ${campaigns.length} campaigns across enterprise cohorts`}
        actionButton={
          <button
            onClick={() => {
              setEditingCampaign(null);
              setIsFormModalOpen(true);
            }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold transition-all shadow-md shadow-indigo-600/30 hover:scale-[1.02] active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" />
            <span>Create Campaign</span>
          </button>
        }
      />

      <div className="p-8 max-w-7xl mx-auto w-full space-y-6">
        {isLoading ? (
          <LoadingSpinner label="Loading outreach sequences..." fullHeight={false} />
        ) : campaigns.length === 0 ? (
          <EmptyState
            icon={Send}
            title="No campaigns yet"
            description="Create your first targeted outreach campaign and start converting high-scoring leads."
            actionText="Create Campaign"
            onAction={() => {
              setEditingCampaign(null);
              setIsFormModalOpen(true);
            }}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {campaigns.map((camp) => (
              <div
                key={camp.id}
                className="glass-card rounded-2xl border border-slate-800 p-6 flex flex-col justify-between transition-all hover:border-slate-700"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <Badge status={camp.status} />
                    <span className="text-[11px] text-slate-400 flex items-center gap-1 font-mono">
                      <Calendar className="w-3 h-3" />
                      {new Date(camp.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <Link to={`/campaigns/${camp.id}`} className="block group">
                    <h3 className="text-base font-bold text-white group-hover:text-indigo-400 transition-colors line-clamp-1">
                      {camp.name}
                    </h3>
                  </Link>

                  <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed min-h-[36px]">
                    {camp.description || 'No description provided for this sequence.'}
                  </p>

                  <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-300">
                    <span className="flex items-center gap-1.5 font-medium">
                      <Users className="w-4 h-4 text-indigo-400" />
                      {camp.leadCount} Target Leads
                    </span>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1">
                    <Link
                      to={`/campaigns/${camp.id}`}
                      title="View Details"
                      className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => {
                        setEditingCampaign(camp);
                        setIsFormModalOpen(true);
                      }}
                      title="Edit Campaign"
                      className="p-2 rounded-lg text-slate-400 hover:text-indigo-400 hover:bg-slate-800 transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeletingCampaign(camp)}
                      title="Delete Campaign"
                      className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {camp.status !== 'ACTIVE' ? (
                    <button
                      onClick={() => handleLaunch(camp)}
                      disabled={launchingId === camp.id}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 rounded-xl text-xs font-semibold transition-all hover:scale-[1.02]"
                    >
                      <Rocket className="w-3.5 h-3.5" />
                      <span>{launchingId === camp.id ? 'Launching...' : 'Launch Sequence'}</span>
                    </button>
                  ) : (
                    <span className="text-[11px] font-semibold text-emerald-400 flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                      Sequence Live
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      <CampaignFormModal
        isOpen={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false);
          setEditingCampaign(null);
        }}
        onSuccess={() => fetchCampaigns()}
        initialCampaign={editingCampaign}
      />

      {/* Delete Confirmation */}
      <Modal
        isOpen={!!deletingCampaign}
        onClose={() => setDeletingCampaign(null)}
        title="Delete Campaign"
        maxWidth="sm"
      >
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-rose-950/30 border border-rose-800/40 text-rose-300 text-xs">
            <AlertTriangle className="w-5 h-5 shrink-0 text-rose-400" />
            <p>
              Are you sure you want to delete <strong>{deletingCampaign?.name}</strong>?
            </p>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              onClick={() => setDeletingCampaign(null)}
              className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-semibold transition-all shadow-md shadow-rose-600/30"
            >
              Confirm Delete
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
