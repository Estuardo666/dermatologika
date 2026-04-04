import type { Metadata } from "next";
import Link from "next/link";

import { PublicBrandHorizontalNav } from "@/features/catalog/components/public-brand-horizontal-nav";
import { PublicCatalogEmptyState } from "@/features/catalog/components/public-catalog-empty-state";
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
  };

  return (
    <div className="mx-auto w-full max-w-[85vw] px-4 py-8 sm:px-6 sm:py-12">
      <div className="space-y-8">

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

        {/* Page heading — centered */}
        <div className="space-y-3 text-center">
          <h1 className="text-headline-md text-text-primary sm:text-headline-lg">
            Tienda Dermatologika
          </h1>
          <p className="mx-auto max-w-xl text-body-md text-text-secondary">
            Descubre nuestra selección de productos dermatológicos. Cuidado de la piel respaldado por especialistas.
          </p>
        </div>

        {/* Horizontal category navigation — centered */}
        <PublicCategoryHorizontalNav categories={data.categoryOptions} />

        {/* Brand thumbnails — centered */}
        <PublicBrandHorizontalNav brands={data.brandOptions} />

        {/* Product grid with inline promo banner as first slot */}
        {data.items.length > 0 ? (
          <>
            <PublicProductGrid
              items={data.items}
              mobileColumns={2}
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
  );
}
