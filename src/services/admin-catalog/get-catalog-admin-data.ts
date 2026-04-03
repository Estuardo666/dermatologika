import "server-only";

import type { AdminMediaAssetSummary } from "@/types/admin-home-content";
import type {
  AdminCatalogCategoryFilterOption,
  AdminCategoryLibraryData,
  AdminCatalogCategoryItem,
  AdminCatalogListFilters,
  AdminCatalogPagination,
  AdminCatalogEditorData,
  AdminProductLibraryData,
  AdminCatalogProductItem,
  CatalogListFilter,
  CatalogSortDirection,
  CategoryCatalogSortField,
  ProductCatalogSortField,
} from "@/types/admin-catalog";
import {
  listAdminCatalogMediaAssetRecords,
  listAdminCategoryLibraryRecords,
  listAdminCategoryRecords,
  listAdminProductLibraryRecords,
  listAdminProductRecords,
} from "@/server/catalog/admin-catalog.repository";

export const DEFAULT_CATALOG_PAGE_SIZE = 10;

interface DecimalLike {
  toNumber(): number;
}

function toNumberValue(value: number | DecimalLike): number {
  return typeof value === "number" ? value : value.toNumber();
}

interface CatalogListSearchParams {
  query: string;
  status: CatalogListFilter;
  categoryId: string;
  page: number;
  pageSize: number;
  sortBy: string;
  sortDirection: CatalogSortDirection;
}

function normalizeStringParam(value: string | string[] | undefined): string {
  if (Array.isArray(value)) {
    return value[0]?.trim() ?? "";
  }

  return value?.trim() ?? "";
}

function normalizePageParam(value: string | string[] | undefined): number {
  const parsedValue = Number.parseInt(normalizeStringParam(value), 10);
  return Number.isFinite(parsedValue) && parsedValue > 0 ? parsedValue : 1;
}

function normalizeStatusParam(value: string | string[] | undefined): CatalogListFilter {
  const normalizedValue = normalizeStringParam(value);
  return normalizedValue === "active" || normalizedValue === "inactive" ? normalizedValue : "all";
}

function normalizeSortDirectionParam(
  value: string | string[] | undefined,
): CatalogSortDirection {
  return normalizeStringParam(value) === "asc" ? "asc" : "desc";
}

function normalizeCategorySortField(value: string): CategoryCatalogSortField {
  return value === "name" || value === "slug" || value === "status" || value === "href"
    ? value
    : "updatedAt";
}

function normalizeProductSortField(value: string): ProductCatalogSortField {
  return value === "name" || value === "slug" || value === "status" || value === "category" || value === "href"
    ? value
    : "updatedAt";
}

function buildPagination(totalItems: number, page: number, pageSize: number): AdminCatalogPagination {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const normalizedPage = Math.min(page, totalPages);

  return {
    page: normalizedPage,
    pageSize,
    totalItems,
    totalPages,
    hasPreviousPage: normalizedPage > 1,
    hasNextPage: normalizedPage < totalPages,
  };
}

export function parseCatalogListSearchParams(searchParams: Record<string, string | string[] | undefined>): CatalogListSearchParams {
  return {
    query: normalizeStringParam(searchParams.query),
    status: normalizeStatusParam(searchParams.status),
    categoryId: normalizeStringParam(searchParams.categoryId),
    page: normalizePageParam(searchParams.page),
    pageSize: DEFAULT_CATALOG_PAGE_SIZE,
    sortBy: normalizeStringParam(searchParams.sortBy),
    sortDirection: normalizeSortDirectionParam(searchParams.sortDirection),
  };
}

function buildCatalogListFilters(input: CatalogListSearchParams): AdminCatalogListFilters {
  return {
    query: input.query,
    status: input.status,
    categoryId: input.categoryId,
  };
}

function mapCategoryFilterOption(record: { id: string; name: string }): AdminCatalogCategoryFilterOption {
  return {
    id: record.id,
    name: record.name,
  };
}

export function mapAdminMediaAssetSummary(record: {
  id: string;
  storageKey: string;
  publicUrl: string | null;
  kind: "image" | "video";
  altText: string | null;
  mimeType: string | null;
  posterUrl: string | null;
  width: number | null;
  height: number | null;
  durationSeconds: number | null;
  createdAt: Date;
  updatedAt: Date;
}): AdminMediaAssetSummary {
  return {
    id: record.id,
    storageKey: record.storageKey,
    publicUrl: record.publicUrl,
    kind: record.kind,
    altText: record.altText ?? "",
    mimeType: record.mimeType,
    posterUrl: record.posterUrl,
    width: record.width,
    height: record.height,
    durationSeconds: record.durationSeconds,
    createdAt: record.createdAt.toISOString(),
    updatedAt: record.updatedAt.toISOString(),
  };
}

