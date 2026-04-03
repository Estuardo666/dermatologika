import Link from "next/link";

import { MediaAssetFrame } from "@/components/media/media-asset-frame";
import { SectionHeading } from "@/features/home/components/section-heading";
import type { HomeCategoryGridContent } from "@/types/content";

interface CategoryGridSectionProps {
  content: HomeCategoryGridContent;
}

export function CategoryGridSection({ content }: CategoryGridSectionProps) {
  return (
    <section id={content.sectionId} className="container py-12 sm:py-16">
      <div className="space-y-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <SectionHeading
              eyebrow={content.eyebrow}
              title={content.title}
              description={content.description}
            />
          </div>

          {content.cta ? (
            <Link
              href={content.cta.href}
              className="inline-flex min-h-11 items-center rounded-pill border border-border-default bg-surface-canvas px-5 py-3 text-label-md text-text-primary transition hover:-translate-y-0.5 hover:border-border-strong hover:bg-surface-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface-canvas"
            >
              {content.cta.label}
            </Link>
          ) : null}
        </div>

        <ul className="grid gap-5 md:grid-cols-2 xl:grid-cols-12">
          {content.items.map((item, index) => {
            const layoutClassName =
              index === 0
                ? "md:col-span-2 xl:col-span-6"
                : index === content.items.length - 1
                  ? "md:col-span-2 xl:col-span-4"
                  : "xl:col-span-3";

            return (
              <li key={item.id} className={layoutClassName}>
                <Link
                  href={item.href}
                  className="group flex h-full flex-col gap-5 rounded-[28px] border border-border-soft bg-surface-canvas p-5 shadow-xs transition hover:-translate-y-1 hover:border-border-brand hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface-subtle sm:p-6"
                >
                  <MediaAssetFrame
                    asset={item.media}
                    label={`Asset de categoría para ${item.name}`}
                    minHeightClassName={index === 0 ? "min-h-[260px] sm:min-h-[320px]" : "min-h-[220px]"}
                  />

                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="text-section-lg text-text-primary">{item.name}</h3>
                      <span className="text-label-sm text-text-brand transition group-hover:translate-x-1">
                        Explorar
                      </span>
                    </div>
                    <p className="max-w-prose text-body-sm text-text-secondary">{item.description}</p>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}