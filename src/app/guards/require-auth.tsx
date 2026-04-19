import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { getCurrentAuthSession } from '@/lib/auth/auth-service';
import type { AuthSession } from '@/types/auth';

function AuthLoadingState() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6 text-foreground">
      <div className="rounded-lg border border-border bg-surface px-6 py-4 shadow-sm">
        Sessie controleren...
      </div>
    </main>
  );
}

export function RequireAuth() {
  const [session, setSession] = useState<AuthSession | null | undefined>(undefined);

  useEffect(() => {
    setSession(getCurrentAuthSession());
  }, []);

  if (typeof session === 'undefined') {
    return <AuthLoadingState />;
  }

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
