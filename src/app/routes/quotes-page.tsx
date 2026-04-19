import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { AppShell } from '@/components/layout/app-shell';
import { PageHeader } from '@/components/shared/page-header';
import { Alert } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { getSetupSnapshot } from '@/lib/bootstrap/bootstrap-service';
import { sendQuoteMail } from '@/lib/mail/mail-service';
import { getCustomerById } from '@/modules/customers/customer-service';
import { emptyQuoteFormValues, emptyQuoteLineFormValues, type QuoteFormValues } from '@/modules/quotes/quote-types';
import { validateQuoteForm } from '@/modules/quotes/quote-validation';
import { createQuote, findCustomerName, getQuoteCustomers, getQuoteProducts, listQuotes, mapQuoteToFormValues, markQuoteAsSent, updateQuote } from '@/modules/quotes/quote-service';
import type { Quote, Product } from '@/types/domain';

export function QuotesPage() {
  const [quotes, setQuotes] = useState<Quote[]>(() => listQuotes());
  const [formValues, setFormValues] = useState<QuoteFormValues>(emptyQuoteFormValues);
  const [activeQuoteId, setActiveQuoteId] = useState<string | null>(null);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [formMessage, setFormMessage] = useState('');
  const [pageFeedback, setPageFeedback] = useState<{ message: string; variant: 'success' | 'error' } | null>(null);
  const [mailFeedback, setMailFeedback] = useState<{ message: string; variant: 'default' | 'error' } | null>(null);

  const customers = getQuoteCustomers();
  const products = getQuoteProducts();
  const formMode = activeQuoteId ? 'edit' : 'create';
  const errors = useMemo(() => validateQuoteForm(formValues), [formValues]);

  const openCreateForm = () => {
    setActiveQuoteId(null);
    setFormValues(emptyQuoteFormValues);
    setFormMessage('');
    setIsFormVisible(true);
  };

  const openEditForm = (quote: Quote) => {
    if (quote.status !== 'draft') {
      return;
    }

    setActiveQuoteId(quote.id);
    setFormValues(mapQuoteToFormValues(quote));
    setFormMessage('');
    setIsFormVisible(true);
  };

  const closeForm = () => {
    setActiveQuoteId(null);
    setFormValues(emptyQuoteFormValues);
    setFormMessage('');
    setIsFormVisible(false);
  };

  const handleSubmit = () => {
    if (Object.keys(errors).length > 0) {
      setFormMessage('Controleer de verplichte velden en regels en probeer opnieuw.');
      return;
    }

    if (formMode === 'edit' && activeQuoteId) {
      updateQuote(activeQuoteId, formValues);
      setPageFeedback({ message: 'Offerte is bijgewerkt.', variant: 'success' });
    } else {
      createQuote(formValues);
      setPageFeedback({ message: 'Offerte is toegevoegd als concept.', variant: 'success' });
    }

    setQuotes(listQuotes());
    setActiveQuoteId(null);
    setFormValues(emptyQuoteFormValues);
    setFormMessage('');
    setIsFormVisible(false);
  };

  const handleMarkAsSent = (quoteId: string) => {
    markQuoteAsSent(quoteId);
    setQuotes(listQuotes());
  };

  const handleSendMail = (quote: Quote) => {
    const customer = getCustomerById(quote.customerId);
    const organization = getSetupSnapshot();
    const result = sendQuoteMail({
      quote,
      customer,
      organization,
    });

    setQuotes(listQuotes());
    setMailFeedback({
      message: result.message,
      variant: result.success ? 'default' : 'error',
    });
  };

  const addLine = () => {
    setFormValues((current) => ({
      ...current,
      lines: [...current.lines, { ...emptyQuoteLineFormValues }],
    }));
  };

  const removeLine = (lineIndex: number) => {
    setFormValues((current) => ({
      ...current,
      lines: current.lines.filter((_, index) => index !== lineIndex),
    }));
  };

  const updateLine = (lineIndex: number, field: 'sourceProductId' | 'description' | 'quantity' | 'unitPrice', value: string) => {
    setFormValues((current) => {
      const nextLines = [...current.lines];
      const nextLine = { ...nextLines[lineIndex], [field]: value };

      if (field === 'sourceProductId') {
        const selectedProduct = products.find((product) => product.id === value);
        if (selectedProduct) {
          nextLine.description = selectedProduct.name;
          nextLine.unitPrice = selectedProduct.unitPrice.toFixed(2);
        }
      }

      nextLines[lineIndex] = nextLine;
      return {
        ...current,
        lines: nextLines,
      };
    });
  };

  const hasCustomers = customers.length > 0;

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <PageHeader
            title="Offertes"
            description="Basis offertebeheer voor fase 4, bewust eenvoudiger gehouden dan factuurlogica."
          />
          <Button type="button" onClick={openCreateForm} disabled={!hasCustomers}>
            Offerte toevoegen
          </Button>
        </div>

        <Alert>
          Deze fase gebruikt een eenvoudige client-side mailactie via uw standaard mailapp, zonder automatische statuswijziging of extra templatecomplexiteit.
        </Alert>

        {pageFeedback ? <Alert variant={pageFeedback.variant}>{pageFeedback.message}</Alert> : null}
        {mailFeedback ? <Alert variant={mailFeedback.variant}>{mailFeedback.message}</Alert> : null}

        {!hasCustomers ? (
          <EmptyState
            title="Voeg eerst een klant toe"
            description="Een offerte is altijd gekoppeld aan een klant. Maak daarom eerst minimaal één klant aan."
          />
        ) : quotes.length === 0 ? (
          <EmptyState
            title="Nog geen offertes"
            description="Voeg de eerste offerte toe om de basis van het offertebeheer op te zetten."
            action={
              <Button type="button" onClick={openCreateForm}>
                Eerste offerte toevoegen
              </Button>
            }
          />
        ) : (
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-border text-sm">
                <thead className="bg-slate-50 text-left text-slate-600">
                  <tr>
                    <th className="px-4 py-3 font-medium">Klant</th>
                    <th className="px-4 py-3 font-medium">Datum</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium">Totaal</th>
                    <th className="px-4 py-3 text-right font-medium">Acties</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border bg-white">
                  {quotes.map((quote) => (
                    <tr key={quote.id} className="hover:bg-slate-50/60">
                      <td className="px-4 py-3">
                        <div className="font-medium text-foreground">{findCustomerName(quote.customerId)}</div>
                        <div className="text-slate-500">{quote.lines.length} regel(s)</div>
                      </td>
                      <td className="px-4 py-3 text-slate-600">{quote.quoteDate}</td>
                      <td className="px-4 py-3">
                        <Badge>{quote.status === 'sent' ? 'Verzonden' : 'Concept'}</Badge>
                      </td>
                      <td className="px-4 py-3 text-slate-600">{quote.currency} {(quote.totalCents / 100).toFixed(2)}</td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-2">
                          <Link
                            to={`/quotes/${quote.id}/document`}
                            className="inline-flex items-center justify-center rounded-md border border-border bg-white px-4 py-2 text-sm font-medium transition hover:bg-slate-50"
                          >
                            Document
                          </Link>
                          <Button type="button" variant="secondary" onClick={() => handleSendMail(quote)}>
                            Open mail
                          </Button>
                          <Button type="button" variant="secondary" onClick={() => openEditForm(quote)} disabled={quote.status !== 'draft'}>
                            Bewerken
                          </Button>
                          {quote.status === 'draft' ? (
                            <Button type="button" onClick={() => handleMarkAsSent(quote.id)}>
                              Markeer als verzonden
                            </Button>
                          ) : null}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {isFormVisible ? (
          <Card className="p-5">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-foreground">
                  {formMode === 'edit' ? 'Offerte bewerken' : 'Nieuwe offerte'}
                </h2>
                <p className="mt-1 text-sm text-slate-600">
                  Houd de structuur helder: klant eerst, daarna regels en samenvatting.
                </p>
              </div>
              <Button type="button" variant="secondary" onClick={closeForm}>
                Sluiten
              </Button>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <section className="space-y-4">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Basis</h3>
                <div>
                  <Label>
                    <span className="mb-1 block">Klant *</span>
                    <select
                      value={formValues.customerId}
                      onChange={(event) => setFormValues((current) => ({ ...current, customerId: event.target.value }))}
                      className="w-full rounded-md border border-border bg-white px-3 py-2 text-sm text-foreground outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    >
                      <option value="">Selecteer een klant</option>
                      {customers.map((customer) => (
                        <option key={customer.id} value={customer.id}>
                          {customer.name}
                        </option>
                      ))}
                    </select>
                  </Label>
                  {errors.customerId ? <p className="mt-1 text-xs text-red-600">{errors.customerId}</p> : null}
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <Field label="Offertedatum" value={formValues.quoteDate} onChange={(value) => setFormValues((current) => ({ ...current, quoteDate: value }))} type="date" error={errors.quoteDate} required />
                  <Field label="Geldig tot" value={formValues.validUntil} onChange={(value) => setFormValues((current) => ({ ...current, validUntil: value }))} type="date" />
                </div>

                <Field label="Valuta" value={formValues.currency} onChange={(value) => setFormValues((current) => ({ ...current, currency: value.toUpperCase() }))} error={errors.currency} required placeholder="EUR" />

                <div>
                  <Label>
                    <span className="mb-1 block">Notities</span>
                    <textarea
                      value={formValues.notes}
                      onChange={(event) => setFormValues((current) => ({ ...current, notes: event.target.value }))}
                      rows={4}
                      className="w-full rounded-md border border-border bg-white px-3 py-2 text-sm text-foreground outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                  </Label>
                </div>
              </section>

              <section className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Regels</h3>
                  <Button type="button" variant="secondary" onClick={addLine}>
                    Regel toevoegen
                  </Button>
                </div>

                <div className="space-y-4">
                  {formValues.lines.map((line, index) => {
                    const lineErrors = errors.lines?.[index];

                    return (
                      <div key={`line-${index}`} className="rounded-lg border border-border p-4">
                        <div className="mb-3 flex items-center justify-between gap-3">
                          <p className="text-sm font-medium text-foreground">Regel {index + 1}</p>
                          {formValues.lines.length > 1 ? (
                            <Button type="button" variant="secondary" onClick={() => removeLine(index)}>
                              Verwijderen
                            </Button>
                          ) : null}
                        </div>

                        <div className="space-y-3">
                          <div>
                            <Label>
                              <span className="mb-1 block">Bestaand product</span>
                              <select
                                value={line.sourceProductId}
                                onChange={(event) => updateLine(index, 'sourceProductId', event.target.value)}
                                className="w-full rounded-md border border-border bg-white px-3 py-2 text-sm text-foreground outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                              >
                                <option value="">Handmatige regel</option>
                                {products.map((product: Product) => (
                                  <option key={product.id} value={product.id}>
                                    {product.name}
                                  </option>
                                ))}
                              </select>
                            </Label>
                          </div>

                          <Field label="Omschrijving" value={line.description} onChange={(value) => updateLine(index, 'description', value)} error={lineErrors?.description} required />

                          <div className="grid gap-4 md:grid-cols-2">
                            <Field label="Hoeveelheid" value={line.quantity} onChange={(value) => updateLine(index, 'quantity', value)} error={lineErrors?.quantity} placeholder="1" />
                            <Field label="Prijs per stuk" value={line.unitPrice} onChange={(value) => updateLine(index, 'unitPrice', value)} error={lineErrors?.unitPrice} placeholder="0.00" />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            </div>

            {formMessage ? (
              <div className="mt-5">
                <Alert variant={Object.keys(errors).length > 0 ? 'error' : 'default'}>{formMessage}</Alert>
              </div>
            ) : null}

            <div className="mt-6 flex items-center justify-end gap-3 border-t border-border pt-5">
              <Button type="button" variant="secondary" onClick={closeForm}>
                Annuleren
              </Button>
              <Button type="button" onClick={handleSubmit}>
                {formMode === 'edit' ? 'Wijzigingen opslaan' : 'Offerte opslaan'}
              </Button>
            </div>
          </Card>
        ) : null}
      </div>
    </AppShell>
  );
}

interface FieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  type?: 'text' | 'date';
  required?: boolean;
  placeholder?: string;
}

function Field({ label, value, onChange, error, type = 'text', required = false, placeholder }: FieldProps) {
  return (
    <div>
      <Label>
        <span className="mb-1 block">
          {label}
          {required ? ' *' : ''}
        </span>
        <Input type={type} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} />
      </Label>
      {error ? <p className="mt-1 text-xs text-red-600">{error}</p> : null}
    </div>
  );
}
