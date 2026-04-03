-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "categoryId" TEXT,
ALTER COLUMN "lastSyncedAt" SET DATA TYPE TIMESTAMP(3);

-- CreateIndex
CREATE INDEX "Product_categoryId_idx" ON "Product"("categoryId");

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;
