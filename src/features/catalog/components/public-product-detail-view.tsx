import Link from "next/link";

import { MediaAssetFrame } from "@/components/media/media-asset-frame";
import { ProductBadge } from "@/components/ui/product-badge";
import { PublicLinkButton } from "@/components/ui/public-link-button";
import type { PublicProductDetailData } from "@/types/public-catalog";

import { PublicProductGrid } from "./public-product-grid";

interface PublicProductDetailViewProps {
  data: PublicProductDetailData;
}

export function PublicProductDetailView({ data }: PublicProductDetailViewProps) {
  const { product, relatedProducts } = data;

  return (
    <div className="container py-10 sm:py-14">
      <div className="space-y-10">
        <nav aria-label="Breadcrumb" className="text-body-sm text-text-secondary">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link href="/" className="transition hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface-subtle">
                Inicio
              </Link>
            </li>
            <li>/</li>
            <li>
              <Link href="/productos" className="transition hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface-subtle">
                Productos
              </Link>
            </li>
            {product.category ? (
              <>
                <li>/</li>
                <li>
                  <Link href={product.category.href} className="transition hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface-subtle">
                    {product.category.name}
                  </Link>
                </li>
              </>
            ) : null}
            <li>/</li>
            <li aria-current="page" className="text-text-primary">
              {product.name}
            </li>
          </ol>
        </nav>

        <section className="grid gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(320px,0.95fr)] lg:items-start">
          <MediaAssetFrame
            asset={product.media}
            label={`Imagen principal de ${product.name}`}
            minHeightClassName="min-h-[360px] sm:min-h-[460px]"
          />

          <div className="space-y-6 rounded-[28px] border border-border-soft bg-surface-canvas p-6 shadow-xs sm:p-8">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                {product.category ? (
                  <Link
                    href={product.category.href}
                    className="rounded-pill border border-border-default bg-surface-subtle px-3 py-1 text-caption uppercase tracking-[0.14em] text-text-secondary transition duration-200 hover:border-border-strong hover:bg-surface-canvas focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface-canvas"
                  >
                    {product.category.name}
                  </Link>
                ) : null}
                {product.badge ? (
                  <ProductBadge label={product.badge} color={product.badgeColor} className="rounded-pill border px-3 py-1" />
                ) : null}
              </div>

              <div className="space-y-3">
                <h1 className="text-headline-md text-text-primary sm:text-headline-lg">{product.name}</h1>
                <p className="text-body-md text-text-secondary">{product.description}</p>
              </div>
            </div>

            <div className="rounded-[24px] border border-border-soft bg-surface-subtle p-5">
              <div className="space-y-3">
                <p className="text-label-md text-text-primary">Catalogo local listo para storefront</p>
                <p className="text-body-sm text-text-secondary">
                  Esta ficha se sirve desde la base local normalizada y queda preparada para futura sincronizacion externa sin acoplar el frontend al proveedor.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <PublicLinkButton
                action={{ href: "/productos", label: "Volver a productos" }}
                variant="secondary"
              />
              {product.category ? (
                <PublicLinkButton
                  action={{ href: product.category.href, label: `Ver ${product.category.name}` }}
                  variant="ghost"
                  className="px-0"
                />
              ) : null}
            </div>
          </div>
        </section>

        {relatedProducts.length > 0 ? (
          <section className="space-y-6">
            <div className="space-y-3">
              <span className="inline-flex rounded-pill border border-border-brand bg-brand-soft px-3 py-1 text-caption uppercase tracking-[0.14em] text-text-brand">
                Relacionados
              </span>
              <div className="space-y-2">
                <h2 className="text-section-xl text-text-primary">Productos de la misma categoria</h2>
                <p className="text-body-md text-text-secondary">
                  Sigue explorando el catalogo local con una seleccion relacionada a esta ficha.
                </p>
              </div>
            </div>

            <PublicProductGrid items={relatedProducts} />
          </section>
        ) : null}
      </div>
    </div>
  );
}