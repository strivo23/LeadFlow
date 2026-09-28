import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '../components/common/Navbar';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { EmptyState } from '../components/common/EmptyState';
import { Badge } from '../components/common/Badge';
import { ScoreBadge } from '../components/common/ScoreBadge';
import { Modal } from '../components/common/Modal';
import { LeadFormModal } from '../components/leads/LeadFormModal';
import { leadService } from '../services/api';
import { Lead, LeadStatus } from '../types';
import { useToast } from '../hooks/useToast';
import {
  Users,
  Search,
  Filter,
  Plus,
  ArrowUpDown,
  Eye,
  Edit2,
  Trash2,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  Building2,
  Mail,
  Phone,
} from 'lucide-react';

export const Leads: React.FC = () => {
  const { success, error } = useToast();

  const [leads, setLeads] = useState<Lead[]>([]);
  const [industries, setIndustries] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters & Pagination State
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [industryFilter, setIndustryFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState<'score' | 'createdAt' | 'name'>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalLeads, setTotalLeads] = useState(0);

  // Modal states
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [deletingLead, setDeletingLead] = useState<Lead | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchLeads = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await leadService.getLeads({
        search: search.trim() || undefined,
        status: statusFilter !== 'ALL' ? statusFilter : undefined,
        industry: industryFilter !== 'ALL' ? industryFilter : undefined,
        sortBy,
        sortOrder,
        page,
        limit: 15,
      });

      if (res.success && res.data) {
        setLeads(res.data);
        if (res.meta) {
          setTotalPages(res.meta.totalPages || 1);
          setTotalLeads(res.meta.total || 0);
        }
      }
    } catch (err: any) {
      error('Failed to fetch leads', err.response?.data?.message || err.message);
    } finally {
      setIsLoading(false);
    }
  }, [search, statusFilter, industryFilter, sortBy, sortOrder, page, error]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  useEffect(() => {
    leadService.getIndustries().then((res) => {
      if (res.success && res.data) {
        setIndustries(res.data);
      }
    });
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchLeads();
  };

  const handleSortToggle = (field: 'score' | 'name' | 'createdAt') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
    setPage(1);
  };

  const handleEdit = (lead: Lead) => {
    setEditingLead(lead);
    setIsFormModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingLead) return;
    setIsDeleting(true);
    try {
      await leadService.deleteLead(deletingLead.id);
      success('Lead Deleted', `${deletingLead.firstName} ${deletingLead.lastName} has been removed.`);
      setDeletingLead(null);
      fetchLeads();
    } catch (err: any) {
      error('Delete failed', err.response?.data?.message || err.message);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col pb-16">
      <Navbar
        title="Lead Directory & Scoring"
        subtitle={`Managing ${totalLeads} targeted accounts with AI qualification`}
        actionButton={
          <button
            onClick={() => {
              setEditingLead(null);
              setIsFormModalOpen(true);
            }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold transition-all shadow-md shadow-indigo-600/30 hover:scale-[1.02] active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Lead</span>
          </button>
        }
      />

      <div className="p-8 max-w-7xl mx-auto w-full space-y-6">
        {/* Search & Filter Bar */}
        <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Search Input */}
          <form onSubmit={handleSearchSubmit} className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, company, email..."
              className="w-full pl-10 pr-4 py-2 bg-slate-900/80 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 text-xs transition-all"
            />
          </form>

          {/* Filters & Sorting */}
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            {/* Status Filter */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-slate-400 font-medium">Status:</span>
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setPage(1);
                }}
                className="px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="ALL">All Statuses</option>
                <option value="NEW">NEW</option>
                <option value="CONTACTED">CONTACTED</option>
                <option value="QUALIFIED">QUALIFIED</option>
                <option value="CONVERTED">CONVERTED</option>
                <option value="LOST">LOST</option>
              </select>
            </div>

            {/* Industry Filter */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-slate-400 font-medium">Industry:</span>
              <select
                value={industryFilter}
                onChange={(e) => {
                  setIndustryFilter(e.target.value);
                  setPage(1);
                }}
                className="px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="ALL">All Industries</option>
                {industries.map((ind) => (
                  <option key={ind} value={ind}>
                    {ind}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort by Score Toggle */}
            <button
              onClick={() => handleSortToggle('score')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
                sortBy === 'score'
                  ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300'
                  : 'bg-slate-900 border-slate-700 text-slate-300 hover:text-white'
              }`}
            >
              <ArrowUpDown className="w-3.5 h-3.5" />
              <span>Sort AI Score {sortBy === 'score' ? `(${sortOrder})` : ''}</span>
            </button>
          </div>
        </div>

        {/* Leads Table */}
        <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
          {isLoading ? (
            <LoadingSpinner label="Fetching qualified leads..." fullHeight={false} />
          ) : leads.length === 0 ? (
            <div className="p-8">
              <EmptyState
                icon={Users}
                title="No leads found"
                description="Try refining your search terms, removing filters, or create a brand new lead."
                actionText="Add New Lead"
                onAction={() => {
                  setEditingLead(null);
                  setIsFormModalOpen(true);
                }}
              />
            </div>
          ) : (
            <div className="overflow-x-auto custom-scroll">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800/80 bg-slate-900/50 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    <th className="py-3.5 px-6">Lead Name & Title</th>
                    <th className="py-3.5 px-6">Company & Domain</th>
                    <th className="py-3.5 px-6">Industry</th>
                    <th className="py-3.5 px-6">Status</th>
                    <th
                      className="py-3.5 px-6 cursor-pointer hover:text-white transition-colors"
                      onClick={() => handleSortToggle('score')}
                    >
                      <div className="flex items-center gap-1">
                        <span>AI Lead Score</span>
                        <ArrowUpDown className="w-3 h-3 text-slate-500" />
                      </div>
                    </th>
                    <th className="py-3.5 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-sm">
                  {leads.map((lead) => (
                    <tr
                      key={lead.id}
                      className="hover:bg-slate-800/40 transition-colors group"
                    >
                      {/* Name & Title */}
                      <td className="py-4 px-6">
                        <Link to={`/leads/${lead.id}`} className="block">
                          <p className="font-semibold text-white group-hover:text-indigo-400 transition-colors">
                            {lead.firstName} {lead.lastName}
                          </p>
                          <p className="text-xs text-slate-400 mt-0.5">{lead.jobTitle}</p>
                        </Link>
                      </td>

                      {/* Company & Domain */}
                      <td className="py-4 px-6">
                        <p className="font-medium text-slate-200 flex items-center gap-1.5">
                          <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          {lead.company}
                        </p>
                        <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                          <Mail className="w-3 h-3 text-slate-500 shrink-0" />
                          {lead.email}
                        </p>
                      </td>

                      {/* Industry */}
                      <td className="py-4 px-6">
                        <span className="text-xs text-slate-300 px-2 py-1 rounded-md bg-slate-800/80 border border-slate-700/60">
                          {lead.industry}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-6">
                        <Badge status={lead.status} />
                      </td>

                      {/* AI Score */}
                      <td className="py-4 px-6">
                        <ScoreBadge score={lead.score} classification={lead.classification} />
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            to={`/leads/${lead.id}`}
                            title="View Full Dossier"
                            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => handleEdit(lead)}
                            title="Edit Lead"
                            className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-400 hover:bg-slate-800 transition-colors"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeletingLead(lead)}
                            title="Delete Lead"
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="px-6 py-4 border-t border-slate-800/80 bg-slate-900/30 flex items-center justify-between">
              <span className="text-xs text-slate-400">
                Page {page} of {totalPages} ({totalLeads} total records)
              </span>
              <div className="flex items-center gap-2">
                <button
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="p-1.5 rounded-lg border border-slate-800 text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-800 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  className="p-1.5 rounded-lg border border-slate-800 text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-800 transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add / Edit Modal */}
      <LeadFormModal
        isOpen={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false);
          setEditingLead(null);
        }}
        onSuccess={() => fetchLeads()}
        initialLead={editingLead}
      />

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deletingLead}
        onClose={() => setDeletingLead(null)}
        title="Delete Lead Record"
        maxWidth="sm"
      >
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-rose-950/30 border border-rose-800/40 text-rose-300 text-xs">
            <AlertTriangle className="w-5 h-5 shrink-0 text-rose-400" />
            <p>
              Are you sure you want to delete{' '}
              <strong>
                {deletingLead?.firstName} {deletingLead?.lastName}
              </strong>
              ? This action will remove all campaign associations.
            </p>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              onClick={() => setDeletingLead(null)}
              className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-semibold transition-all shadow-md shadow-rose-600/30"
            >
              {isDeleting ? 'Deleting...' : 'Confirm Delete'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
