import { ReactNode } from 'react';
import useAuth from 'hooks/useAuth';
import Login from 'pages/authentication/Login';

// ----------------------------------------------------------------------

type AuthGuardProps = {
  children: ReactNode;
};

export default function AuthGuard({ children }: AuthGuardProps) {
  const { isAuthenticated, isLoggedIn } = useAuth();

  if (!isLoggedIn || !isAuthenticated) {
    return <Login />;
  }

  return <>{children}</>;
}
