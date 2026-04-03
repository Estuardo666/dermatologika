import { PublicLinkButton } from "@/components/ui/public-link-button";
import type { PublicActionLink } from "@/types/content";

interface PublicCatalogEmptyStateProps {
  title: string;
  description: string;
  action?: PublicActionLink;
}

export function PublicCatalogEmptyState({
  title,
  description,
  action,
}: PublicCatalogEmptyStateProps) {
  return (
    <div className="rounded-[28px] border border-border-soft bg-surface-canvas p-8 shadow-xs sm:p-10">
      <div className="mx-auto max-w-2xl space-y-4 text-center">
        <span className="inline-flex rounded-pill border border-border-brand bg-brand-soft px-3 py-1 text-caption uppercase tracking-[0.14em] text-text-brand">
          Catalogo publico
        </span>
        <div className="space-y-3">
          <h2 className="text-section-xl text-text-primary">{title}</h2>
          <p className="text-body-md text-text-secondary">{description}</p>
        </div>
        {action ? <PublicLinkButton action={action} variant="secondary" /> : null}
      </div>
    </div>
  );
}