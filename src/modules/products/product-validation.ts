import type { ProductFormValues, ProductValidationErrors } from '@/modules/products/product-types';

export function validateProductForm(values: ProductFormValues): ProductValidationErrors {
  const errors: ProductValidationErrors = {};

  if (!values.name.trim()) {
    errors.name = 'Productnaam is verplicht.';
  }

  if (!values.unitLabel.trim()) {
    errors.unitLabel = 'Eenheid is verplicht.';
  }

  const parsedPrice = Number(values.unitPrice.replace(',', '.'));
  if (!Number.isFinite(parsedPrice) || parsedPrice < 0) {
    errors.unitPrice = 'Voer een geldige prijs in.';
  }

  if (!values.currency.trim() || values.currency.trim().length !== 3) {
    errors.currency = 'Gebruik een valuta van 3 letters, zoals EUR.';
  }

  return errors;
}
