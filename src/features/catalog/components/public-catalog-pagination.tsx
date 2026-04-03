import Link from "next/link";

import { cx } from "@/lib/utils";
import type { PublicCatalogPagination } from "@/types/public-catalog";

interface PublicCatalogPaginationProps {
  basePath: string;
  pagination: PublicCatalogPagination;
  searchParams: Record<string, string>;
}

function buildPageHref(
  basePath: string,
  searchParams: Record<string, string>,
  page: number,
): string {
  const params = new URLSearchParams();

  Object.entries(searchParams).forEach(([key, value]) => {
    if (!value || key === "pagina") {
      return;
    }

    params.set(key, value);
  });

  if (page > 1) {
    params.set("pagina", String(page));
  }

  const queryString = params.toString();
  return queryString ? `${basePath}?${queryString}` : basePath;
}

function buildVisiblePages(currentPage: number, totalPages: number): number[] {
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const start = Math.max(1, currentPage - 2);
  const end = Math.min(totalPages, start + 4);
  const normalizedStart = Math.max(1, end - 4);

  return Array.from({ length: end - normalizedStart + 1 }, (_, index) => normalizedStart + index);
}

export function PublicCatalogPagination({
  basePath,
  pagination,
  searchParams,
}: PublicCatalogPaginationProps) {
  if (pagination.totalPages <= 1) {
    return null;
  }

  const visiblePages = buildVisiblePages(pagination.page, pagination.totalPages);

  return (
    <nav
      aria-label="Paginacion del catalogo"
      className="flex flex-col gap-4 rounded-[28px] border border-border-soft bg-surface-canvas p-5 shadow-xs sm:flex-row sm:items-center sm:justify-between"
    >
      <p className="text-body-sm text-text-secondary">
        Pagina {pagination.page} de {pagination.totalPages} · {pagination.totalItems} resultados
      </p>

      <div className="flex flex-wrap items-center gap-2">
        <Link
          href={buildPageHref(basePath, searchParams, pagination.page - 1)}
          aria-disabled={!pagination.hasPreviousPage}
          className={cx(
            "inline-flex min-h-11 items-center rounded-pill border px-4 py-2 text-label-md transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface-canvas",
            pagination.hasPreviousPage
              ? "border-border-default bg-surface-canvas text-text-primary hover:border-border-strong hover:bg-surface-subtle"
              : "pointer-events-none border-border-soft bg-surface-soft text-text-muted",
          )}
        >
          Anterior
        </Link>

        {visiblePages.map((pageNumber) => {
          const isCurrent = pageNumber === pagination.page;

          return (
            <Link
              key={pageNumber}
              href={buildPageHref(basePath, searchParams, pageNumber)}
              aria-current={isCurrent ? "page" : undefined}
              className={cx(
                "inline-flex h-11 min-w-11 items-center justify-center rounded-full border px-3 text-label-md transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface-canvas",
                isCurrent
                  ? "border-border-brand bg-brand-soft text-text-brand"
                  : "border-border-default bg-surface-canvas text-text-primary hover:border-border-strong hover:bg-surface-subtle",
              )}
            >
              {pageNumber}
            </Link>
          );
        })}

        <Link
          href={buildPageHref(basePath, searchParams, pagination.page + 1)}
          aria-disabled={!pagination.hasNextPage}
          className={cx(
            "inline-flex min-h-11 items-center rounded-pill border px-4 py-2 text-label-md transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface-canvas",
            pagination.hasNextPage
              ? "border-border-default bg-surface-canvas text-text-primary hover:border-border-strong hover:bg-surface-subtle"
              : "pointer-events-none border-border-soft bg-surface-soft text-text-muted",
          )}
        >
          Siguiente
        </Link>
      </div>
    </nav>
  );
}