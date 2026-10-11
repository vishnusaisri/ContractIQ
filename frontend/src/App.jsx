import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DashboardLayout } from './layouts/DashboardLayout';
import { DashboardPage } from './pages/DashboardPage';
import { ContractsListPage } from './pages/ContractsListPage';
import { ContractDetailPage } from './pages/ContractDetailPage';
import { ContractComparePage } from './pages/ContractComparePage';
import { SearchQAContractPage } from './pages/SearchQAContractPage';
import { ObligationsPage } from './pages/ObligationsPage';
import { CalendarPage } from './pages/CalendarPage';
import { AlertsPage } from './pages/AlertsPage';
import { SettingsPage } from './pages/SettingsPage';
import { FileUploader } from './components/FileUploader';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

export function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Marketing & Auth Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected Organization SaaS Routes */}
          <Route
            path="/app"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<DashboardPage />} />
            <Route path="contracts" element={<ContractsListPage />} />
            <Route path="contracts/:id" element={<ContractDetailPage />} />
            <Route path="upload" element={<div className="max-w-xl mx-auto py-8"><FileUploader onUploadSuccess={(data) => window.location.href = `/app/contracts/${data.id}`} /></div>} />
            <Route path="compare" element={<ContractComparePage />} />
            <Route path="search" element={<SearchQAContractPage />} />
            <Route path="obligations" element={<ObligationsPage />} />
            <Route path="calendar" element={<CalendarPage />} />
            <Route path="alerts" element={<AlertsPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>

          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
