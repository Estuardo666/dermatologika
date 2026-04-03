-- AlterTable: Add product commerce fields
ALTER TABLE "Product"
ADD COLUMN "price" DECIMAL(10, 2) NOT NULL DEFAULT 0,
ADD COLUMN "discountPrice" DECIMAL(10, 2),
ADD COLUMN "stock" INTEGER NOT NULL DEFAULT 0;

-- Guardrails to prevent invalid commercial values
ALTER TABLE "Product"
ADD CONSTRAINT "Product_price_non_negative_check" CHECK ("price" >= 0),
ADD CONSTRAINT "Product_discount_price_valid_check" CHECK (
  "discountPrice" IS NULL OR ("discountPrice" >= 0 AND "discountPrice" <= "price")
),
ADD CONSTRAINT "Product_stock_non_negative_check" CHECK ("stock" >= 0);
