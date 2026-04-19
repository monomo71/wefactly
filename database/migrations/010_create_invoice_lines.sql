BEGIN;

CREATE TABLE invoice_lines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id UUID NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
  source_product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  description TEXT NOT NULL,
  quantity NUMERIC(12, 2) NOT NULL DEFAULT 1 CHECK (quantity > 0),
  unit_price_cents INTEGER NOT NULL DEFAULT 0 CHECK (unit_price_cents >= 0),
  line_total_cents INTEGER NOT NULL DEFAULT 0 CHECK (line_total_cents >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_invoice_lines_invoice_id ON invoice_lines (invoice_id);
CREATE INDEX idx_invoice_lines_sort_order ON invoice_lines (invoice_id, sort_order);

CREATE TRIGGER invoice_lines_set_updated_at
BEFORE UPDATE ON invoice_lines
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

COMMIT;
