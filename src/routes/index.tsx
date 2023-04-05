import { Suspense, lazy } from 'react';
import { Navigate, useRoutes, useLocation } from 'react-router-dom';
// layouts
import DirectToHomePage from 'components/DirectToHomePage';
import DashboardLayout from 'layouts/dashboard';
import LogoOnlyLayout from '../layouts/LogoOnlyLayout';
// guards
import GuestGuard from '../guards/GuestGuard';
import AuthGuard from '../guards/AuthGuard';
// components
import LoadingScreen from '../components/LoadingScreen';
// ----------------------------------------------------------------------

const Loadable = (Component: React.ElementType) => (props: any) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { pathname } = useLocation();
  const isDashboard = pathname.includes('/dashboard');

  return (
    <Suspense
      fallback={
        <LoadingScreen
          sx={{
            ...(!isDashboard && {
              top: 0,
              left: 0,
              width: 1,
              zIndex: 9999,
              position: 'fixed'
            })
          }}
        />
      }
    >
      <Component {...props} />
    </Suspense>
  );
};

export default function Router() {
  return useRoutes([
    {
      path: 'auth',
      children: [
        {
          path: 'login',
          element: (
            <GuestGuard>
              <Login />
            </GuestGuard>
          )
        },
        { path: 'reset-password', element: <ResetPassword /> },
        { path: 'update-password', element: <UpdatePassword /> },
        {
          path: 'verify',
          element: (
            <GuestGuard>
              <Verify2FA />
            </GuestGuard>
          )
        }
      ]
    },
    {
      path: '/',
      element: (
        <AuthGuard>
          <DashboardLayout />
        </AuthGuard>
      ),
      children: [
        { path: '/', element: <DirectToHomePage /> },
        {
          path: '/postgres-references',
          element: <PostgresReferenceTab />
        },
        {
          path: '/hubspot-references',
          element: <HubspotReferenceTab />
        },
        {
          path: '/search',
          element: <SearchTab />
        }
      ]
    },
    {
      path: '*',
      element: <LogoOnlyLayout />,
      children: [
        { path: '500', element: <Page500 /> },
        { path: '404', element: <NotFound /> },
        { path: '*', element: <Navigate to="/404" replace /> }
      ]
    },
    { path: '*', element: <Navigate to="/404" replace /> },
    { path: '/auth/*', element: <Navigate to="/404" replace /> }
  ]);
}

// Authentication
const Login = Loadable(lazy(() => import('../pages/authentication/Login')));
const ResetPassword = Loadable(lazy(() => import('../pages/authentication/ResetPassword')));
const UpdatePassword = Loadable(lazy(() => import('../pages/authentication/UpdatePassword')));
const Verify2FA = Loadable(lazy(() => import('../pages/authentication/Verify2FA')));

// Tabs
const PostgresReferenceTab = Loadable(
  lazy(() => import('../pages/references/PostgresReferenceTab'))
);
const HubspotReferenceTab = Loadable(lazy(() => import('../pages/references/HubspotReferenceTab')));
const SearchTab = Loadable(lazy(() => import('../pages/search/SearchTab')));

// Main
const Page500 = Loadable(lazy(() => import('../pages/Page500')));
const NotFound = Loadable(lazy(() => import('../pages/Page404')));
