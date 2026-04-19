BEGIN;

CREATE INDEX idx_users_organization_id ON users (organization_id);
CREATE INDEX idx_users_is_active ON users (is_active);
CREATE INDEX idx_settings_organization_id ON settings (organization_id);

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER organizations_set_updated_at
BEFORE UPDATE ON organizations
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER users_set_updated_at
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER settings_set_updated_at
BEFORE UPDATE ON settings
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

COMMIT;
