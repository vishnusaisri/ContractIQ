import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  AlertTriangle,
  Clock,
  CheckSquare,
  RefreshCw,
  ShieldAlert,
  ArrowUpRight,
  Database,
  Plus,
  ChevronRight
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import api from '../services/api';
import { RiskBadge } from '../components/StatusBadge';
import { useAuth } from '../contexts/AuthContext';

export const DashboardPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { seedDemoData } = useAuth();

  const fetchDashboardData = () => {
    setLoading(true);
    api.get('/dashboard')
      .then((res) => setData(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleSeed = async () => {
    await seedDemoData();
    fetchDashboardData();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-xs text-slate-400">
        <RefreshCw className="w-5 h-5 animate-spin mr-2 text-blue-400" />
        Loading Organization Dashboard...
      </div>
    );
  }

  const kpi = data?.kpi || {
    total_contracts: 0,
    active_contracts: 0,
    expiring_soon: 0,
    high_risk: 0,
    pending_obligations: 0,
    auto_renewals: 0
  };

  const chartData = [
    { name: 'Low', value: data?.risk_distribution?.LOW || 0, color: '#10b981' },
    { name: 'Medium', value: data?.risk_distribution?.MEDIUM || 0, color: '#f59e0b' },
    { name: 'High', value: data?.risk_distribution?.HIGH || 0, color: '#ef4444' },
    { name: 'Critical', value: data?.risk_distribution?.CRITICAL || 0, color: '#991b1b' },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Contract Intelligence Dashboard</h1>
          <p className="text-xs text-slate-400 mt-1">Real-time risk scoring, renewal deadlines, and obligation management.</p>
        </div>

        <div className="flex items-center space-x-3">
          {kpi.total_contracts === 0 && (
            <button
              onClick={handleSeed}
              className="px-3.5 py-2 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 text-xs font-semibold rounded-xl flex items-center space-x-1.5 transition-all"
            >
              <Database className="w-4 h-4" />
              <span>Load 5 Demo Contracts</span>
            </button>
          )}

          <Link
            to="/app/upload"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-blue-500/20 flex items-center space-x-2 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Upload Contract</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        <div className="glass-card p-4 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Total</span>
            <FileText className="w-4 h-4 text-blue-400" />
          </div>
          <p className="text-2xl font-extrabold text-white">{kpi.total_contracts}</p>
          <span className="text-[10px] text-slate-500">Tracked Documents</span>
        </div>

        <div className="glass-card p-4 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Active</span>
            <CheckSquare className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-extrabold text-emerald-400">{kpi.active_contracts}</p>
          <span className="text-[10px] text-slate-500">In-Force Agreements</span>
        </div>

        <div className="glass-card p-4 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Expiring Soon</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl font-extrabold text-amber-400">{kpi.expiring_soon}</p>
          <span className="text-[10px] text-slate-500">Next 90 Days</span>
        </div>

        <div className="glass-card p-4 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider">High Risk</span>
            <AlertTriangle className="w-4 h-4 text-rose-400" />
          </div>
          <p className="text-2xl font-extrabold text-rose-400">{kpi.high_risk}</p>
          <span className="text-[10px] text-slate-500">Score ≥ 50/100</span>
        </div>

        <div className="glass-card p-4 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Obligations</span>
            <CheckSquare className="w-4 h-4 text-purple-400" />
          </div>
          <p className="text-2xl font-extrabold text-purple-400">{kpi.pending_obligations}</p>
          <span className="text-[10px] text-slate-500">Pending Actions</span>
        </div>

        <div className="glass-card p-4 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Auto-Renewals</span>
            <RefreshCw className="w-4 h-4 text-sky-400" />
          </div>
          <p className="text-2xl font-extrabold text-sky-400">{kpi.auto_renewals}</p>
          <span className="text-[10px] text-slate-500">Active Notice Flags</span>
        </div>
      </div>

      {/* Main Grid: Upcoming Renewals & Risk Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Upcoming Renewals Table */}
        <div className="lg:col-span-2 glass-card rounded-2xl p-6 border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white">Upcoming Renewals & Deadlines</h3>
              <p className="text-[11px] text-slate-400">Contracts requiring notice decisions before auto-renewal dates.</p>
            </div>
            <Link to="/app/calendar" className="text-xs text-blue-400 hover:underline flex items-center font-semibold">
              <span>View Calendar</span>
              <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
            </Link>
          </div>

          {data?.upcoming_renewals?.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 text-[10px] uppercase tracking-wider">
                    <th className="pb-3 font-semibold">Contract</th>
                    <th className="pb-3 font-semibold">Renewal Date</th>
                    <th className="pb-3 font-semibold">Notice Deadline</th>
                    <th className="pb-3 font-semibold">Risk Level</th>
                    <th className="pb-3 font-semibold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  {data.upcoming_renewals.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-900/40">
                      <td className="py-3 font-medium text-white">
                        <Link to={`/app/contracts/${item.id}`} className="hover:text-blue-400">
                          {item.contract_name}
                        </Link>
                        <span className="block text-[10px] text-slate-500">{item.contract_type}</span>
                      </td>
                      <td className="py-3 font-mono text-slate-300">{item.renewal_date}</td>
                      <td className="py-3 font-mono text-amber-400 font-semibold">{item.notice_deadline}</td>
                      <td className="py-3">
                        <RiskBadge level={item.risk_level} score={item.risk_score} />
                      </td>
                      <td className="py-3 text-right">
                        <Link to={`/app/contracts/${item.id}`} className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white inline-block">
                          <ArrowUpRight className="w-4 h-4" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-xs text-slate-500">
              No upcoming renewals detected. Upload contracts to track deadlines.
            </div>
          )}
        </div>

        {/* Risk Distribution Chart */}
        <div className="glass-card rounded-2xl p-6 border border-slate-800 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-white mb-1">Risk Level Distribution</h3>
            <p className="text-[11px] text-slate-400 mb-4">Portfolio breakdown across risk categories.</p>

            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 border-t border-slate-800 pt-4 text-xs">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span className="text-slate-400">Low ({data?.risk_distribution?.LOW || 0})</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <span className="text-slate-400">Medium ({data?.risk_distribution?.MEDIUM || 0})</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              <span className="text-slate-400">High ({data?.risk_distribution?.HIGH || 0})</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-700" />
              <span className="text-slate-400">Critical ({data?.risk_distribution?.CRITICAL || 0})</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Center & Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass-card rounded-2xl p-6 border border-slate-800">
          <h3 className="text-sm font-bold text-white mb-1 flex items-center">
            <ShieldAlert className="w-4 h-4 text-rose-400 mr-2" />
            Action Center
          </h3>
          <p className="text-[11px] text-slate-400 mb-4">Contracts needing legal review or urgent decision.</p>

          {data?.action_center?.length > 0 ? (
            <div className="space-y-3">
              {data.action_center.map((act, idx) => (
                <div key={idx} className="p-3 bg-slate-900/70 rounded-xl border border-slate-800 flex items-start justify-between">
                  <div>
                    <span className="text-xs font-semibold text-rose-300 block">{act.title}</span>
                    <p className="text-[11px] text-slate-400 mt-0.5">{act.description}</p>
                  </div>
                  <Link
                    to={`/app/contracts/${act.contract_id}`}
                    className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 rounded-lg shrink-0 ml-3"
                  >
                    Review
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-500 text-center py-6">No urgent action items pending.</p>
          )}
        </div>

        <div className="glass-card rounded-2xl p-6 border border-slate-800">
          <h3 className="text-sm font-bold text-white mb-1">Contract Activity Feed</h3>
          <p className="text-[11px] text-slate-400 mb-4">Recent document processing, updates, and system alerts.</p>

          {data?.activity_feed?.length > 0 ? (
            <div className="space-y-3">
              {data.activity_feed.map((act) => (
                <div key={act.id} className="p-3 bg-slate-900/50 rounded-xl border border-slate-800/80 text-xs flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-slate-200 block">{act.title}</span>
                    <p className="text-[11px] text-slate-400">{act.message}</p>
                  </div>
                  <span className="text-[10px] text-slate-500 shrink-0 font-mono ml-2">{act.date}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-500 text-center py-6">No recent activity logged.</p>
          )}
        </div>
      </div>
    </div>
  );
};
