import Link from "next/link";

import {
  ADMIN_BUTTON_PRIMARY_CLASS_NAME,
  ADMIN_HERO_SURFACE_CLASS_NAME,
  ADMIN_INSET_CARD_CLASS_NAME,
  ADMIN_LIST_ITEM_CLASS_NAME,
  ADMIN_PANEL_SURFACE_CLASS_NAME,
} from "@/components/admin/surface-styles";
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
      <section className={ADMIN_HERO_SURFACE_CLASS_NAME}>
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

          <Link href="/admin/catalog/brands/new" className={ADMIN_BUTTON_PRIMARY_CLASS_NAME}>
            Nueva marca
          </Link>
        </div>
      </section>

      <section className={ADMIN_PANEL_SURFACE_CLASS_NAME}>
        <div className="grid gap-3 sm:grid-cols-3">
          <div className={ADMIN_INSET_CARD_CLASS_NAME}>
            <p className="text-caption uppercase tracking-[0.12em] text-text-muted">Total</p>
            <p className="mt-2 text-headline-sm text-text-primary">{brands.length}</p>
            <p className="text-body-sm text-text-secondary">marcas registradas</p>
          </div>
          <div className={ADMIN_INSET_CARD_CLASS_NAME}>
            <p className="text-caption uppercase tracking-[0.12em] text-text-muted">Con imagen</p>
            <p className="mt-2 text-headline-sm text-text-primary">{brands.filter((brand) => brand.mediaAssetId).length}</p>
            <p className="text-body-sm text-text-secondary">listas para el storefront</p>
          </div>
          <div className={ADMIN_INSET_CARD_CLASS_NAME}>
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
                className={`group ${ADMIN_LIST_ITEM_CLASS_NAME} focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-brand focus-visible:ring-offset-2 focus-visible:ring-offset-surface-canvas`}
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
