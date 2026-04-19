BEGIN;

CREATE TABLE quote_lines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quote_id UUID NOT NULL REFERENCES quotes(id) ON DELETE CASCADE,
  source_product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  description TEXT NOT NULL,
  quantity NUMERIC(12, 2) NOT NULL DEFAULT 1 CHECK (quantity > 0),
  unit_price_cents INTEGER NOT NULL DEFAULT 0 CHECK (unit_price_cents >= 0),
  line_total_cents INTEGER NOT NULL DEFAULT 0 CHECK (line_total_cents >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_quote_lines_quote_id ON quote_lines (quote_id);
CREATE INDEX idx_quote_lines_sort_order ON quote_lines (quote_id, sort_order);

CREATE TRIGGER quote_lines_set_updated_at
BEFORE UPDATE ON quote_lines
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

COMMIT;
