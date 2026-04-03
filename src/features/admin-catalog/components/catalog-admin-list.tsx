"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition, type FormEvent } from "react";

import { AdminBreadcrumbs } from "@/components/layout/admin-breadcrumbs";
import { cx } from "@/lib/utils";
import {
  applyCategoryBulkActionClient,
  applyProductBulkActionClient,
} from "@/services/admin-catalog/client";
import type {
  AdminCatalogCategoryFilterOption,
  AdminCatalogCategoryItem,
  AdminCatalogBulkActionResult,
  AdminCatalogProductItem,
  AdminCategoryLibraryData,
  AdminProductLibraryData,
  CatalogListFilter,
  CatalogBulkAction,
  CatalogSortDirection,
  CategoryCatalogSortField,
  ProductCatalogSortField,
} from "@/types/admin-catalog";

interface CatalogAdminListProps {
  libraryData: AdminCategoryLibraryData | AdminProductLibraryData;
  section: "categories" | "products";
}

const adminListFieldClassName =
  "w-full rounded-2xl border border-[#c0d4be] bg-[#f8fbf7] px-4 py-3 text-body-md text-text-primary transition-[border-color,box-shadow,background-color] duration-[200ms] ease-soft hover:border-brand-primary hover:bg-[#fbfdfb] active:bg-surface-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-brand focus-visible:ring-offset-2 focus-visible:ring-offset-surface-subtle";

