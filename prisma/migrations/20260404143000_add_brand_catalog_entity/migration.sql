-- CreateTable: normalized brand catalog
CREATE TABLE "Brand" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "mediaAssetId" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "Brand_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Brand_name_key" ON "Brand"("name");
CREATE INDEX "Brand_mediaAssetId_idx" ON "Brand"("mediaAssetId");
CREATE INDEX "Brand_createdAt_idx" ON "Brand"("createdAt");

ALTER TABLE "Brand"
ADD CONSTRAINT "Brand_mediaAssetId_fkey"
FOREIGN KEY ("mediaAssetId") REFERENCES "MediaAsset"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AlterTable: add relational brand reference to products
ALTER TABLE "Product"
ADD COLUMN "brandId" TEXT;

ALTER TABLE "Product"
ADD CONSTRAINT "Product_brandId_fkey"
FOREIGN KEY ("brandId") REFERENCES "Brand"("id") ON DELETE SET NULL ON UPDATE CASCADE;

CREATE INDEX "Product_brandId_idx" ON "Product"("brandId");

-- Backfill brands from existing product.brand values
INSERT INTO "Brand" ("id", "name")
SELECT CONCAT('brand_', SUBSTRING(MD5(source."brand") FROM 1 FOR 24)), source."brand"
FROM (
  SELECT DISTINCT BTRIM("brand") AS "brand"
  FROM "Product"
  WHERE BTRIM("brand") <> ''
) AS source
ON CONFLICT ("name") DO NOTHING;

UPDATE "Product"
SET "brandId" = "Brand"."id"
FROM "Brand"
WHERE "Brand"."name" = "Product"."brand";
