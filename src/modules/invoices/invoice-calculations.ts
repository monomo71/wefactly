import type { InvoiceFormValues } from '@/modules/invoices/invoice-types';

export function toMoneyCents(value: string): number {
  const parsedValue = Number(value.replace(',', '.'));
  if (!Number.isFinite(parsedValue)) {
    return 0;
  }

  return Math.round(parsedValue * 100);
}

export function normalizeQuantity(value: string): number {
  const parsedValue = Number(value.replace(',', '.'));
  return Number.isFinite(parsedValue) && parsedValue > 0 ? parsedValue : 1;
}

export function calculateInvoiceDraftTotals(values: InvoiceFormValues) {
  const lines = values.lines.map((line, index) => {
    const quantity = normalizeQuantity(line.quantity);
    const unitPriceCents = toMoneyCents(line.unitPrice);
    const lineTotalCents = Math.round(quantity * unitPriceCents);

    return {
      index,
      quantity,
      unitPriceCents,
      lineTotalCents,
    };
  });

  const subtotalCents = lines.reduce((total, line) => total + line.lineTotalCents, 0);

  return {
    lines,
    subtotalCents,
    totalCents: subtotalCents,
  };
}

export function formatMoneyFromCents(value: number, currency: string): string {
  return `${currency} ${(value / 100).toFixed(2)}`;
}

export function centsToDecimalString(value: number): string {
  return (value / 100).toFixed(2);
}
