import Image from "next/image";

import type { PublicCatalogBrandOption } from "@/types/public-catalog";

interface PublicBrandHorizontalNavProps {
  brands: PublicCatalogBrandOption[];
}

export function PublicBrandHorizontalNav({ brands }: PublicBrandHorizontalNavProps) {
  if (brands.length === 0) {
    return null;
  }

  return (
    <nav aria-label="Marcas disponibles" className="relative">
      <div
        className="flex justify-center gap-4 overflow-x-auto pb-1 scrollbar-none sm:gap-6"
        style={{ scrollbarWidth: "none" }}
      >
        {brands.map((brand) => (
          <div
            key={brand.id}
            className="flex shrink-0 flex-col items-center gap-2"
            title={brand.name}
          >
            <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-full border border-border-soft bg-surface-canvas shadow-xs sm:h-16 sm:w-16">
              {brand.logoUrl ? (
                <Image
                  src={brand.logoUrl}
                  alt={brand.name}
                  width={64}
                  height={64}
                  className="h-full w-full object-contain p-2"
                />
              ) : (
                <span className="select-none text-label-sm font-medium text-text-muted">
                  {brand.name.slice(0, 2).toUpperCase()}
                </span>
              )}
            </div>
            <span className="max-w-[72px] truncate text-center text-[0.65rem] text-text-muted sm:max-w-[80px]">
              {brand.name}
            </span>
          </div>
        ))}
      </div>
    </nav>
  );
}
