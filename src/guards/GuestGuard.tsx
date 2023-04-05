import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
// hooks
import useAuth from '../hooks/useAuth';
// routes
import { PATH_AUTH, PATH_DASHBOARD } from '../routes/paths';

// ----------------------------------------------------------------------

type GuestGuardProps = {
  children: ReactNode;
};

export default function GuestGuard({ children }: GuestGuardProps) {
  const { isAuthenticated, is2faVerified } = useAuth();

  if (isAuthenticated) {
    if (!is2faVerified) {
      return <Navigate to={PATH_AUTH.verify} />;
    }
    return <Navigate to={PATH_DASHBOARD.root} />;
  }

  return <>{children}</>;
}
