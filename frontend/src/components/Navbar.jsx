import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, LogOut, User as UserIcon, Database } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export const Navbar = ({ isLanding = false }) => {
  const { user, logout, seedDemoData } = useAuth();
  const navigate = useNavigate();

  const handleSeedDemo = async () => {
    try {
      await seedDemoData();
      alert('Demo contracts loaded successfully into your organization dashboard!');
      navigate('/app');
    } catch (e) {
      alert('Demo data already present or error initializing demo contracts.');
      navigate('/app');
    }
  };

  return (
    <nav className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to={user ? "/app" : "/"} className="flex items-center space-x-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <ShieldCheck className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="text-lg font-black tracking-tight text-white">Contract<span className="text-blue-400">IQ</span></span>
            <span className="hidden sm:inline-block ml-2 text-[10px] bg-blue-500/10 text-blue-400 border border-blue-500/20 px-1.5 py-0.5 rounded font-mono">B2B SaaS</span>
          </div>
        </Link>

        {/* Navigation Items */}
        <div className="flex items-center space-x-4">
          {user ? (
            <>
              <button
                onClick={handleSeedDemo}
                className="hidden md:flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 hover:bg-indigo-500/20 text-xs font-semibold transition-all"
                title="Populate 5 sample contracts (Vendor, SaaS, Employment, Service, NDA)"
              >
                <Database className="w-3.5 h-3.5" />
                <span>Load Demo Contracts</span>
              </button>

              <div className="flex items-center space-x-2 border-l border-slate-800 pl-4">
                <div className="w-8 h-8 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 font-bold text-xs">
                  {user.name ? user.name[0].toUpperCase() : 'U'}
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-xs font-semibold text-white leading-none">{user.name}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5 capitalize">{user.role}</p>
                </div>
              </div>

              <button
                onClick={logout}
                className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-all"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </>
          ) : (
            <div className="flex items-center space-x-3">
              <Link to="/login" className="text-xs font-semibold text-slate-300 hover:text-white px-3 py-2">
                Sign In
              </Link>
              <Link to="/register" className="text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-xl shadow-lg shadow-blue-500/20 transition-all">
                Start Free Trial
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};
