import React, { useState, useEffect } from 'react';
import { GitCompare, ArrowRight, ShieldAlert, Sparkles, RefreshCw } from 'lucide-react';
import api from '../services/api';

export const ContractComparePage = () => {
  const [contracts, setContracts] = useState([]);
  const [c1Id, setC1Id] = useState('');
  const [c2Id, setC2Id] = useState('');
  const [comparison, setComparison] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get('/contracts').then((res) => {
      setContracts(res.data);
      if (res.data.length >= 2) {
        setC1Id(res.data[0].id);
        setC2Id(res.data[1].id);
      }
    });
  }, []);

  const handleCompare = async () => {
    if (!c1Id || !c2Id) return;
    setLoading(true);
    try {
      const res = await api.post('/contracts/compare', {
        contract_id_1: c1Id,
        contract_id_2: c2Id
      });
      setComparison(res.data);
    } catch (err) {
      alert('Comparison failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-white tracking-tight">Contract Comparison Engine</h1>
        <p className="text-xs text-slate-400 mt-1">Select two contract versions to highlight key term changes, liability diffs, and risk shifts.</p>
      </div>

      {/* Select Box */}
      <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Version 1 (Original / Baseline)</label>
            <select
              value={c1Id}
              onChange={(e) => setC1Id(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
            >
              <option value="">Select Baseline Contract</option>
              {contracts.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.contract_name} ({c.risk_level})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Version 2 (New / Revision)</label>
            <select
              value={c2Id}
              onChange={(e) => setC2Id(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
            >
              <option value="">Select Revised Contract</option>
              {contracts.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.contract_name} ({c.risk_level})
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          onClick={handleCompare}
          disabled={!c1Id || !c2Id || loading}
          className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-500/25 flex items-center justify-center space-x-2 transition-all disabled:opacity-50"
        >
          <GitCompare className="w-4 h-4" />
          <span>{loading ? 'Comparing Versions...' : 'Run Side-by-Side Comparison'}</span>
        </button>
      </div>

      {/* Comparison Results */}
      {comparison && (
        <div className="space-y-6">
          {/* AI Explanation Banner */}
          <div className="glass-card rounded-2xl p-6 border border-blue-500/30 bg-blue-500/5">
            <div className="flex items-center space-x-2 text-blue-400 font-bold text-sm mb-2">
              <Sparkles className="w-4 h-4" />
              <span>AI Comparative Summary</span>
            </div>
            <p className="text-xs text-slate-200 leading-relaxed">{comparison.ai_explanation}</p>
          </div>

          {/* Key Term Diff Table */}
          <div className="glass-card rounded-2xl p-6 border border-slate-800">
            <h3 className="text-sm font-bold text-white mb-4">Commercial & Legal Key Term Differences</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px]">
                    <th className="pb-3 font-semibold">Key Term</th>
                    <th className="pb-3 font-semibold">Version 1</th>
                    <th className="pb-3 font-semibold">Version 2</th>
                    <th className="pb-3 font-semibold text-center">Flag</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  {comparison.key_term_diffs.map((diff, idx) => (
                    <tr key={idx} className="hover:bg-slate-900/40">
                      <td className="py-3 font-bold text-white">{diff.term}</td>
                      <td className="py-3 text-slate-300">{diff.v1}</td>
                      <td className="py-3 font-semibold text-slate-100">{diff.v2}</td>
                      <td className="py-3 text-center text-base">{diff.symbol}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Clause Diffs */}
          <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white">Clause Changes & Modifications</h3>
            <div className="space-y-3">
              {comparison.clause_diffs.map((cl, idx) => (
                <div key={idx} className="p-4 bg-slate-900/60 rounded-xl border border-slate-800 text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-blue-400 uppercase">{cl.clause_type}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      cl.change_type === 'ADDED' ? 'bg-emerald-500/10 text-emerald-400' :
                      cl.change_type === 'REMOVED' ? 'bg-rose-500/10 text-rose-400' : 'bg-amber-500/10 text-amber-400'
                    }`}>
                      {cl.change_type}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-slate-300 font-mono text-[11px]">
                    <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                      <span className="text-[10px] font-sans font-bold text-slate-500 block mb-1">V1 Text:</span>
                      "{cl.v1_text}"
                    </div>
                    <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                      <span className="text-[10px] font-sans font-bold text-slate-500 block mb-1">V2 Text:</span>
                      "{cl.v2_text}"
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
