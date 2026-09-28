import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Campaign, CampaignStatus, Lead } from '../../types';
import { campaignService, leadService } from '../../services/api';
import { useToast } from '../../hooks/useToast';
import { Send, Loader2 } from 'lucide-react';

interface CampaignFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (campaign: Campaign) => void;
  initialCampaign?: Campaign | null;
}

export const CampaignFormModal: React.FC<CampaignFormModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  initialCampaign,
}) => {
  const { success, error } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [availableLeads, setAvailableLeads] = useState<Lead[]>([]);
  const [selectedLeadIds, setSelectedLeadIds] = useState<string[]>([]);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: 'DRAFT' as CampaignStatus,
  });

  useEffect(() => {
    if (initialCampaign) {
      setFormData({
        name: initialCampaign.name || '',
        description: initialCampaign.description || '',
        status: initialCampaign.status || 'DRAFT',
      });
      setSelectedLeadIds([]);
    } else {
      setFormData({
        name: '',
        description: '',
        status: 'DRAFT',
      });
      setSelectedLeadIds([]);
    }

    if (isOpen && !initialCampaign) {
      // Fetch leads so user can optionally select initial leads for the campaign
      leadService.getLeads({ limit: 50 }).then((res) => {
        if (res.success && res.data) {
          setAvailableLeads(res.data);
        }
      });
    }
  }, [initialCampaign, isOpen]);

  const toggleLead = (leadId: string) => {
    setSelectedLeadIds((prev) =>
      prev.includes(leadId) ? prev.filter((id) => id !== leadId) : [...prev, leadId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      error('Validation error', 'Campaign name is required.');
      return;
    }

    setIsSubmitting(true);
    try {
      if (initialCampaign) {
        const res = await campaignService.updateCampaign(initialCampaign.id, formData);
        if (res.success && res.data) {
          success('Campaign Updated', `Campaign "${res.data.name}" has been updated.`);
          onSuccess(res.data);
          onClose();
        }
      } else {
        const res = await campaignService.createCampaign({
          ...formData,
          leadIds: selectedLeadIds,
        });
        if (res.success && res.data) {
          success('Campaign Created', `Campaign "${res.data.name}" created with ${selectedLeadIds.length} lead(s).`);
          onSuccess(res.data);
          onClose();
        }
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Failed to save campaign.';
      error('Error', msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialCampaign ? 'Edit Campaign' : 'Create Outreach Campaign'}
      description="Organize targeted outbound sequences and associate qualified leads."
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
            Campaign Name *
          </label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g. Q4 Enterprise SaaS Outbound"
            className="w-full px-3.5 py-2.5 bg-slate-900/80 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm transition-all"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
            Description & Target ICP
          </label>
          <textarea
            rows={3}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Target audience, value proposition, and outreach objectives..."
            className="w-full px-3.5 py-2.5 bg-slate-900/80 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm transition-all resize-none"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
            Campaign Status
          </label>
          <select
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value as CampaignStatus })}
            className="w-full px-3 py-2.5 bg-slate-900/80 border border-slate-700/80 rounded-xl text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm transition-all"
          >
            <option value="DRAFT" className="bg-slate-900">DRAFT (Sequence under preparation)</option>
            <option value="ACTIVE" className="bg-slate-900">ACTIVE (Live outreach ongoing)</option>
            <option value="PAUSED" className="bg-slate-900">PAUSED (Temporarily on hold)</option>
            <option value="COMPLETED" className="bg-slate-900">COMPLETED (All touches completed)</option>
          </select>
        </div>

        {!initialCampaign && availableLeads.length > 0 && (
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Select Initial Leads ({selectedLeadIds.length} selected)
            </label>
            <div className="max-h-40 overflow-y-auto custom-scroll border border-slate-800 rounded-xl p-2 bg-slate-900/50 space-y-1">
              {availableLeads.map((lead) => (
                <label
                  key={lead.id}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-800/60 cursor-pointer text-xs transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={selectedLeadIds.includes(lead.id)}
                    onChange={() => toggleLead(lead.id)}
                    className="w-4 h-4 rounded text-indigo-600 bg-slate-800 border-slate-700 focus:ring-indigo-500"
                  />
                  <span className="font-semibold text-white">
                    {lead.firstName} {lead.lastName}
                  </span>
                  <span className="text-slate-400">({lead.company} · {lead.jobTitle})</span>
                  <span className="ml-auto font-mono text-[11px] text-indigo-400">
                    Score: {lead.score}
                  </span>
                </label>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800/80">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-semibold text-slate-400 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl text-sm font-semibold transition-all shadow-md shadow-indigo-600/30 hover:scale-[1.02] active:scale-[0.98]"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>{initialCampaign ? 'Update Campaign' : 'Create Campaign'}</span>
              </>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
};
