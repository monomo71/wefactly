import { FormEvent, useMemo, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { Alert } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { getCurrentAuthSession, loginWithEmailPassword } from '@/lib/auth/auth-service';
import { getSetupSnapshot } from '@/lib/bootstrap/bootstrap-service';
import { validateLoginForm } from '@/lib/validation/login-schema';
import type { LoginFormValues } from '@/types/auth';

const initialValues: LoginFormValues = {
  email: '',
  password: '',
};

export function LoginPage() {
  const navigate = useNavigate();
  const snapshot = getSetupSnapshot();
  const activeSession = getCurrentAuthSession();
  const [values, setValues] = useState<LoginFormValues>(initialValues);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const errors = useMemo(() => validateLoginForm(values), [values]);

  if (activeSession) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage('');

    if (Object.keys(errors).length > 0) {
      setErrorMessage('Controleer de inlogvelden en probeer opnieuw.');
      return;
    }

    setIsSubmitting(true);

    try {
      await loginWithEmailPassword(values);
      navigate('/dashboard', { replace: true });
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Inloggen is niet gelukt.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-background px-6 py-10 text-foreground">
      <div className="mx-auto max-w-2xl rounded-lg border border-border bg-surface p-8 shadow-sm">
        <span className="inline-flex rounded-full bg-muted px-3 py-1 text-sm font-medium">
          Login
        </span>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight">Inloggen bij weFactly</h1>
        <p className="mt-2 text-sm text-slate-600">
          Gebruik het admin-account dat tijdens de eerste setup is aangemaakt.
        </p>

        {snapshot ? (
          <div className="mt-6 rounded-md border border-border bg-slate-50 p-4 text-sm text-slate-700">
            <p>
              Organisatie: <strong>{snapshot.organizationName}</strong>
            </p>
            <p className="mt-1">Admin e-mail: {snapshot.adminEmail}</p>
          </div>
        ) : null}

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <Field
            label="E-mail"
            type="email"
            value={values.email}
            onChange={(value) => setValues((current) => ({ ...current, email: value }))}
            error={errors.email}
          />
          <Field
            label="Wachtwoord"
            type="password"
            value={values.password}
            onChange={(value) => setValues((current) => ({ ...current, password: value }))}
            error={errors.password}
          />

          {errorMessage ? <Alert variant="error">{errorMessage}</Alert> : null}

          <div className="flex items-center justify-end pt-2">
            <Button type="submit" isLoading={isSubmitting}>
              {isSubmitting ? 'Bezig met inloggen...' : 'Inloggen'}
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
}

function Field({ label, value, onChange, error, type = 'text' }: FieldProps) {
  return (
    <label className="block text-sm font-medium text-foreground">
      <span className="mb-1 block">{label}</span>
      <Input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
      {error ? <span className="mt-1 block text-xs text-red-600">{error}</span> : null}
    </label>
  );
}
