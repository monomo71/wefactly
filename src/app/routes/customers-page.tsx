import { useMemo, useState } from 'react';
import { AppShell } from '@/components/layout/app-shell';
import { PageHeader } from '@/components/shared/page-header';
import { Alert } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createCustomer, listCustomers, mapCustomerToFormValues, updateCustomer } from '@/modules/customers/customer-service';
import { emptyCustomerFormValues, type CustomerFormValues } from '@/modules/customers/customer-types';
import { validateCustomerForm } from '@/modules/customers/customer-validation';
import type { Customer } from '@/types/domain';

export function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>(() => listCustomers());
  const [formValues, setFormValues] = useState<CustomerFormValues>(emptyCustomerFormValues);
  const [activeCustomerId, setActiveCustomerId] = useState<string | null>(null);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [formMessage, setFormMessage] = useState('');
  const [pageFeedback, setPageFeedback] = useState<{ message: string; variant: 'success' | 'error' } | null>(null);

  const formMode = activeCustomerId ? 'edit' : 'create';
  const errors = useMemo(() => validateCustomerForm(formValues), [formValues]);

  const openCreateForm = () => {
    setActiveCustomerId(null);
    setFormValues(emptyCustomerFormValues);
    setFormMessage('');
    setIsFormVisible(true);
  };

  const openEditForm = (customer: Customer) => {
    setActiveCustomerId(customer.id);
    setFormValues(mapCustomerToFormValues(customer));
    setFormMessage('');
    setIsFormVisible(true);
  };

  const closeForm = () => {
    setActiveCustomerId(null);
    setFormValues(emptyCustomerFormValues);
    setFormMessage('');
    setIsFormVisible(false);
  };

  const handleSubmit = () => {
    if (Object.keys(errors).length > 0) {
      setFormMessage('Controleer de verplichte velden en probeer opnieuw.');
      return;
    }

    if (formMode === 'edit' && activeCustomerId) {
      updateCustomer(activeCustomerId, formValues);
      setPageFeedback({ message: 'Klant is bijgewerkt.', variant: 'success' });
    } else {
      createCustomer(formValues);
      setPageFeedback({ message: 'Klant is toegevoegd.', variant: 'success' });
    }

    setCustomers(listCustomers());
    setActiveCustomerId(null);
    setFormValues(emptyCustomerFormValues);
    setFormMessage('');
    setIsFormVisible(false);
  };

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <PageHeader
            title="Klanten"
            description="Een rustige en bruikbare klantenbasis voor fase 2, zonder extra complexiteit buiten scope."
          />
          <Button type="button" onClick={openCreateForm}>
            Klant toevoegen
          </Button>
        </div>

        <Alert>
          Deze fase bevat alleen basis klantbeheer: lijst, toevoegen, bewerken en nette validatie.
        </Alert>

        {pageFeedback ? <Alert variant={pageFeedback.variant}>{pageFeedback.message}</Alert> : null}

        {customers.length === 0 ? (
          <EmptyState
            title="Nog geen klanten"
            description="Voeg de eerste klant toe om de basis van het klantenbeheer op te zetten."
            action={
              <Button type="button" onClick={openCreateForm}>
                Eerste klant toevoegen
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
                    <th className="px-4 py-3 font-medium">Contact</th>
                    <th className="px-4 py-3 font-medium">Locatie</th>
                    <th className="px-4 py-3 text-right font-medium">Acties</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border bg-white">
                  {customers.map((customer) => (
                    <tr key={customer.id} className="hover:bg-slate-50/60">
                      <td className="px-4 py-3">
                        <div className="font-medium text-foreground">{customer.name}</div>
                        <div className="text-slate-500">{customer.email ?? 'Geen e-mail'}</div>
                      </td>
                      <td className="px-4 py-3 text-slate-600">{customer.contactName ?? customer.phone ?? '—'}</td>
                      <td className="px-4 py-3 text-slate-600">
                        {[customer.city, customer.country].filter(Boolean).join(', ') || '—'}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Button type="button" variant="secondary" onClick={() => openEditForm(customer)}>
                          Bewerken
                        </Button>
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
                  {formMode === 'edit' ? 'Klant bewerken' : 'Nieuwe klant'}
                </h2>
                <p className="mt-1 text-sm text-slate-600">
                  Gebruik een vaste en duidelijke opbouw voor basisgegevens en adresinformatie.
                </p>
              </div>
              <Button type="button" variant="secondary" onClick={closeForm}>
                Sluiten
              </Button>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <section className="space-y-4">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Basis</h3>
                <Field label="Klantnaam" value={formValues.name} onChange={(value) => setFormValues((current) => ({ ...current, name: value }))} error={errors.name} required />
                <Field label="Contactpersoon" value={formValues.contactName} onChange={(value) => setFormValues((current) => ({ ...current, contactName: value }))} />
                <Field label="E-mail" value={formValues.email} onChange={(value) => setFormValues((current) => ({ ...current, email: value }))} error={errors.email} type="email" />
                <Field label="Telefoon" value={formValues.phone} onChange={(value) => setFormValues((current) => ({ ...current, phone: value }))} />
                <Field label="Website" value={formValues.website} onChange={(value) => setFormValues((current) => ({ ...current, website: value }))} error={errors.website} placeholder="https://example.com" />
              </section>

              <section className="space-y-4">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Adres en registratie</h3>
                <Field label="Registratienummer" value={formValues.registrationNumber} onChange={(value) => setFormValues((current) => ({ ...current, registrationNumber: value }))} />
                <Field label="Tax nummer" value={formValues.taxNumber} onChange={(value) => setFormValues((current) => ({ ...current, taxNumber: value }))} />
                <Field label="Adresregel 1" value={formValues.addressLine1} onChange={(value) => setFormValues((current) => ({ ...current, addressLine1: value }))} />
                <Field label="Adresregel 2" value={formValues.addressLine2} onChange={(value) => setFormValues((current) => ({ ...current, addressLine2: value }))} />
                <div className="grid gap-4 md:grid-cols-2">
                  <Field label="Postcode" value={formValues.postalCode} onChange={(value) => setFormValues((current) => ({ ...current, postalCode: value }))} />
                  <Field label="Plaats" value={formValues.city} onChange={(value) => setFormValues((current) => ({ ...current, city: value }))} />
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <Field label="Staat / regio" value={formValues.stateRegion} onChange={(value) => setFormValues((current) => ({ ...current, stateRegion: value }))} />
                  <Field label="Land" value={formValues.country} onChange={(value) => setFormValues((current) => ({ ...current, country: value.toUpperCase() }))} error={errors.country} required />
                </div>
              </section>
            </div>

            {formMessage ? <div className="mt-5"><Alert variant={Object.keys(errors).length > 0 ? 'error' : 'default'}>{formMessage}</Alert></div> : null}

            <div className="mt-6 flex items-center justify-end gap-3 border-t border-border pt-5">
              <Button type="button" variant="secondary" onClick={closeForm}>
                Annuleren
              </Button>
              <Button type="button" onClick={handleSubmit}>
                {formMode === 'edit' ? 'Wijzigingen opslaan' : 'Klant opslaan'}
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
  type?: 'text' | 'email';
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
