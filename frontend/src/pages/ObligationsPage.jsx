import React, { useState, useEffect } from 'react';
import { CheckSquare, Filter, CheckCircle2, Clock, RefreshCw } from 'lucide-react';
import api from '../services/api';

export const ObligationsPage = () => {
  const [obligations, setObligations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');

  const fetchObligations = () => {
    setLoading(true);
    let url = '/obligations';
    if (statusFilter) url += `?status_filter=${statusFilter}`;
    api.get(url)
      .then((res) => setObligations(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchObligations();
  }, [statusFilter]);

  const handleStatusToggle = async (id, currentStatus) => {
    const nextStatus = currentStatus === 'Completed' ? 'Pending' : 'Completed';
    try {
      const res = await api.patch(`/obligations/${id}`, { status: nextStatus });
      setObligations(obligations.map((ob) => (ob.id === id ? res.data : ob)));
    } catch (err) {
      alert('Failed to update obligation status.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Contractual Obligations</h1>
          <p className="text-xs text-slate-400 mt-1">Track compliance deadlines, party commitments, and operational deliverables.</p>
        </div>

        <div className="flex items-center space-x-2">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
          >
            <option value="">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
            <option value="Overdue">Overdue</option>
          </select>
        </div>
      </div>

      <div className="glass-card rounded-2xl border border-slate-800 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-48 text-xs text-slate-400">
            <RefreshCw className="w-4 h-4 animate-spin mr-2 text-blue-400" />
            Loading obligations...
          </div>
        ) : obligations.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px] bg-slate-900/50">
                  <th className="py-3.5 px-4 font-semibold">Contract</th>
                  <th className="py-3.5 px-4 font-semibold">Obligation Description</th>
                  <th className="py-3.5 px-4 font-semibold">Responsible Party</th>
                  <th className="py-3.5 px-4 font-semibold">Due Date</th>
                  <th className="py-3.5 px-4 font-semibold">Priority</th>
                  <th className="py-3.5 px-4 font-semibold">Status</th>
                  <th className="py-3.5 px-4 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {obligations.map((ob) => (
                  <tr key={ob.id} className="hover:bg-slate-900/40">
                    <td className="py-3.5 px-4 font-semibold text-white">{ob.contract_name}</td>
                    <td className="py-3.5 px-4 max-w-xs">{ob.description}</td>
                    <td className="py-3.5 px-4 text-slate-300 font-medium">{ob.responsible_party}</td>
                    <td className="py-3.5 px-4 font-mono text-amber-400">{ob.due_date || 'Ongoing'}</td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        ob.priority === 'Critical' ? 'bg-rose-500/10 text-rose-400' :
                        ob.priority === 'High' ? 'bg-amber-500/10 text-amber-400' : 'bg-slate-800 text-slate-300'
                      }`}>
                        {ob.priority}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                        ob.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' :
                        ob.status === 'Overdue' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30' : 'bg-blue-500/10 text-blue-400 border border-blue-500/30'
                      }`}>
                        {ob.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleStatusToggle(ob.id, ob.status)}
                        className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                          ob.status === 'Completed'
                            ? 'bg-slate-800 text-slate-400 hover:text-white'
                            : 'bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/30 border border-emerald-500/30'
                        }`}
                      >
                        {ob.status === 'Completed' ? 'Mark Pending' : 'Mark Complete'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12 text-xs text-slate-500">
            No active obligations found.
          </div>
        )}
      </div>
    </div>
  );
};
