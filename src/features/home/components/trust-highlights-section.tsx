import { SectionHeading } from "@/features/home/components/section-heading";
import type { HomeSectionContent, TrustHighlightContent } from "@/types/content";

interface TrustHighlightsSectionProps {
  content: HomeSectionContent<TrustHighlightContent>;
}

export function TrustHighlightsSection({ content }: TrustHighlightsSectionProps) {
  return (
    <section id={content.sectionId} className="container py-12 sm:py-16">
      <div className="space-y-8 rounded-[32px] border border-border-soft bg-gradient-to-br from-surface-canvas via-surface-canvas to-surface-soft p-6 shadow-xs sm:p-8 lg:p-10">
        <SectionHeading
          eyebrow={content.eyebrow}
          title={content.title}
          description={content.description}
          align="center"
        />

        <div className="grid gap-4 md:grid-cols-3">
          {content.items.map((item, index) => (
            <article
              key={item.id}
              className="rounded-2xl border border-border-soft bg-surface-subtle p-5"
            >
              <div className="space-y-3">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border-brand bg-brand-soft text-label-md text-text-brand">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="text-section-md text-text-primary">{item.title}</h3>
                <p className="text-body-sm text-text-secondary">{item.description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
