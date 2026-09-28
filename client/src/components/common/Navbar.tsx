import React from 'react';
import { Sparkles, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

interface NavbarProps {
  title: string;
  subtitle?: string;
  actionButton?: React.ReactNode;
}

export const Navbar: React.FC<NavbarProps> = ({ title, subtitle, actionButton }) => {
  const { user } = useAuth();

  return (
    <header className="h-16 px-8 border-b border-slate-800/80 bg-[#0d121f]/80 backdrop-blur-md flex items-center justify-between sticky top-0 z-30">
      <div>
        <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
          {title}
        </h1>
        {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-4">
        {/* Demo indicator tag */}
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Live Workspace</span>
        </div>

        {/* AI Engine Status */}
        <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-medium">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span>AI Scoring Active</span>
        </div>

        {/* Action button if provided */}
        {actionButton && <div>{actionButton}</div>}
      </div>
    </header>
  );
};
