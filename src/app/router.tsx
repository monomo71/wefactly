import { Navigate, createBrowserRouter } from 'react-router-dom';
import { RequireAuth } from '@/app/guards/require-auth';
import { RequireSetupComplete, RequireSetupIncomplete } from '@/app/guards/require-setup';
import { DashboardPage } from '@/app/routes/dashboard-page';
import { LoginPage } from '@/app/routes/login-page';
import { SettingsPage } from '@/app/routes/settings-page';
import { SetupPage } from '@/app/routes/setup-page';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/setup" replace />,
  },
  {
    element: <RequireSetupIncomplete />,
    children: [
      {
        path: '/setup',
        element: <SetupPage />,
      },
    ],
  },
  {
    element: <RequireSetupComplete />,
    children: [
      {
        path: '/login',
        element: <LoginPage />,
      },
      {
        element: <RequireAuth />,
        children: [
          {
            path: '/dashboard',
            element: <DashboardPage />,
          },
          {
            path: '/settings',
            element: <SettingsPage />,
          },
        ],
      },
    ],
  },
]);
