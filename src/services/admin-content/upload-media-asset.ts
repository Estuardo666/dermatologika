import "server-only";

import { uploadMediaAssetSchema } from "@/features/admin-content/schemas/admin-home-content.schema";
import {
  MAX_MEDIA_UPLOAD_SIZE_BYTES,
  uploadObjectToCloudflareR2,
} from "@/server/storage/cloudflare-r2";
import type { UploadMediaAssetInput } from "@/types/admin-home-content";

import { upsertMediaAsset } from "./upsert-media-asset";

const MIME_PREFIX_BY_KIND = {
  image: "image/",
  video: "video/",
} as const;

export class MediaUploadValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "MediaUploadValidationError";
  }
}

function validateUploadedFile(file: File, kind: UploadMediaAssetInput["kind"]): void {
  if (file.size === 0) {
    throw new MediaUploadValidationError("The uploaded file is empty.");
  }

  if (file.size > MAX_MEDIA_UPLOAD_SIZE_BYTES) {
    throw new MediaUploadValidationError("The uploaded file exceeds the 25 MB limit.");
  }

  const mimeType = file.type.trim();
  if (!mimeType) {
    throw new MediaUploadValidationError("The uploaded file must include a MIME type.");
  }

  if (!mimeType.startsWith(MIME_PREFIX_BY_KIND[kind])) {
    throw new MediaUploadValidationError(
      `The uploaded file MIME type must match the selected ${kind} kind.`,
    );
  }
}

export async function uploadMediaAsset(file: File, input: UploadMediaAssetInput) {
  const parsedInput = uploadMediaAssetSchema.parse(input);
  validateUploadedFile(file, parsedInput.kind);

  const mimeType = file.type.trim();
  const buffer = Buffer.from(await file.arrayBuffer());

  await uploadObjectToCloudflareR2({
    storageKey: parsedInput.storageKey,
    body: buffer,
    contentType: mimeType,
    contentLength: file.size,
  });

  return upsertMediaAsset({
    storageKey: parsedInput.storageKey,
    kind: parsedInput.kind,
    mimeType,
    altText: parsedInput.altText,
    posterUrl: parsedInput.posterUrl,
    width: parsedInput.width,
    height: parsedInput.height,
    durationSeconds: parsedInput.durationSeconds,
  });
}