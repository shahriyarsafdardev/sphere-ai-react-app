import { Suspense, lazy } from 'react';
import { Navigate, useRoutes, useLocation } from 'react-router-dom';
// layouts
import LogoOnlyLayout from '../layouts/LogoOnlyLayout';
import MainLayout from '../layouts/MainLayout';
// guards
import GuestGuard from '../guards/GuestGuard';
import AuthGuard from '../guards/AuthGuard';
import RoleBasedGuard from '../guards/RoleBasedGuard';
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
  const customerRoles = ['customer', 'admin'];
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
        { path: 'verify', element: <VerifyCode /> }
      ]
    },
    // {
    //   path: '/',
    //   element: <MainLayout />,
    //   children: [
    //     // { path: '/', element: <RedirectToCohort /> },
    //     { path: '/postgres-references', element: <PostgresReferenceTab /> },
    //     { path: '/hubspot-references', element: <HubspotReferenceTab /> }
    //   ]
    // },
    {
      path: '/',
      element: (
        <AuthGuard>
          <MainLayout />
        </AuthGuard>
      ),
      children: [
        {
          path: '/',
          element: (
            <AuthGuard>
              <PostgresReferenceTab />
            </AuthGuard>
          )
        },
        {
          path: '/postgres-references',
          element: (
            <AuthGuard>
              <PostgresReferenceTab />
            </AuthGuard>
          )
        },
        {
          path: '/hubspot-references',
          element: (
            <AuthGuard>
              <PostgresReferenceTab />
            </AuthGuard>
          )
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
const VerifyCode = Loadable(lazy(() => import('../pages/authentication/VerifyCode')));

// References
const PostgresReferenceTab = Loadable(
  lazy(() => import('../pages/references/PostgresReferenceTab'))
);
const HubspotReferenceTab = Loadable(lazy(() => import('../pages/references/HubspotReferenceTab')));

// Main
const Page500 = Loadable(lazy(() => import('../pages/Page500')));
const NotFound = Loadable(lazy(() => import('../pages/Page404')));
