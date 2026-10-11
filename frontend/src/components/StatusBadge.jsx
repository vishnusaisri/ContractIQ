import React from 'react';
import { AlertTriangle, CheckCircle, ShieldAlert, AlertCircle } from 'lucide-react';

export const RiskBadge = ({ level, score }) => {
  const normalized = (level || 'LOW').toUpperCase();
  
  const styles = {
    LOW: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    MEDIUM: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    HIGH: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
    CRITICAL: 'bg-red-700/20 text-red-300 border-red-600/50 animate-pulse',
  };

  const icons = {
    LOW: <CheckCircle className="w-3.5 h-3.5 mr-1" />,
    MEDIUM: <AlertCircle className="w-3.5 h-3.5 mr-1" />,
    HIGH: <AlertTriangle className="w-3.5 h-3.5 mr-1" />,
    CRITICAL: <ShieldAlert className="w-3.5 h-3.5 mr-1" />,
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${styles[normalized] || styles.LOW}`}>
      {icons[normalized]}
      {normalized} {score !== undefined ? `(${score})` : ''}
    </span>
  );
};

export const StatusBadge = ({ status }) => {
  const normalized = (status || 'COMPLETED').toUpperCase();

  const styles = {
    COMPLETED: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
    UPLOADED: 'bg-slate-500/10 text-slate-400 border-slate-500/30',
    ANALYZING: 'bg-purple-500/10 text-purple-400 border-purple-500/30 animate-pulse',
    FAILED: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${styles[normalized] || styles.COMPLETED}`}>
      {normalized}
    </span>
  );
};
