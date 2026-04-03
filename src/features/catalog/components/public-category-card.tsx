import Link from "next/link";

import { MediaAssetFrame } from "@/components/media/media-asset-frame";
import type { PublicCatalogCategorySummary } from "@/types/public-catalog";

interface PublicCategoryCardProps {
  category: PublicCatalogCategorySummary;
}

export function PublicCategoryCard({ category }: PublicCategoryCardProps) {
  return (
    <Link
      href={category.href}
      className="group flex h-full flex-col gap-5 rounded-[28px] border border-border-soft bg-surface-canvas p-5 shadow-xs transition hover:border-border-brand hover:bg-surface-subtle hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface-subtle sm:p-6"
    >
      <MediaAssetFrame
        asset={category.media}
        label={`Imagen de categoria para ${category.name}`}
        minHeightClassName="min-h-[220px] sm:min-h-[260px]"
      />

      <div className="space-y-3">
        <div className="flex items-center justify-between gap-4">
          <span className="rounded-pill border border-border-default bg-surface-subtle px-3 py-1 text-caption uppercase tracking-[0.14em] text-text-secondary">
            {category.productCount} productos
          </span>
          <span className="text-label-sm text-text-brand">Explorar</span>
        </div>
        <div className="space-y-2">
          <h2 className="text-section-lg text-text-primary">{category.name}</h2>
          <p className="text-body-sm text-text-secondary">{category.description}</p>
        </div>
      </div>
    </Link>
  );
}