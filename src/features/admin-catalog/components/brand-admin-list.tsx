import Image from "next/image";
import Link from "next/link";

import {
  ADMIN_BUTTON_PRIMARY_CLASS_NAME,
  ADMIN_HERO_SURFACE_CLASS_NAME,
  ADMIN_INSET_CARD_CLASS_NAME,
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

      <section className={`space-y-5 ${ADMIN_PANEL_SURFACE_CLASS_NAME}`}>
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

        <div className="rounded-[24px] border border-border-soft bg-surface-subtle">
          {brands.length > 0 ? (
            <>
              <div className="space-y-3 px-3 py-3 md:hidden">
                {brands.map((brand) => (
                  <article key={brand.id} className="rounded-2xl border border-border-soft bg-surface-canvas p-4 shadow-[0_14px_28px_-24px_rgba(28,56,41,0.25)]">
                    <div className="flex items-start gap-3">
                      <div className="relative aspect-square w-14 shrink-0 overflow-hidden rounded-lg border border-border-soft bg-surface-canvas">
                        {brand.mediaAssetPublicUrl ? (
                          <Image src={brand.mediaAssetPublicUrl} alt={brand.mediaAssetAltText || brand.name} fill sizes="56px" className="object-cover" />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-label-md text-text-secondary">{brand.name.slice(0, 1).toUpperCase()}</div>
                        )}
                      </div>
                      <div className="min-w-0 flex-1 space-y-1.5">
                        <Link href={`/admin/catalog/brands/${brand.id}`} className="block rounded-lg px-1 py-0.5 text-label-md text-text-primary transition-[color,background-color,border-color] duration-[200ms] ease-soft hover:bg-surface-subtle hover:text-text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-brand focus-visible:ring-offset-2 focus-visible:ring-offset-surface-canvas">
                          {brand.name}
                        </Link>
                        <p className="text-body-sm text-text-secondary">{brand.productCount} productos vinculados</p>
                        <p className="text-body-sm text-text-secondary">Actualizada: {formatDate(brand.updatedAt)}</p>
                      </div>
                    </div>

                    <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:justify-end">
                      <Link href={`/admin/catalog/brands/${brand.id}`} className={`${ADMIN_BUTTON_PRIMARY_CLASS_NAME} w-full sm:w-auto`}>
                        Editar
                      </Link>
                    </div>
                  </article>
                ))}
              </div>

              <div className="hidden overflow-x-auto md:block">
                <table className="min-w-full border-collapse text-left">
                  <thead>
                    <tr className="border-b border-border-soft text-caption uppercase tracking-[0.12em] text-text-muted">
                      <th className="px-4 py-3 font-medium">Marca</th>
                      <th className="px-4 py-3 font-medium">Imagen</th>
                      <th className="px-4 py-3 font-medium">Productos</th>
                      <th className="px-4 py-3 font-medium">Actualizado</th>
                      <th className="px-4 py-3 font-medium text-right">Acción</th>
                    </tr>
                  </thead>
                  <tbody>
                    {brands.map((brand) => (
                      <tr key={brand.id} className="border-b border-border-soft/80 bg-surface-canvas transition-colors hover:bg-surface-subtle/60">
                        <td className="px-4 py-4 align-top">
                          <div className="space-y-1">
                            <Link href={`/admin/catalog/brands/${brand.id}`} className="rounded-lg px-1 py-0.5 text-label-md text-text-primary transition-[color,background-color,border-color] duration-[200ms] ease-soft hover:bg-surface-subtle hover:text-text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-brand focus-visible:ring-offset-2 focus-visible:ring-offset-surface-canvas">
                              {brand.name}
                            </Link>
                            <p className="text-caption text-text-muted">Creada: {formatDate(brand.createdAt)}</p>
                          </div>
                        </td>
                        <td className="px-4 py-4 align-top text-body-sm text-text-secondary">
                          <div className="flex items-center gap-3">
                            <div className="relative aspect-square w-11 shrink-0 overflow-hidden rounded-lg border border-border-soft bg-surface-canvas">
                              {brand.mediaAssetPublicUrl ? (
                                <Image src={brand.mediaAssetPublicUrl} alt={brand.mediaAssetAltText || brand.name} fill sizes="48px" className="object-cover" />
                              ) : (
                                <div className="flex h-full w-full items-center justify-center text-label-md text-text-secondary">{brand.name.slice(0, 1).toUpperCase()}</div>
                              )}
                            </div>
                            <span>{brand.mediaAssetId ? "Disponible" : "Sin imagen"}</span>
                          </div>
                        </td>
                        <td className="px-4 py-4 align-top text-body-sm text-text-secondary">{brand.productCount}</td>
                        <td className="px-4 py-4 align-top text-body-sm text-text-secondary">{formatDate(brand.updatedAt)}</td>
                        <td className="px-4 py-4 text-right align-top">
                          <Link href={`/admin/catalog/brands/${brand.id}`} className={ADMIN_BUTTON_PRIMARY_CLASS_NAME}>
                            Editar
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <div className="rounded-2xl border border-dashed border-border-soft bg-surface-subtle p-6 text-body-sm text-text-secondary">
              Todavia no hay marcas registradas. Crea la primera para asignarla a tus productos.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
