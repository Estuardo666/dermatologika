import "server-only";

import { adminProductBadgePresetFormSchema } from "@/features/admin-catalog/schemas/admin-catalog.schema";
import { normalizeBadgeColor } from "@/lib/product-badges";
import { prisma } from "@/server/db/prisma";
import {
  findAdminProductBadgePresetRecord,
  findConflictingProductBadgePresetRecord,
} from "@/server/catalog/admin-catalog.repository";
import type { AdminProductBadgePresetFormData } from "@/types/admin-catalog";

import { CatalogConflictError } from "./admin-catalog.errors";

function normalizePresetLabel(label: string): string {
  return label.trim();
}

async function assertPresetLabelIsUnique(input: { excludeId?: string; label: string }) {
  const conflict = await findConflictingProductBadgePresetRecord(input);
  if (!conflict) {
    return;
  }

  throw new CatalogConflictError("Badge preset label already exists.");
}

export async function createProductBadgePreset(input: AdminProductBadgePresetFormData) {
  const parsedInput = adminProductBadgePresetFormSchema.parse(input);
  const label = normalizePresetLabel(parsedInput.label);
  await assertPresetLabelIsUnique({ label });

  return prisma.productBadgePreset.create({
    data: {
      label,
      color: normalizeBadgeColor(parsedInput.color) ?? parsedInput.color,
      isActive: parsedInput.isActive,
      sortOrder: parsedInput.sortOrder,
    },
  });
}

export async function updateProductBadgePreset(id: string, input: AdminProductBadgePresetFormData) {
  const existingPreset = await findAdminProductBadgePresetRecord(id);
  if (!existingPreset) {
    throw new Error("Badge preset not found.");
  }

  const parsedInput = adminProductBadgePresetFormSchema.parse(input);
  const label = normalizePresetLabel(parsedInput.label);
  await assertPresetLabelIsUnique({ excludeId: id, label });

  return prisma.productBadgePreset.update({
    where: {
      id,
    },
    data: {
      label,
      color: normalizeBadgeColor(parsedInput.color) ?? parsedInput.color,
      isActive: parsedInput.isActive,
      sortOrder: parsedInput.sortOrder,
    },
  });
}

export async function deleteProductBadgePreset(id: string) {
  const existingPreset = await findAdminProductBadgePresetRecord(id);
  if (!existingPreset) {
    throw new Error("Badge preset not found.");
  }

  await prisma.productBadgePreset.delete({
    where: {
      id,
    },
  });

  return {
    deletedId: id,
  };
}