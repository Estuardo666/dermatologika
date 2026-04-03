export const MEDIA_ASSET_KINDS = ["image", "video"] as const;

export type MediaAssetKind = (typeof MEDIA_ASSET_KINDS)[number];

export interface MediaAsset {
  id: string;
  kind: MediaAssetKind;
  url: string | null;
  storageKey: string | null;
  altText: string;
  mimeType?: string | null;
  posterUrl?: string | null;
  width?: number | null;
  height?: number | null;
  durationSeconds?: number | null;
}
