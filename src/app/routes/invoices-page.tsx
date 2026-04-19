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
import { sendInvoiceMail } from '@/lib/mail/mail-service';
import { getCustomerById } from '@/modules/customers/customer-service';
import { calculateInvoiceDraftTotals, formatMoneyFromCents } from '@/modules/invoices/invoice-calculations';
import { deleteDraftInvoice, findInvoiceCustomerName, formatInvoiceTotal, getInvoiceCustomers, getInvoiceProducts, listInvoices, mapInvoiceToFormValues, markInvoiceAsOverdue, markInvoiceAsPaid, markInvoiceAsSent, updateInvoice, createInvoice } from '@/modules/invoices/invoice-service';
import { emptyInvoiceFormValues, emptyInvoiceLineFormValues, type InvoiceFormValues } from '@/modules/invoices/invoice-types';
import { validateInvoiceForm } from '@/modules/invoices/invoice-validation';
import type { Invoice, Product } from '@/types/domain';

export function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>(() => listInvoices());
  const [formValues, setFormValues] = useState<InvoiceFormValues>(emptyInvoiceFormValues);
  const [activeInvoiceId, setActiveInvoiceId] = useState<string | null>(null);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [formMessage, setFormMessage] = useState('');
  const [pageFeedback, setPageFeedback] = useState<{ message: string; variant: 'success' | 'error' } | null>(null);
  const [mailFeedback, setMailFeedback] = useState<{ message: string; variant: 'default' | 'error' } | null>(null);

  const customers = getInvoiceCustomers();
  const products = getInvoiceProducts();
  const formMode = activeInvoiceId ? 'edit' : 'create';
  const errors = useMemo(() => validateInvoiceForm(formValues), [formValues]);
  const totals = useMemo(() => calculateInvoiceDraftTotals(formValues), [formValues]);

  const openCreateForm = () => {
    setActiveInvoiceId(null);
    setFormValues(emptyInvoiceFormValues);
    setFormMessage('');
    setIsFormVisible(true);
  };

  const openEditForm = (invoice: Invoice) => {
    if (invoice.status !== 'draft') {
      return;
    }

    setActiveInvoiceId(invoice.id);
    setFormValues(mapInvoiceToFormValues(invoice));
    setFormMessage('');
    setIsFormVisible(true);
  };

  const closeForm = () => {
    setActiveInvoiceId(null);
    setFormValues(emptyInvoiceFormValues);
    setFormMessage('');
    setIsFormVisible(false);
  };

  const refreshInvoices = () => {
    setInvoices(listInvoices());
  };

  const handleSubmit = () => {
    if (Object.keys(errors).length > 0) {
      setFormMessage('Controleer de verplichte velden en regels en probeer opnieuw.');
      return;
    }

    if (formMode === 'edit' && activeInvoiceId) {
      updateInvoice(activeInvoiceId, formValues);
      setPageFeedback({ message: 'Factuur is bijgewerkt.', variant: 'success' });
    } else {
      createInvoice(formValues);
      setPageFeedback({ message: 'Factuur is toegevoegd als concept.', variant: 'success' });
    }

    refreshInvoices();
    closeForm();
  };

  const handleDeleteDraft = (invoiceId: string) => {
    deleteDraftInvoice(invoiceId);
    refreshInvoices();
  };

  const handleMarkAsSent = (invoiceId: string) => {
    markInvoiceAsSent(invoiceId);
    refreshInvoices();
  };

  const handleMarkAsPaid = (invoiceId: string) => {
    markInvoiceAsPaid(invoiceId);
    refreshInvoices();
  };

  const handleMarkAsOverdue = (invoiceId: string) => {
    markInvoiceAsOverdue(invoiceId);
    refreshInvoices();
  };

  const handleSendMail = (invoice: Invoice) => {
    const customer = getCustomerById(invoice.customerId);
    const organization = getSetupSnapshot();
    const result = sendInvoiceMail({
      invoice,
      customer,
      organization,
    });

    refreshInvoices();
    setMailFeedback({
      message: result.message,
      variant: result.success ? 'default' : 'error',
    });
  };

  const addLine = () => {
    setFormValues((current) => ({
      ...current,
      lines: [...current.lines, { ...emptyInvoiceLineFormValues }],
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
        const selectedProduct = products.find((product: Product) => product.id === value);
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
            title="Facturen"
            description="Basis factuurbeheer voor fase 5, met strikte scheiding tussen concept en verzonden facturen."
          />
          <Button type="button" onClick={openCreateForm} disabled={!hasCustomers}>
            Factuur toevoegen
          </Button>
        </div>

        <Alert>
          Deze fase gebruikt een eenvoudige client-side mailactie via uw standaard mailapp, zonder automatische statuswijziging of extra mailcomplexiteit.
        </Alert>

        {pageFeedback ? <Alert variant={pageFeedback.variant}>{pageFeedback.message}</Alert> : null}
        {mailFeedback ? <Alert variant={mailFeedback.variant}>{mailFeedback.message}</Alert> : null}

        {!hasCustomers ? (
          <EmptyState
            title="Voeg eerst een klant toe"
            description="Een factuur is altijd gekoppeld aan een klant. Maak daarom eerst minimaal één klant aan."
          />
        ) : invoices.length === 0 ? (
          <EmptyState
            title="Nog geen facturen"
            description="Voeg de eerste factuur toe om de basis van het factuurbeheer op te zetten."
            action={
              <Button type="button" onClick={openCreateForm}>
                Eerste factuur toevoegen
              </Button>
            }
          />
        ) : (
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-border text-sm">
                <thead className="bg-slate-50 text-left text-slate-600">
                  <tr>
                    <th className="px-4 py-3 font-medium">Factuur</th>
                    <th className="px-4 py-3 font-medium">Klant</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium">Totaal</th>
                    <th className="px-4 py-3 text-right font-medium">Acties</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border bg-white">
                  {invoices.map((invoice) => (
                    <tr key={invoice.id} className="hover:bg-slate-50/60">
                      <td className="px-4 py-3">
                        <div className="font-medium text-foreground">{invoice.invoiceNumber ?? 'Nog geen nummer'}</div>
                        <div className="text-slate-500">{invoice.issueDate}</div>
                      </td>
                      <td className="px-4 py-3 text-slate-600">{findInvoiceCustomerName(invoice.customerId)}</td>
                      <td className="px-4 py-3">
                        <Badge>{mapStatusLabel(invoice.status)}</Badge>
                      </td>
                      <td className="px-4 py-3 text-slate-600">{formatInvoiceTotal(invoice)}</td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap justify-end gap-2">
                          <Link
                            to={`/invoices/${invoice.id}/document`}
                            className="inline-flex items-center justify-center rounded-md border border-border bg-white px-4 py-2 text-sm font-medium transition hover:bg-slate-50"
                          >
                            Document
                          </Link>
                          <Button type="button" variant="secondary" onClick={() => handleSendMail(invoice)}>
                            Open mail
                          </Button>
                          <Button type="button" variant="secondary" onClick={() => openEditForm(invoice)} disabled={invoice.status !== 'draft'}>
                            Bewerken
                          </Button>
                          {invoice.status === 'draft' ? (
                            <>
                              <Button type="button" variant="secondary" onClick={() => handleDeleteDraft(invoice.id)}>
                                Verwijderen
                              </Button>
                              <Button type="button" onClick={() => handleMarkAsSent(invoice.id)}>
                                Verzenden
                              </Button>
                            </>
                          ) : null}
                          {invoice.status === 'sent' ? (
                            <>
                              <Button type="button" variant="secondary" onClick={() => handleMarkAsOverdue(invoice.id)}>
                                Markeer overdue
                              </Button>
                              <Button type="button" onClick={() => handleMarkAsPaid(invoice.id)}>
                                Markeer betaald
                              </Button>
                            </>
                          ) : null}
                          {invoice.status === 'overdue' ? (
                            <Button type="button" onClick={() => handleMarkAsPaid(invoice.id)}>
                              Markeer betaald
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
                  {formMode === 'edit' ? 'Factuur bewerken' : 'Nieuwe factuur'}
                </h2>
                <p className="mt-1 text-sm text-slate-600">
                  Conceptfacturen blijven bewerkbaar. Na verzenden wordt de inhoud vergrendeld en krijgt de factuur een definitief nummer.
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
                  <Field label="Factuurdatum" value={formValues.issueDate} onChange={(value) => setFormValues((current) => ({ ...current, issueDate: value }))} type="date" error={errors.issueDate} required />
                  <Field label="Vervaldatum" value={formValues.dueDate} onChange={(value) => setFormValues((current) => ({ ...current, dueDate: value }))} type="date" error={errors.dueDate} />
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
                    const linePreviewTotal = totals.lines[index]?.lineTotalCents ?? 0;

                    return (
                      <div key={`invoice-line-${index}`} className="rounded-lg border border-border p-4">
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

                          <p className="text-sm text-slate-600">Regeltotaal: <strong>{formatMoneyFromCents(linePreviewTotal, formValues.currency)}</strong></p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            </div>

            <div className="mt-5 rounded-lg border border-border bg-slate-50 p-4 text-sm text-slate-700">
              <p>Subtotaal: <strong>{formatMoneyFromCents(totals.subtotalCents, formValues.currency)}</strong></p>
              <p className="mt-1">Totaal: <strong>{formatMoneyFromCents(totals.totalCents, formValues.currency)}</strong></p>
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
                {formMode === 'edit' ? 'Wijzigingen opslaan' : 'Factuur opslaan'}
              </Button>
            </div>
          </Card>
        ) : null}
      </div>
    </AppShell>
  );
}

function mapStatusLabel(status: Invoice['status']) {
  if (status === 'draft') return 'Concept';
  if (status === 'sent') return 'Verzonden';
  if (status === 'paid') return 'Betaald';
  return 'Overdue';
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
