import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import AppShell from '../components/layout/AppShell';
import { Skeleton } from '../components/ui/Skeleton';

const LoginPage = lazy(() => import('../features/auth/LoginPage'));
const SignupPage = lazy(() => import('../features/auth/SignupPage'));
const DashboardPage = lazy(() => import('../pages/DashboardPage'));
const BoardPage = lazy(() => import('../pages/BoardPage'));
const AnalyticsPage = lazy(() => import('../pages/AnalyticsPage'));
const SettingsPage = lazy(() => import('../pages/SettingsPage'));
const WorkspacePage = lazy(() => import('../pages/WorkspacePage'));
const NotFoundPage = lazy(() => import('../pages/NotFoundPage'));

const PageSkeleton = () => (
  <div className="p-6 space-y-4 w-full max-w-7xl mx-auto">
    <Skeleton className="h-8 w-1/4" />
    <Skeleton className="h-4 w-1/3" />
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
      <Skeleton className="h-32 rounded-xl" />
      <Skeleton className="h-32 rounded-xl" />
      <Skeleton className="h-32 rounded-xl" />
    </div>
    <div className="pt-6">
      <Skeleton className="h-96 rounded-xl" />
    </div>
  </div>
);

export default function AppRouter() {
  return (
    <Suspense fallback={<div className="h-screen w-screen flex items-center justify-center bg-surface-light dark:bg-surface-dark"><PageSkeleton /></div>}>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        <Route path="/app" element={<ProtectedRoute><AppShell /></ProtectedRoute>}>
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="board/:boardId" element={<BoardPage />} />
          <Route path="analytics" element={<AnalyticsPage />} />
          <Route path="workspace" element={<WorkspacePage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
        
        {/* Redirect root dashboard to app/dashboard */}
        <Route path="/dashboard" element={<Navigate to="/app/dashboard" replace />} />

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
}
