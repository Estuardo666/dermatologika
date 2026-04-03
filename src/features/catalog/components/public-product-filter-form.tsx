import Link from "next/link";

import type {
  PublicCatalogCategoryOption,
  PublicProductCatalogFilters,
  PublicProductCatalogSort,
} from "@/types/public-catalog";

interface PublicProductFilterFormProps {
  actionPath: string;
  filters: PublicProductCatalogFilters;
  sortBy: PublicProductCatalogSort;
  categoryOptions: PublicCatalogCategoryOption[];
}

export function PublicProductFilterForm({
  actionPath,
  filters,
  sortBy,
  categoryOptions,
}: PublicProductFilterFormProps) {
  const hasActiveFilters = Boolean(filters.query || filters.categorySlug || sortBy !== "recent");

  return (
    <form
      action={actionPath}
      className="grid gap-4 rounded-[28px] border border-border-soft bg-surface-canvas p-5 shadow-xs lg:grid-cols-[minmax(0,1.3fr)_minmax(220px,0.8fr)_minmax(200px,0.7fr)_auto] lg:items-end sm:p-6"
    >
      <label className="space-y-2">
        <span className="block text-label-md text-text-primary">Buscar producto</span>
        <input
          type="search"
          name="q"
          defaultValue={filters.query}
          placeholder="Buscar por nombre, descripcion o badge"
          className="w-full rounded-[20px] border border-border-default bg-surface-canvas px-4 py-3 text-body-md text-text-primary transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface-canvas"
        />
      </label>

      <label className="space-y-2">
        <span className="block text-label-md text-text-primary">Categoria</span>
        <select
          name="categoria"
          defaultValue={filters.categorySlug}
          className="w-full rounded-[20px] border border-border-default bg-surface-canvas px-4 py-3 text-body-md text-text-primary transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface-canvas"
        >
          <option value="">Todas las categorias</option>
          {categoryOptions.map((option) => (
            <option key={option.id} value={option.slug}>
              {option.name}
            </option>
          ))}
        </select>
      </label>

      <label className="space-y-2">
        <span className="block text-label-md text-text-primary">Orden</span>
        <select
          name="orden"
          defaultValue={sortBy}
          className="w-full rounded-[20px] border border-border-default bg-surface-canvas px-4 py-3 text-body-md text-text-primary transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface-canvas"
        >
          <option value="recent">Mas recientes</option>
          <option value="name">Nombre A-Z</option>
        </select>
      </label>

      <div className="flex flex-wrap items-center gap-3 lg:justify-end">
        <button
          type="submit"
          className="inline-flex min-h-11 items-center justify-center rounded-pill bg-brand-primary px-6 py-3 text-label-md text-text-inverse shadow-sm transition duration-200 hover:bg-brand-primaryHover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface-canvas"
        >
          Aplicar
        </button>

        {hasActiveFilters ? (
          <Link
            href={actionPath}
            className="inline-flex min-h-11 items-center justify-center rounded-pill border border-border-default bg-surface-canvas px-5 py-3 text-label-md text-text-primary transition duration-200 hover:border-border-strong hover:bg-surface-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface-canvas"
          >
            Limpiar
          </Link>
        ) : null}
      </div>
    </form>
  );
}