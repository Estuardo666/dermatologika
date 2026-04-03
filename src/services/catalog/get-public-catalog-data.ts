import "server-only";

import type { MediaAsset } from "@/types/media";
import type {
  PublicCatalogCategoryOption,
  PublicCatalogCategorySummary,
  PublicCatalogPagination,
  PublicCatalogProductSummary,
  PublicCategoryDetailData,
  PublicCategoryCatalogData,
  PublicProductCatalogData,
  PublicProductCatalogFilters,
  PublicProductDetailData,
  PublicProductCatalogSort,
} from "@/types/public-catalog";
import {
  findPublicCategoryRecordBySlug,
  findPublicProductRecordBySlug,
  listPublicCategoryOptions,
  listPublicCategoryRecords,
  listPublicProductRecords,
  listRelatedPublicProductRecords,
  PUBLIC_CATALOG_PAGE_SIZE,
} from "@/server/catalog/public-catalog.repository";

interface PublicCatalogSearchParams {
  query: string;
  categorySlug: string;
  page: number;
  sortBy: PublicProductCatalogSort;
}

interface DecimalLike {
  toNumber(): number;
}

function toNumberValue(value: number | DecimalLike): number {
  return typeof value === "number" ? value : value.toNumber();
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

function normalizeSortParam(value: string | string[] | undefined): PublicProductCatalogSort {
  return normalizeStringParam(value) === "name" ? "name" : "recent";
}

function mapMediaAsset(record: {
  id: string;
  kind: "image" | "video";
  publicUrl: string | null;
  storageKey: string;
  altText: string | null;
  mimeType: string | null;
  posterUrl: string | null;
  width: number | null;
  height: number | null;
  durationSeconds: number | null;
} | null | undefined): MediaAsset | null {
  if (!record) {
    return null;
  }

  return {
    id: record.id,
    kind: record.kind,
    url: record.publicUrl,
    storageKey: record.storageKey,
    altText: record.altText ?? "",
    mimeType: record.mimeType,
    posterUrl: record.posterUrl,
    width: record.width,
    height: record.height,
    durationSeconds: record.durationSeconds,
  };
}

function mapCategorySummary(record: {
  id: string;
  slug: string;
  name: string;
  description: string;
  href: string;
  mediaAsset?: {
    id: string;
    kind: "image" | "video";
    publicUrl: string | null;
    storageKey: string;
    altText: string | null;
    mimeType: string | null;
    posterUrl: string | null;
    width: number | null;
    height: number | null;
    durationSeconds: number | null;
  } | null;
  _count: {
    products: number;
  };
}): PublicCatalogCategorySummary {
  return {
    id: record.id,
    slug: record.slug,
    name: record.name,
    description: record.description,
    href: record.href,
    media: mapMediaAsset(record.mediaAsset),
    productCount: record._count.products,
  };
}

function mapCategoryOption(record: {
  id: string;
  slug: string;
  name: string;
  href: string;
  _count: {
    products: number;
  };
}): PublicCatalogCategoryOption {
  return {
    id: record.id,
    slug: record.slug,
    name: record.name,
    href: record.href,
    productCount: record._count.products,
  };
}

function mapProductSummary(record: {
  id: string;
  slug: string;
  name: string;
  description: string;
  href: string;
  price: number | DecimalLike;
  discountPrice: number | DecimalLike | null;
  stock: number;
  badge: string | null;
  categoryId: string | null;
  category?: {
    id: string;
    slug: string;
    name: string;
    href: string;
  } | null;
  mediaAsset?: {
    id: string;
    kind: "image" | "video";
    publicUrl: string | null;
    storageKey: string;
    altText: string | null;
    mimeType: string | null;
    posterUrl: string | null;
    width: number | null;
    height: number | null;
    durationSeconds: number | null;
  } | null;
}): PublicCatalogProductSummary {
  const baseItem = {
    id: record.id,
    slug: record.slug,
    name: record.name,
    description: record.description,
    href: record.href,
    price: toNumberValue(record.price),
    discountPrice: record.discountPrice === null ? null : toNumberValue(record.discountPrice),
    stock: record.stock,
    media: mapMediaAsset(record.mediaAsset),
    category: record.category
      ? {
          id: record.category.id,
          slug: record.category.slug,
          name: record.category.name,
          href: record.category.href,
        }
      : null,
  };

  return record.badge ? { ...baseItem, badge: record.badge } : baseItem;
}

function buildPagination(totalItems: number, page: number): PublicCatalogPagination {
  const totalPages = Math.max(1, Math.ceil(totalItems / PUBLIC_CATALOG_PAGE_SIZE));
  const normalizedPage = Math.min(page, totalPages);

  return {
    page: normalizedPage,
    pageSize: PUBLIC_CATALOG_PAGE_SIZE,
    totalItems,
    totalPages,
    hasPreviousPage: normalizedPage > 1,
    hasNextPage: normalizedPage < totalPages,
  };
}

export function parsePublicCatalogSearchParams(
  searchParams: Record<string, string | string[] | undefined>,
): PublicCatalogSearchParams {
  return {
    query: normalizeStringParam(searchParams.q),
    categorySlug: normalizeStringParam(searchParams.categoria),
    page: normalizePageParam(searchParams.pagina),
    sortBy: normalizeSortParam(searchParams.orden),
  };
}

function buildPublicProductFilters(query: PublicCatalogSearchParams): PublicProductCatalogFilters {
  return {
    query: query.query,
    categorySlug: query.categorySlug,
  };
}

export async function getPublicCategoryCatalogData(): Promise<PublicCategoryCatalogData> {
  const categories = await listPublicCategoryRecords();

  return {
    items: categories.map(mapCategorySummary),
  };
}

export async function getPublicProductCatalogData(
  searchParams: Record<string, string | string[] | undefined>,
): Promise<PublicProductCatalogData> {
  const query = parsePublicCatalogSearchParams(searchParams);
  const [records, categoryOptions] = await Promise.all([
    listPublicProductRecords({
      ...query,
      pageSize: PUBLIC_CATALOG_PAGE_SIZE,
    }),
    listPublicCategoryOptions(),
  ]);

  return {
    items: records.items.map(mapProductSummary),
    filters: buildPublicProductFilters(query),
    sortBy: query.sortBy,
    pagination: buildPagination(records.filteredCount, query.page),
    categoryOptions: categoryOptions.map(mapCategoryOption),
  };
}

export async function getPublicCategoryDetailData(
  slug: string,
  searchParams: Record<string, string | string[] | undefined>,
): Promise<PublicCategoryDetailData | null> {
  const category = await findPublicCategoryRecordBySlug(slug);
  if (!category) {
    return null;
  }

  const query = parsePublicCatalogSearchParams({
    ...searchParams,
    categoria: slug,
  });
  const records = await listPublicProductRecords({
    ...query,
    categorySlug: slug,
    pageSize: PUBLIC_CATALOG_PAGE_SIZE,
  });

  return {
    category: mapCategorySummary(category),
    products: records.items.map(mapProductSummary),
    pagination: buildPagination(records.filteredCount, query.page),
  };
}

export async function getPublicProductDetailData(
  slug: string,
): Promise<PublicProductDetailData | null> {
  const product = await findPublicProductRecordBySlug(slug);
  if (!product) {
    return null;
  }

  const relatedProducts = await listRelatedPublicProductRecords({
    productId: product.id,
    categoryId: product.categoryId,
  });

  return {
    product: mapProductSummary(product),
    relatedProducts: relatedProducts.map(mapProductSummary),
  };
}