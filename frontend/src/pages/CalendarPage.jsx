import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, AlertTriangle, ArrowUpRight, RefreshCw } from 'lucide-react';
import api from '../services/api';
import { RiskBadge } from '../components/StatusBadge';

export const CalendarPage = () => {
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/contracts')
      .then((res) => setContracts(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const timelineEvents = contracts
    .filter((c) => c.renewal_date || c.end_date)
    .map((c) => ({
      id: c.id,
      name: c.contract_name,
      type: c.contract_type,
      date: c.renewal_date || c.end_date,
      renewal_type: c.renewal_type,
      notice_days: c.notice_period_days || 30,
      risk_level: c.risk_level,
      risk_score: c.risk_score
    }))
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-white tracking-tight">Renewal & Expiration Calendar</h1>
        <p className="text-xs text-slate-400 mt-1">Timeline of upcoming contract expiration dates, auto-renewal deadlines, and notice windows.</p>
      </div>

      <div className="glass-card p-6 rounded-2xl border border-slate-800">
        <h3 className="text-sm font-bold text-white mb-6 flex items-center">
          <Calendar className="w-4 h-4 text-blue-400 mr-2" />
          Chronological Expiration & Renewal Timeline
        </h3>

        {loading ? (
          <div className="flex items-center justify-center h-48 text-xs text-slate-400">
            <RefreshCw className="w-4 h-4 animate-spin mr-2 text-blue-400" />
            Loading timeline...
          </div>
        ) : timelineEvents.length > 0 ? (
          <div className="relative border-l-2 border-slate-800 ml-4 pl-6 space-y-8">
            {timelineEvents.map((evt) => (
              <div key={evt.id} className="relative group">
                <span className={`absolute -left-[31px] top-1 w-3.5 h-3.5 rounded-full border-2 border-slate-950 ${
                  evt.risk_level === 'CRITICAL' || evt.risk_level === 'HIGH' ? 'bg-rose-500 animate-pulse' : 'bg-blue-500'
                }`} />

                <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 hover:border-blue-500/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <Link to={`/app/contracts/${evt.id}`} className="text-sm font-bold text-white hover:text-blue-400">
                        {evt.name}
                      </Link>
                      <RiskBadge level={evt.risk_level} score={evt.risk_score} />
                    </div>
                    <p className="text-xs text-slate-400">{evt.type} • Requires {evt.notice_days} days notice for cancellation</p>
                  </div>

                  <div className="flex items-center space-x-4 shrink-0">
                    <div className="text-right">
                      <span className="text-xs font-mono font-bold text-amber-400 block">{evt.date}</span>
                      <span className="text-[10px] text-slate-500 uppercase font-semibold">Renewal Target</span>
                    </div>

                    <Link to={`/app/contracts/${evt.id}`} className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg">
                      <ArrowUpRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-xs text-slate-500">
            No tracked contract timeline dates found.
          </div>
        )}
      </div>
    </div>
  );
};
