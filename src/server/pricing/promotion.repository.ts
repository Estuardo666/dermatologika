import "server-only";

import type { Prisma } from "@prisma/client";

import { prisma } from "@/server/db/prisma";
import type { NormalizedAdminPromotionInput } from "@/server/pricing/promotion.schemas";

const promotionInclude = {
  productScopes: {
    select: {
      productId: true,
    },
    orderBy: {
      productId: "asc",
    },
  },
  categoryScopes: {
    select: {
      categoryId: true,
    },
    orderBy: {
      categoryId: "asc",
    },
  },
  brandScopes: {
    select: {
      brandId: true,
    },
    orderBy: {
      brandId: "asc",
    },
  },
} satisfies Prisma.PromotionInclude;

export type PromotionRecord = Prisma.PromotionGetPayload<{
  include: typeof promotionInclude;
}>;

export async function listAdminPromotionRecords(): Promise<PromotionRecord[]> {
  return prisma.promotion.findMany({
    include: promotionInclude,
    orderBy: [
      { priority: "desc" },
      { createdAt: "desc" },
    ],
  });
}

export async function listActivePromotionRecords(): Promise<PromotionRecord[]> {
  return prisma.promotion.findMany({
    where: {
      isActive: true,
    },
    include: promotionInclude,
    orderBy: [
      { priority: "desc" },
      { createdAt: "desc" },
    ],
  });
}

export async function findPromotionRecord(id: string): Promise<PromotionRecord | null> {
  return prisma.promotion.findUnique({
    where: {
      id,
    },
    include: promotionInclude,
  });
}

export async function createPromotionRecord(input: NormalizedAdminPromotionInput): Promise<PromotionRecord> {
  const createdPromotion = await prisma.promotion.create({
    data: {
      name: input.name,
      description: input.description,
      isActive: input.isActive,
      triggerType: input.triggerType,
      couponCode: input.couponCode,
      ruleType: input.ruleType,
      stackingMode: input.stackingMode,
      priority: input.priority,
      startsAt: input.startsAt,
      endsAt: input.endsAt,
      config: input.config as unknown as Prisma.InputJsonValue,
      productScopes: {
        create: input.scope.productIds.map((productId) => ({
          productId,
        })),
      },
      categoryScopes: {
        create: input.scope.categoryIds.map((categoryId) => ({
          categoryId,
        })),
      },
      brandScopes: {
        create: input.scope.brandIds.map((brandId) => ({
          brandId,
        })),
      },
    },
    select: {
      id: true,
    },
  });

  const promotion = await findPromotionRecord(createdPromotion.id);
  if (!promotion) {
    throw new Error("Failed to reload created promotion.");
  }

  return promotion;
}

export async function updatePromotionRecord(id: string, input: NormalizedAdminPromotionInput): Promise<PromotionRecord> {
  await prisma.promotion.update({
    where: {
      id,
    },
    data: {
      name: input.name,
      description: input.description,
      isActive: input.isActive,
      triggerType: input.triggerType,
      couponCode: input.couponCode,
      ruleType: input.ruleType,
      stackingMode: input.stackingMode,
      priority: input.priority,
      startsAt: input.startsAt,
      endsAt: input.endsAt,
      config: input.config as unknown as Prisma.InputJsonValue,
      productScopes: {
        deleteMany: {},
        create: input.scope.productIds.map((productId) => ({
          productId,
        })),
      },
      categoryScopes: {
        deleteMany: {},
        create: input.scope.categoryIds.map((categoryId) => ({
          categoryId,
        })),
      },
      brandScopes: {
        deleteMany: {},
        create: input.scope.brandIds.map((brandId) => ({
          brandId,
        })),
      },
    },
  });

  const promotion = await findPromotionRecord(id);
  if (!promotion) {
    throw new Error("Failed to reload updated promotion.");
  }

  return promotion;
}

export async function deletePromotionRecord(id: string): Promise<void> {
  await prisma.promotion.delete({
    where: {
      id,
    },
  });
}