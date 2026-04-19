import { Navigate, createBrowserRouter } from 'react-router-dom';
import { RequireAuth } from '@/app/guards/require-auth';
import { RequireSetupComplete, RequireSetupIncomplete } from '@/app/guards/require-setup';
import { CustomersPage } from '@/app/routes/customers-page';
import { DashboardPage } from '@/app/routes/dashboard-page';
import { InvoiceDocumentPage } from '@/app/routes/invoice-document-page';
import { InvoicesPage } from '@/app/routes/invoices-page';
import { LoginPage } from '@/app/routes/login-page';
import { ProductsPage } from '@/app/routes/products-page';
import { QuoteDocumentPage } from '@/app/routes/quote-document-page';
import { QuotesPage } from '@/app/routes/quotes-page';
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
            path: '/customers',
            element: <CustomersPage />,
          },
          {
            path: '/products',
            element: <ProductsPage />,
          },
          {
            path: '/quotes',
            element: <QuotesPage />,
          },
          {
            path: '/quotes/:quoteId/document',
            element: <QuoteDocumentPage />,
          },
          {
            path: '/invoices',
            element: <InvoicesPage />,
          },
          {
            path: '/invoices/:invoiceId/document',
            element: <InvoiceDocumentPage />,
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
