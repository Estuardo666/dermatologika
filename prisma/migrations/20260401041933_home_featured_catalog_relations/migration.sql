-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "href" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "mediaAssetId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "href" TEXT NOT NULL,
    "badge" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "mediaAssetId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HomeFeaturedCategory" (
    "id" TEXT NOT NULL,
    "homePageContentId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "HomeFeaturedCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HomeFeaturedProduct" (
    "id" TEXT NOT NULL,
    "homePageContentId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "HomeFeaturedProduct_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Category_slug_key" ON "Category"("slug");

-- CreateIndex
CREATE INDEX "Category_isActive_idx" ON "Category"("isActive");

-- CreateIndex
CREATE INDEX "Category_mediaAssetId_idx" ON "Category"("mediaAssetId");

-- CreateIndex
CREATE INDEX "Category_createdAt_idx" ON "Category"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Product_slug_key" ON "Product"("slug");

-- CreateIndex
CREATE INDEX "Product_isActive_idx" ON "Product"("isActive");

-- CreateIndex
CREATE INDEX "Product_mediaAssetId_idx" ON "Product"("mediaAssetId");

-- CreateIndex
CREATE INDEX "Product_createdAt_idx" ON "Product"("createdAt");

-- CreateIndex
CREATE INDEX "HomeFeaturedCategory_categoryId_idx" ON "HomeFeaturedCategory"("categoryId");

-- CreateIndex
CREATE UNIQUE INDEX "HomeFeaturedCategory_homePageContentId_categoryId_key" ON "HomeFeaturedCategory"("homePageContentId", "categoryId");

-- CreateIndex
CREATE UNIQUE INDEX "HomeFeaturedCategory_homePageContentId_position_key" ON "HomeFeaturedCategory"("homePageContentId", "position");

-- CreateIndex
CREATE INDEX "HomeFeaturedProduct_productId_idx" ON "HomeFeaturedProduct"("productId");

-- CreateIndex
CREATE UNIQUE INDEX "HomeFeaturedProduct_homePageContentId_productId_key" ON "HomeFeaturedProduct"("homePageContentId", "productId");

-- CreateIndex
CREATE UNIQUE INDEX "HomeFeaturedProduct_homePageContentId_position_key" ON "HomeFeaturedProduct"("homePageContentId", "position");

-- AddForeignKey
ALTER TABLE "Category" ADD CONSTRAINT "Category_mediaAssetId_fkey" FOREIGN KEY ("mediaAssetId") REFERENCES "MediaAsset"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_mediaAssetId_fkey" FOREIGN KEY ("mediaAssetId") REFERENCES "MediaAsset"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HomeFeaturedCategory" ADD CONSTRAINT "HomeFeaturedCategory_homePageContentId_fkey" FOREIGN KEY ("homePageContentId") REFERENCES "HomePageContent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HomeFeaturedCategory" ADD CONSTRAINT "HomeFeaturedCategory_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HomeFeaturedProduct" ADD CONSTRAINT "HomeFeaturedProduct_homePageContentId_fkey" FOREIGN KEY ("homePageContentId") REFERENCES "HomePageContent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HomeFeaturedProduct" ADD CONSTRAINT "HomeFeaturedProduct_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
