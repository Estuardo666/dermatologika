import "server-only";

import { adminBrandFormSchema } from "@/features/admin-catalog/schemas/admin-catalog.schema";
import {
  findAdminBrandRecord,
  findConflictingBrandRecord,
} from "@/server/catalog/admin-catalog.repository";
import { prisma } from "@/server/db/prisma";
import type { AdminBrandFormData } from "@/types/admin-catalog";

import { CatalogConflictError } from "./admin-catalog.errors";

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
    throw new Error("The selected brand media asset does not exist.");
  }
}

async function assertBrandBusinessUniqueness(input: { excludeId?: string; name: string }) {
  const conflict = await findConflictingBrandRecord(input);
  if (!conflict) {
    return;
  }

  throw new CatalogConflictError("Brand name already exists.");
}

const brandInclude = {
  mediaAsset: {
    select: {
      publicUrl: true,
      altText: true,
    },
  },
  _count: {
    select: {
      products: true,
    },
  },
} as const;

export async function createBrand(input: AdminBrandFormData) {
  const parsedInput = adminBrandFormSchema.parse(input);
  const mediaAssetId = normalizeMediaAssetId(parsedInput.mediaAssetId);
  await assertMediaAssetExists(mediaAssetId);
  await assertBrandBusinessUniqueness({ name: parsedInput.name });

  return prisma.brand.create({
    data: {
      name: parsedInput.name,
      mediaAssetId,
    },
    include: brandInclude,
  });
}

export async function updateBrand(id: string, input: AdminBrandFormData) {
  const existingBrand = await findAdminBrandRecord(id);
  if (!existingBrand) {
    throw new Error("Brand not found.");
  }

  const parsedInput = adminBrandFormSchema.parse(input);
  const mediaAssetId = normalizeMediaAssetId(parsedInput.mediaAssetId);
  await assertMediaAssetExists(mediaAssetId);
  await assertBrandBusinessUniqueness({ excludeId: id, name: parsedInput.name });

  return prisma.$transaction(async (transaction) => {
    const brand = await transaction.brand.update({
      where: { id },
      data: {
        name: parsedInput.name,
        mediaAssetId,
      },
      include: brandInclude,
    });

    await transaction.product.updateMany({
      where: {
        brandId: id,
      },
      data: {
        brand: parsedInput.name,
      },
    });

    return brand;
  });
}

export async function deleteBrand(id: string) {
  const existingBrand = await findAdminBrandRecord(id);
  if (!existingBrand) {
    throw new Error("Brand not found.");
  }

  await prisma.$transaction(async (transaction) => {
    await transaction.product.updateMany({
      where: {
        brandId: id,
      },
      data: {
        brandId: null,
      },
    });

    await transaction.brand.delete({
      where: { id },
    });
  });

  return {
    deletedId: id,
  };
}