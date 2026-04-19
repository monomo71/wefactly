import { Link } from 'react-router-dom';
import { AppShell } from '@/components/layout/app-shell';
import { PageHeader } from '@/components/shared/page-header';
import { Alert } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { getCurrentAuthSession } from '@/lib/auth/auth-service';
import { listCustomers } from '@/modules/customers/customer-service';
import { listInvoices } from '@/modules/invoices/invoice-service';
import { listProducts } from '@/modules/products/product-service';
import { listQuotes } from '@/modules/quotes/quote-service';

export function DashboardPage() {
  const session = getCurrentAuthSession();
  const customers = listCustomers();
  const products = listProducts();
  const quotes = listQuotes();
  const invoices = listInvoices();

  const recentQuotes = quotes.slice(0, 4);
  const recentInvoices = invoices.slice(0, 4);
  const draftQuotesCount = quotes.filter((quote) => quote.status === 'draft').length;
  const openInvoicesCount = invoices.filter((invoice) => invoice.status === 'sent' || invoice.status === 'overdue').length;

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex items-start justify-between gap-4">
          <PageHeader
            title="Dashboard"
            description="Een rustig startpunt met nuttige basisinformatie, snelle acties en recent overzicht."
          />
          <Badge>Basis</Badge>
        </div>

        <Alert>
          Dit dashboard blijft bewust licht: alleen relevante kerninformatie, zonder grafieken of zware analytics.
        </Alert>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Klanten" value={String(customers.length)} detail="Beschikbare klantrecords" />
          <StatCard label="Producten" value={String(products.length)} detail="Basis productcatalogus" />
          <StatCard label="Conceptoffertes" value={String(draftQuotesCount)} detail="Nog niet verzonden" />
          <StatCard label="Open facturen" value={String(openInvoicesCount)} detail="Verzonden of overdue" />
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <Card className="p-5">
            <h2 className="text-base font-semibold text-foreground">Snelle acties</h2>
            <p className="mt-1 text-sm text-slate-600">Ga direct naar de belangrijkste kernflows van v1.</p>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <QuickLink to="/customers" label="Klanten beheren" />
              <QuickLink to="/products" label="Producten beheren" />
              <QuickLink to="/quotes" label="Offertes openen" />
              <QuickLink to="/invoices" label="Facturen openen" />
            </div>
          </Card>

          <Card className="p-5">
            <h2 className="text-base font-semibold text-foreground">Actieve sessie</h2>
            <p className="mt-3 text-sm text-slate-600">
              Organisatie: <strong>{session?.user.organizationName ?? 'Onbekend'}</strong>
            </p>
            <p className="mt-1 text-sm text-slate-600">Ingelogd als: {session?.user.email ?? 'Onbekend'}</p>
            <p className="mt-4 text-sm text-slate-500">
              Gebruik dit dashboard als rustig vertrekpunt; de inhoud blijft bewust compact en professioneel.
            </p>
          </Card>
        </div>

        <div className="grid gap-6 xl:grid-cols-2">
          <Card className="p-5">
            <div className="mb-4 flex items-center justify-between gap-3">
              <h2 className="text-base font-semibold text-foreground">Recente offertes</h2>
              <Link to="/quotes" className="text-sm text-slate-600 underline-offset-2 hover:underline">
                Alles bekijken
              </Link>
            </div>

            {recentQuotes.length === 0 ? (
              <EmptyState
                title="Nog geen offertes"
                description="Zodra er offertes zijn, verschijnt hier een kort en rustig overzicht."
              />
            ) : (
              <div className="space-y-3">
                {recentQuotes.map((quote) => (
                  <div key={quote.id} className="flex items-center justify-between rounded-md border border-border px-4 py-3">
                    <div>
                      <p className="text-sm font-medium text-foreground">{quote.quoteDate}</p>
                      <p className="text-sm text-slate-600">{quote.currency} {(quote.totalCents / 100).toFixed(2)}</p>
                    </div>
                    <Badge>{quote.status === 'sent' ? 'Verzonden' : 'Concept'}</Badge>
                  </div>
                ))}
              </div>
            )}
          </Card>

          <Card className="p-5">
            <div className="mb-4 flex items-center justify-between gap-3">
              <h2 className="text-base font-semibold text-foreground">Recente facturen</h2>
              <Link to="/invoices" className="text-sm text-slate-600 underline-offset-2 hover:underline">
                Alles bekijken
              </Link>
            </div>

            {recentInvoices.length === 0 ? (
              <EmptyState
                title="Nog geen facturen"
                description="Zodra er facturen zijn, verschijnt hier een kort en rustig overzicht."
              />
            ) : (
              <div className="space-y-3">
                {recentInvoices.map((invoice) => (
                  <div key={invoice.id} className="flex items-center justify-between rounded-md border border-border px-4 py-3">
                    <div>
                      <p className="text-sm font-medium text-foreground">{invoice.invoiceNumber ?? 'Conceptfactuur'}</p>
                      <p className="text-sm text-slate-600">{invoice.currency} {(invoice.totalCents / 100).toFixed(2)}</p>
                    </div>
                    <Badge>{mapInvoiceStatus(invoice.status)}</Badge>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </AppShell>
  );
}

function StatCard({ label, value, detail }: { label: string; value: string; detail: string }) {
  return (
    <Card className="p-5">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-2 text-3xl font-semibold tracking-tight text-foreground">{value}</p>
      <p className="mt-2 text-sm text-slate-600">{detail}</p>
    </Card>
  );
}

function QuickLink({ to, label }: { to: string; label: string }) {
  return (
    <Link
      to={to}
      className="inline-flex items-center justify-center rounded-md border border-border bg-white px-4 py-3 text-sm font-medium text-foreground transition hover:bg-slate-50"
    >
      {label}
    </Link>
  );
}

function mapInvoiceStatus(status: 'draft' | 'sent' | 'paid' | 'overdue') {
  if (status === 'draft') return 'Concept';
  if (status === 'sent') return 'Verzonden';
  if (status === 'paid') return 'Betaald';
  return 'Overdue';
}
