import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Sidebar } from '../components/Sidebar';
import { DisclaimerBanner } from '../components/DisclaimerBanner';

export const DashboardLayout = () => {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6 md:p-8 overflow-y-auto max-w-7xl mx-auto w-full">
          <DisclaimerBanner />
          <Outlet />
        </main>
      </div>
    </div>
  );
};
