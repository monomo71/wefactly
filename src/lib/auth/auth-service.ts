import { createAuthSession, clearAuthSession, getAuthSession } from '@/lib/auth/session';
import { getSetupSnapshot } from '@/lib/bootstrap/bootstrap-service';
import { getSetupStatus } from '@/lib/bootstrap/setup-status';
import { isPasswordReadyForScaffold } from '@/lib/auth/password';
import { validateLoginForm } from '@/lib/validation/login-schema';
import type { AuthSession, LoginFormValues } from '@/types/auth';

export async function loginWithEmailPassword(values: LoginFormValues): Promise<AuthSession> {
  const errors = validateLoginForm(values);
  if (Object.keys(errors).length > 0) {
    throw new Error('Controleer de inlogvelden en probeer opnieuw.');
  }

  const setupStatus = await getSetupStatus();
  if (!setupStatus.isInitialized) {
    throw new Error('Rond eerst de eerste setup af voordat je kunt inloggen.');
  }

  const snapshot = getSetupSnapshot();
  if (!snapshot) {
    throw new Error('Geen setupgegevens gevonden voor deze omgeving.');
  }

  const email = values.email.trim().toLowerCase();
  const expectedEmail = snapshot.adminEmail.trim().toLowerCase();

  if (email !== expectedEmail || !isPasswordReadyForScaffold(values.password)) {
    throw new Error('Onjuiste inloggegevens.');
  }

  return createAuthSession({
    email: snapshot.adminEmail,
    fullName: snapshot.adminFullName,
    organizationName: snapshot.organizationName,
  });
}

export function getCurrentAuthSession(): AuthSession | null {
  return getAuthSession();
}

export function logoutCurrentUser(): void {
  clearAuthSession();
}
