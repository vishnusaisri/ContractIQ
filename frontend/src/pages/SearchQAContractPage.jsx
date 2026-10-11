import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Sparkles, FileText, ArrowUpRight, HelpCircle, Loader2 } from 'lucide-react';
import api from '../services/api';
import { RiskBadge } from '../components/StatusBadge';

export const SearchQAContractPage = () => {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);

  const sampleQuestions = [
    "Which contracts expire in the next 60 days?",
    "Which contracts automatically renew?",
    "Show contracts with unlimited liability.",
    "Which vendors have late-delivery penalties?",
    "Which contracts require more than 60 days notice?",
    "What are the highest-risk contracts?"
  ];

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    try {
      const res = await api.post('/search/query', { query });
      setResponse(res.data);
    } catch (err) {
      alert('Query failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleSampleClick = (q) => {
    setQuery(q);
    setLoading(true);
    api.post('/search/query', { query: q })
      .then((res) => setResponse(res.data))
      .catch(() => alert('Query failed.'))
      .finally(() => setLoading(false));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-white tracking-tight">Ask ContractIQ (Natural Language Search)</h1>
        <p className="text-xs text-slate-400 mt-1">Query your organization contract portfolio in plain English.</p>
      </div>

      {/* Query Bar */}
      <form onSubmit={handleSearch} className="glass-card p-4 rounded-2xl border border-slate-800 space-y-4">
        <div className="relative">
          <Search className="w-5 h-5 text-blue-400 absolute left-4 top-3.5" />
          <input
            type="text"
            placeholder="Ask a question across your contracts..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-12 pr-28 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 shadow-inner"
          />
          <button
            type="submit"
            disabled={loading || !query.trim()}
            className="absolute right-2 top-2 px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg transition-all disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Ask IQ'}
          </button>
        </div>

        {/* Suggested Queries */}
        <div>
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-2">Suggested Sample Questions:</span>
          <div className="flex flex-wrap gap-2">
            {sampleQuestions.map((q, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSampleClick(q)}
                className="text-xs bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 hover:border-slate-700 px-3 py-1.5 rounded-lg transition-all text-left"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      </form>

      {/* Search Response */}
      {response && (
        <div className="space-y-6">
          <div className="glass-card p-6 rounded-2xl border border-blue-500/30 bg-blue-500/5">
            <div className="flex items-center space-x-2 text-blue-400 font-bold text-sm mb-2">
              <Sparkles className="w-4 h-4" />
              <span>ContractIQ Answer</span>
            </div>
            <p className="text-sm font-semibold text-white leading-relaxed mb-3">{response.answer}</p>
            <p className="text-[11px] text-slate-400 italic">{response.disclaimer}</p>
          </div>

          {/* Matching Contracts */}
          <div className="glass-card p-6 rounded-2xl border border-slate-800">
            <h3 className="text-sm font-bold text-white mb-4">Referenced Source Contracts ({response.matching_count})</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {response.results.map((c) => (
                <div key={c.id} className="p-4 bg-slate-900/80 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <Link to={`/app/contracts/${c.id}`} className="text-xs font-bold text-white hover:text-blue-400 flex items-center space-x-1.5">
                      <FileText className="w-4 h-4 text-blue-400 shrink-0" />
                      <span>{c.contract_name}</span>
                    </Link>
                    <RiskBadge level={c.risk_level} score={c.risk_score} />
                  </div>
                  <p className="text-xs text-slate-400 line-clamp-2">{c.summary}</p>
                  <div className="flex items-center justify-between text-[10px] text-slate-500 border-t border-slate-800/80 pt-2">
                    <span>Renewal: {c.renewal_date || 'N/A'}</span>
                    <Link to={`/app/contracts/${c.id}`} className="text-blue-400 hover:underline flex items-center">
                      <span>View Analysis</span>
                      <ArrowUpRight className="w-3 h-3 ml-0.5" />
                    </Link>
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