export function mapAdminCategoryItem(record: {
  id: string;
  slug: string;
  name: string;
  description: string;
  href: string;
  isActive: boolean;
  mediaAssetId: string | null;
  mediaAsset?: {
    publicUrl: string | null;
    altText: string | null;
  } | null;
  createdAt: Date;
  updatedAt: Date;
}): AdminCatalogCategoryItem {
  return {
    id: record.id,
    slug: record.slug,
    name: record.name,
    description: record.description,
    href: record.href,
    isActive: record.isActive,
    mediaAssetId: record.mediaAssetId,
    mediaAssetPublicUrl: record.mediaAsset?.publicUrl ?? null,
    mediaAssetAltText: record.mediaAsset?.altText ?? "",
    createdAt: record.createdAt.toISOString(),
    updatedAt: record.updatedAt.toISOString(),
  };
}

export function mapAdminProductItem(record: {
  id: string;
  slug: string;
  name: string;
  description: string;
  href: string;
  badge: string | null;
  price: number | DecimalLike;
  discountPrice: number | DecimalLike | null;
  stock: number;
  isActive: boolean;
  categoryId: string | null;
  category?: {
    id: string;
    name: string;
  } | null;
  mediaAssetId: string | null;
  mediaAsset?: {
    publicUrl: string | null;
    altText: string | null;
  } | null;
  externalId: string | null;
  externalSourceId: string | null;
  lastSyncedAt: Date | null;
  syncVersion: number;
  createdAt: Date;
  updatedAt: Date;
}): AdminCatalogProductItem {
  return {
    id: record.id,
    slug: record.slug,
    name: record.name,
    description: record.description,
    href: record.href,
    badge: record.badge,
    price: toNumberValue(record.price),
    discountPrice: record.discountPrice === null ? null : toNumberValue(record.discountPrice),
    stock: record.stock,
    isActive: record.isActive,
    categoryId: record.categoryId,
    categoryName: record.category?.name ?? null,
    mediaAssetId: record.mediaAssetId,
    mediaAssetPublicUrl: record.mediaAsset?.publicUrl ?? null,
    mediaAssetAltText: record.mediaAsset?.altText ?? "",
    externalId: record.externalId,
    externalSourceId: record.externalSourceId,
    lastSyncedAt: record.lastSyncedAt ? record.lastSyncedAt.toISOString() : null,
    syncVersion: record.syncVersion,
    createdAt: record.createdAt.toISOString(),
    updatedAt: record.updatedAt.toISOString(),
  };
}

export async function getCatalogAdminData(): Promise<AdminCatalogEditorData> {
  const [categories, products, mediaAssets] = await Promise.all([
    listAdminCategoryRecords(),
    listAdminProductRecords(),
    listAdminCatalogMediaAssetRecords(),
  ]);

  return {
    categories: categories.map(mapAdminCategoryItem),
    products: products.map(mapAdminProductItem),
    mediaAssets: mediaAssets.map(mapAdminMediaAssetSummary),
  };
}

export async function getCategoryLibraryData(
  searchParams: Record<string, string | string[] | undefined>,
): Promise<AdminCategoryLibraryData> {
  const parsedParams = parseCatalogListSearchParams(searchParams);
  const query = {
    ...parsedParams,
    sortBy: normalizeCategorySortField(parsedParams.sortBy),
  };
  const records = await listAdminCategoryLibraryRecords(query);
  const pagination = buildPagination(records.filteredCount, query.page, query.pageSize);

  return {
    items: records.items.map(mapAdminCategoryItem),
    summary: {
      totalCount: records.totalCount,
      activeCount: records.activeCount,
      inactiveCount: records.inactiveCount,
    },
    pagination,
    filters: buildCatalogListFilters(query),
    sorting: {
      sortBy: query.sortBy,
      sortDirection: query.sortDirection,
    },
  };
}

export async function getProductLibraryData(
  searchParams: Record<string, string | string[] | undefined>,
): Promise<AdminProductLibraryData> {
  const parsedParams = parseCatalogListSearchParams(searchParams);
  const query = {
    ...parsedParams,
    sortBy: normalizeProductSortField(parsedParams.sortBy),
  };
  const [records, categories] = await Promise.all([
    listAdminProductLibraryRecords(query),
    listAdminCategoryRecords(),
  ]);
  const pagination = buildPagination(records.filteredCount, query.page, query.pageSize);

  return {
    items: records.items.map(mapAdminProductItem),
    summary: {
      totalCount: records.totalCount,
      activeCount: records.activeCount,
      inactiveCount: records.inactiveCount,
    },
    pagination,
    filters: buildCatalogListFilters(query),
    sorting: {
      sortBy: query.sortBy,
      sortDirection: query.sortDirection,
    },
    categoryOptions: categories.map(mapCategoryFilterOption),
  };
}
