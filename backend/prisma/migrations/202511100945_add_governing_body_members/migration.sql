-- Create governing_body_members table
CREATE TABLE IF NOT EXISTS "governing_body_members" (
  "id" TEXT PRIMARY KEY,
  "name" TEXT NOT NULL,
  "designation" TEXT,
  "sector" TEXT,
  "address" TEXT,
  "phone" TEXT,
  "email" TEXT,
  "order" INTEGER NOT NULL DEFAULT 0,
  "isActive" BOOLEAN NOT NULL DEFAULT TRUE,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Trigger to auto-update updatedAt (Postgres specific)
CREATE OR REPLACE FUNCTION update_governing_body_members_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW."updatedAt" = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger
    WHERE tgname = 'set_timestamp_governing_body_members'
  ) THEN
    CREATE TRIGGER set_timestamp_governing_body_members
    BEFORE UPDATE ON "governing_body_members"
    FOR EACH ROW
    EXECUTE FUNCTION update_governing_body_members_updated_at();
  END IF;
END $$;




