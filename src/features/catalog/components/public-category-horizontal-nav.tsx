import Link from "next/link";

import { cx } from "@/lib/utils";
import type { PublicCatalogCategoryOption } from "@/types/public-catalog";

interface PublicCategoryHorizontalNavProps {
  categories: PublicCatalogCategoryOption[];
}

export function PublicCategoryHorizontalNav({ categories }: PublicCategoryHorizontalNavProps) {
  if (categories.length === 0) {
    return null;
  }

  return (
    <nav aria-label="Categorías" className="relative">
      <div
        className="flex justify-center gap-2 overflow-x-auto pb-1 scrollbar-none"
        style={{ scrollbarWidth: "none" }}
      >
        {categories.map((category) => (
          <Link
            key={category.id}
            href={category.href}
            className={cx(
              "inline-flex shrink-0 items-center gap-1.5 rounded-pill border px-4 py-2 text-label-sm transition",
              "border-border-default bg-surface-canvas text-text-primary",
              "hover:border-border-brand hover:bg-brand-soft hover:text-text-brand",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface-subtle",
            )}
          >
            {category.name}
            <span className="text-[0.65rem] text-text-muted">
              {category.productCount}
            </span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
