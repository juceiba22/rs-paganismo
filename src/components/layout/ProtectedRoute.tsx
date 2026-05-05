import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface Props {
  children: React.ReactNode;
  requireApproved?: boolean;
}

export default function ProtectedRoute({
  children,
  requireApproved = true,
}: Props) {
  const { currentUser, appUser, loading, isApproved } = useAuth();

  // 🧠 1. Esperar carga REAL
  if (loading || appUser === undefined) {
    return <div>Cargando...</div>;
  }

  // 🚪 2. No logeado
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  // 🧩 3. Usuario sin doc → onboarding
  if (appUser === null) {
    return <Navigate to="/onboarding" replace />;
  }

  // ⛔ 4. No aprobado
  if (requireApproved && !isApproved) {
    return <Navigate to="/pending" replace />;
  }

  // ✅ 5. OK
  return <>{children}</>;
}