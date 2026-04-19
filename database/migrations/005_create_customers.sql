BEGIN;

CREATE TABLE customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE RESTRICT,
  name VARCHAR(160) NOT NULL,
  contact_name VARCHAR(160),
  email VARCHAR(255),
  phone VARCHAR(50),
  website VARCHAR(255),
  registration_number VARCHAR(100),
  tax_number VARCHAR(100),
  address_line_1 VARCHAR(255),
  address_line_2 VARCHAR(255),
  postal_code VARCHAR(40),
  city VARCHAR(120),
  state_region VARCHAR(120),
  country VARCHAR(2) NOT NULL DEFAULT 'NL',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_customers_organization_id ON customers (organization_id);
CREATE INDEX idx_customers_name ON customers (name);

CREATE TRIGGER customers_set_updated_at
BEFORE UPDATE ON customers
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

COMMIT;
