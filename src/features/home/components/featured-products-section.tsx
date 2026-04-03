import Link from "next/link";

import { MediaAssetFrame } from "@/components/media/media-asset-frame";
import { SectionHeading } from "@/features/home/components/section-heading";
import type { FeaturedProductContent, HomeSectionContent } from "@/types/content";

interface FeaturedProductsSectionProps {
  content: HomeSectionContent<FeaturedProductContent>;
}

export function FeaturedProductsSection({ content }: FeaturedProductsSectionProps) {
  return (
    <section id={content.sectionId} className="bg-surface-canvas py-12 sm:py-16">
      <div className="container space-y-8">
        <SectionHeading
          eyebrow={content.eyebrow}
          title={content.title}
          description={content.description}
        />

        <ul className="grid gap-5 lg:grid-cols-3">
          {content.items.map((item) => (
            <li key={item.id}>
              <Link
                href={item.href}
                className="group flex h-full flex-col gap-5 rounded-2xl border border-border-soft bg-surface-subtle p-5 transition hover:-translate-y-1 hover:border-border-brand hover:bg-surface-canvas hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface-canvas"
              >
                <MediaAssetFrame
                  asset={item.media}
                  label={`Media destacada para ${item.name}`}
                  minHeightClassName="min-h-[240px]"
                />

                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-3">
                    {item.badge ? (
                      <span className="rounded-pill border border-border-brand bg-brand-soft px-3 py-1 text-caption uppercase tracking-[0.14em] text-text-brand">
                        {item.badge}
                      </span>
                    ) : null}
                  </div>
                  <h3 className="text-section-lg text-text-primary">{item.name}</h3>
                  <p className="text-body-sm text-text-secondary">{item.description}</p>
                  <span className="text-label-md text-text-brand transition group-hover:translate-x-1">
                    Abrir ficha
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
