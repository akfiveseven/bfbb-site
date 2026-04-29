-- AlterTable: Convert videoURL to videoURLs (JSON array)
ALTER TABLE "Method" ADD COLUMN "videoURLs" TEXT;

-- Migrate existing data: wrap single videoURL into JSON array
UPDATE "Method" SET "videoURLs" = CASE
  WHEN "videoURL" IS NULL OR "videoURL" = 'N/A' OR "videoURL" = '' THEN '[]'
  ELSE '["' || "videoURL" || '"]'
END;

-- Make column non-nullable
ALTER TABLE "Method" ALTER COLUMN "videoURLs" SET NOT NULL;

-- Drop old column
ALTER TABLE "Method" DROP COLUMN "videoURL";
