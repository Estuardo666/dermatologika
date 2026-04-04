/**
 * Promo banner components for the public catalog.
 *
 * These render placeholder UI until the backend supports uploading banner content
 * per category. When the backend is ready, both components will accept content data
 * and render real images, text, and CTAs.
 */

interface PublicCatalogPageBannerProps {
  className?: string;
}

/**
 * Full-width banner displayed above the product grid on category pages.
 * Corresponds to "Banner promo categoría 1" in the wireframe.
 */
export function PublicCatalogPageBanner({ className }: PublicCatalogPageBannerProps) {
  return (
    <div
      aria-label="Espacio para banner promocional de categoría"
      className={[
        "flex min-h-[100px] items-center justify-center rounded-[20px] border border-border-brand bg-brand-soft px-6 py-8 sm:min-h-[120px]",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <p className="text-center text-label-md text-text-brand opacity-60">
        Banner promocional de categoría
      </p>
    </div>
  );
}

interface PublicCatalogInlineBannerCardProps {
  variant: "category" | "store";
  className?: string;
}

/**
 * Card-sized banner rendered as the first slot inside the product grid.
 * Corresponds to "Banner promo categoría 2" in the wireframe.
 *
 * variant "category" — filled green background (used on category detail pages).
 * variant "store"    — outlined only (used on the main store page).
 */
export function PublicCatalogInlineBannerCard({
  variant,
  className,
}: PublicCatalogInlineBannerCardProps) {
  const base =
    "flex h-full min-h-[220px] flex-col items-center justify-center rounded-[20px] border p-5 text-center sm:min-h-[260px]";

  const variantClass =
    variant === "category"
      ? "border-border-brand bg-brand-soft"
      : "border-border-soft bg-surface-canvas";

  const textClass =
    variant === "category" ? "text-text-brand opacity-60" : "text-text-muted";

  return (
    <div
      aria-label="Espacio para banner promocional"
      className={[base, variantClass, className].filter(Boolean).join(" ")}
    >
      <p className={["text-label-md", textClass].join(" ")}>Banner promocional</p>
    </div>
  );
}
