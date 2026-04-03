import Link from "next/link";

import { MediaAssetFrame } from "@/components/media/media-asset-frame";
import { SectionHeading } from "@/features/home/components/section-heading";
import type { FeaturedCategoryContent, HomeSectionContent } from "@/types/content";

interface FeaturedCategoriesSectionProps {
  content: HomeSectionContent<FeaturedCategoryContent>;
}

export function FeaturedCategoriesSection({ content }: FeaturedCategoriesSectionProps) {
  return (
    <section id={content.sectionId} className="container py-12 sm:py-16">
      <div className="space-y-8">
        <SectionHeading
          eyebrow={content.eyebrow}
          title={content.title}
          description={content.description}
        />

        <ul className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {content.items.map((item) => (
            <li key={item.id}>
              <Link
                href={item.href}
                className="group flex h-full flex-col gap-5 rounded-2xl border border-border-soft bg-surface-canvas p-5 shadow-xs transition hover:-translate-y-1 hover:border-border-brand hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface-subtle"
              >
                <MediaAssetFrame
                  asset={item.media}
                  label={`Asset de categoría para ${item.name}`}
                  minHeightClassName="min-h-[220px]"
                />

                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="text-section-lg text-text-primary">{item.name}</h3>
                    <span className="text-label-sm text-text-brand transition group-hover:translate-x-1">
                      Ver más
                    </span>
                  </div>
                  <p className="text-body-sm text-text-secondary">{item.description}</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
