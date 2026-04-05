import "server-only";

import { getCatalogAdminData } from "@/services/admin-catalog/get-catalog-admin-data";
import { getAdminPromotions } from "@/services/admin-promotions/get-admin-promotions";
import type { AdminPromotionEditorData } from "@/types/admin-promotions";

export async function getPromotionAdminData(): Promise<AdminPromotionEditorData> {
  const [catalogData, promotions] = await Promise.all([
    getCatalogAdminData(),
    getAdminPromotions(),
  ]);

  return {
    promotions,
    categories: catalogData.categories.map((category) => ({
      id: category.id,
      name: category.name,
    })),
    brands: catalogData.brands.map((brand) => ({
      id: brand.id,
      name: brand.name,
    })),
    products: catalogData.products.map((product) => ({
      id: product.id,
      name: product.name,
      brand: product.brand,
      mediaAssetPublicUrl: product.mediaAssetPublicUrl,
      mediaAssetAltText: product.mediaAssetAltText,
    })),
  };
}