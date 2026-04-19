import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { getSetupStatus } from '@/lib/bootstrap/setup-status';
import type { SetupStatus } from '@/types/auth';

interface SetupGuardProps {
  requiresInitialized: boolean;
}

function SetupLoadingState() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6 text-foreground">
      <div className="rounded-lg border border-border bg-surface px-6 py-4 shadow-sm">
        Omgeving controleren...
      </div>
    </main>
  );
}

function SetupGuard({ requiresInitialized }: SetupGuardProps) {
  const [status, setStatus] = useState<SetupStatus | null>(null);

  useEffect(() => {
    let active = true;

    getSetupStatus().then((nextStatus) => {
      if (active) {
        setStatus(nextStatus);
      }
    });

    return () => {
      active = false;
    };
  }, []);

  if (!status) {
    return <SetupLoadingState />;
  }

  if (requiresInitialized && !status.isInitialized) {
    return <Navigate to="/setup" replace />;
  }

  if (!requiresInitialized && status.isInitialized) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

export function RequireSetupIncomplete() {
  return <SetupGuard requiresInitialized={false} />;
}

export function RequireSetupComplete() {
  return <SetupGuard requiresInitialized />;
}
