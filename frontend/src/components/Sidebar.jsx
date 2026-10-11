import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  Upload,
  GitCompare,
  Search,
  CheckSquare,
  Calendar,
  Bell,
  Settings,
  Sparkles
} from 'lucide-react';

export const Sidebar = () => {
  const navItems = [
    { to: '/app', label: 'Dashboard', icon: LayoutDashboard, end: true },
    { to: '/app/contracts', label: 'All Contracts', icon: FileText },
    { to: '/app/upload', label: 'Upload Contract', icon: Upload },
    { to: '/app/compare', label: 'Contract Compare', icon: GitCompare },
    { to: '/app/search', label: 'Ask ContractIQ (Q&A)', icon: Search },
    { to: '/app/obligations', label: 'Obligations', icon: CheckSquare },
    { to: '/app/calendar', label: 'Renewal Calendar', icon: Calendar },
    { to: '/app/alerts', label: 'Alert Center', icon: Bell },
    { to: '/app/settings', label: 'Organization Settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-slate-950/90 border-r border-slate-800/80 flex flex-col justify-between shrink-0 min-h-[calc(100vh-4rem)]">
      <div className="p-4 space-y-1">
        <div className="px-3 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
          Contract Intelligence Platform
        </div>

        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-blue-600/15 text-blue-400 border border-blue-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`
            }
          >
            <item.icon className="w-4 h-4 shrink-0" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </div>

      {/* Upgrade Banner */}
      <div className="p-4 m-4 rounded-xl bg-gradient-to-b from-blue-900/30 to-indigo-900/40 border border-blue-500/20">
        <div className="flex items-center space-x-2 text-blue-400 text-xs font-bold mb-1">
          <Sparkles className="w-4 h-4" />
          <span>Multi-Tenant Enterprise</span>
        </div>
        <p className="text-[11px] text-slate-400 mb-3">
          Isolated organization data with deterministic risk engine and AI clause extraction.
        </p>
        <div className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20 text-center">
          Active Plan: Starter
        </div>
      </div>
    </aside>
  );
};
