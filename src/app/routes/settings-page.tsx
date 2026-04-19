import { AppShell } from '@/components/layout/app-shell';
import { PageHeader } from '@/components/shared/page-header';
import { Alert } from '@/components/ui/alert';
import { Card } from '@/components/ui/card';

export function SettingsPage() {
  return (
    <AppShell>
      <div className="space-y-6">
        <PageHeader
          title="Settings"
          description="Centrale instellingen blijven in fase 1 bewust beperkt en voorbereid op latere uitbreiding."
        />

        <Alert>
          Dit is een placeholder-scherm voor de fase 1 basis. Verdere settings-uitwerking volgt later.
        </Alert>

        <Card className="p-5">
          <h2 className="text-base font-semibold text-foreground">Voorbereide basis</h2>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-slate-600">
            <li>organisatie-instellingen</li>
            <li>documentnummering per documenttype</li>
            <li>ruimte voor mailinstellingen in latere fases</li>
          </ul>
        </Card>
      </div>
    </AppShell>
  );
}
