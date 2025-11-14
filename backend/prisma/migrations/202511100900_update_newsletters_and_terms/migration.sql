-- Add extended metadata columns to newsletters table
ALTER TABLE "newsletters"
ADD COLUMN IF NOT EXISTS "priority" VARCHAR(20) NOT NULL DEFAULT 'NORMAL',
ADD COLUMN IF NOT EXISTS "status" VARCHAR(20) NOT NULL DEFAULT 'DRAFT',
ADD COLUMN IF NOT EXISTS "scheduledFor" TIMESTAMP,
ADD COLUMN IF NOT EXISTS "targetAudience" VARCHAR(32) NOT NULL DEFAULT 'ALL',
ADD COLUMN IF NOT EXISTS "gradeLevels" TEXT,
ADD COLUMN IF NOT EXISTS "attachments" TEXT,
ADD COLUMN IF NOT EXISTS "authorId" TEXT,
ADD COLUMN IF NOT EXISTS "sentAt" TIMESTAMP;

-- Ensure existing rows have default values
UPDATE "newsletters"
SET
  "priority" = COALESCE("priority", 'NORMAL'),
  "status" = COALESCE("status", 'DRAFT'),
  "targetAudience" = COALESCE("targetAudience", 'ALL');

-- Add foreign key for author
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.table_constraints
    WHERE constraint_name = 'newsletters_authorId_fkey'
      AND table_name = 'newsletters'
  ) THEN
    ALTER TABLE "newsletters"
    ADD CONSTRAINT "newsletters_authorId_fkey"
    FOREIGN KEY ("authorId") REFERENCES "users"("id")
    ON UPDATE CASCADE
    ON DELETE SET NULL;
  END IF;
END $$;

-- Extend terms table with term number and description
ALTER TABLE "terms"
ADD COLUMN IF NOT EXISTS "termNumber" INTEGER,
ADD COLUMN IF NOT EXISTS "description" TEXT;

-- Populate default term numbers when missing
UPDATE "terms"
SET "termNumber" = COALESCE("termNumber", 1)
WHERE "termNumber" IS NULL;

-- Enforce non-null term number
ALTER TABLE "terms"
ALTER COLUMN "termNumber" SET NOT NULL;

-- Ensure unique constraint on year + termNumber
CREATE UNIQUE INDEX IF NOT EXISTS "terms_year_termNumber_key"
ON "terms" ("year", "termNumber");




