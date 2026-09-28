import React from 'react';
import { LeadStatus, CampaignStatus } from '../../types';

interface BadgeProps {
  status: LeadStatus | CampaignStatus | string;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ status, className = '' }) => {
  let badgeStyle = 'bg-slate-800 text-slate-300 border-slate-700';

  switch (status) {
    // Lead Statuses
    case 'NEW':
      badgeStyle = 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      break;
    case 'CONTACTED':
      badgeStyle = 'bg-purple-500/10 text-purple-400 border-purple-500/30';
      break;
    case 'QUALIFIED':
      badgeStyle = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      break;
    case 'CONVERTED':
      badgeStyle = 'bg-teal-500/15 text-teal-300 border-teal-500/40 ring-1 ring-teal-500/20';
      break;
    case 'LOST':
      badgeStyle = 'bg-rose-500/10 text-rose-400 border-rose-500/30';
      break;

    // Campaign Statuses
    case 'DRAFT':
      badgeStyle = 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      break;
    case 'ACTIVE':
      badgeStyle = 'bg-emerald-500/15 text-emerald-400 border-emerald-500/40 ring-1 ring-emerald-500/30 animate-pulse';
      break;
    case 'PAUSED':
      badgeStyle = 'bg-orange-500/10 text-orange-400 border-orange-500/30';
      break;
    case 'COMPLETED':
      badgeStyle = 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30';
      break;
  }

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide border uppercase ${badgeStyle} ${className}`}
    >
      {status}
    </span>
  );
};
