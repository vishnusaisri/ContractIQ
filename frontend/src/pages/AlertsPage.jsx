import React, { useState, useEffect } from 'react';
import { Bell, CheckCircle2, ShieldAlert, Clock, RefreshCw } from 'lucide-react';
import api from '../services/api';

export const AlertsPage = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAlerts = () => {
    setLoading(true);
    api.get('/alerts')
      .then((res) => setAlerts(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  const handleMarkRead = async (id) => {
    try {
      const res = await api.patch(`/alerts/${id}`, { status: 'read' });
      setAlerts(alerts.map((a) => (a.id === id ? res.data : a)));
    } catch (err) {
      alert('Failed to update alert.');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-white tracking-tight">Organization Alerts Center</h1>
        <p className="text-xs text-slate-400 mt-1">Automated alerts for notice deadlines, high risk clauses, and overdue obligations.</p>
      </div>

      <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
        {loading ? (
          <div className="flex items-center justify-center h-48 text-xs text-slate-400">
            <RefreshCw className="w-4 h-4 animate-spin mr-2 text-blue-400" />
            Loading alerts...
          </div>
        ) : alerts.length > 0 ? (
          <div className="space-y-3">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className={`p-4 rounded-xl border transition-all flex items-start justify-between ${
                  alert.status === 'unread'
                    ? 'bg-slate-900 border-blue-500/30'
                    : 'bg-slate-950/60 border-slate-800 opacity-75'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className={`p-2 rounded-lg shrink-0 mt-0.5 ${
                    alert.alert_type === 'high_risk' ? 'bg-rose-500/10 text-rose-400' : 'bg-amber-500/10 text-amber-400'
                  }`}>
                    {alert.alert_type === 'high_risk' ? <ShieldAlert className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-xs font-bold text-white capitalize">{alert.alert_type.replace('_', ' ')}</span>
                      <span className="text-[10px] font-mono text-slate-500">{alert.alert_date}</span>
                    </div>
                    <p className="text-xs text-slate-300">{alert.message}</p>
                  </div>
                </div>

                {alert.status === 'unread' && (
                  <button
                    onClick={() => handleMarkRead(alert.id)}
                    className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-300 rounded-lg shrink-0 ml-4"
                  >
                    Mark Read
                  </button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-xs text-slate-500">
            No active alerts in your organization.
          </div>
        )}
      </div>
    </div>
  );
};
