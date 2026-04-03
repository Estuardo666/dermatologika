import "server-only";

import { upsertMediaAssetSchema } from "@/features/admin-content/schemas/admin-home-content.schema";
import { prisma } from "@/server/db/prisma";
import { buildR2PublicUrl } from "@/server/storage/cloudflare-r2";
import type { UpsertMediaAssetInput } from "@/types/admin-home-content";

function normalizeOptionalString(value: string | undefined): string | null {
  if (!value) {
    return null;
  }

  const trimmedValue = value.trim();
  return trimmedValue.length > 0 ? trimmedValue : null;
}

export async function upsertMediaAsset(input: UpsertMediaAssetInput) {
  const parsedInput = upsertMediaAssetSchema.parse(input);
  const publicUrl = normalizeOptionalString(parsedInput.publicUrl) ?? buildR2PublicUrl(parsedInput.storageKey);

  return prisma.mediaAsset.upsert({
    where: {
      storageKey: parsedInput.storageKey,
    },
    update: {
      publicUrl,
      kind: parsedInput.kind,
      mimeType: normalizeOptionalString(parsedInput.mimeType),
      altText: normalizeOptionalString(parsedInput.altText),
      posterUrl: normalizeOptionalString(parsedInput.posterUrl),
      width: parsedInput.width ?? null,
      height: parsedInput.height ?? null,
      durationSeconds: parsedInput.durationSeconds ?? null,
    },
    create: {
      storageKey: parsedInput.storageKey,
      publicUrl,
      kind: parsedInput.kind,
      mimeType: normalizeOptionalString(parsedInput.mimeType),
      altText: normalizeOptionalString(parsedInput.altText),
      posterUrl: normalizeOptionalString(parsedInput.posterUrl),
      width: parsedInput.width ?? null,
      height: parsedInput.height ?? null,
      durationSeconds: parsedInput.durationSeconds ?? null,
    },
  });
}
