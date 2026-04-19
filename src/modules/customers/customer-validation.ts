import type { CustomerFormValues, CustomerValidationErrors } from '@/modules/customers/customer-types';

export function validateCustomerForm(values: CustomerFormValues): CustomerValidationErrors {
  const errors: CustomerValidationErrors = {};

  if (!values.name.trim()) {
    errors.name = 'Klantnaam is verplicht.';
  }

  if (values.email.trim() && !values.email.includes('@')) {
    errors.email = 'Voer een geldig e-mailadres in.';
  }

  if (values.website.trim() && !/^https?:\/\//i.test(values.website.trim())) {
    errors.website = 'Gebruik een volledige URL, bijvoorbeeld https://example.com.';
  }

  if (!values.country.trim()) {
    errors.country = 'Land is verplicht.';
  }

  return errors;
}
