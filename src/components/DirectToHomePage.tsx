import useAuth from 'hooks/useAuth';
import { Navigate } from 'react-router-dom';

export default function DirectToHomePage() {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/postgres-references" replace />;
  }
  return <Navigate to="auth/login" replace />;
}
