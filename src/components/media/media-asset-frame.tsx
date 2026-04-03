import { cx } from "@/lib/utils";
import type { MediaAsset } from "@/types/media";

interface MediaAssetFrameProps {
  asset: MediaAsset | null;
  label: string;
  className?: string;
  minHeightClassName?: string;
}

export function MediaAssetFrame({
  asset,
  label,
  className,
  minHeightClassName = "min-h-[240px]",
}: MediaAssetFrameProps) {
  const mediaBadge = asset?.kind === "video" ? "Video" : "Imagen";
  const imageAltText = asset?.altText?.trim() || label;

  return (
    <div
      className={cx(
        "relative overflow-hidden rounded-2xl border border-border-soft bg-gradient-to-br from-surface-brandTint via-surface-canvas to-surface-soft shadow-sm",
        minHeightClassName,
        className,
      )}
    >
      {asset?.url ? (
        <>
          {asset.kind === "video" ? (
            <video
              className="absolute inset-0 h-full w-full object-cover"
              autoPlay
              muted
              loop
              playsInline
              aria-label={asset.altText}
              poster={asset.posterUrl ?? undefined}
            >
              <source src={asset.url} type={asset.mimeType ?? undefined} />
            </video>
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={asset.url}
              alt={imageAltText}
              loading="lazy"
              decoding="async"
              className="absolute inset-0 h-full w-full object-cover"
            />
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-ink-900/35 via-transparent to-transparent" />
        </>
      ) : null}

      <div className="relative flex h-full flex-col justify-between gap-6 p-6 sm:p-8">
        <div>
          <span className="inline-flex rounded-pill border border-border-brand bg-surface-canvas/80 px-3 py-1 text-caption uppercase tracking-[0.14em] text-text-brand">
            {asset?.url ? mediaBadge : "Media administrable"}
          </span>
        </div>

        {!asset?.url ? (
          <div className="max-w-sm space-y-3">
            <p className="text-section-lg text-text-primary">{label}</p>
            <p className="text-body-sm text-text-secondary">
              Este espacio queda listo para renderizar una imagen o video gestionado desde backend o storage.
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
