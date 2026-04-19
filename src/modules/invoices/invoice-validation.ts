import type { InvoiceFormValues, InvoiceValidationErrors } from '@/modules/invoices/invoice-types';

export function validateInvoiceForm(values: InvoiceFormValues): InvoiceValidationErrors {
  const errors: InvoiceValidationErrors = {};

  if (!values.customerId.trim()) {
    errors.customerId = 'Kies een klant.';
  }

  if (!values.issueDate.trim()) {
    errors.issueDate = 'Factuurdatum is verplicht.';
  }

  if (values.dueDate && values.issueDate && values.dueDate < values.issueDate) {
    errors.dueDate = 'Vervaldatum mag niet vóór de factuurdatum liggen.';
  }

  if (!values.currency.trim() || values.currency.trim().length !== 3) {
    errors.currency = 'Gebruik een valuta van 3 letters, zoals EUR.';
  }

  if (values.lines.length === 0) {
    errors.lines = [{ description: 'Voeg minimaal één regel toe.' }];
    return errors;
  }

  const lineErrors = values.lines.map((line) => {
    const nextLineErrors: { description?: string; quantity?: string; unitPrice?: string } = {};

    if (!line.description.trim()) {
      nextLineErrors.description = 'Omschrijving is verplicht.';
    }

    const quantity = Number(line.quantity.replace(',', '.'));
    if (!Number.isFinite(quantity) || quantity <= 0) {
      nextLineErrors.quantity = 'Voer een geldige hoeveelheid in.';
    }

    const unitPrice = Number(line.unitPrice.replace(',', '.'));
    if (!Number.isFinite(unitPrice) || unitPrice < 0) {
      nextLineErrors.unitPrice = 'Voer een geldige prijs in.';
    }

    return nextLineErrors;
  });

  if (lineErrors.some((line) => Object.keys(line).length > 0)) {
    errors.lines = lineErrors;
  }

  return errors;
}
