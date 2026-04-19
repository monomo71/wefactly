import { logoutCurrentUser } from '@/lib/auth/auth-service';
import { Button } from '@/components/ui/button';

interface AppHeaderProps {
  userName?: string;
}

export function AppHeader({ userName }: AppHeaderProps) {
  return (
    <header className="print-hidden flex items-center justify-between border-b border-border bg-surface px-6 py-4">
      <div>
        <p className="text-sm font-medium text-foreground">weFactly</p>
        <p className="text-xs text-slate-500">Phase 1 foundation</p>
      </div>

      <div className="flex items-center gap-3">
        <span className="hidden text-sm text-slate-600 md:inline">{userName ?? 'Admin'}</span>
        <Button
          type="button"
          variant="secondary"
          onClick={() => {
            logoutCurrentUser();
            window.location.href = '/login';
          }}
        >
          Uitloggen
        </Button>
      </div>
    </header>
  );
}
