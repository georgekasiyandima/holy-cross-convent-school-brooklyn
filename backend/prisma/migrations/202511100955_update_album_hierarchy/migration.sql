ALTER TABLE "albums"
ADD COLUMN IF NOT EXISTS "phase" TEXT,
ADD COLUMN IF NOT EXISTS "parentAlbumId" TEXT;

-- Add foreign key for parent album hierarchy
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'albums_parentAlbumId_fkey'
  ) THEN
    ALTER TABLE "albums"
    ADD CONSTRAINT "albums_parentAlbumId_fkey"
    FOREIGN KEY ("parentAlbumId") REFERENCES "albums"("id")
    ON UPDATE CASCADE
    ON DELETE SET NULL;
  END IF;
END $$;

-- Optional index for hierarchical queries
CREATE INDEX IF NOT EXISTS "albums_parentAlbum_idx" ON "albums" ("parentAlbumId");




