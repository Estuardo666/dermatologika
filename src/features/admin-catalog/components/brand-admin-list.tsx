import Link from "next/link";

import { AdminBreadcrumbs } from "@/components/layout/admin-breadcrumbs";
import type { AdminBrandItem } from "@/types/admin-catalog";

interface BrandAdminListProps {
  brands: AdminBrandItem[];
}

function formatDate(value: string): string {
  return new Intl.DateTimeFormat("es-ES", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export function BrandAdminList({ brands }: BrandAdminListProps) {
  return (
    <div className="space-y-6">
      <section className="rounded-[28px] border border-border-soft bg-surface-canvas p-6 shadow-xs sm:p-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-2">
            <AdminBreadcrumbs
              items={[
                { label: "Admin", href: "/admin/leads" },
                { label: "Catalogo", href: "/admin/catalog/products" },
                { label: "Marcas" },
              ]}
            />
            <p className="text-caption uppercase tracking-[0.14em] text-text-muted">Catalogo</p>
            <h1 className="text-section-lg text-text-primary sm:text-headline-sm">Marcas</h1>
            <p className="max-w-2xl text-body-sm text-text-secondary">
              Gestiona el directorio de marcas disponible para los productos. Cada marca tiene nombre e imagen propia.
            </p>
          </div>

          <Link href="/admin/catalog/brands/new" className="inline-flex min-h-11 items-center justify-center rounded-pill bg-brand-primary px-6 py-3 text-label-md text-text-inverse shadow-sm transition-[background-color] duration-[200ms] ease-soft hover:bg-emerald-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface-canvas">
            Nueva marca
          </Link>
        </div>
      </section>

      <section className="rounded-[28px] border border-border-soft bg-surface-canvas p-5 shadow-xs sm:p-6">
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-border-soft bg-surface-subtle p-4">
            <p className="text-caption uppercase tracking-[0.12em] text-text-muted">Total</p>
            <p className="mt-2 text-headline-sm text-text-primary">{brands.length}</p>
            <p className="text-body-sm text-text-secondary">marcas registradas</p>
          </div>
          <div className="rounded-2xl border border-border-soft bg-surface-subtle p-4">
            <p className="text-caption uppercase tracking-[0.12em] text-text-muted">Con imagen</p>
            <p className="mt-2 text-headline-sm text-text-primary">{brands.filter((brand) => brand.mediaAssetId).length}</p>
            <p className="text-body-sm text-text-secondary">listas para el storefront</p>
          </div>
          <div className="rounded-2xl border border-border-soft bg-surface-subtle p-4">
            <p className="text-caption uppercase tracking-[0.12em] text-text-muted">Vinculadas</p>
            <p className="mt-2 text-headline-sm text-text-primary">{brands.filter((brand) => brand.productCount > 0).length}</p>
            <p className="text-body-sm text-text-secondary">usadas por productos</p>
          </div>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {brands.length > 0 ? (
            brands.map((brand) => (
              <Link
                key={brand.id}
                href={`/admin/catalog/brands/${brand.id}`}
                className="group rounded-2xl border border-border-soft bg-surface-subtle p-4 transition-[border-color,background-color,box-shadow] duration-[200ms] ease-soft hover:border-border-brand hover:bg-surface-canvas hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-brand focus-visible:ring-offset-2 focus-visible:ring-offset-surface-canvas"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-border-soft bg-surface-canvas">
                    {brand.mediaAssetPublicUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element -- Admin-managed media uses native img
                      <img src={brand.mediaAssetPublicUrl} alt={brand.mediaAssetAltText || brand.name} className="h-full w-full object-cover" />
                    ) : (
                      <span className="text-label-md text-text-secondary">{brand.name.slice(0, 1).toUpperCase()}</span>
                    )}
                  </div>

                  <div className="min-w-0 flex-1 space-y-2">
                    <div>
                      <h2 className="text-section-sm text-text-primary">{brand.name}</h2>
                      <p className="text-body-sm text-text-secondary">{brand.productCount} productos vinculados</p>
                    </div>
                    <p className="text-caption uppercase tracking-[0.12em] text-text-muted">
                      Actualizada {formatDate(brand.updatedAt).toLowerCase()}
                    </p>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="rounded-2xl border border-dashed border-border-soft bg-surface-subtle p-6 text-body-sm text-text-secondary md:col-span-2 xl:col-span-3">
              Todavia no hay marcas registradas. Crea la primera para asignarla a tus productos.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
