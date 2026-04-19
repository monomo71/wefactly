import { FormEvent, useMemo, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
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

          {errorMessage ? (
            <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {errorMessage}
            </div>
          ) : null}

          <div className="flex items-center justify-end pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-60"
            >
              {isSubmitting ? 'Bezig met inloggen...' : 'Inloggen'}
            </button>
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
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-md border border-border bg-white px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
      />
      {error ? <span className="mt-1 block text-xs text-red-600">{error}</span> : null}
    </label>
  );
}
