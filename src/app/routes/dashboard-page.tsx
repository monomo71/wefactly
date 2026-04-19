import { AppShell } from '@/components/layout/app-shell';
import { PageHeader } from '@/components/shared/page-header';
import { Alert } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { getCurrentAuthSession } from '@/lib/auth/auth-service';

export function DashboardPage() {
  const session = getCurrentAuthSession();

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex items-start justify-between gap-4">
          <PageHeader
            title="Dashboard"
            description="Dit blijft in fase 1 bewust een protected placeholder binnen de nieuwe app-shell."
          />
          <Badge>Protected</Badge>
        </div>

        <Alert>
          Dit is nog geen echt dashboard. Deze pagina bevestigt alleen de protected basisstructuur van fase 1.
        </Alert>

        <Card className="p-5">
          <h2 className="text-base font-semibold text-foreground">Actieve sessie</h2>
          <p className="mt-3 text-sm text-slate-600">
            Organisatie: <strong>{session?.user.organizationName ?? 'Onbekend'}</strong>
          </p>
          <p className="mt-1 text-sm text-slate-600">Ingelogd als: {session?.user.email ?? 'Onbekend'}</p>
        </Card>
      </div>
    </AppShell>
  );
}
