import type { Metadata } from "next";

import { PublicCatalogEmptyState } from "@/features/catalog/components/public-catalog-empty-state";
import { PublicCatalogPagination } from "@/features/catalog/components/public-catalog-pagination";
import { PublicProductFilterForm } from "@/features/catalog/components/public-product-filter-form";
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
    <div className="w-full px-4 py-10 sm:px-6 sm:py-14 lg:px-8 xl:px-10 2xl:px-12">
      <div className="space-y-8">
        <section className="space-y-4">
          <span className="inline-flex rounded-pill border border-border-brand bg-brand-soft px-3 py-1 text-caption uppercase tracking-[0.14em] text-text-brand">
            Catalogo publico
          </span>
          <div className="max-w-3xl space-y-3">
            <h1 className="text-headline-md text-text-primary sm:text-headline-lg">
              Productos activos servidos desde el catalogo local
            </h1>
            <p className="text-body-md text-text-secondary">
              Explora el merchandising disponible, filtra por categoria y valida como se vera el storefront antes de la futura sincronizacion externa.
            </p>
          </div>
        </section>

        <PublicProductFilterForm
          actionPath="/productos"
          filters={data.filters}
          sortBy={data.sortBy}
          categoryOptions={data.categoryOptions}
        />

        {data.items.length > 0 ? (
          <>
            <PublicProductGrid items={data.items} mobileColumns={2} />
            <PublicCatalogPagination
              basePath="/productos"
              pagination={data.pagination}
              searchParams={normalizedSearchParams}
            />
          </>
        ) : (
          <PublicCatalogEmptyState
            title="No encontramos productos para esa combinacion"
            description="Prueba con otra categoria, limpia la busqueda o vuelve al inicio para seguir explorando la portada."
            action={{ href: "/productos", label: "Ver todos los productos" }}
          />
        )}
      </div>
    </div>
  );
}