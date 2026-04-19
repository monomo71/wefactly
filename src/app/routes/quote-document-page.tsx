import { Link, Navigate, useParams } from 'react-router-dom';
import { AppShell } from '@/components/layout/app-shell';
import { DocumentLayout } from '@/components/documents/document-layout';
import { Alert } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { getSetupSnapshot } from '@/lib/bootstrap/bootstrap-service';
import { getCustomerById } from '@/modules/customers/customer-service';
import { getQuoteById } from '@/modules/quotes/quote-service';

export function QuoteDocumentPage() {
  const { quoteId } = useParams();
  const quote = quoteId ? getQuoteById(quoteId) : null;
  const organization = getSetupSnapshot();
  const customer = quote ? getCustomerById(quote.customerId) : null;

  if (!quote || !organization || !customer) {
    return <Navigate to="/quotes" replace />;
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
          documentLabel="Offerte"
          title={quote.status === 'sent' ? 'Verzonden offerte' : 'Conceptofferte'}
          statusLabel={quote.status === 'sent' ? 'Verzonden' : 'Concept'}
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
            { label: 'Datum', value: quote.quoteDate },
            { label: 'Geldig tot', value: quote.validUntil ?? 'Niet opgegeven' },
            { label: 'Context', value: 'Offertebasis voor fase 6 PDF-uitvoer' },
          ]}
          lines={quote.lines}
          currency={quote.currency}
          subtotalCents={quote.subtotalCents}
          totalCents={quote.totalCents}
          notes={quote.notes}
        />

        <div className="print-hidden text-right">
          <Link to="/quotes" className="text-sm text-slate-600 underline-offset-2 hover:underline">
            Terug naar offertes
          </Link>
        </div>
      </div>
    </AppShell>
  );
}
