import React, { useState, useEffect } from 'react';
import { Building2, Users, UserPlus, Trash2, ShieldCheck, CheckCircle2 } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { Modal } from '../components/Modal';

export const SettingsPage = () => {
  const { user } = useAuth();
  const [org, setOrg] = useState(null);
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);

  // Invite Modal
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [inviteName, setInviteName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('legal');

  const fetchSettings = () => {
    setLoading(true);
    Promise.all([
      api.get('/organizations/me'),
      api.get('/organizations/users')
    ])
      .then(([orgRes, usersRes]) => {
        setOrg(orgRes.data);
        setTeam(usersRes.data);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleInviteSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/organizations/users/invite', {
        name: inviteName,
        email: inviteEmail,
        role: inviteRole
      });
      setTeam([...team, res.data]);
      setIsInviteOpen(false);
      setInviteName('');
      setInviteEmail('');
      alert(`Invitation created for ${inviteEmail}!`);
    } catch (err) {
      alert(err.response?.data?.detail || 'Failed to invite user.');
    }
  };

  const handleRemoveUser = async (userId, userName) => {
    if (window.confirm(`Remove ${userName} from organization?`)) {
      try {
        await api.delete(`/organizations/users/${userId}`);
        setTeam(team.filter((u) => u.id !== userId));
      } catch (err) {
        alert(err.response?.data?.detail || 'Failed to remove user.');
      }
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-black text-white tracking-tight">Organization & Team Settings</h1>
        <p className="text-xs text-slate-400 mt-1">Manage company profile, multi-user role access, and risk policy preferences.</p>
      </div>

      {/* Company Profile */}
      <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center">
          <Building2 className="w-4 h-4 text-blue-400 mr-2" />
          Company Profile
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Company Name</span>
            <span className="text-sm font-bold text-white">{org?.name || 'My Organization'}</span>
          </div>

          <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Industry Sector</span>
            <span className="text-sm font-bold text-blue-400">{org?.industry || 'Technology'}</span>
          </div>

          <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Subscription Plan</span>
            <span className="text-sm font-bold text-emerald-400">{org?.plan || 'Starter Tier'}</span>
          </div>
        </div>
      </div>

      {/* Team Management */}
      <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center">
              <Users className="w-4 h-4 text-blue-400 mr-2" />
              Team Members & Role Access Control
            </h3>
            <p className="text-xs text-slate-400">Roles: Owner, Admin, Legal, Manager, Member, Viewer.</p>
          </div>

          {user?.role === 'owner' || user?.role === 'admin' ? (
            <button
              onClick={() => setIsInviteOpen(true)}
              className="px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl flex items-center space-x-1.5 transition-all"
            >
              <UserPlus className="w-4 h-4" />
              <span>Invite Team Member</span>
            </button>
          ) : null}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px]">
                <th className="pb-3 font-semibold">User</th>
                <th className="pb-3 font-semibold">Email</th>
                <th className="pb-3 font-semibold">Role</th>
                <th className="pb-3 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {team.map((m) => (
                <tr key={m.id} className="hover:bg-slate-900/40">
                  <td className="py-3 font-bold text-white">{m.name}</td>
                  <td className="py-3 text-slate-300 font-mono">{m.email}</td>
                  <td className="py-3">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-blue-500/10 text-blue-400 border border-blue-500/20">
                      {m.role}
                    </span>
                  </td>
                  <td className="py-3 text-right">
                    {m.id !== user?.id && (user?.role === 'owner' || user?.role === 'admin') ? (
                      <button
                        onClick={() => handleRemoveUser(m.id, m.name)}
                        className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-rose-400"
                        title="Remove Member"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    ) : (
                      <span className="text-[10px] text-slate-500 italic">Self</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invite Modal */}
      <Modal isOpen={isInviteOpen} onClose={() => setIsInviteOpen(false)} title="Invite Team Member">
        <form onSubmit={handleInviteSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
            <input
              type="text"
              required
              value={inviteName}
              onChange={(e) => setInviteName(e.target.value)}
              placeholder="e.g. David Vance"
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
            <input
              type="email"
              required
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              placeholder="d.vance@company.com"
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Role Permissions</label>
            <select
              value={inviteRole}
              onChange={(e) => setInviteRole(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
            >
              <option value="legal">Legal Department (Full Review Access)</option>
              <option value="manager">Manager (Upload & Review)</option>
              <option value="admin">Administrator (Full Admin Access)</option>
              <option value="member">Standard Member</option>
              <option value="viewer">Viewer (Read-Only)</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-500/25 transition-all"
          >
            Send Member Invite
          </button>
        </form>
      </Modal>
    </div>
  );
};
