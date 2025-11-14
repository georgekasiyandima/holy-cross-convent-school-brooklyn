-- Add attachment fields to news articles
ALTER TABLE "news_articles"
ADD COLUMN IF NOT EXISTS "attachmentUrl" TEXT,
ADD COLUMN IF NOT EXISTS "attachmentType" TEXT;

