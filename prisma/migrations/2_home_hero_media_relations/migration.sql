ALTER TABLE "HomePageContent"
ADD COLUMN "heroSecondaryMediaId" TEXT,
ADD COLUMN "heroTertiaryMediaId" TEXT;

CREATE INDEX "HomePageContent_heroSecondaryMediaId_idx" ON "HomePageContent"("heroSecondaryMediaId");
CREATE INDEX "HomePageContent_heroTertiaryMediaId_idx" ON "HomePageContent"("heroTertiaryMediaId");

ALTER TABLE "HomePageContent"
ADD CONSTRAINT "HomePageContent_heroSecondaryMediaId_fkey"
FOREIGN KEY ("heroSecondaryMediaId") REFERENCES "MediaAsset"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "HomePageContent"
ADD CONSTRAINT "HomePageContent_heroTertiaryMediaId_fkey"
FOREIGN KEY ("heroTertiaryMediaId") REFERENCES "MediaAsset"("id") ON DELETE SET NULL ON UPDATE CASCADE;