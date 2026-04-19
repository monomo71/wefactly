import { useMemo, useState } from 'react';
import { AppShell } from '@/components/layout/app-shell';
import { PageHeader } from '@/components/shared/page-header';
import { Alert } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createProduct, listProducts, mapProductToFormValues, updateProduct } from '@/modules/products/product-service';
import { emptyProductFormValues, type ProductFormValues } from '@/modules/products/product-types';
import { validateProductForm } from '@/modules/products/product-validation';
import type { Product } from '@/types/domain';

export function ProductsPage() {
  const [products, setProducts] = useState<Product[]>(() => listProducts());
  const [formValues, setFormValues] = useState<ProductFormValues>(emptyProductFormValues);
  const [activeProductId, setActiveProductId] = useState<string | null>(null);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [formMessage, setFormMessage] = useState('');
  const [pageFeedback, setPageFeedback] = useState<{ message: string; variant: 'success' | 'error' } | null>(null);

  const formMode = activeProductId ? 'edit' : 'create';
  const errors = useMemo(() => validateProductForm(formValues), [formValues]);

  const openCreateForm = () => {
    setActiveProductId(null);
    setFormValues(emptyProductFormValues);
    setFormMessage('');
    setIsFormVisible(true);
  };

  const openEditForm = (product: Product) => {
    setActiveProductId(product.id);
    setFormValues(mapProductToFormValues(product));
    setFormMessage('');
    setIsFormVisible(true);
  };

  const closeForm = () => {
    setActiveProductId(null);
    setFormValues(emptyProductFormValues);
    setFormMessage('');
    setIsFormVisible(false);
  };

  const handleSubmit = () => {
    if (Object.keys(errors).length > 0) {
      setFormMessage('Controleer de verplichte velden en probeer opnieuw.');
      return;
    }

    if (formMode === 'edit' && activeProductId) {
      updateProduct(activeProductId, formValues);
      setPageFeedback({ message: 'Product is bijgewerkt.', variant: 'success' });
    } else {
      createProduct(formValues);
      setPageFeedback({ message: 'Product is toegevoegd.', variant: 'success' });
    }

    setProducts(listProducts());
    setActiveProductId(null);
    setFormValues(emptyProductFormValues);
    setFormMessage('');
    setIsFormVisible(false);
  };

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <PageHeader
            title="Producten"
            description="Een rustige en bruikbare productbasis voor fase 3, zonder extra velden of koppelingen buiten scope."
          />
          <Button type="button" onClick={openCreateForm}>
            Product toevoegen
          </Button>
        </div>

        <Alert>
          Deze fase bevat alleen basis productbeheer: lijst, toevoegen, bewerken, prijsinformatie en nette validatie.
        </Alert>

        {pageFeedback ? <Alert variant={pageFeedback.variant}>{pageFeedback.message}</Alert> : null}

        {products.length === 0 ? (
          <EmptyState
            title="Nog geen producten"
            description="Voeg het eerste product toe om een bruikbare productbasis op te zetten."
            action={
              <Button type="button" onClick={openCreateForm}>
                Eerste product toevoegen
              </Button>
            }
          />
        ) : (
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-border text-sm">
                <thead className="bg-slate-50 text-left text-slate-600">
                  <tr>
                    <th className="px-4 py-3 font-medium">Product</th>
                    <th className="px-4 py-3 font-medium">SKU / eenheid</th>
                    <th className="px-4 py-3 font-medium">Prijs</th>
                    <th className="px-4 py-3 text-right font-medium">Acties</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border bg-white">
                  {products.map((product) => (
                    <tr key={product.id} className="hover:bg-slate-50/60">
                      <td className="px-4 py-3">
                        <div className="font-medium text-foreground">{product.name}</div>
                        <div className="text-slate-500">{product.description ?? 'Geen beschrijving'}</div>
                      </td>
                      <td className="px-4 py-3 text-slate-600">{product.sku ?? '—'} / {product.unitLabel}</td>
                      <td className="px-4 py-3 text-slate-600">{product.currency} {product.unitPrice.toFixed(2)}</td>
                      <td className="px-4 py-3 text-right">
                        <Button type="button" variant="secondary" onClick={() => openEditForm(product)}>
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
                  {formMode === 'edit' ? 'Product bewerken' : 'Nieuw product'}
                </h2>
                <p className="mt-1 text-sm text-slate-600">
                  Houd de opbouw helder: basisgegevens links, prijsinformatie rechts.
                </p>
              </div>
              <Button type="button" variant="secondary" onClick={closeForm}>
                Sluiten
              </Button>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <section className="space-y-4">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Basis</h3>
                <Field label="Productnaam" value={formValues.name} onChange={(value) => setFormValues((current) => ({ ...current, name: value }))} error={errors.name} required />
                <Field label="SKU" value={formValues.sku} onChange={(value) => setFormValues((current) => ({ ...current, sku: value }))} />
                <Field label="Beschrijving" value={formValues.description} onChange={(value) => setFormValues((current) => ({ ...current, description: value }))} />
              </section>

              <section className="space-y-4">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Prijsinformatie</h3>
                <Field label="Eenheid" value={formValues.unitLabel} onChange={(value) => setFormValues((current) => ({ ...current, unitLabel: value }))} error={errors.unitLabel} required placeholder="piece" />
                <Field label="Prijs per eenheid" value={formValues.unitPrice} onChange={(value) => setFormValues((current) => ({ ...current, unitPrice: value }))} error={errors.unitPrice} placeholder="0.00" />
                <Field label="Valuta" value={formValues.currency} onChange={(value) => setFormValues((current) => ({ ...current, currency: value.toUpperCase() }))} error={errors.currency} required placeholder="EUR" />
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
                {formMode === 'edit' ? 'Wijzigingen opslaan' : 'Product opslaan'}
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
