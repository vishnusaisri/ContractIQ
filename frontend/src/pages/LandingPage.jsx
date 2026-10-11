import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  Zap,
  Clock,
  AlertTriangle,
  FileCheck,
  BarChart3,
  Search,
  Lock,
  Building2,
  CheckCircle,
  ChevronRight,
  ArrowRight
} from 'lucide-react';
import { Navbar } from '../components/Navbar';

export const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-blue-500 selection:text-white">
      <Navbar isLanding={true} />

      {/* Hero Section */}
      <section className="relative pt-20 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center overflow-hidden">
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-blue-600/20 blur-[120px] rounded-full pointer-events-none" />

        <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold mb-6">
          <Zap className="w-3.5 h-3.5" />
          <span>Next-Gen Enterprise Contract Intelligence SaaS</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white mb-6 max-w-4xl mx-auto leading-tight">
          Contract Intelligence, <br />
          <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-sky-400 bg-clip-text text-transparent">
            Without the Manual Work
          </span>
        </h1>

        <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto mb-8 leading-relaxed">
          Upload your contracts. ContractIQ automatically extracts important terms, detects risks, tracks obligations, and alerts your team before critical deadlines.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <Link
            to="/register"
            className="w-full sm:w-auto px-8 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm rounded-xl shadow-xl shadow-blue-500/25 flex items-center justify-center space-x-2 transition-all"
          >
            <span>Start Free Trial</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <button
            onClick={() => navigate('/login')}
            className="w-full sm:w-auto px-8 py-3.5 bg-slate-900 hover:bg-slate-800 text-slate-200 font-semibold text-sm rounded-xl border border-slate-800 transition-all"
          >
            Book a Product Demo
          </button>
        </div>

        {/* Hero Interactive Preview Card */}
        <div className="glass-card rounded-2xl p-6 sm:p-8 max-w-5xl mx-auto border border-slate-800 text-left shadow-2xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 rounded-full bg-rose-500" />
              <div className="w-3 h-3 rounded-full bg-amber-500" />
              <div className="w-3 h-3 rounded-full bg-emerald-500" />
              <span className="text-xs text-slate-400 font-mono ml-2">Acme_Cloud_Infrastructure_MSA.pdf</span>
            </div>
            <span className="text-xs font-bold text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2.5 py-1 rounded-full">
              Risk Score: 75 / 100 (HIGH)
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Contract Type</span>
              <span className="text-sm font-semibold text-white">Master Services Agreement</span>
            </div>
            <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Auto-Renewal Deadline</span>
              <span className="text-sm font-semibold text-amber-400">Notice due in 32 days</span>
            </div>
            <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Contract Value</span>
              <span className="text-sm font-semibold text-emerald-400">₹15,000,000.00</span>
            </div>
          </div>
        </div>
      </section>

      {/* Problem & Solution */}
      <section className="py-16 bg-slate-900/50 border-y border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">Why Modern Businesses Need ContractIQ</h2>
            <p className="text-sm text-slate-400">
              Companies lose millions every year due to missed auto-renewal deadlines, unmanaged liability clauses, and lost obligation tracking.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="glass-card p-6 rounded-2xl border border-rose-500/20">
              <h3 className="text-lg font-bold text-rose-400 mb-4 flex items-center">
                <AlertTriangle className="w-5 h-5 mr-2" />
                The Problem
              </h3>
              <ul className="space-y-3 text-xs text-slate-300">
                <li className="flex items-start">❌ Manual contract reviews take 10+ hours per agreement.</li>
                <li className="flex items-start">❌ Auto-renewal clauses lock companies into unwanted multi-year renewals.</li>
                <li className="flex items-start">❌ Hidden unlimited liability and broad indemnity clauses expose firm to extreme legal risk.</li>
                <li className="flex items-start">❌ Key obligations are buried in 50-page PDFs with zero tracking.</li>
              </ul>
            </div>

            <div className="glass-card p-6 rounded-2xl border border-emerald-500/20">
              <h3 className="text-lg font-bold text-emerald-400 mb-4 flex items-center">
                <CheckCircle className="w-5 h-5 mr-2" />
                The ContractIQ Solution
              </h3>
              <ul className="space-y-3 text-xs text-slate-300">
                <li className="flex items-start">✅ Instant AI extraction of parties, dates, values, and clauses in seconds.</li>
                <li className="flex items-start">✅ Automated notice deadline calendar and alert triggers.</li>
                <li className="flex items-start">✅ Transparent, rule-based deterministic risk engine (+25 Unlimited liability breakdown).</li>
                <li className="flex items-start">✅ Side-by-side contract comparison and natural language Q&A search.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Industries */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold text-white mb-2">Built for Modern Organizations</h2>
          <p className="text-xs text-slate-400">Trusted across IT, SMEs, Healthcare, Logistics, Real Estate, and Legal Departments.</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {['IT & SaaS', 'SMEs & Startups', 'Logistics & Supply', 'Legal & Procurement', 'Healthcare', 'Real Estate', 'Manufacturing', 'Consulting & CA'].map((ind) => (
            <div key={ind} className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 text-center">
              <Building2 className="w-5 h-5 text-blue-400 mx-auto mb-2" />
              <span className="text-xs font-semibold text-slate-200">{ind}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing Tiers */}
      <section className="py-16 bg-slate-900/50 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl font-bold text-white mb-2">Simple, Configurable Pricing</h2>
            <p className="text-xs text-slate-400">Scale contract intelligence as your company grows.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glass-card p-6 rounded-2xl border border-slate-800">
              <h3 className="text-base font-bold text-white mb-1">Starter</h3>
              <p className="text-2xl font-extrabold text-blue-400 mb-4">₹2,999 <span className="text-xs text-slate-400 font-normal">/ month</span></p>
              <ul className="text-xs text-slate-300 space-y-2 mb-6">
                <li>• Up to 25 Contracts</li>
                <li>• Standard AI Analysis</li>
                <li>• Deterministic Risk Engine</li>
                <li>• Basic Alert Center</li>
              </ul>
              <Link to="/register" className="block text-center py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-xl">Choose Starter</Link>
            </div>

            <div className="glass-card p-6 rounded-2xl border-2 border-blue-500 relative">
              <span className="absolute -top-3 right-4 bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">POPULAR</span>
              <h3 className="text-base font-bold text-white mb-1">Growth</h3>
              <p className="text-2xl font-extrabold text-blue-400 mb-4">₹7,999 <span className="text-xs text-slate-400 font-normal">/ month</span></p>
              <ul className="text-xs text-slate-300 space-y-2 mb-6">
                <li>• Up to 100 Contracts</li>
                <li>• Contract Comparison Engine</li>
                <li>• Ask ContractIQ (Q&A Search)</li>
                <li>• Obligation Calendar</li>
              </ul>
              <Link to="/register" className="block text-center py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl">Choose Growth</Link>
            </div>

            <div className="glass-card p-6 rounded-2xl border border-slate-800">
              <h3 className="text-base font-bold text-white mb-1">Business</h3>
              <p className="text-2xl font-extrabold text-blue-400 mb-4">₹14,999 <span className="text-xs text-slate-400 font-normal">/ month</span></p>
              <ul className="text-xs text-slate-300 space-y-2 mb-6">
                <li>• Unlimited Contracts</li>
                <li>• Multi-User Team Roles</li>
                <li>• Custom Risk Rule Policies</li>
                <li>• Dedicated Onboarding</li>
              </ul>
              <Link to="/register" className="block text-center py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-xl">Contact Sales</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-8 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between">
          <p>© 2026 ContractIQ Inc. All rights reserved.</p>
          <p className="mt-2 sm:mt-0 text-[11px]">Human-Review Disclaimer: ContractIQ provides decision support and extraction tools for informational purposes.</p>
        </div>
      </footer>
    </div>
  );
};
