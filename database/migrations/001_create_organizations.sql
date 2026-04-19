BEGIN;

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(160) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(50),
  website VARCHAR(255),
  registration_number VARCHAR(100),
  tax_number VARCHAR(100),
  address_line_1 VARCHAR(255),
  address_line_2 VARCHAR(255),
  postal_code VARCHAR(40),
  city VARCHAR(120),
  country VARCHAR(2) NOT NULL DEFAULT 'NL',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMIT;
