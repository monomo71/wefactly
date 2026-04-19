import type { AuthSession, AuthenticatedUser } from '@/types/auth';

const AUTH_SESSION_KEY = 'wefactly.auth.session';

export function getAuthSession(): AuthSession | null {
  if (typeof window === 'undefined') {
    return null;
  }

  const rawValue = window.localStorage.getItem(AUTH_SESSION_KEY);
  if (!rawValue) {
    return null;
  }

  try {
    return JSON.parse(rawValue) as AuthSession;
  } catch {
    return null;
  }
}

export function createAuthSession(user: AuthenticatedUser): AuthSession {
  const session: AuthSession = {
    user,
    createdAt: new Date().toISOString(),
  };

  if (typeof window !== 'undefined') {
    window.localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(session));
  }

  return session;
}

export function clearAuthSession(): void {
  if (typeof window !== 'undefined') {
    window.localStorage.removeItem(AUTH_SESSION_KEY);
  }
}
