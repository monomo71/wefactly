import type { LoginFormValues, LoginValidationErrors } from '@/types/auth';

export function validateLoginForm(values: LoginFormValues): LoginValidationErrors {
  const errors: LoginValidationErrors = {};

  if (!values.email.trim()) {
    errors.email = 'E-mailadres is verplicht.';
  } else if (!values.email.includes('@')) {
    errors.email = 'Voer een geldig e-mailadres in.';
  }

  if (!values.password.trim()) {
    errors.password = 'Wachtwoord is verplicht.';
  } else if (values.password.length < 8) {
    errors.password = 'Gebruik minimaal 8 tekens.';
  }

  return errors;
}
