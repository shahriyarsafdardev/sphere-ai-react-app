import { ReactNode } from 'react';
import useAuth from 'hooks/useAuth';
import Login from 'pages/authentication/Login';
import { Navigate } from 'react-router-dom';
import { PATH_AUTH } from 'routes/paths';

// ----------------------------------------------------------------------

type AuthGuardProps = {
  children: ReactNode;
};

export default function AuthGuard({ children }: AuthGuardProps) {
  const { isAuthenticated, isOtpVerified } = useAuth();

  if (!isAuthenticated) {
    return <Login />;
  }

  if (isAuthenticated && !isOtpVerified) {
    return <Navigate to={PATH_AUTH.verify} />;
  }

  return <>{children}</>;
}
