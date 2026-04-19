import { FormEvent, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Alert } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { submitInitialSetup } from '@/lib/bootstrap/bootstrap-service';
import { validateSetupForm } from '@/lib/validation/setup-schema';
import type { SetupFormValues } from '@/types/auth';

const initialValues: SetupFormValues = {
  organizationName: '',
  adminFullName: '',
  adminEmail: '',
  password: '',
  registrationNumber: '',
  taxNumber: '',
  phone: '',
  website: '',
  city: '',
  country: 'NL',
};

export function SetupPage() {
  const navigate = useNavigate();
  const [values, setValues] = useState<SetupFormValues>(initialValues);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const errors = useMemo(() => validateSetupForm(values), [values]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage('');

    if (Object.keys(errors).length > 0) {
      setErrorMessage('Controleer de verplichte velden en probeer opnieuw.');
      return;
    }

    setIsSubmitting(true);

    try {
      await submitInitialSetup(values);
      navigate('/login', { replace: true });
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Setup kon niet worden opgeslagen.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-background px-6 py-10 text-foreground">
      <div className="mx-auto max-w-3xl rounded-lg border border-border bg-surface p-8 shadow-sm">
        <div className="mb-8">
          <span className="inline-flex rounded-full bg-muted px-3 py-1 text-sm font-medium">
            Eerste setup
          </span>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight">weFactly initialiseren</h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-600">
            Deze eenmalige stap maakt de basis van de organisatie en het eerste beheerdersaccount aan.
          </p>
        </div>

        <form className="space-y-8" onSubmit={handleSubmit}>
          <section className="space-y-4">
            <h2 className="text-lg font-semibold">Organisatie</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <Field
                label="Bedrijfsnaam"
                value={values.organizationName}
                onChange={(value) => setValues((current) => ({ ...current, organizationName: value }))}
                error={errors.organizationName}
                required
              />
              <Field
                label="Registratienummer"
                value={values.registrationNumber}
                onChange={(value) => setValues((current) => ({ ...current, registrationNumber: value }))}
                error={errors.registrationNumber}
              />
              <Field
                label="BTW / tax nummer"
                value={values.taxNumber}
                onChange={(value) => setValues((current) => ({ ...current, taxNumber: value }))}
                error={errors.taxNumber}
              />
              <Field
                label="Plaats"
                value={values.city}
                onChange={(value) => setValues((current) => ({ ...current, city: value }))}
                error={errors.city}
              />
              <Field
                label="Telefoon"
                value={values.phone}
                onChange={(value) => setValues((current) => ({ ...current, phone: value }))}
                error={errors.phone}
              />
              <Field
                label="Website"
                value={values.website}
                onChange={(value) => setValues((current) => ({ ...current, website: value }))}
                error={errors.website}
              />
              <Field
                label="Land"
                value={values.country}
                onChange={(value) => setValues((current) => ({ ...current, country: value.toUpperCase() }))}
                error={errors.country}
                required
              />
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-lg font-semibold">Beheerder</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <Field
                label="Naam"
                value={values.adminFullName}
                onChange={(value) => setValues((current) => ({ ...current, adminFullName: value }))}
                error={errors.adminFullName}
                required
              />
              <Field
                label="E-mail"
                type="email"
                value={values.adminEmail}
                onChange={(value) => setValues((current) => ({ ...current, adminEmail: value }))}
                error={errors.adminEmail}
                required
              />
              <div className="md:col-span-2">
                <Field
                  label="Wachtwoord"
                  type="password"
                  value={values.password}
                  onChange={(value) => setValues((current) => ({ ...current, password: value }))}
                  error={errors.password}
                  required
                />
              </div>
            </div>
          </section>

          {errorMessage ? <Alert variant="error">{errorMessage}</Alert> : null}

          <div className="flex items-center justify-between gap-4 border-t border-border pt-6">
            <p className="text-sm text-slate-600">Na afronding wordt deze publieke setup niet opnieuw getoond.</p>
            <Button type="submit" isLoading={isSubmitting}>
              {isSubmitting ? 'Bezig met opslaan...' : 'Setup afronden'}
            </Button>
          </div>
        </form>
      </div>
    </main>
  );
}

interface FieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  type?: 'text' | 'email' | 'password';
  required?: boolean;
}

function Field({ label, value, onChange, error, type = 'text', required = false }: FieldProps) {
  return (
    <label className="block text-sm font-medium text-foreground">
      <span className="mb-1 block">
        {label}
        {required ? ' *' : ''}
      </span>
      <Input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
      {error ? <span className="mt-1 block text-xs text-red-600">{error}</span> : null}
    </label>
  );
}
