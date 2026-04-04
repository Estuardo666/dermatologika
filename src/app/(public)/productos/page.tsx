import type { Metadata } from "next";
import Link from "next/link";

import { PublicBrandHorizontalNav } from "@/features/catalog/components/public-brand-horizontal-nav";
import { PublicCatalogEmptyState } from "@/features/catalog/components/public-catalog-empty-state";
import { PublicCatalogFilterSidebar } from "@/features/catalog/components/public-catalog-filter-sidebar";
import { PublicCatalogPagination } from "@/features/catalog/components/public-catalog-pagination";
import { PublicCatalogInlineBannerCard } from "@/features/catalog/components/public-catalog-promo-banner";
import { PublicCategoryHorizontalNav } from "@/features/catalog/components/public-category-horizontal-nav";
import { PublicProductGrid } from "@/features/catalog/components/public-product-grid";
import { buildProductIndexMetadata } from "@/seo/catalog";
import { getPublicProductCatalogData } from "@/services/catalog/get-public-catalog-data";

export const metadata: Metadata = buildProductIndexMetadata();

interface PublicProductsPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function PublicProductsPage({ searchParams }: PublicProductsPageProps) {
  const resolvedSearchParams = await searchParams;
  const data = await getPublicProductCatalogData(resolvedSearchParams);

  const normalizedSearchParams: Record<string, string> = {
    ...(data.filters.query ? { q: data.filters.query } : {}),
    ...(data.filters.categorySlug ? { categoria: data.filters.categorySlug } : {}),
    ...(data.sortBy !== "recent" ? { orden: data.sortBy } : {}),
    ...(data.filters.priceMin !== null ? { precioMin: String(data.filters.priceMin) } : {}),
    ...(data.filters.priceMax !== null ? { precioMax: String(data.filters.priceMax) } : {}),
    ...(data.filters.inStock ? { enStock: "1" } : {}),
    ...(data.filters.onSale ? { enOferta: "1" } : {}),
    ...(data.filters.brandIds.length > 0 ? { marcas: data.filters.brandIds.join(",") } : {}),
  };

  return (
    <div className="w-full">
      {/* ── Page header ─────────────────────────────────────────────────── */}
      <div className="mx-auto w-[95vw] px-[5px] pb-6 pt-8 sm:px-6 sm:pt-10">
        <div className="space-y-6">
          {/* Breadcrumbs */}
          <nav aria-label="Breadcrumb" className="text-body-sm text-text-muted">
            <ol className="flex flex-wrap items-center justify-center gap-1.5">
              <li>
                <Link
                  href="/"
                  className="transition hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface-subtle"
                >
                  Inicio
                </Link>
              </li>
              <li aria-hidden="true" className="text-text-muted">/</li>
              <li aria-current="page" className="text-text-secondary">
                Tienda
              </li>
            </ol>
          </nav>

          {/* Page heading */}
          <div className="space-y-3 text-center">
            <h1 className="text-headline-md text-text-primary sm:text-headline-lg">
              Tienda Dermatologika
            </h1>
            <p className="mx-auto max-w-xl text-body-md text-text-secondary">
              Descubre nuestra selección de productos dermatológicos. Cuidado de la piel respaldado por especialistas.
            </p>
          </div>
        </div>
      </div>

      {/* ── Catalog navs — full width above the sidebar+grid row ─────────── */}
      <div className="mx-auto w-[95vw] space-y-4 px-[5px] pb-6 sm:px-6">
        <PublicCategoryHorizontalNav categories={data.categoryOptions} />
        <PublicBrandHorizontalNav brands={data.brandOptions} />
      </div>

      {/* ── Catalog body: sidebar + grid ────────────────────────────────── */}
      <div className="mx-auto w-[95vw] px-[5px] pb-16 sm:px-6">
        <div className="flex items-start gap-8">

          {/* Filter sidebar — renders desktop sticky rail + mobile FAB + modal */}
          <PublicCatalogFilterSidebar
            actionPath="/productos"
            filters={data.filters}
            sortBy={data.sortBy}
            brandOptions={data.brandOptions}
            maxPrice={data.maxPrice}
            totalItems={data.pagination.totalItems}
          />

          {/* Right column: grid + pagination */}
          <div className="min-w-0 flex-1 space-y-6">

            {data.items.length > 0 ? (
              <>
                <PublicProductGrid
                  items={data.items}
                  mobileColumns={2}
                  layout="withSidebar"
                  id="catalog-products-top"
                  inlineBannerSlot={<PublicCatalogInlineBannerCard variant="store" />}
                />
                <PublicCatalogPagination
                  basePath="/productos"
                  pagination={data.pagination}
                  searchParams={normalizedSearchParams}
                />
              </>
            ) : (
              <PublicCatalogEmptyState
                title="No encontramos productos disponibles"
                description="Vuelve pronto o explora nuestras categorías para encontrar lo que buscas."
                action={{ href: "/productos", label: "Ver toda la tienda" }}
              />
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
