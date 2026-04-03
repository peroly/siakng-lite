'use client';

import { useAuth } from '@/app/context/AuthContext';
import { DosenDashboard } from '@/app/components/DosenDashboard';
import { MahasiswaDashboard } from '@/app/components/MahasiswaDashboard';
import { ProtectedRoute } from '@/app/components/ProtectedRoute';

export default function DashboardPage() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      {user?.role === 'dosen' ? (
        <DosenDashboard />
      ) : (
        <MahasiswaDashboard />
      )}
    </ProtectedRoute>
  );
}
