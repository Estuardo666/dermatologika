import "server-only";

import { adminCategoryFormSchema } from "@/features/admin-catalog/schemas/admin-catalog.schema";
import { resolveCategoryIdentity } from "@/lib/catalog-slugs";
import {
  findAdminCategoryRecord,
  findConflictingCategoryRecord,
} from "@/server/catalog/admin-catalog.repository";
import { prisma } from "@/server/db/prisma";
import type { AdminCatalogBulkActionResult, AdminCategoryFormData } from "@/types/admin-catalog";

import { CatalogBulkActionError, CatalogConflictError } from "./admin-catalog.errors";

function normalizeMediaAssetId(mediaAssetId: string): string | null {
  const normalizedValue = mediaAssetId.trim();
  return normalizedValue.length > 0 ? normalizedValue : null;
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
    throw new Error("The selected category media asset does not exist.");
  }
}

function equalsIgnoreCase(left: string, right: string): boolean {
  return left.trim().toLocaleLowerCase("es") === right.trim().toLocaleLowerCase("es");
}

async function assertCategoryBusinessUniqueness(input: {
  excludeId?: string;
  name: string;
  slug: string;
  href: string;
}) {
  const conflict = await findConflictingCategoryRecord(input);
  if (!conflict) {
    return;
  }

  if (equalsIgnoreCase(conflict.name, input.name)) {
    throw new CatalogConflictError("Category name already exists.");
  }

  if (equalsIgnoreCase(conflict.slug, input.slug)) {
    throw new CatalogConflictError("Category slug already exists.");
  }

  if (equalsIgnoreCase(conflict.href, input.href)) {
    throw new CatalogConflictError("Category href already exists.");
  }
}

export async function createCategory(input: AdminCategoryFormData) {
  const parsedInput = adminCategoryFormSchema.parse(input);
  const identity = resolveCategoryIdentity(parsedInput);
  const mediaAssetId = normalizeMediaAssetId(parsedInput.mediaAssetId);
  await assertMediaAssetExists(mediaAssetId);
  await assertCategoryBusinessUniqueness({
    name: parsedInput.name,
    slug: identity.slug,
    href: identity.href,
  });

  return prisma.category.create({
    data: {
      slug: identity.slug,
      name: parsedInput.name,
      description: parsedInput.description,
      href: identity.href,
      isActive: parsedInput.isActive,
      mediaAssetId,
    },
  });
}

export async function updateCategory(id: string, input: AdminCategoryFormData) {
  const existingCategory = await findAdminCategoryRecord(id);
  if (!existingCategory) {
    throw new Error("Category not found.");
  }

  const parsedInput = adminCategoryFormSchema.parse(input);
  const identity = resolveCategoryIdentity(parsedInput);
  const mediaAssetId = normalizeMediaAssetId(parsedInput.mediaAssetId);
  await assertMediaAssetExists(mediaAssetId);
  await assertCategoryBusinessUniqueness({
    excludeId: id,
    name: parsedInput.name,
    slug: identity.slug,
    href: identity.href,
  });

  return prisma.category.update({
    where: {
      id,
    },
    data: {
      slug: identity.slug,
      name: parsedInput.name,
      description: parsedInput.description,
      href: identity.href,
      isActive: parsedInput.isActive,
      mediaAssetId,
    },
  });
}

export async function deleteCategory(id: string) {
  const existingCategory = await findAdminCategoryRecord(id);
  if (!existingCategory) {
    throw new Error("Category not found.");
  }

  if (existingCategory.homeSelections.length > 0) {
    throw new Error("Cannot delete a category that is currently featured on Home.");
  }

  await prisma.category.delete({
    where: {
      id,
    },
  });

  return {
    deletedId: id,
  };
}

async function listExistingCategoryIds(ids: string[]): Promise<string[]> {
  const records = await prisma.category.findMany({
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

async function assertNoFeaturedCategories(ids: string[]): Promise<void> {
  const blockedRecords = await prisma.category.findMany({
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
    `Cannot delete categories currently featured on Home: ${blockedRecords.map((record) => record.name).join(", ")}.`,
  );
}

export async function applyCategoryBulkAction(
  ids: string[],
  action: "activate" | "deactivate" | "delete",
): Promise<AdminCatalogBulkActionResult> {
  const uniqueIds = [...new Set(ids.map((id) => id.trim()).filter(Boolean))];
  if (uniqueIds.length === 0) {
    throw new CatalogBulkActionError("Select at least one category.");
  }

  const existingIds = await listExistingCategoryIds(uniqueIds);
  if (existingIds.length === 0) {
    throw new CatalogBulkActionError("No matching categories were found.");
  }

  if (action === "delete") {
    await assertNoFeaturedCategories(existingIds);
    await prisma.category.deleteMany({
      where: {
        id: {
          in: existingIds,
        },
      },
    });
  } else {
    await prisma.category.updateMany({
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
