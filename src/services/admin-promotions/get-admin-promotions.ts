import "server-only";

import { parsePromotionConfig } from "@/server/pricing/promotion.schemas";
import {
  listAdminPromotionRecords,
  type PromotionRecord,
} from "@/server/pricing/promotion.repository";
import type { AdminPromotionItem } from "@/types/admin-promotions";

export async function getAdminPromotions(): Promise<AdminPromotionItem[]> {
  const records = await listAdminPromotionRecords();
  return records.map(mapAdminPromotionItem);
}

export function mapAdminPromotionItem(record: PromotionRecord): AdminPromotionItem {
  return {
    id: record.id,
    name: record.name,
    description: record.description,
    isActive: record.isActive,
    triggerType: record.triggerType,
    couponCode: record.couponCode,
    ruleType: record.ruleType,
    stackingMode: record.stackingMode,
    priority: record.priority,
    startsAt: record.startsAt?.toISOString() ?? null,
    endsAt: record.endsAt?.toISOString() ?? null,
    scope: {
      productIds: record.productScopes.map((entry) => entry.productId),
      categoryIds: record.categoryScopes.map((entry) => entry.categoryId),
      brandIds: record.brandScopes.map((entry) => entry.brandId),
    },
    config: parsePromotionConfig(record.ruleType, record.config),
    createdAt: record.createdAt.toISOString(),
    updatedAt: record.updatedAt.toISOString(),
  };
}