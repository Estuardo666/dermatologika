import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { PublicCatalogEmptyState } from "@/features/catalog/components/public-catalog-empty-state";
import { PublicCatalogPagination } from "@/features/catalog/components/public-catalog-pagination";
import { PublicProductGrid } from "@/features/catalog/components/public-product-grid";
import { buildCategoryMetadata } from "@/seo/catalog";
import { getPublicCategoryDetailData } from "@/services/catalog/get-public-catalog-data";

interface PublicCategoryDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export async function generateMetadata({ params }: PublicCategoryDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const data = await getPublicCategoryDetailData(slug, {});

  if (!data) {
    return {
      title: "Categoria no encontrada",
    };
  }

  return buildCategoryMetadata(data.category);
}

export default async function PublicCategoryDetailPage({
  params,
  searchParams,
}: PublicCategoryDetailPageProps) {
  const { slug } = await params;
  const resolvedSearchParams = await searchParams;
  const data = await getPublicCategoryDetailData(slug, resolvedSearchParams);

  if (!data) {
    notFound();
  }

  return (
    <div className="container py-10 sm:py-14">
      <div className="space-y-8">
        <nav aria-label="Breadcrumb" className="text-body-sm text-text-secondary">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link href="/" className="transition hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface-subtle">
                Inicio
              </Link>
            </li>
            <li>/</li>
            <li>
              <Link href="/categorias" className="transition hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface-subtle">
                Categorias
              </Link>
            </li>
            <li>/</li>
            <li aria-current="page" className="text-text-primary">
              {data.category.name}
            </li>
          </ol>
        </nav>

        <section className="rounded-[32px] border border-border-soft bg-surface-canvas p-6 shadow-xs sm:p-8 lg:p-10">
          <div className="max-w-3xl space-y-4">
            <span className="inline-flex rounded-pill border border-border-brand bg-brand-soft px-3 py-1 text-caption uppercase tracking-[0.14em] text-text-brand">
              {data.category.productCount} productos activos
            </span>
            <div className="space-y-3">
              <h1 className="text-headline-md text-text-primary sm:text-headline-lg">{data.category.name}</h1>
              <p className="text-body-md text-text-secondary">{data.category.description}</p>
            </div>
          </div>
        </section>

        {data.products.length > 0 ? (
          <>
            <PublicProductGrid items={data.products} />
            <PublicCatalogPagination
              basePath={data.category.href}
              pagination={data.pagination}
              searchParams={{}}
            />
          </>
        ) : (
          <PublicCatalogEmptyState
            title="Esta categoria todavia no tiene productos visibles"
            description="El equipo puede activar productos desde el catalogo interno y apareceran aqui sin cambiar la plantilla publica."
            action={{ href: "/categorias", label: "Ver todas las categorias" }}
          />
        )}
      </div>
    </div>
  );
}