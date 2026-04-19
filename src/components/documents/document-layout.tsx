import { Card } from '@/components/ui/card';

interface PartyDetails {
  name: string;
  email?: string | null;
  phone?: string | null;
  website?: string | null;
  registrationNumber?: string | null;
  taxNumber?: string | null;
  addressLine1?: string | null;
  addressLine2?: string | null;
  postalCode?: string | null;
  city?: string | null;
  stateRegion?: string | null;
  country?: string | null;
}

interface MetaItem {
  label: string;
  value: string;
}

interface LineItem {
  description: string;
  quantity: number;
  unitPriceCents: number;
  lineTotalCents: number;
}

interface DocumentLayoutProps {
  documentLabel: string;
  title: string;
  statusLabel: string;
  organization: PartyDetails;
  customer: PartyDetails;
  meta: MetaItem[];
  lines: LineItem[];
  currency: string;
  subtotalCents: number;
  totalCents: number;
  notes?: string | null;
}

export function DocumentLayout({
  documentLabel,
  title,
  statusLabel,
  organization,
  customer,
  meta,
  lines,
  currency,
  subtotalCents,
  totalCents,
  notes,
}: DocumentLayoutProps) {
  return (
    <Card className="document-print-area mx-auto max-w-5xl p-8 md:p-10">
      <header className="flex flex-col gap-6 border-b border-border pb-8 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">{documentLabel}</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-foreground">{title}</h1>
          <p className="mt-2 text-sm text-slate-600">Professionele documentopmaak voor eerste PDF-uitvoer in weFactly.</p>
        </div>

        <div className="rounded-lg border border-border bg-slate-50 px-4 py-3 text-right">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Status</p>
          <p className="mt-1 text-sm font-semibold text-foreground">{statusLabel}</p>
        </div>
      </header>

      <section className="grid gap-6 py-8 md:grid-cols-2">
        <PartyBlock title="Van" party={organization} />
        <PartyBlock title="Aan" party={customer} />
      </section>

      <section className="grid gap-4 border-b border-border pb-8 md:grid-cols-2">
        {meta.map((item) => (
          <div key={item.label} className="rounded-md bg-slate-50 px-4 py-3">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{item.label}</p>
            <p className="mt-1 text-sm text-foreground">{item.value}</p>
          </div>
        ))}
      </section>

      <section className="py-8">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-border text-sm">
            <thead className="bg-slate-50 text-left text-slate-600">
              <tr>
                <th className="px-4 py-3 font-medium">Omschrijving</th>
                <th className="px-4 py-3 font-medium">Aantal</th>
                <th className="px-4 py-3 font-medium">Prijs</th>
                <th className="px-4 py-3 text-right font-medium">Totaal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border bg-white">
              {lines.map((line, index) => (
                <tr key={`${line.description}-${index}`}>
                  <td className="px-4 py-3 text-foreground">{line.description}</td>
                  <td className="px-4 py-3 text-slate-600">{line.quantity}</td>
                  <td className="px-4 py-3 text-slate-600">{formatMoneyFromCents(line.unitPriceCents, currency)}</td>
                  <td className="px-4 py-3 text-right text-slate-700">{formatMoneyFromCents(line.lineTotalCents, currency)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="grid gap-6 border-t border-border pt-8 md:grid-cols-[1fr_320px]">
        <div>
          <h2 className="text-base font-semibold text-foreground">Opmerking</h2>
          <p className="mt-2 text-sm text-slate-600">{notes?.trim() ? notes : 'Geen extra opmerkingen toegevoegd.'}</p>
        </div>

        <div className="rounded-lg border border-border bg-slate-50 p-4">
          <div className="flex items-center justify-between text-sm text-slate-600">
            <span>Subtotaal</span>
            <span>{formatMoneyFromCents(subtotalCents, currency)}</span>
          </div>
          <div className="mt-3 flex items-center justify-between border-t border-border pt-3 text-sm font-semibold text-foreground">
            <span>Totaal</span>
            <span>{formatMoneyFromCents(totalCents, currency)}</span>
          </div>
        </div>
      </section>
    </Card>
  );
}

function PartyBlock({ title, party }: { title: string; party: PartyDetails }) {
  const details = [
    party.email,
    party.phone,
    party.website,
    party.registrationNumber ? `Registratie: ${party.registrationNumber}` : null,
    party.taxNumber ? `Tax: ${party.taxNumber}` : null,
    party.addressLine1,
    party.addressLine2,
    [party.postalCode, party.city].filter(Boolean).join(' '),
    [party.stateRegion, party.country].filter(Boolean).join(', '),
  ].filter(Boolean);

  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{title}</p>
      <h2 className="mt-2 text-lg font-semibold text-foreground">{party.name}</h2>
      <div className="mt-3 space-y-1 text-sm text-slate-600">
        {details.length > 0 ? details.map((detail) => <p key={detail}>{detail}</p>) : <p>Geen extra gegevens beschikbaar.</p>}
      </div>
    </div>
  );
}

function formatMoneyFromCents(value: number, currency: string) {
  return new Intl.NumberFormat('nl-NL', {
    style: 'currency',
    currency,
  }).format(value / 100);
}
