import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
// hooks
import useAuth from '../hooks/useAuth';
// routes
import { PATH_AUTH, PATH_DASHBOARD } from '../routes/paths';

// ----------------------------------------------------------------------

type OtpGuardProps = {
  children: ReactNode;
};

export default function OtpGuard({ children }: OtpGuardProps) {
  const { isAuthenticated, isOtpVerified } = useAuth();
  const pageTitle = window.location.href.split('/auth/')?.[1];

  if (isAuthenticated) {
    if (isOtpVerified) return <Navigate to={PATH_DASHBOARD.root} />;
    if (pageTitle !== 'verify') return <Navigate to={PATH_AUTH.verify} />;
  }
  if (!isAuthenticated && pageTitle === 'verify') {
    return <Navigate to={PATH_AUTH.login} />;
  }

  return <>{children}</>;
}
