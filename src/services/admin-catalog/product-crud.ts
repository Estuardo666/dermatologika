import "server-only";

import { adminProductFormSchema } from "@/features/admin-catalog/schemas/admin-catalog.schema";
import { normalizeBadgeColor } from "@/lib/product-badges";
import { resolveProductIdentity } from "@/lib/catalog-slugs";
import {
  findAdminProductRecord,
  findConflictingProductRecord,
} from "@/server/catalog/admin-catalog.repository";
import { prisma } from "@/server/db/prisma";
import type { AdminCatalogBulkActionResult, AdminProductFormData } from "@/types/admin-catalog";

import { CatalogBulkActionError, CatalogConflictError } from "./admin-catalog.errors";

function normalizeMediaAssetId(mediaAssetId: string): string | null {
  const normalizedValue = mediaAssetId.trim();
  return normalizedValue.length > 0 ? normalizedValue : null;
}

function normalizeOptionalString(value: string): string | null {
  const normalizedValue = value.trim();
  return normalizedValue.length > 0 ? normalizedValue : null;
}

function normalizeOptionalBadgeColor(input: { badge: string; badgeColor: string }): string | null {
  if (input.badge.trim().length === 0) {
    return null;
  }

  return normalizeBadgeColor(input.badgeColor);
}

async function assertMediaAssetExists(mediaAssetId: string | null): Promise<void> {
  if (!mediaAssetId) {
    return;
  }

  const mediaAsset = await prisma.mediaAsset.findUnique({
    where: {
      id: mediaAssetId,
    },
    select: {
      id: true,
    },
  });

  if (!mediaAsset) {
    throw new Error("The selected product media asset does not exist.");
  }
}

async function assertCategoryExists(categoryId: string): Promise<void> {
  const category = await prisma.category.findUnique({
    where: {
      id: categoryId,
    },
    select: {
      id: true,
    },
  });

  if (!category) {
    throw new Error("The selected category does not exist.");
  }
}

function equalsIgnoreCase(left: string, right: string): boolean {
  return left.trim().toLocaleLowerCase("es") === right.trim().toLocaleLowerCase("es");
}

async function assertProductBusinessUniqueness(input: {
  excludeId?: string;
  name: string;
  slug: string;
  href: string;
}) {
  const conflict = await findConflictingProductRecord(input);
  if (!conflict) {
    return;
  }

  if (equalsIgnoreCase(conflict.name, input.name)) {
    throw new CatalogConflictError("Product name already exists.");
  }

  if (equalsIgnoreCase(conflict.slug, input.slug)) {
    throw new CatalogConflictError("Product slug already exists.");
  }

  if (equalsIgnoreCase(conflict.href, input.href)) {
    throw new CatalogConflictError("Product href already exists.");
  }
}

export async function createProduct(input: AdminProductFormData) {
  const parsedInput = adminProductFormSchema.parse(input);
  const identity = resolveProductIdentity(parsedInput);
  const mediaAssetId = normalizeMediaAssetId(parsedInput.mediaAssetId);
  await assertCategoryExists(parsedInput.categoryId);
  await assertMediaAssetExists(mediaAssetId);
  await assertProductBusinessUniqueness({
    name: parsedInput.name,
    slug: identity.slug,
    href: identity.href,
  });

  return prisma.product.create({
    data: {
      slug: identity.slug,
      name: parsedInput.name,
      description: parsedInput.description,
      href: identity.href,
      badge: normalizeOptionalString(parsedInput.badge),
      badgeColor: normalizeOptionalBadgeColor(parsedInput),
      price: parsedInput.price,
      discountPrice: parsedInput.discountPrice,
      stock: parsedInput.stock,
      isActive: parsedInput.isActive,
      categoryId: parsedInput.categoryId,
      mediaAssetId,
    },
  });
}

export async function updateProduct(id: string, input: AdminProductFormData) {
  const existingProduct = await findAdminProductRecord(id);
  if (!existingProduct) {
    throw new Error("Product not found.");
  }

  const parsedInput = adminProductFormSchema.parse(input);
  const identity = resolveProductIdentity(parsedInput);
  const mediaAssetId = normalizeMediaAssetId(parsedInput.mediaAssetId);
  await assertCategoryExists(parsedInput.categoryId);
  await assertMediaAssetExists(mediaAssetId);
  await assertProductBusinessUniqueness({
    excludeId: id,
    name: parsedInput.name,
    slug: identity.slug,
    href: identity.href,
  });

  return prisma.product.update({
    where: {
      id,
    },
    data: {
      slug: identity.slug,
      name: parsedInput.name,
      description: parsedInput.description,
      href: identity.href,
      badge: normalizeOptionalString(parsedInput.badge),
      badgeColor: normalizeOptionalBadgeColor(parsedInput),
      price: parsedInput.price,
      discountPrice: parsedInput.discountPrice,
      stock: parsedInput.stock,
      isActive: parsedInput.isActive,
      categoryId: parsedInput.categoryId,
      mediaAssetId,
    },
  });
}

export async function deleteProduct(id: string) {
  const existingProduct = await findAdminProductRecord(id);
  if (!existingProduct) {
    throw new Error("Product not found.");
  }

  if (existingProduct.homeSelections.length > 0) {
    throw new Error("Cannot delete a product that is currently featured on Home.");
  }

  await prisma.product.delete({
    where: {
      id,
    },
  });

  return {
    deletedId: id,
  };
}

async function listExistingProductIds(ids: string[]): Promise<string[]> {
  const records = await prisma.product.findMany({
    where: {
      id: {
        in: ids,
      },
    },
    select: {
      id: true,
    },
  });

  return records.map((record) => record.id);
}

async function assertNoFeaturedProducts(ids: string[]): Promise<void> {
  const blockedRecords = await prisma.product.findMany({
    where: {
      id: {
        in: ids,
      },
      homeSelections: {
        some: {},
      },
    },
    select: {
      name: true,
    },
  });

  if (blockedRecords.length === 0) {
    return;
  }

  throw new CatalogBulkActionError(
    `Cannot delete products currently featured on Home: ${blockedRecords.map((record) => record.name).join(", ")}.`,
  );
}

export async function applyProductBulkAction(
  ids: string[],
  action: "activate" | "deactivate" | "delete",
): Promise<AdminCatalogBulkActionResult> {
  const uniqueIds = [...new Set(ids.map((id) => id.trim()).filter(Boolean))];
  if (uniqueIds.length === 0) {
    throw new CatalogBulkActionError("Select at least one product.");
  }

  const existingIds = await listExistingProductIds(uniqueIds);
  if (existingIds.length === 0) {
    throw new CatalogBulkActionError("No matching products were found.");
  }

  if (action === "delete") {
    await assertNoFeaturedProducts(existingIds);
    await prisma.product.deleteMany({
      where: {
        id: {
          in: existingIds,
        },
      },
    });
  } else {
    await prisma.product.updateMany({
      where: {
        id: {
          in: existingIds,
        },
      },
      data: {
        isActive: action === "activate",
      },
    });
  }

  return {
    action,
    processedIds: existingIds,
    processedCount: existingIds.length,
  };
}
