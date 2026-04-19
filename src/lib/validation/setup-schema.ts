import type { SetupFormValues, SetupValidationErrors } from '@/types/auth';

export function validateSetupForm(values: SetupFormValues): SetupValidationErrors {
  const errors: SetupValidationErrors = {};

  if (!values.organizationName.trim()) {
    errors.organizationName = 'Bedrijfsnaam is verplicht.';
  }

  if (!values.adminFullName.trim()) {
    errors.adminFullName = 'Naam van de beheerder is verplicht.';
  }

  if (!values.adminEmail.trim()) {
    errors.adminEmail = 'E-mailadres is verplicht.';
  } else if (!values.adminEmail.includes('@')) {
    errors.adminEmail = 'Voer een geldig e-mailadres in.';
  }

  if (!values.password.trim()) {
    errors.password = 'Wachtwoord is verplicht.';
  } else if (values.password.length < 8) {
    errors.password = 'Gebruik minimaal 8 tekens.';
  }

  if (!values.country.trim()) {
    errors.country = 'Land is verplicht.';
  }

  return errors;
}
