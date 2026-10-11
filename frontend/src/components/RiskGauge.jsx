import React from 'react';
import { ShieldAlert, CheckCircle2, AlertTriangle } from 'lucide-react';
import { RiskBadge } from './StatusBadge';

export const RiskGauge = ({ score = 0, level = 'LOW', breakdown = [] }) => {
  const getScoreColor = () => {
    if (score <= 25) return 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10';
    if (score <= 50) return 'text-amber-400 border-amber-500/30 bg-amber-500/10';
    if (score <= 75) return 'text-rose-400 border-rose-500/30 bg-rose-500/10';
    return 'text-red-400 border-red-600/50 bg-red-600/20';
  };

  return (
    <div className="glass-card rounded-2xl p-6 border border-slate-800">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">Deterministic Risk Score</h3>
        <RiskBadge level={level} score={score} />
      </div>

      <div className="flex items-center space-x-6 mb-6">
        <div className={`w-24 h-24 rounded-2xl border-2 flex flex-col items-center justify-center shrink-0 ${getScoreColor()}`}>
          <span className="text-3xl font-extrabold">{score}</span>
          <span className="text-[10px] uppercase font-bold text-slate-400">/ 100 Risk</span>
        </div>

        <div>
          <h4 className="text-lg font-bold text-white mb-1">
            {level === 'LOW' && 'Low Contract Risk'}
            {level === 'MEDIUM' && 'Moderate Risk Factors'}
            {level === 'HIGH' && 'High Risk - Legal Review Recommended'}
            {level === 'CRITICAL' && 'Critical Risk - Urgent Action Needed'}
          </h4>
          <p className="text-xs text-slate-400">
            Calculated transparently by ContractIQ's rule engine based on liability caps, notice deadlines, auto-renewals, and penalty clauses.
          </p>
        </div>
      </div>

      {/* Transparent Score Breakdown */}
      <div className="border-t border-slate-800 pt-4">
        <h4 className="text-xs font-semibold text-slate-300 mb-3 flex items-center">
          <ShieldAlert className="w-3.5 h-3.5 text-blue-400 mr-1.5" />
          Scoring Rule Breakdown
        </h4>

        {breakdown && breakdown.length > 0 ? (
          <div className="space-y-2">
            {breakdown.map((item, idx) => (
              <div key={idx} className="flex items-start justify-between bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/80 text-xs">
                <div className="flex items-start space-x-2">
                  <span className="font-bold text-rose-400 bg-rose-500/10 px-1.5 py-0.5 rounded text-[11px] shrink-0">
                    +{item.points}
                  </span>
                  <div>
                    <span className="font-semibold text-slate-200">{item.rule}</span>
                    <p className="text-slate-400 text-[11px] mt-0.5">{item.reason}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center text-xs text-emerald-400 bg-emerald-500/10 p-3 rounded-lg border border-emerald-500/20">
            <CheckCircle2 className="w-4 h-4 mr-2 text-emerald-400 shrink-0" />
            No major high-risk penalty clauses triggered. Standard commercial terms detected.
          </div>
        )}
      </div>
    </div>
  );
};
