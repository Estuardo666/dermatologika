-- CreateEnum
CREATE TYPE "MediaAssetKind" AS ENUM ('image', 'video');

-- CreateTable
CREATE TABLE "MediaAsset" (
    "id" TEXT NOT NULL,
    "storageKey" TEXT NOT NULL,
    "publicUrl" TEXT,
    "kind" "MediaAssetKind" NOT NULL,
    "mimeType" TEXT,
    "altText" TEXT,
    "posterUrl" TEXT,
    "width" INTEGER,
    "height" INTEGER,
    "durationSeconds" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MediaAsset_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HomePageContent" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL DEFAULT 'home',
    "heroEyebrow" TEXT NOT NULL,
    "heroTitle" TEXT NOT NULL,
    "heroSubtitle" TEXT NOT NULL,
    "heroSupportingBadge" TEXT NOT NULL,
    "heroPrimaryCtaText" TEXT NOT NULL,
    "heroPrimaryCtaHref" TEXT NOT NULL,
    "heroSecondaryCtaText" TEXT,
    "heroSecondaryCtaHref" TEXT,
    "heroMediaId" TEXT,
    "featuredCategoriesEyebrow" TEXT NOT NULL,
    "featuredCategoriesTitle" TEXT NOT NULL,
    "featuredCategoriesDescription" TEXT NOT NULL,
    "featuredCategoriesItems" JSONB NOT NULL,
    "featuredProductsEyebrow" TEXT NOT NULL,
    "featuredProductsTitle" TEXT NOT NULL,
    "featuredProductsDescription" TEXT NOT NULL,
    "featuredProductsItems" JSONB NOT NULL,
    "trustHighlightsEyebrow" TEXT NOT NULL,
    "trustHighlightsTitle" TEXT NOT NULL,
    "trustHighlightsDescription" TEXT NOT NULL,
    "trustHighlightsItems" JSONB NOT NULL,
    "ctaEyebrow" TEXT NOT NULL,
    "ctaTitle" TEXT NOT NULL,
    "ctaDescription" TEXT NOT NULL,
    "ctaPrimaryCtaText" TEXT NOT NULL,
    "ctaPrimaryCtaHref" TEXT NOT NULL,
    "ctaSecondaryCtaText" TEXT,
    "ctaSecondaryCtaHref" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HomePageContent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MediaAsset_storageKey_key" ON "MediaAsset"("storageKey");

-- CreateIndex
CREATE INDEX "MediaAsset_kind_idx" ON "MediaAsset"("kind");

-- CreateIndex
CREATE INDEX "MediaAsset_createdAt_idx" ON "MediaAsset"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "HomePageContent_slug_key" ON "HomePageContent"("slug");

-- CreateIndex
CREATE INDEX "HomePageContent_heroMediaId_idx" ON "HomePageContent"("heroMediaId");

-- CreateIndex
CREATE INDEX "HomePageContent_createdAt_idx" ON "HomePageContent"("createdAt");

-- AddForeignKey
ALTER TABLE "HomePageContent" ADD CONSTRAINT "HomePageContent_heroMediaId_fkey" FOREIGN KEY ("heroMediaId") REFERENCES "MediaAsset"("id") ON DELETE SET NULL ON UPDATE CASCADE;
