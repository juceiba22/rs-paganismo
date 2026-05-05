import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface Props {
  children: React.ReactNode;
  requireApproved?: boolean;
  requireAdmin?: boolean;
}

export default function ProtectedRoute({ children, requireApproved = true, requireAdmin = false }: Props) {
  const { currentUser, appUser, loading } = useAuth();

  if (loading) {
    return (
      <div className="loader" style={{ minHeight: '100dvh' }}>
        <div className="loader-ring" />
      </div>
    );
  }

  if (!currentUser) return <Navigate to="/login" replace />;

  if (!appUser) return <Navigate to="/onboarding" replace />;

  if (requireAdmin && appUser.role !== 'admin') return <Navigate to="/" replace />;

  if (requireApproved && appUser.role === 'pending') return <Navigate to="/pending" replace />;

  return <>{children}</>;
}
