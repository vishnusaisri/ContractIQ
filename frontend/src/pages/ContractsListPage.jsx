import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  Search,
  Filter,
  Plus,
  Trash2,
  Eye,
  GitCompare,
  RefreshCw,
  SlidersHorizontal
} from 'lucide-react';
import api from '../services/api';
import { RiskBadge, StatusBadge } from '../components/StatusBadge';

export const ContractsListPage = () => {
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [riskFilter, setRiskFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

  const fetchContracts = () => {
    setLoading(true);
    let url = '/contracts?';
    if (search) url += `search=${encodeURIComponent(search)}&`;
    if (riskFilter) url += `risk_level=${riskFilter}&`;
    if (typeFilter) url += `contract_type=${encodeURIComponent(typeFilter)}&`;

    api.get(url)
      .then((res) => setContracts(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchContracts();
  }, [search, riskFilter, typeFilter]);

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete '${name}'?`)) {
      try {
        await api.delete(`/contracts/${id}`);
        setContracts(contracts.filter(c => c.id !== id));
      } catch (err) {
        alert('Failed to delete contract.');
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Organization Contracts</h1>
          <p className="text-xs text-slate-400 mt-1">Manage, search, and monitor all organization agreements.</p>
        </div>

        <Link
          to="/app/upload"
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-blue-500/20 flex items-center space-x-2 transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Upload Contract</span>
        </Link>
      </div>

      {/* Filter Bar */}
      <div className="glass-card p-4 rounded-2xl border border-slate-800 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by contract name, party..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex items-center space-x-3 w-full md:w-auto">
          <div className="flex items-center space-x-1 text-xs text-slate-400">
            <Filter className="w-3.5 h-3.5" />
            <span>Risk:</span>
          </div>
          <select
            value={riskFilter}
            onChange={(e) => setRiskFilter(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
          >
            <option value="">All Risks</option>
            <option value="LOW">LOW</option>
            <option value="MEDIUM">MEDIUM</option>
            <option value="HIGH">HIGH</option>
            <option value="CRITICAL">CRITICAL</option>
          </select>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
          >
            <option value="">All Contract Types</option>
            <option value="Master Services Agreement">Master Services Agreement</option>
            <option value="Vendor Agreement">Vendor Agreement</option>
            <option value="SaaS Subscription Agreement">SaaS Agreement</option>
            <option value="Employment Agreement">Employment Agreement</option>
            <option value="Non-Disclosure Agreement">NDA</option>
          </select>
        </div>
      </div>

      {/* Contracts Table */}
      <div className="glass-card rounded-2xl border border-slate-800 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-48 text-xs text-slate-400">
            <RefreshCw className="w-4 h-4 animate-spin mr-2 text-blue-400" />
            Loading contracts...
          </div>
        ) : contracts.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 text-[10px] uppercase tracking-wider bg-slate-900/50">
                  <th className="py-3.5 px-4 font-semibold">Contract</th>
                  <th className="py-3.5 px-4 font-semibold">Type</th>
                  <th className="py-3.5 px-4 font-semibold">Expiry Date</th>
                  <th className="py-3.5 px-4 font-semibold">Renewal</th>
                  <th className="py-3.5 px-4 font-semibold">Value</th>
                  <th className="py-3.5 px-4 font-semibold">Risk Level</th>
                  <th className="py-3.5 px-4 font-semibold">Status</th>
                  <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {contracts.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-900/40 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-white">
                      <Link to={`/app/contracts/${c.id}`} className="hover:text-blue-400 flex items-center space-x-2">
                        <FileText className="w-4 h-4 text-blue-400 shrink-0" />
                        <span>{c.contract_name}</span>
                      </Link>
                    </td>
                    <td className="py-3.5 px-4 text-slate-400">{c.contract_type || 'General'}</td>
                    <td className="py-3.5 px-4 font-mono text-slate-300">{c.end_date || 'N/A'}</td>
                    <td className="py-3.5 px-4">
                      <span className={`capitalize font-mono ${c.renewal_type === 'auto' ? 'text-amber-400 font-semibold' : 'text-slate-400'}`}>
                        {c.renewal_type || 'manual'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-emerald-400 font-medium">
                      {c.contract_value ? `₹${c.contract_value.toLocaleString()}` : 'Unspecified'}
                    </td>
                    <td className="py-3.5 px-4">
                      <RiskBadge level={c.risk_level} score={c.risk_score} />
                    </td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={c.status} />
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Link
                          to={`/app/contracts/${c.id}`}
                          className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white"
                          title="View Analysis"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <Link
                          to="/app/compare"
                          className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-blue-400"
                          title="Compare Contract"
                        >
                          <GitCompare className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(c.id, c.contract_name)}
                          className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-rose-400"
                          title="Delete"
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
        ) : (
          <div className="text-center py-12 text-xs text-slate-500">
            No contracts matching filters. Upload your first contract to begin analysis.
          </div>
        )}
      </div>
    </div>
  );
};
