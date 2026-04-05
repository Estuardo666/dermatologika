import "server-only";

import { prisma } from "@/server/db/prisma";
import type { NormalizedAdminPromotionInput } from "@/server/pricing/promotion.schemas";
import {
  createPromotionRecord,
  deletePromotionRecord,
  findPromotionRecord,
  updatePromotionRecord,
} from "@/server/pricing/promotion.repository";

export async function createPromotion(input: NormalizedAdminPromotionInput) {
  await assertScopeEntityIdsExist(input);
  return createPromotionRecord(input);
}

export async function updatePromotion(id: string, input: NormalizedAdminPromotionInput) {
  const existingPromotion = await findPromotionRecord(id);
  if (!existingPromotion) {
    throw new Error("Promotion not found.");
  }

  await assertScopeEntityIdsExist(input);
  return updatePromotionRecord(id, input);
}

export async function deletePromotion(id: string): Promise<void> {
  const existingPromotion = await findPromotionRecord(id);
  if (!existingPromotion) {
    throw new Error("Promotion not found.");
  }

  await deletePromotionRecord(id);
}

async function assertScopeEntityIdsExist(input: NormalizedAdminPromotionInput): Promise<void> {
  await Promise.all([
    assertProductsExist(input.scope.productIds),
    assertCategoriesExist(input.scope.categoryIds),
    assertBrandsExist(input.scope.brandIds),
  ]);
}

async function assertProductsExist(productIds: string[]): Promise<void> {
  if (productIds.length === 0) {
    return;
  }

  const productCount = await prisma.product.count({
    where: {
      id: {
        in: productIds,
      },
    },
  });

  if (productCount !== productIds.length) {
    throw new Error("One or more selected products do not exist.");
  }
}

async function assertCategoriesExist(categoryIds: string[]): Promise<void> {
  if (categoryIds.length === 0) {
    return;
  }

  const categoryCount = await prisma.category.count({
    where: {
      id: {
        in: categoryIds,
      },
    },
  });

  if (categoryCount !== categoryIds.length) {
    throw new Error("One or more selected categories do not exist.");
  }
}

async function assertBrandsExist(brandIds: string[]): Promise<void> {
  if (brandIds.length === 0) {
    return;
  }

  const brandCount = await prisma.brand.count({
    where: {
      id: {
        in: brandIds,
      },
    },
  });

  if (brandCount !== brandIds.length) {
    throw new Error("One or more selected brands do not exist.");
  }
}