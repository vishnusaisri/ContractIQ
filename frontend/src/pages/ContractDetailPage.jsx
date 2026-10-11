import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  FileText,
  Clock,
  ShieldAlert,
  CheckSquare,
  Sparkles,
  Calendar,
  AlertTriangle,
  FileCheck,
  ChevronLeft,
  RefreshCw,
  Info
} from 'lucide-react';
import api from '../services/api';
import { RiskGauge } from '../components/RiskGauge';
import { RiskBadge, StatusBadge } from '../components/StatusBadge';

export const ContractDetailPage = () => {
  const { id } = useParams();
  const [contract, setContract] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview'); // overview, key_terms, clauses, obligations, timeline, summary
  const [clauseFilter, setClauseFilter] = useState('ALL');

  useEffect(() => {
    setLoading(true);
    api.get(`/contracts/${id}`)
      .then((res) => setContract(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-xs text-slate-400">
        <RefreshCw className="w-5 h-5 animate-spin mr-2 text-blue-400" />
        Loading Contract Analysis...
      </div>
    );
  }

  if (!contract) {
    return (
      <div className="text-center py-12 text-xs text-slate-400">
        Contract not found or access denied.
      </div>
    );
  }

  const filteredClauses = (contract.clauses || []).filter((cl) => {
    if (clauseFilter === 'ALL') return true;
    if (clauseFilter === 'HIGH_RISK') return cl.risk_level === 'HIGH' || cl.risk_level === 'CRITICAL';
    return cl.clause_type === clauseFilter;
  });

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Link to="/app/contracts" className="p-2 hover:bg-slate-800 rounded-xl text-slate-400 hover:text-white">
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center space-x-3">
              <h1 className="text-xl font-black text-white">{contract.contract_name}</h1>
              <RiskBadge level={contract.risk_level} score={contract.risk_score} />
              <StatusBadge status={contract.status} />
            </div>
            <p className="text-xs text-slate-400 mt-0.5">{contract.contract_type} • File: {contract.file_name}</p>
          </div>
        </div>

        <Link
          to="/app/compare"
          className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white rounded-xl border border-slate-700 transition-all"
        >
          Compare Version
        </Link>
      </div>

      {/* Tabs Navigation */}
      <div className="border-b border-slate-800 flex space-x-2 text-xs font-semibold overflow-x-auto pb-1">
        {[
          { id: 'overview', label: 'Overview & Score' },
          { id: 'key_terms', label: 'Extracted Terms' },
          { id: 'clauses', label: `Clauses (${contract.clauses?.length || 0})` },
          { id: 'obligations', label: `Obligations (${contract.obligations?.length || 0})` },
          { id: 'timeline', label: 'Dates & Timeline' },
          { id: 'summary', label: 'AI Executive Summary' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2.5 rounded-xl transition-all whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB CONTENT: Overview */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <RiskGauge
              score={contract.risk_score}
              level={contract.risk_level}
              breakdown={contract.score_breakdown || []}
            />

            <div className="glass-card rounded-2xl p-6 border border-slate-800">
              <h3 className="text-sm font-bold text-white mb-3">Key Contract Highlights</h3>
              <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/60 p-4 rounded-xl border border-slate-800">
                {contract.summary || 'Summary analysis available.'}
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Metadata Summary</h3>

              <div className="border-b border-slate-800 pb-3">
                <span className="text-[10px] text-slate-500 uppercase block">Contract Value</span>
                <span className="text-base font-extrabold text-emerald-400">
                  {contract.contract_value ? `₹${contract.contract_value.toLocaleString()}` : 'Not Specified'}
                </span>
              </div>

              <div className="border-b border-slate-800 pb-3">
                <span className="text-[10px] text-slate-500 uppercase block">Renewal Type</span>
                <span className="text-xs font-semibold text-amber-400 capitalize">
                  {contract.renewal_type || 'manual'}
                </span>
              </div>

              <div className="border-b border-slate-800 pb-3">
                <span className="text-[10px] text-slate-500 uppercase block">Notice Period</span>
                <span className="text-xs font-semibold text-slate-200">
                  {contract.notice_period_days ? `${contract.notice_period_days} Days Notice Required` : 'Not Specified'}
                </span>
              </div>

              <div>
                <span className="text-[10px] text-slate-500 uppercase block">Expiration Date</span>
                <span className="text-xs font-mono text-slate-300">
                  {contract.end_date || 'Unstated / Indefinite'}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: Key Extracted Terms */}
      {activeTab === 'key_terms' && (
        <div className="glass-card rounded-2xl p-6 border border-slate-800">
          <h3 className="text-sm font-bold text-white mb-4">Structured Extracted Fields</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Contract Name</span>
              <span className="text-xs font-semibold text-white">{contract.contract_name}</span>
            </div>
            <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Contract Type</span>
              <span className="text-xs font-semibold text-white">{contract.contract_type}</span>
            </div>
            <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Effective Start Date</span>
              <span className="text-xs font-mono text-slate-200">{contract.start_date || 'Not specified'}</span>
            </div>
            <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Expiration / Renewal Date</span>
              <span className="text-xs font-mono text-amber-400 font-semibold">{contract.renewal_date || contract.end_date || 'Not specified'}</span>
            </div>
            <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Notice Period</span>
              <span className="text-xs font-semibold text-slate-200">{contract.notice_period_days ? `${contract.notice_period_days} Days` : 'Not specified'}</span>
            </div>
            <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Financial Value</span>
              <span className="text-xs font-semibold text-emerald-400">{contract.contract_value ? `₹${contract.contract_value.toLocaleString()}` : 'Not specified'}</span>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: Clauses */}
      {activeTab === 'clauses' && (
        <div className="space-y-4">
          <div className="flex items-center space-x-2 text-xs overflow-x-auto pb-2">
            {['ALL', 'HIGH_RISK', 'liability', 'indemnification', 'renewal', 'payment', 'termination', 'confidentiality'].map((f) => (
              <button
                key={f}
                onClick={() => setClauseFilter(f)}
                className={`px-3 py-1.5 rounded-lg border capitalize ${
                  clauseFilter === f
                    ? 'bg-blue-600/20 text-blue-400 border-blue-500/40 font-semibold'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                {f.replace('_', ' ')}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            {filteredClauses.map((cl) => (
              <div key={cl.id} className="glass-card rounded-2xl p-6 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-blue-400 uppercase bg-blue-500/10 px-2.5 py-1 rounded border border-blue-500/20">
                      {cl.clause_type}
                    </span>
                    {cl.page_number && <span className="text-[10px] text-slate-500 font-mono">Page {cl.page_number}</span>}
                  </div>
                  <RiskBadge level={cl.risk_level} score={cl.risk_score} />
                </div>

                <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 font-mono text-xs text-slate-200 leading-relaxed">
                  "{cl.clause_text}"
                </div>

                {cl.explanation && (
                  <p className="text-xs text-rose-300 bg-rose-500/10 p-3 rounded-xl border border-rose-500/20 flex items-start">
                    <AlertTriangle className="w-4 h-4 mr-2 text-rose-400 shrink-0 mt-0.5" />
                    <span><strong>Risk Explanation:</strong> {cl.explanation}</span>
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT: Obligations */}
      {activeTab === 'obligations' && (
        <div className="glass-card rounded-2xl p-6 border border-slate-800">
          <h3 className="text-sm font-bold text-white mb-4">Extracted Contractual Obligations</h3>
          <div className="space-y-3">
            {(contract.obligations || []).map((ob) => (
              <div key={ob.id} className="p-4 bg-slate-900/80 rounded-xl border border-slate-800 flex items-start justify-between">
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-xs font-bold text-slate-200">{ob.responsible_party}</span>
                    <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded font-mono">{ob.frequency}</span>
                    <span className="text-[10px] bg-purple-500/10 text-purple-400 px-2 py-0.5 rounded font-semibold">{ob.priority} Priority</span>
                  </div>
                  <p className="text-xs text-slate-300">{ob.description}</p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-mono text-amber-400 block">{ob.due_date || 'No due date'}</span>
                  <span className="text-[10px] text-emerald-400 font-semibold">{ob.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT: Timeline */}
      {activeTab === 'timeline' && (
        <div className="glass-card rounded-2xl p-6 border border-slate-800">
          <h3 className="text-sm font-bold text-white mb-6">Contract Milestone Timeline</h3>
          <div className="relative border-l-2 border-slate-800 ml-4 pl-6 space-y-6">
            <div className="relative">
              <span className="absolute -left-[31px] top-0.5 w-3 h-3 rounded-full bg-blue-500" />
              <h4 className="text-xs font-bold text-white">Start Date</h4>
              <p className="text-xs font-mono text-slate-400">{contract.start_date || 'Not specified'}</p>
            </div>

            <div className="relative">
              <span className="absolute -left-[31px] top-0.5 w-3 h-3 rounded-full bg-amber-500 animate-ping" />
              <h4 className="text-xs font-bold text-amber-400">Notice Cancellation Deadline</h4>
              <p className="text-xs font-mono text-slate-300">
                {contract.notice_period_days ? `Requires written notice ${contract.notice_period_days} days prior to renewal` : 'Standard notice deadline'}
              </p>
            </div>

            <div className="relative">
              <span className="absolute -left-[31px] top-0.5 w-3 h-3 rounded-full bg-purple-500" />
              <h4 className="text-xs font-bold text-white">Renewal Date ({contract.renewal_type || 'manual'})</h4>
              <p className="text-xs font-mono text-slate-400">{contract.renewal_date || contract.end_date || 'Indefinite'}</p>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: AI Summary */}
      {activeTab === 'summary' && (
        <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
          <div className="flex items-center space-x-2 text-blue-400 text-sm font-bold">
            <Sparkles className="w-5 h-5" />
            <span>AI Executive Briefing</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/80 p-5 rounded-xl border border-slate-800">
            {contract.summary}
          </p>
        </div>
      )}
    </div>
  );
};
