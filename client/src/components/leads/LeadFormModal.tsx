import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Lead, LeadStatus } from '../../types';
import { leadService } from '../../services/api';
import { useToast } from '../../hooks/useToast';
import { Sparkles, Loader2 } from 'lucide-react';

interface LeadFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (lead: Lead) => void;
  initialLead?: Lead | null;
}

const COMMON_INDUSTRIES = [
  'SaaS',
  'Technology',
  'Software',
  'Artificial Intelligence',
  'Finance',
  'FinTech',
  'Cybersecurity',
  'Cloud',
  'Healthcare Tech',
  'E-Commerce',
  'Logistics Tech',
  'Consulting',
  'Media & Marketing',
  'Other',
];

export const LeadFormModal: React.FC<LeadFormModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  initialLead,
}) => {
  const { success, error } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    company: '',
    jobTitle: '',
    phone: '',
    website: '',
    industry: 'SaaS',
    status: 'NEW' as LeadStatus,
    source: 'Website',
    notes: '',
  });

  useEffect(() => {
    if (initialLead) {
      setFormData({
        firstName: initialLead.firstName || '',
        lastName: initialLead.lastName || '',
        email: initialLead.email || '',
        company: initialLead.company || '',
        jobTitle: initialLead.jobTitle || '',
        phone: initialLead.phone || '',
        website: initialLead.website || '',
        industry: initialLead.industry || 'SaaS',
        status: initialLead.status || 'NEW',
        source: initialLead.source || 'Website',
        notes: initialLead.notes || '',
      });
    } else {
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        company: '',
        jobTitle: '',
        phone: '',
        website: '',
        industry: 'SaaS',
        status: 'NEW',
        source: 'Website',
        notes: '',
      });
    }
  }, [initialLead, isOpen]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.company || !formData.jobTitle) {
      error('Validation error', 'Please fill in all required fields (Name, Email, Company, Job Title).');
      return;
    }

    setIsSubmitting(true);
    try {
      if (initialLead) {
        const res = await leadService.updateLead(initialLead.id, formData);
        if (res.success && res.data) {
          success('Lead Updated', `${res.data.firstName} ${res.data.lastName} score updated to ${res.data.score} (${res.data.classification})`);
          onSuccess(res.data);
          onClose();
        }
      } else {
        const res = await leadService.createLead(formData);
        if (res.success && res.data) {
          success('Lead Created', `AI Lead Score: ${res.data.score}/100 (${res.data.classification})`);
          onSuccess(res.data);
          onClose();
        }
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Failed to save lead.';
      error('Error', msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialLead ? 'Edit Lead Profile' : 'Add New B2B Lead'}
      description="The intelligent lead scoring engine calculates qualification probability in real-time."
      maxWidth="xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              First Name *
            </label>
            <input
              type="text"
              name="firstName"
              required
              value={formData.firstName}
              onChange={handleChange}
              placeholder="e.g. Elena"
              className="w-full px-3.5 py-2.5 bg-slate-900/80 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Last Name *
            </label>
            <input
              type="text"
              name="lastName"
              required
              value={formData.lastName}
              onChange={handleChange}
              placeholder="e.g. Rostova"
              className="w-full px-3.5 py-2.5 bg-slate-900/80 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm transition-all"
            />
          </div>
        </div>

        {/* Email & Phone */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Email Address *
            </label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="elena@company.com"
              className="w-full px-3.5 py-2.5 bg-slate-900/80 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Phone Number
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+1-555-0199"
              className="w-full px-3.5 py-2.5 bg-slate-900/80 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm transition-all"
            />
          </div>
        </div>

        {/* Company & Job Title */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Company *
            </label>
            <input
              type="text"
              name="company"
              required
              value={formData.company}
              onChange={handleChange}
              placeholder="e.g. CloudScale AI"
              className="w-full px-3.5 py-2.5 bg-slate-900/80 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Job Title *
            </label>
            <input
              type="text"
              name="jobTitle"
              required
              value={formData.jobTitle}
              onChange={handleChange}
              placeholder="e.g. Chief Technology Officer"
              className="w-full px-3.5 py-2.5 bg-slate-900/80 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm transition-all"
            />
          </div>
        </div>

        {/* Industry, Status & Website */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Industry *
            </label>
            <select
              name="industry"
              value={formData.industry}
              onChange={handleChange}
              className="w-full px-3 py-2.5 bg-slate-900/80 border border-slate-700/80 rounded-xl text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm transition-all"
            >
              {COMMON_INDUSTRIES.map((ind) => (
                <option key={ind} value={ind} className="bg-slate-900">
                  {ind}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-3 py-2.5 bg-slate-900/80 border border-slate-700/80 rounded-xl text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm transition-all"
            >
              <option value="NEW" className="bg-slate-900">NEW</option>
              <option value="CONTACTED" className="bg-slate-900">CONTACTED</option>
              <option value="QUALIFIED" className="bg-slate-900">QUALIFIED</option>
              <option value="CONVERTED" className="bg-slate-900">CONVERTED</option>
              <option value="LOST" className="bg-slate-900">LOST</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Website
            </label>
            <input
              type="url"
              name="website"
              value={formData.website}
              onChange={handleChange}
              placeholder="https://company.io"
              className="w-full px-3.5 py-2.5 bg-slate-900/80 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm transition-all"
            />
          </div>
        </div>

        {/* Source & Notes */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
            Acquisition Source
          </label>
          <input
            type="text"
            name="source"
            value={formData.source}
            onChange={handleChange}
            placeholder="e.g. LinkedIn Outbound, Referral, Inbound Form"
            className="w-full px-3.5 py-2.5 bg-slate-900/80 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm transition-all"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
            Qualification Notes
          </label>
          <textarea
            name="notes"
            rows={3}
            value={formData.notes}
            onChange={handleChange}
            placeholder="Key discussion points, enterprise requirements, pain points..."
            className="w-full px-3.5 py-2.5 bg-slate-900/80 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm transition-all resize-none"
          />
        </div>

        {/* Scoring Engine Highlight */}
        <div className="p-3 rounded-xl bg-indigo-950/40 border border-indigo-800/40 flex items-center gap-3">
          <Sparkles className="w-5 h-5 text-indigo-400 shrink-0" />
          <p className="text-xs text-indigo-200">
            Saving this lead evaluates title authority, corporate domain, and industry affinity to compute an <strong>AI Lead Score</strong> from 0-100.
          </p>
        </div>

        {/* Action Buttons */}
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
                <span>Evaluating...</span>
              </>
            ) : (
              <span>{initialLead ? 'Update Lead' : 'Calculate & Save Lead'}</span>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
};
