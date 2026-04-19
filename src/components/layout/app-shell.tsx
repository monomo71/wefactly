import type { ReactNode } from 'react';
import { AppHeader } from '@/components/layout/app-header';
import { AppSidebar } from '@/components/layout/app-sidebar';
import { getCurrentAuthSession } from '@/lib/auth/auth-service';

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const session = getCurrentAuthSession();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="flex min-h-screen flex-col md:flex-row">
        <AppSidebar />
        <div className="flex min-h-screen flex-1 flex-col">
          <AppHeader userName={session?.user.fullName} />
          <main className="flex-1 px-6 py-6">{children}</main>
        </div>
      </div>
    </div>
  );
}
