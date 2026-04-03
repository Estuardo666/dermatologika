CREATE TABLE "ProductBadgePreset" (
  "id" TEXT NOT NULL,
  "label" TEXT NOT NULL,
  "color" TEXT NOT NULL,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "sortOrder" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "ProductBadgePreset_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "ProductBadgePreset_label_key" ON "ProductBadgePreset"("label");
CREATE INDEX "ProductBadgePreset_isActive_idx" ON "ProductBadgePreset"("isActive");
CREATE INDEX "ProductBadgePreset_sortOrder_idx" ON "ProductBadgePreset"("sortOrder");
CREATE INDEX "ProductBadgePreset_createdAt_idx" ON "ProductBadgePreset"("createdAt");