import Link from "next/link";

import type { MediaAsset } from "@/types/media";
import type { PublicCatalogCategoryReference } from "@/types/public-catalog";

interface PublicProductCardProps {
  product: {
    id: string;
    name: string;
    href: string;
    price: number | null;
    discountPrice: number | null;
    media: MediaAsset | null;
    category: PublicCatalogCategoryReference | null;
  };
}

const storefrontPriceFormatter = new Intl.NumberFormat("es-MX", {
  style: "currency",
  currency: "MXN",
  minimumFractionDigits: 2,
});

export function PublicProductCard({ product }: PublicProductCardProps) {
  const mediaLabel = product.media?.altText?.trim() || product.name;
  const basePrice = product.price;
  const hasPrice = basePrice !== null;
  const hasDiscount =
    basePrice !== null &&
    product.discountPrice !== null &&
    product.discountPrice < basePrice;
  const displayPrice = hasDiscount && product.discountPrice !== null
    ? product.discountPrice
    : basePrice;
  const discountPercentage = hasDiscount && basePrice !== null && product.discountPrice !== null
    ? Math.max(1, Math.round(((basePrice - product.discountPrice) / basePrice) * 100))
    : null;

  return (
    <Link
      href={product.href}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border-soft bg-white shadow-sm transition-[border-color,box-shadow,background-color] duration-200 ease-soft hover:border-[#d9d6ce] hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2"
    >
      {/* Image area */}
      <div className="relative bg-white">
        <div className="relative aspect-square w-full p-6">
          {product.media?.url ? (
            // eslint-disable-next-line @next/next/no-img-element -- R2 assets use native img
            <img
              src={product.media.url}
              alt={mediaLabel}
              className="h-full w-full object-contain"
              loading="lazy"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-neutral-200 text-label-md text-neutral-500">
                {product.name.slice(0, 1).toUpperCase()}
              </span>
            </div>
          )}
        </div>

        {/* Category chip — bottom-left of image */}
        {product.category ? (
          <span className="absolute bottom-3 left-3 rounded-[10px] border border-neutral-300 bg-white px-[6px] py-0 text-caption text-text-primary sm:rounded-full sm:px-3 sm:py-1">
            {product.category.name}
          </span>
        ) : null}

        {discountPercentage !== null ? (
          <span className="absolute right-3 top-3 rounded-full bg-[#e35d5d] px-3 py-1 text-[0.74rem] font-medium leading-none text-white">
            -{discountPercentage}%
          </span>
        ) : null}
      </div>

      {/* Info area */}
      <div className="flex flex-1 flex-col bg-[#f1f1f1] p-[6px] pt-[8px] sm:p-4">
        <h2 className="text-[1.04rem] leading-tight text-text-primary line-clamp-3">
          {product.name}
        </h2>

        <div className="mt-auto pt-4">
          <div className="flex min-h-11 items-center justify-between gap-2 rounded-md bg-[#2a2a2a] px-3 py-2 text-white transition-[background-color] duration-200 ease-soft group-hover:bg-[#1f1f1f] sm:gap-3 sm:px-4">
            <span className="inline-flex items-center gap-1.5 whitespace-nowrap text-[0.78rem] font-normal tracking-[0.02em] sm:gap-2 sm:text-[0.84rem] sm:tracking-[0.03em]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-3.5 w-3.5 sm:h-4 sm:w-4"
                aria-hidden="true"
              >
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
              Agregar
            </span>

            {hasDiscount && hasPrice && displayPrice !== null ? (
              <span className="flex items-baseline gap-2 whitespace-nowrap">
                <span className="text-[0.95rem] font-normal leading-none text-white sm:text-[1rem]">
                  {storefrontPriceFormatter.format(displayPrice)}
                </span>
                <span className="text-[0.72rem] font-light leading-none text-neutral-400 line-through sm:text-[0.83rem]">
                  {storefrontPriceFormatter.format(basePrice)}
                </span>
              </span>
            ) : displayPrice !== null ? (
              <span className="whitespace-nowrap text-[0.95rem] font-normal leading-none text-white sm:text-[1rem]">
                {storefrontPriceFormatter.format(displayPrice)}
              </span>
            ) : (
              <span className="whitespace-nowrap text-[0.78rem] font-normal leading-none text-neutral-300 sm:text-[0.84rem]">
                Consultar precio
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}