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

  // 1. Esperar carga REAL
  if (loading || appUser === undefined) {
    return <div>Cargando...</div>;
  }

  // 2. No logeado → login
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  // 3. Si la ruta NO requiere aprobación (onboarding, pending)
  //    dejar pasar siempre que el usuario esté autenticado
  if (!requireApproved) {
    return <>{children}</>;
  }

  // 4. Usuario sin doc de Firestore → onboarding
  if (appUser === null) {
    return <Navigate to="/onboarding" replace />;
  }

  // 5. Usuario con nombre vacío → onboarding
  if (!appUser.name) {
    return <Navigate to="/onboarding" replace />;
  }

  // 6. No aprobado → pending
  if (!isApproved) {
    return <Navigate to="/pending" replace />;
  }

  // 7. OK
  return <>{children}</>;
}
