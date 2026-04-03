-- AlterTable: Add product sync tracking fields
ALTER TABLE "Product" ADD COLUMN "externalId" TEXT,
ADD COLUMN "externalSourceId" TEXT,
ADD COLUMN "lastSyncedAt" TIMESTAMPTZ,
ADD COLUMN "syncVersion" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN "externalMetadata" JSONB;

-- Create unique constraint on externalId
ALTER TABLE "Product" ADD CONSTRAINT "Product_externalId_key" UNIQUE ("externalId");

-- Create indexes for sync performance
CREATE INDEX "Product_externalId_idx" ON "Product"("externalId");
CREATE INDEX "Product_externalSourceId_idx" ON "Product"("externalSourceId");
CREATE INDEX "Product_lastSyncedAt_idx" ON "Product"("lastSyncedAt");
