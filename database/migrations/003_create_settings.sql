BEGIN;

CREATE TABLE settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE RESTRICT,
  currency VARCHAR(3) NOT NULL DEFAULT 'EUR',
  locale VARCHAR(10) NOT NULL DEFAULT 'nl-NL',
  timezone VARCHAR(64) NOT NULL DEFAULT 'Europe/Amsterdam',
  invoice_number_prefix VARCHAR(20) NOT NULL DEFAULT 'INV',
  invoice_number_next_value INTEGER NOT NULL DEFAULT 1 CHECK (invoice_number_next_value > 0),
  quote_number_prefix VARCHAR(20) NOT NULL DEFAULT 'QUO',
  quote_number_next_value INTEGER NOT NULL DEFAULT 1 CHECK (quote_number_next_value > 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT settings_organization_unique UNIQUE (organization_id)
);

COMMIT;
