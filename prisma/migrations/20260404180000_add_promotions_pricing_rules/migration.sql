-- CreateEnum
CREATE TYPE "PromotionTriggerType" AS ENUM ('automatic', 'coupon');

-- CreateEnum
CREATE TYPE "PromotionRuleType" AS ENUM ('buy_x_get_y', 'nth_item_percentage', 'volume_discount', 'free_shipping');

-- CreateEnum
CREATE TYPE "PromotionStackingMode" AS ENUM ('exclusive', 'stackable');

-- CreateTable
CREATE TABLE "Promotion" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "description" TEXT,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "triggerType" "PromotionTriggerType" NOT NULL DEFAULT 'automatic',
  "couponCode" TEXT,
  "ruleType" "PromotionRuleType" NOT NULL,
  "stackingMode" "PromotionStackingMode" NOT NULL DEFAULT 'exclusive',
  "priority" INTEGER NOT NULL DEFAULT 0,
  "startsAt" TIMESTAMP(3),
  "endsAt" TIMESTAMP(3),
  "config" JSONB NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "Promotion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PromotionProduct" (
  "promotionId" TEXT NOT NULL,
  "productId" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "PromotionProduct_pkey" PRIMARY KEY ("promotionId", "productId")
);

-- CreateTable
CREATE TABLE "PromotionCategory" (
  "promotionId" TEXT NOT NULL,
  "categoryId" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "PromotionCategory_pkey" PRIMARY KEY ("promotionId", "categoryId")
);

-- CreateTable
CREATE TABLE "PromotionBrand" (
  "promotionId" TEXT NOT NULL,
  "brandId" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "PromotionBrand_pkey" PRIMARY KEY ("promotionId", "brandId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Promotion_couponCode_key" ON "Promotion"("couponCode");

-- CreateIndex
CREATE INDEX "Promotion_isActive_triggerType_idx" ON "Promotion"("isActive", "triggerType");

-- CreateIndex
CREATE INDEX "Promotion_priority_idx" ON "Promotion"("priority");

-- CreateIndex
CREATE INDEX "Promotion_startsAt_endsAt_idx" ON "Promotion"("startsAt", "endsAt");

-- CreateIndex
CREATE INDEX "Promotion_createdAt_idx" ON "Promotion"("createdAt");

-- CreateIndex
CREATE INDEX "PromotionProduct_productId_idx" ON "PromotionProduct"("productId");

-- CreateIndex
CREATE INDEX "PromotionProduct_promotionId_idx" ON "PromotionProduct"("promotionId");

-- CreateIndex
CREATE INDEX "PromotionCategory_categoryId_idx" ON "PromotionCategory"("categoryId");

-- CreateIndex
CREATE INDEX "PromotionCategory_promotionId_idx" ON "PromotionCategory"("promotionId");

-- CreateIndex
CREATE INDEX "PromotionBrand_brandId_idx" ON "PromotionBrand"("brandId");

-- CreateIndex
CREATE INDEX "PromotionBrand_promotionId_idx" ON "PromotionBrand"("promotionId");

-- AddForeignKey
ALTER TABLE "PromotionProduct"
ADD CONSTRAINT "PromotionProduct_promotionId_fkey"
FOREIGN KEY ("promotionId") REFERENCES "Promotion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PromotionProduct"
ADD CONSTRAINT "PromotionProduct_productId_fkey"
FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PromotionCategory"
ADD CONSTRAINT "PromotionCategory_promotionId_fkey"
FOREIGN KEY ("promotionId") REFERENCES "Promotion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PromotionCategory"
ADD CONSTRAINT "PromotionCategory_categoryId_fkey"
FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PromotionBrand"
ADD CONSTRAINT "PromotionBrand_promotionId_fkey"
FOREIGN KEY ("promotionId") REFERENCES "Promotion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PromotionBrand"
ADD CONSTRAINT "PromotionBrand_brandId_fkey"
FOREIGN KEY ("brandId") REFERENCES "Brand"("id") ON DELETE CASCADE ON UPDATE CASCADE;