function formatDate(value: string): string {
  return new Intl.DateTimeFormat("es-ES", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function buildPaginationRange(currentPage: number, totalPages: number): number[] {
  const startPage = Math.max(1, currentPage - 2);
  const endPage = Math.min(totalPages, currentPage + 2);
  const pages: number[] = [];

  for (let page = startPage; page <= endPage; page += 1) {
    pages.push(page);
  }

  return pages;
}

function buildThumbnailFallback(label: string) {
  return label.slice(0, 1).toUpperCase();
}

function BulkSelectionCheckbox(props: {
  checked: boolean;
  onChange: () => void;
  disabled: boolean;
  srLabel: string;
}) {
  return (
    <label className="relative inline-flex h-4 w-4 items-center justify-center">
      <span className="sr-only">{props.srLabel}</span>
      <input
        type="checkbox"
        checked={props.checked}
        onChange={props.onChange}
        disabled={props.disabled}
        className="peer sr-only"
      />

      <motion.span
        aria-hidden="true"
        initial={false}
        animate={{
          scale: props.checked ? 1 : 0.96,
        }}
        transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
        className={cx(
          "flex h-4 w-4 items-center justify-center rounded-full border shadow-[inset_0_0_0_1px_rgba(0,0,0,0.01)] transition-[background-color,border-color] duration-[180ms] ease-soft peer-focus-visible:outline-none peer-focus-visible:ring-2 peer-focus-visible:ring-border-brand peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-surface-canvas",
          props.checked
            ? "border-border-brand bg-brand-primary"
            : "border-border-default bg-surface-canvas",
          props.disabled ? "opacity-50" : "cursor-pointer",
        )}
      >
        <motion.span
          initial={false}
          animate={{
            opacity: props.checked ? 1 : 0,
            scale: props.checked ? 1 : 0.4,
          }}
          transition={{ duration: 0.16, ease: [0.22, 1, 0.36, 1] }}
          className="h-1.5 w-1.5 rounded-full bg-surface-canvas"
        />
      </motion.span>
    </label>
  );
}

function getBulkActionLabel(action: CatalogBulkAction, processedCount: number, section: "categories" | "products") {
  const noun = section === "categories" ? "categorias" : "productos";

  if (action === "activate") {
    return `${processedCount} ${noun} ${processedCount === 1 ? "activada" : "activadas"} correctamente.`;
  }

  if (action === "deactivate") {
    return `${processedCount} ${noun} ${processedCount === 1 ? "desactivada" : "desactivadas"} correctamente.`;
  }

  return `${processedCount} ${noun} ${processedCount === 1 ? "eliminada" : "eliminadas"} correctamente.`;
}

export function CatalogAdminList({ libraryData, section }: CatalogAdminListProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isBulkPending, setIsBulkPending] = useState(false);
  const [bulkFeedback, setBulkFeedback] = useState<{
    tone: "success" | "error";
    message: string;
  } | null>(null);

  const showCategories = section === "categories";
  const categoryItems = showCategories ? (libraryData.items as AdminCatalogCategoryItem[]) : [];
  const productLibraryData = showCategories ? null : (libraryData as AdminProductLibraryData);
  const productItems = showCategories ? [] : (libraryData.items as AdminCatalogProductItem[]);
  const currentItems = showCategories ? categoryItems : productItems;
  const createHref = showCategories ? "/admin/catalog/categories/new" : "/admin/catalog/products/new";
  const createLabel = showCategories ? "Nueva categoria" : "Nuevo producto";
  const currentPage = libraryData.pagination.page;
  const activeQuery = searchParams.get("query") ?? libraryData.filters.query;
  const activeCategoryId = showCategories ? "" : searchParams.get("categoryId") ?? libraryData.filters.categoryId;
  const selectedCategoryOption =
    !showCategories && productLibraryData && activeCategoryId
      ? productLibraryData.categoryOptions.find((option) => option.id === activeCategoryId) ?? null
      : null;
  const paginationRange = buildPaginationRange(currentPage, libraryData.pagination.totalPages);
  const activeSortBy = libraryData.sorting.sortBy;
  const activeSortDirection = libraryData.sorting.sortDirection;
  const currentRowIds = currentItems.map((item) => item.id);
  const allRowsSelected = currentRowIds.length > 0 && currentRowIds.every((id) => selectedIds.includes(id));
  const selectedCount = selectedIds.length;
  const isBusy = isPending || isBulkPending;
  const filterOptions: Array<{ value: CatalogListFilter; label: string }> = [
    { value: "all", label: showCategories ? "Todas" : "Todos" },
    { value: "active", label: showCategories ? "Activas" : "Activos" },
    { value: "inactive", label: showCategories ? "Inactivas" : "Inactivos" },
  ];
  const breadcrumbItems = [
    { label: "Admin", href: "/admin/leads" },
    { label: "Catalogo", href: showCategories ? "/admin/catalog/categories" : "/admin/catalog/products" },
    { label: showCategories ? "Categorias" : "Productos" },
  ];

  function navigateWithParams(
    updates: Partial<{
      query: string;
      status: CatalogListFilter;
      categoryId: string;
      page: number;
      sortBy: string;
      sortDirection: CatalogSortDirection;
    }>,
  ) {
    const nextParams = new URLSearchParams(searchParams.toString());
    const defaultSortBy = "updatedAt";
    const defaultSortDirection: CatalogSortDirection = "desc";

    setSelectedIds([]);
    setBulkFeedback(null);

    if (updates.query !== undefined) {
      const normalizedQuery = updates.query.trim();

      if (normalizedQuery) {
        nextParams.set("query", normalizedQuery);
      } else {
        nextParams.delete("query");
      }
    }

    if (updates.status !== undefined) {
      if (updates.status === "all") {
        nextParams.delete("status");
      } else {
        nextParams.set("status", updates.status);
      }
    }

    if (updates.page !== undefined) {
      if (updates.page <= 1) {
        nextParams.delete("page");
      } else {
        nextParams.set("page", String(updates.page));
      }
    }

    if (updates.categoryId !== undefined) {
      if (!updates.categoryId) {
        nextParams.delete("categoryId");
      } else {
        nextParams.set("categoryId", updates.categoryId);
      }
    }

    if (updates.sortBy !== undefined) {
      if (updates.sortBy === defaultSortBy) {
        nextParams.delete("sortBy");
      } else {
        nextParams.set("sortBy", updates.sortBy);
      }
    }

    if (updates.sortDirection !== undefined) {
      if (updates.sortDirection === defaultSortDirection) {
        nextParams.delete("sortDirection");
      } else {
        nextParams.set("sortDirection", updates.sortDirection);
      }
    }

    const nextQueryString = nextParams.toString();
    const nextHref = nextQueryString ? `${pathname}?${nextQueryString}` : pathname;

    startTransition(() => {
      router.push(nextHref);
    });
  }

  function handleSearchSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const queryValue = formData.get("query");

    navigateWithParams({ query: typeof queryValue === "string" ? queryValue : "", page: 1 });
  }

  function handleStatusChange(status: CatalogListFilter) {
    navigateWithParams({ status, page: 1 });
  }

  function handleCategoryChange(categoryId: string) {
    navigateWithParams({ categoryId, page: 1 });
  }

  function handlePageChange(page: number) {
    navigateWithParams({ page });
  }

  function handleToggleRow(id: string) {
    setSelectedIds((current) =>
      current.includes(id) ? current.filter((currentId) => currentId !== id) : [...current, id],
    );
    setBulkFeedback(null);
  }

  function handleToggleAllRows() {
    setSelectedIds(allRowsSelected ? [] : currentRowIds);
    setBulkFeedback(null);
  }

  function handleSort(field: CategoryCatalogSortField | ProductCatalogSortField) {
    const nextDirection: CatalogSortDirection =
      activeSortBy === field && activeSortDirection === "asc"
        ? "desc"
        : field === "updatedAt"
          ? "desc"
          : "asc";

    navigateWithParams({ sortBy: field, sortDirection: nextDirection, page: 1 });
  }

  async function handleBulkAction(action: CatalogBulkAction) {
    if (selectedIds.length === 0) {
      return;
    }

    if (
      action === "delete" &&
      !window.confirm(
        `Se ${selectedIds.length === 1 ? "eliminara" : "eliminaran"} ${selectedIds.length} ${showCategories ? "categoria" : "producto"}${selectedIds.length === 1 ? "" : "s"}. Esta accion no se puede deshacer.`,
      )
    ) {
      return;
    }

    setIsBulkPending(true);
    setBulkFeedback(null);

    try {
      const result: AdminCatalogBulkActionResult = showCategories
        ? await applyCategoryBulkActionClient({ ids: selectedIds, action })
        : await applyProductBulkActionClient({ ids: selectedIds, action });

      setSelectedIds([]);
      setBulkFeedback({
        tone: "success",
        message: getBulkActionLabel(result.action, result.processedCount, section),
      });

      startTransition(() => {
        router.refresh();
      });
    } catch (error) {
      setBulkFeedback({
        tone: "error",
        message:
          error instanceof Error
            ? error.message
            : `No se pudo aplicar la accion masiva sobre ${showCategories ? "categorias" : "productos"}.`,
      });
    } finally {
      setIsBulkPending(false);
    }
  }

  function renderSortHeader(
    field: CategoryCatalogSortField | ProductCatalogSortField,
    label: string,
  ) {
    const isCurrent = activeSortBy === field;
    const sortIndicator = isCurrent ? (activeSortDirection === "asc" ? "↑" : "↓") : "↕";
    const ariaSort = isCurrent
      ? activeSortDirection === "asc"
        ? "ascending"
        : "descending"
      : "none";

    return (
      <th aria-sort={ariaSort} className="px-4 py-3 font-medium">
        <button
          type="button"
          onClick={() => handleSort(field)}
          className="inline-flex items-center gap-2 rounded-lg px-1 py-1 text-caption uppercase tracking-[0.12em] text-text-muted transition-[color,background-color,border-color] duration-[200ms] ease-soft hover:bg-surface-subtle hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-brand focus-visible:ring-offset-2 focus-visible:ring-offset-surface-canvas"
        >
          <span>{label}</span>
          <span aria-hidden="true">{sortIndicator}</span>
        </button>
      </th>
    );
  }

  return (
    <div className="space-y-6">
      <section className="rounded-[28px] border border-border-soft bg-surface-canvas p-6 shadow-xs sm:p-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-2">
            <AdminBreadcrumbs items={breadcrumbItems} />
            <p className="text-caption uppercase tracking-[0.14em] text-text-muted">
              {showCategories ? "Taxonomia" : "Catalogo"}
            </p>
            <h1 className="text-section-lg text-text-primary sm:text-headline-sm">{showCategories ? "Categorias" : "Productos"}</h1>
          </div>

          <Link
            href={createHref}
            className="inline-flex min-h-10 items-center justify-center rounded-2xl bg-ink-900 px-5 py-2.5 text-label-sm text-white shadow-sm transition-[background-color,border-color,color] duration-[200ms] ease-soft hover:bg-ink-700 active:bg-ink-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-900 focus-visible:ring-offset-2 focus-visible:ring-offset-surface-canvas sm:min-h-11 sm:px-6 sm:py-3 sm:text-label-md"
          >
            {createLabel}
          </Link>
        </div>
      </section>

      <section className="space-y-5 rounded-[28px] border border-border-soft bg-surface-canvas p-5 shadow-xs sm:p-6">
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-border-soft bg-surface-subtle p-4">
            <p className="text-caption uppercase tracking-[0.12em] text-text-muted">Total</p>
            <p className="mt-2 text-headline-sm text-text-primary">{libraryData.summary.totalCount}</p>
            <p className="text-body-sm text-text-secondary">
              {showCategories ? "categorias registradas" : "productos locales"}
            </p>
          </div>
          <div className="rounded-2xl border border-border-soft bg-surface-subtle p-4">
            <p className="text-caption uppercase tracking-[0.12em] text-text-muted">Activos</p>
            <p className="mt-2 text-headline-sm text-text-primary">{libraryData.summary.activeCount}</p>
            <p className="text-body-sm text-text-secondary">
              {showCategories ? "visibles para seleccion" : "disponibles para Home"}
            </p>
          </div>
          <div className="rounded-2xl border border-border-soft bg-surface-subtle p-4">
            <p className="text-caption uppercase tracking-[0.12em] text-text-muted">Inactivos</p>
            <p className="mt-2 text-headline-sm text-text-primary">{libraryData.summary.inactiveCount}</p>
            <p className="text-body-sm text-text-secondary">en reserva editorial</p>
          </div>
        </div>

        <div className="rounded-[24px] border border-border-soft bg-surface-subtle">
          <div className="flex flex-col gap-4 border-b border-border-soft px-4 py-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap items-center gap-2">
              {filterOptions.map((option) => {
                const isActive = libraryData.filters.status === option.value;

                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleStatusChange(option.value)}
                    className={cx(
                      "inline-flex min-h-11 items-center justify-center rounded-2xl px-4 py-2 text-label-md transition-[background-color,border-color,color] duration-[200ms] ease-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-brand focus-visible:ring-offset-2 focus-visible:ring-offset-surface-subtle",
                      isActive
                        ? "bg-surface-canvas text-text-primary shadow-sm"
                        : "text-text-secondary hover:bg-surface-canvas/70 active:bg-surface-subtle hover:text-text-primary",
                    )}
                    aria-pressed={isActive}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>

            <form onSubmit={handleSearchSubmit} className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <label className="sr-only" htmlFor={`${section}-search`}>
                {showCategories ? "Buscar categorias" : "Buscar productos"}
              </label>
              <input
                key={`${section}-${activeQuery}`}
                id={`${section}-search`}
                name="query"
                defaultValue={activeQuery}
                className={`w-full sm:min-w-[240px] ${adminListFieldClassName}`}
                placeholder={showCategories ? "Buscar por nombre, slug o href" : "Buscar por nombre, badge, origen o href"}
              />
              {!showCategories && productLibraryData ? (
                <label className="sr-only" htmlFor="products-category-filter">
                  Filtrar productos por categoria
                </label>
              ) : null}
              {!showCategories && productLibraryData ? (
                <select
                  id="products-category-filter"
                  value={activeCategoryId}
                  onChange={(event) => handleCategoryChange(event.target.value)}
                  className={`w-full sm:min-w-[220px] ${adminListFieldClassName}`}
                  disabled={isBusy}
                >
                  <option value="">Todas las categorias</option>
                  {productLibraryData.categoryOptions.map((option: AdminCatalogCategoryFilterOption) => (
                    <option key={option.id} value={option.id}>
                      {option.name}
                    </option>
                  ))}
                </select>
              ) : null}
              <button
                type="submit"
                disabled={isBusy}
                className="inline-flex min-h-11 items-center justify-center rounded-2xl border border-border-default bg-surface-canvas px-4 py-3 text-label-md text-text-primary transition-[background-color,border-color,color] duration-[200ms] ease-soft hover:border-border-strong hover:bg-surface-subtle active:bg-surface-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-brand focus-visible:ring-offset-2 focus-visible:ring-offset-surface-subtle disabled:opacity-50"
              >
                {isPending ? "Buscando..." : "Buscar"}
              </button>
            </form>
          </div>

          {selectedCategoryOption || activeQuery ? (
            <div className="flex flex-wrap items-center gap-3 border-b border-border-soft px-4 py-3">
              <span className="text-body-sm text-text-secondary">Filtro activo:</span>
              {selectedCategoryOption ? (
                <button
                  type="button"
                  onClick={() => handleCategoryChange("")}
                  disabled={isBusy}
                  className="inline-flex min-h-10 items-center gap-2 rounded-full border border-border-default bg-surface-canvas px-4 py-2 text-body-sm text-text-primary shadow-sm transition-[background-color,border-color,color] duration-[200ms] ease-soft hover:border-border-strong hover:bg-surface-subtle active:bg-surface-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-brand focus-visible:ring-offset-2 focus-visible:ring-offset-surface-subtle disabled:opacity-50"
                  aria-label={`Quitar filtro de categoria ${selectedCategoryOption.name}`}
                >
                  <span className="text-text-secondary">Categoria:</span>
                  <span className="font-medium text-text-primary">{selectedCategoryOption.name}</span>
                  <span aria-hidden="true" className="text-text-secondary">
                    ×
                  </span>
                </button>
              ) : null}
              {activeQuery ? (
                <button
                  type="button"
                  onClick={() => navigateWithParams({ query: "", page: 1 })}
                  disabled={isBusy}
                  className="inline-flex min-h-10 items-center gap-2 rounded-full border border-border-default bg-surface-canvas px-4 py-2 text-body-sm text-text-primary shadow-sm transition-[background-color,border-color,color] duration-[200ms] ease-soft hover:border-border-strong hover:bg-surface-subtle active:bg-surface-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-brand focus-visible:ring-offset-2 focus-visible:ring-offset-surface-subtle disabled:opacity-50"
                  aria-label={`Quitar busqueda ${activeQuery}`}
                >
                  <span className="text-text-secondary">Busqueda:</span>
                  <span className="font-medium text-text-primary">{activeQuery}</span>
                  <span aria-hidden="true" className="text-text-secondary">
                    ×
                  </span>
                </button>
              ) : null}
            </div>
          ) : null}

          <div className="flex flex-col gap-3 border-b border-border-soft px-4 py-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-body-sm text-text-secondary">
                {selectedCount > 0
                  ? `${selectedCount} ${showCategories ? "categoria" : "producto"}${selectedCount === 1 ? "" : "s"} seleccionada${selectedCount === 1 ? "" : "s"}`
                  : `Selecciona filas para activar, desactivar o eliminar en bloque.`}
              </span>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => void handleBulkAction("activate")}
                  disabled={selectedCount === 0 || isBusy}
                  className="inline-flex min-h-10 items-center justify-center rounded-2xl border border-border-default bg-surface-canvas px-4 py-2 text-label-md text-text-primary transition-[background-color,border-color,color] duration-[200ms] ease-soft hover:border-border-strong hover:bg-surface-subtle active:bg-surface-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-brand focus-visible:ring-offset-2 focus-visible:ring-offset-surface-subtle disabled:opacity-50"
                >
                  Activar
                </button>
                <button
                  type="button"
                  onClick={() => void handleBulkAction("deactivate")}
                  disabled={selectedCount === 0 || isBusy}
                  className="inline-flex min-h-10 items-center justify-center rounded-2xl border border-border-default bg-surface-canvas px-4 py-2 text-label-md text-text-primary transition-[background-color,border-color,color] duration-[200ms] ease-soft hover:border-border-strong hover:bg-surface-subtle active:bg-surface-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-brand focus-visible:ring-offset-2 focus-visible:ring-offset-surface-subtle disabled:opacity-50"
                >
                  Desactivar
                </button>
                <button
                  type="button"
                  onClick={() => void handleBulkAction("delete")}
                  disabled={selectedCount === 0 || isBusy}
                  className="inline-flex min-h-10 items-center justify-center rounded-2xl border border-status-error/40 bg-status-error/10 px-4 py-2 text-label-md text-status-error transition-[background-color,border-color,color] duration-[200ms] ease-soft hover:border-status-error/60 hover:bg-status-error/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-status-error focus-visible:ring-offset-2 focus-visible:ring-offset-surface-subtle disabled:opacity-50"
                >
                  Eliminar
                </button>
              </div>
            </div>

            {bulkFeedback ? (
              <p
                className={cx(
                  "text-body-sm",
                  bulkFeedback.tone === "success" ? "text-status-success" : "text-status-error",
                )}
                role="status"
              >
                {bulkFeedback.message}
              </p>
            ) : null}
          </div>

          <div className="overflow-x-auto">
            {libraryData.items.length === 0 ? (
              <div className="px-4 py-10 text-body-sm text-text-secondary">
                No hay resultados para los filtros actuales.
              </div>
            ) : (
              <table className="min-w-full border-collapse text-left">
                <thead>
                  <tr className="border-b border-border-soft text-caption uppercase tracking-[0.12em] text-text-muted">
                    <th className="px-4 py-3 font-medium">
                      <BulkSelectionCheckbox
                        checked={allRowsSelected}
                        onChange={handleToggleAllRows}
                        disabled={currentRowIds.length === 0 || isBusy}
                        srLabel="Seleccionar todas las filas visibles"
                      />
                    </th>
                    {renderSortHeader("name", showCategories ? "Categoria" : "Producto")}
                    {renderSortHeader("slug", "Slug")}
                    {renderSortHeader("status", "Estado")}
                    {!showCategories ? renderSortHeader("category", "Categoria") : null}
                    {!showCategories ? <th className="px-4 py-3 font-medium">Origen</th> : null}
                    {renderSortHeader("updatedAt", "Actualizado")}
                    <th className="px-4 py-3 font-medium text-right">Accion</th>
                  </tr>
                </thead>
                <tbody>
                  {showCategories
                    ? categoryItems.map((category) => (
                        <tr
                          key={category.id}
                          className="border-b border-border-soft/80 bg-surface-canvas transition-colors hover:bg-surface-subtle/60"
                        >
                          <td className="px-4 py-4 align-top">
                            <BulkSelectionCheckbox
                              checked={selectedIds.includes(category.id)}
                              onChange={() => handleToggleRow(category.id)}
                              disabled={isBusy}
                              srLabel={`Seleccionar categoria ${category.name}`}
                            />
                          </td>
                          <td className="px-4 py-4 align-top">
                            <div className="flex items-start gap-3">
                              <div className="relative aspect-square w-11 shrink-0 overflow-hidden rounded-lg border border-border-soft bg-surface-subtle">
                                {category.mediaAssetPublicUrl ? (
                                  <Image
                                    src={category.mediaAssetPublicUrl}
                                    alt={category.mediaAssetAltText || category.name}
                                    fill
                                    sizes="48px"
                                    className="object-cover"
                                  />
                                ) : (
                                  <div className="flex h-full w-full items-center justify-center text-label-md text-text-muted">
                                    {buildThumbnailFallback(category.name)}
                                  </div>
                                )}
                              </div>
                              <div className="min-w-0 space-y-1">
                                <Link
                                  href={`/admin/catalog/categories/${category.id}`}
                                  className="rounded-lg px-1 py-0.5 text-label-md text-text-primary transition-[color,background-color,border-color] duration-[200ms] ease-soft hover:bg-surface-subtle hover:text-text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-brand focus-visible:ring-offset-2 focus-visible:ring-offset-surface-canvas"
                                >
                                  {category.name}
                                </Link>
                                <p className="line-clamp-2 text-body-sm text-text-secondary">{category.description}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-4 align-top text-body-sm text-text-secondary">{category.slug}</td>
                          <td className="px-4 py-4 align-top">
                            <span
                              className={cx(
                                "inline-flex rounded-full px-2.5 py-0.5 text-label-sm",
                                category.isActive ? "bg-emerald-100 text-emerald-800" : "bg-slate-200 text-slate-700",
                              )}
                            >
                              {category.isActive ? "Activa" : "Inactiva"}
                            </span>
                          </td>
                          <td className="px-4 py-4 align-top text-body-sm text-text-secondary">
                            {formatDate(category.updatedAt)}
                          </td>
                          <td className="px-4 py-4 text-right align-top">
                            <Link
                              href={`/admin/catalog/categories/${category.id}`}
                              className="inline-flex min-h-10 items-center justify-center rounded-2xl border border-border-default bg-surface-canvas px-4 py-2 text-label-md text-text-primary transition-[background-color,border-color,color] duration-[200ms] ease-soft hover:border-border-strong hover:bg-surface-soft active:bg-surface-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-brand focus-visible:ring-offset-2 focus-visible:ring-offset-surface-canvas"
                            >
                              Editar
                            </Link>
                          </td>
                        </tr>
                      ))
                    : productItems.map((product) => (
                        <tr
                          key={product.id}
                          className="border-b border-border-soft/80 bg-surface-canvas transition-colors hover:bg-surface-subtle/60"
                        >
                          <td className="px-4 py-4 align-top">
                            <BulkSelectionCheckbox
                              checked={selectedIds.includes(product.id)}
                              onChange={() => handleToggleRow(product.id)}
                              disabled={isBusy}
                              srLabel={`Seleccionar producto ${product.name}`}
                            />
                          </td>
                          <td className="px-4 py-4 align-top">
                            <div className="flex items-start gap-3">
                              <div className="relative aspect-square w-11 shrink-0 overflow-hidden rounded-lg border border-border-soft bg-surface-subtle">
                                {product.mediaAssetPublicUrl ? (
                                  <Image
                                    src={product.mediaAssetPublicUrl}
                                    alt={product.mediaAssetAltText || product.name}
                                    fill
                                    sizes="48px"
                                    className="object-cover"
                                  />
                                ) : (
                                  <div className="flex h-full w-full items-center justify-center text-label-md text-text-muted">
                                    {buildThumbnailFallback(product.name)}
                                  </div>
                                )}
                              </div>
                              <div className="min-w-0 space-y-1">
                                <Link
                                  href={`/admin/catalog/products/${product.id}`}
                                  className="rounded-lg px-1 py-0.5 text-label-md text-text-primary transition-[color,background-color,border-color] duration-[200ms] ease-soft hover:bg-surface-subtle hover:text-text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-brand focus-visible:ring-offset-2 focus-visible:ring-offset-surface-canvas"
                                >
                                  {product.name}
                                </Link>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-4 align-top text-body-sm text-text-secondary">{product.slug}</td>
                          <td className="px-4 py-4 align-top">
                            <span
                              className={cx(
                                "inline-flex rounded-full px-2.5 py-0.5 text-label-sm",
                                product.isActive ? "bg-emerald-100 text-emerald-800" : "bg-slate-200 text-slate-700",
                              )}
                            >
                              {product.isActive ? "Activo" : "Inactivo"}
                            </span>
                          </td>
                          <td className="px-4 py-4 align-top text-body-sm text-text-secondary">
                            {product.categoryName ?? "Sin categoria"}
                          </td>
                          <td className="px-4 py-4 align-top text-body-sm text-text-secondary">
                            {product.externalSourceId ? `${product.externalSourceId} · v${product.syncVersion}` : "Local"}
                          </td>
                          <td className="px-4 py-4 align-top text-body-sm text-text-secondary">
                            {formatDate(product.updatedAt)}
                          </td>
                          <td className="px-4 py-4 text-right align-top">
                            <Link
                              href={`/admin/catalog/products/${product.id}`}
                              className="inline-flex min-h-10 items-center justify-center rounded-2xl border border-border-default bg-surface-canvas px-4 py-2 text-label-md text-text-primary transition-[background-color,border-color,color] duration-[200ms] ease-soft hover:border-border-strong hover:bg-surface-soft active:bg-surface-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-brand focus-visible:ring-offset-2 focus-visible:ring-offset-surface-canvas"
                            >
                              Editar
                            </Link>
                          </td>
                        </tr>
                      ))}
                </tbody>
              </table>
            )}
          </div>

          <div className="flex flex-col gap-4 border-t border-border-soft px-4 py-4 md:flex-row md:items-center md:justify-between">
            <p className="text-body-sm text-text-secondary">
              Mostrando {libraryData.items.length} de {libraryData.pagination.totalItems} {showCategories ? "categorias" : "productos"}.
            </p>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                disabled={!libraryData.pagination.hasPreviousPage || isBusy}
                onClick={() => handlePageChange(currentPage - 1)}
                className="inline-flex min-h-10 items-center justify-center rounded-2xl border border-border-default bg-surface-canvas px-4 py-2 text-label-md text-text-primary transition-[background-color,border-color,color] duration-[200ms] ease-soft hover:border-border-strong hover:bg-surface-soft active:bg-surface-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-brand focus-visible:ring-offset-2 focus-visible:ring-offset-surface-canvas disabled:opacity-50"
              >
                Anterior
              </button>

              {paginationRange.map((page) => {
                const isCurrent = page === currentPage;

                return (
                  <button
                    key={page}
                    type="button"
                    onClick={() => handlePageChange(page)}
                    disabled={isBusy}
                    aria-current={isCurrent ? "page" : undefined}
                    className={cx(
                      "inline-flex h-10 min-w-10 items-center justify-center rounded-2xl border px-3 text-label-md transition-[background-color,border-color,color] duration-[200ms] ease-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-brand focus-visible:ring-offset-2 focus-visible:ring-offset-surface-canvas",
                      isCurrent
                        ? "border-ink-900 bg-ink-900 text-white"
                        : "border-border-default bg-surface-canvas text-text-primary hover:border-border-strong hover:bg-surface-soft active:bg-surface-subtle",
                    )}
                  >
                    {page}
                  </button>
                );
              })}

              <button
                type="button"
                disabled={!libraryData.pagination.hasNextPage || isBusy}
                onClick={() => handlePageChange(currentPage + 1)}
                className="inline-flex min-h-10 items-center justify-center rounded-2xl border border-border-default bg-surface-canvas px-4 py-2 text-label-md text-text-primary transition-[background-color,border-color,color] duration-[200ms] ease-soft hover:border-border-strong hover:bg-surface-soft active:bg-surface-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-brand focus-visible:ring-offset-2 focus-visible:ring-offset-surface-canvas disabled:opacity-50"
              >
                Siguiente
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
