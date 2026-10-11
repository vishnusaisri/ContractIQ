import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, LogIn, Sparkles, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/app');
    } catch (err) {
      setError(err.response?.data?.detail || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoSignIn = async () => {
    setLoading(true);
    setError('');
    try {
      // Auto register a demo owner user if doesn't exist
      const demoEmail = `demo.user.${Date.now()}@contractiq-sample.com`;
      await register("Demo Executive", "ContractIQ Demo Org", demoEmail, "DemoPass123!", "Technology");
      navigate('/app');
    } catch (err) {
      setError('Demo authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-xl shadow-blue-500/20 mx-auto mb-3">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Sign In to ContractIQ</h2>
          <p className="text-xs text-slate-400 mt-1">Enter your credentials to access your organization workspace.</p>
        </div>

        {/* Demo Fast Track Button */}
        <button
          onClick={handleDemoSignIn}
          disabled={loading}
          className="w-full mb-6 p-3.5 rounded-xl bg-gradient-to-r from-blue-900/40 via-indigo-900/40 to-slate-900 border border-blue-500/30 text-blue-300 hover:border-blue-400 text-xs font-bold flex items-center justify-center space-x-2 transition-all shadow-lg"
        >
          <Sparkles className="w-4 h-4 text-blue-400" />
          <span>Instant Demo Access (Skip Form & Auto-Create Workspace)</span>
        </button>

        <div className="glass-card rounded-2xl p-6 border border-slate-800 shadow-2xl">
          {error && (
            <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs text-rose-300 flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Work Email</label>
              <input
                type="email"
                required
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Password</label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center space-x-2"
            >
              <LogIn className="w-4 h-4" />
              <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-slate-400">
            Don't have an organization account?{' '}
            <Link to="/register" className="text-blue-400 hover:underline font-semibold">
              Create Free Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
