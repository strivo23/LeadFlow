import React from 'react';
import { Navbar } from '../components/common/Navbar';
import { useAuth } from '../hooks/useAuth';
import { User, Mail, Calendar, Key, Shield, LogOut, CheckCircle2 } from 'lucide-react';

export const Profile: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <div className="flex-1 flex flex-col pb-16">
      <Navbar title="Account Settings & Security" subtitle="Manage your profile credentials and API access" />

      <div className="p-8 max-w-4xl mx-auto w-full space-y-6 animate-in fade-in duration-300">
        {/* User Card */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-indigo-600/30">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">{user?.name}</h2>
              <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5" />
                {user?.email}
              </p>
              <div className="flex items-center gap-3 mt-2">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
                  <Shield className="w-3 h-3" /> Enterprise Admin
                </span>
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-slate-500" />
                  Member since {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : '2026'}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={logout}
            className="inline-flex items-center gap-2 px-4 py-2 bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/40 rounded-xl text-xs font-semibold transition-all hover:scale-[1.02]"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>

        {/* Security & Token Info */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center gap-2 text-indigo-400">
            <Key className="w-4 h-4" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">
              Authentication & Security Details
            </h3>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            LeadFlow uses cryptographically signed JSON Web Tokens (JWT) with bcrypt salt rounds for secure authentication. Passwords are never stored in plaintext.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                Password Hashing
              </span>
              <p className="text-sm font-semibold text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                bcrypt (10 salt rounds)
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                Token Strategy
              </span>
              <p className="text-sm font-semibold text-indigo-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                JWT Bearer (7-day validity)
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
