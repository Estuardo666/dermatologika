import { MediaAssetFrame } from "@/components/media/media-asset-frame";
import { PublicLinkButton } from "@/components/ui/public-link-button";
import type { HomeEditorialSectionContent } from "@/types/content";

interface EditorialSplitSectionProps {
  content: HomeEditorialSectionContent;
}

export function EditorialSplitSection({ content }: EditorialSplitSectionProps) {
  return (
    <section id={content.sectionId} className="container py-12 sm:py-16">
      <div className="grid gap-8 rounded-[32px] border border-border-soft bg-surface-canvas p-6 shadow-sm sm:p-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.95fr)] lg:items-center lg:p-10">
        <div className="space-y-6">
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
            <p className="text-body-sm text-text-brand">{content.accentText}</p>
          ) : null}

          <div className="grid gap-3 sm:grid-cols-3">
            {content.items.map((item) => (
              <article
                key={item.id}
                className="rounded-2xl border border-border-soft bg-surface-subtle p-4"
              >
                <div className="space-y-2">
                  <h3 className="text-section-sm text-text-primary">{item.title}</h3>
                  <p className="text-body-sm text-text-secondary">{item.description}</p>
                </div>
              </article>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <PublicLinkButton action={content.primaryCta} variant="primary" />
            {content.secondaryCta ? (
              <PublicLinkButton action={content.secondaryCta} variant="secondary" />
            ) : null}
          </div>
        </div>

        <MediaAssetFrame
          asset={content.media}
          label="Bloque editorial preparado para imagen, video o composición de campaña"
          minHeightClassName="min-h-[320px] sm:min-h-[380px]"
        />
      </div>
    </section>
  );
}