-- AlterTable: add brand to products and backfill from external metadata when available
ALTER TABLE "Product"
ADD COLUMN "brand" TEXT NOT NULL DEFAULT 'Sin marca';

UPDATE "Product"
SET "brand" = COALESCE(
  NULLIF(BTRIM(COALESCE(
    "externalMetadata"->>'brand',
    "externalMetadata"->>'marca',
    "externalMetadata"->>'manufacturer',
    "externalMetadata"->>'vendor',
    "externalMetadata"->>'brandName'
  )), ''),
  'Sin marca'
);

-- CreateTable: product category assignments for multi-category membership
CREATE TABLE "ProductCategoryAssignment" (
  "productId" TEXT NOT NULL,
  "categoryId" TEXT NOT NULL,
  "position" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "ProductCategoryAssignment_pkey" PRIMARY KEY ("productId", "categoryId"),
  CONSTRAINT "ProductCategoryAssignment_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "ProductCategoryAssignment_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- Backfill existing primary categories into the assignment table
INSERT INTO "ProductCategoryAssignment" ("productId", "categoryId", "position")
SELECT "id", "categoryId", 0
FROM "Product"
WHERE "categoryId" IS NOT NULL
ON CONFLICT ("productId", "categoryId") DO NOTHING;

CREATE INDEX "ProductCategoryAssignment_categoryId_idx" ON "ProductCategoryAssignment"("categoryId");
CREATE INDEX "ProductCategoryAssignment_productId_position_idx" ON "ProductCategoryAssignment"("productId", "position");
