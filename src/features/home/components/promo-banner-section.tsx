import { MediaAssetFrame } from "@/components/media/media-asset-frame";
import { PublicLinkButton } from "@/components/ui/public-link-button";
import { cx } from "@/lib/utils";
import type { HomePromoBannerContent } from "@/types/content";

interface PromoBannerSectionProps {
  content: HomePromoBannerContent;
  reversed?: boolean;
  variant?: "default" | "immersive";
}

export function PromoBannerSection({
  content,
  reversed = false,
  variant = "default",
}: PromoBannerSectionProps) {
  if (variant === "immersive") {
    return (
      <section id={content.sectionId} className="w-full py-4 sm:py-6">
        <div className="relative w-full overflow-hidden border-y border-border-soft bg-gradient-to-r from-brand-soft/80 via-surface-canvas to-surface-brandTint shadow-sm sm:rounded-[40px] sm:border">
          <div
            aria-hidden="true"
            className="absolute -left-12 top-1/2 h-32 w-32 -translate-y-1/2 rounded-full bg-brand-accent/20 blur-3xl"
          />
          <div
            aria-hidden="true"
            className="absolute -right-12 top-8 h-36 w-36 rounded-full bg-brand-soft/80 blur-3xl"
          />

          <div className="container relative py-6 sm:py-8 lg:py-10">
            <div
              className={cx(
                "grid gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-center lg:gap-10",
                reversed && "lg:[&>*:first-child]:order-2 lg:[&>*:last-child]:order-1",
              )}
            >
              <div className="space-y-5 lg:max-w-xl">
                <div className="space-y-4">
                  <span className="inline-flex rounded-pill border border-border-default bg-surface-canvas/90 px-4 py-2 text-caption uppercase tracking-[0.14em] text-text-secondary shadow-xs">
                    {content.accentText ?? "Campaña destacada"}
                  </span>
                  <div className="space-y-3">
                    <span className="inline-flex rounded-pill border border-border-brand bg-brand-soft px-3 py-1 text-caption uppercase tracking-[0.14em] text-text-brand">
                      {content.eyebrow}
                    </span>
                    <h2 className="max-w-2xl text-headline-sm text-text-primary sm:text-headline-md lg:text-headline-lg">
                      {content.title}
                    </h2>
                    <p className="max-w-prose text-body-md text-text-secondary">{content.description}</p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <PublicLinkButton action={content.primaryCta} variant="primary" />
                  {content.secondaryCta ? (
                    <PublicLinkButton action={content.secondaryCta} variant="secondary" />
                  ) : null}
                </div>
              </div>

              <div className="relative">
                <div className="absolute inset-x-6 top-5 hidden h-16 rounded-[24px] border border-white/50 bg-white/25 backdrop-blur-sm lg:block" />
                <MediaAssetFrame
                  asset={content.media}
                  label="Banner promocional preparado para media administrable"
                  className="relative border-border-default bg-gradient-to-br from-surface-canvas via-brand-soft to-surface-soft"
                  minHeightClassName="min-h-[260px] sm:min-h-[320px] lg:min-h-[400px]"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id={content.sectionId} className="container py-6 sm:py-8">
      <div
        className={cx(
          "grid gap-6 rounded-[32px] border border-border-soft bg-surface-canvas p-6 shadow-xs sm:p-8 lg:grid-cols-2 lg:items-center lg:gap-8",
          reversed && "lg:[&>*:first-child]:order-2 lg:[&>*:last-child]:order-1",
        )}
      >
        <div className="space-y-5">
          <div className="space-y-4">
            <span className="inline-flex rounded-pill border border-border-brand bg-brand-soft px-3 py-1 text-caption uppercase tracking-[0.14em] text-text-brand">
              {content.eyebrow}
            </span>
            <div className="space-y-3">
              <h2 className="max-w-2xl text-headline-sm text-text-primary sm:text-headline-md">
                {content.title}
              </h2>
              <p className="max-w-prose text-body-md text-text-secondary">{content.description}</p>
            </div>
          </div>

          {content.accentText ? (
            <div className="inline-flex rounded-pill border border-border-default bg-surface-subtle px-4 py-2 text-body-sm text-text-secondary">
              {content.accentText}
            </div>
          ) : null}

          <div className="flex flex-wrap items-center gap-3">
            <PublicLinkButton action={content.primaryCta} variant="primary" />
            {content.secondaryCta ? (
              <PublicLinkButton action={content.secondaryCta} variant="secondary" />
            ) : null}
          </div>
        </div>

        <MediaAssetFrame
          asset={content.media}
          label="Banner promocional preparado para media administrable"
          minHeightClassName="min-h-[240px] sm:min-h-[280px]"
        />
      </div>
    </section>
  );
}