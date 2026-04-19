import { Link, Navigate, useParams } from 'react-router-dom';
import { AppShell } from '@/components/layout/app-shell';
import { DocumentLayout } from '@/components/documents/document-layout';
import { Alert } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { getSetupSnapshot } from '@/lib/bootstrap/bootstrap-service';
import { getCustomerById } from '@/modules/customers/customer-service';
import { getInvoiceById } from '@/modules/invoices/invoice-service';

export function InvoiceDocumentPage() {
  const { invoiceId } = useParams();
  const invoice = invoiceId ? getInvoiceById(invoiceId) : null;
  const organization = getSetupSnapshot();
  const customer = invoice ? getCustomerById(invoice.customerId) : null;

  if (!invoice || !organization || !customer) {
    return <Navigate to="/invoices" replace />;
  }

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="print-hidden flex items-center justify-between gap-3">
          <Alert>
            Gebruik afdrukken of Opslaan als PDF in de browser voor de eerste betrouwbare documentuitvoer.
          </Alert>
          <div className="flex items-center gap-3">
            <Button type="button" variant="secondary" onClick={() => window.history.back()}>
              Terug
            </Button>
            <Button type="button" onClick={() => window.print()}>
              Afdrukken / PDF
            </Button>
          </div>
        </div>

        <DocumentLayout
          documentLabel="Factuur"
          title={invoice.invoiceNumber ? `Factuur ${invoice.invoiceNumber}` : 'Conceptfactuur'}
          statusLabel={mapStatusLabel(invoice.status)}
          organization={{
            name: organization.organizationName,
            email: organization.adminEmail,
            phone: organization.phone,
            website: organization.website,
            registrationNumber: organization.registrationNumber,
            taxNumber: organization.taxNumber,
            city: organization.city,
            country: organization.country,
          }}
          customer={customer}
          meta={[
            { label: 'Factuurdatum', value: invoice.issueDate },
            { label: 'Vervaldatum', value: invoice.dueDate ?? 'Niet opgegeven' },
            { label: 'Factuurnummer', value: invoice.invoiceNumber ?? 'Nog niet toegekend' },
          ]}
          lines={invoice.lines}
          currency={invoice.currency}
          subtotalCents={invoice.subtotalCents}
          totalCents={invoice.totalCents}
          notes={invoice.notes}
        />

        <div className="print-hidden text-right">
          <Link to="/invoices" className="text-sm text-slate-600 underline-offset-2 hover:underline">
            Terug naar facturen
          </Link>
        </div>
      </div>
    </AppShell>
  );
}

function mapStatusLabel(status: 'draft' | 'sent' | 'paid' | 'overdue') {
  if (status === 'draft') return 'Concept';
  if (status === 'sent') return 'Verzonden';
  if (status === 'paid') return 'Betaald';
  return 'Overdue';
}
