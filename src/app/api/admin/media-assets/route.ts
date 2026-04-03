import { NextRequest, NextResponse } from "next/server";

import { upsertMediaAssetSchema } from "@/features/admin-content/schemas/admin-home-content.schema";
import { listMediaAssetRecords } from "@/server/content/admin-home-content.repository";
import { requireAdminAuth } from "@/server/auth/require-admin-auth";
import { upsertMediaAsset } from "@/services/admin-content/upsert-media-asset";

function mapMediaAssetResponse(record: {
  id: string;
  storageKey: string;
  publicUrl: string | null;
  kind: "image" | "video";
  altText: string | null;
  mimeType: string | null;
  posterUrl: string | null;
  width: number | null;
  height: number | null;
  durationSeconds: number | null;
  createdAt: Date;
  updatedAt: Date;
}) {
  return {
    id: record.id,
    storageKey: record.storageKey,
    publicUrl: record.publicUrl,
    kind: record.kind,
    altText: record.altText ?? "",
    mimeType: record.mimeType,
    posterUrl: record.posterUrl,
    width: record.width,
    height: record.height,
    durationSeconds: record.durationSeconds,
    createdAt: record.createdAt.toISOString(),
    updatedAt: record.updatedAt.toISOString(),
  };
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  const timestamp = new Date().toISOString();

  try {
    const authResult = requireAdminAuth(request);
    if (!authResult.success) {
      return authResult.response;
    }

    const mediaAssets = await listMediaAssetRecords();

    return NextResponse.json(
      {
        success: true,
        data: {
          mediaAssets: mediaAssets.map(mapMediaAssetResponse),
        },
        timestamp,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Admin media assets GET error:", {
      error: error instanceof Error ? error.message : String(error),
      timestamp,
    });

    return NextResponse.json(
      {
        success: false,
        error: {
          code: "INTERNAL_ERROR",
          message: "Failed to fetch media assets.",
        },
        timestamp,
      },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  const timestamp = new Date().toISOString();

  try {
    const authResult = requireAdminAuth(request);
    if (!authResult.success) {
      return authResult.response;
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "INVALID_JSON",
            message: "Request body must be valid JSON.",
          },
          timestamp,
        },
        { status: 400 },
      );
    }

    const validationResult = upsertMediaAssetSchema.safeParse(body);
    if (!validationResult.success) {
      const message = validationResult.error.issues
        .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
        .join("; ");

      return NextResponse.json(
        {
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            message,
          },
          timestamp,
        },
        { status: 422 },
      );
    }

    const mediaAsset = await upsertMediaAsset(validationResult.data);

    return NextResponse.json(
      {
        success: true,
        data: {
          mediaAsset: mapMediaAssetResponse(mediaAsset),
        },
        timestamp,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Admin media assets POST error:", {
      error: error instanceof Error ? error.message : String(error),
      timestamp,
    });

    return NextResponse.json(
      {
        success: false,
        error: {
          code: "INTERNAL_ERROR",
          message: "Failed to register media asset.",
        },
        timestamp,
      },
      { status: 500 },
    );
  }
}
