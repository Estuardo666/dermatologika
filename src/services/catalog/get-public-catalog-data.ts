import "server-only";

import { buildCategoryHref } from "@/lib/catalog-slugs";
import { slugifyCatalogName } from "@/lib/catalog-slugs";
import type { MediaAsset } from "@/types/media";
import type {
  PublicCatalogBrandOption,
  PublicCatalogCategoryReference,
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
  getMaxPublicProductPrice,
  getMaxPublicProductPriceForScope,
  listPublicBrandOptions,
  listPublicCategoryOptions,
  listPublicCategoryRecords,
  listPublicProductRecords,
  listProductsByBrand,
  listRelatedPublicProductRecords,
  PUBLIC_CATALOG_PAGE_SIZE,
} from "@/server/catalog/public-catalog.repository";

interface PublicCatalogSearchParams {
  query: string;
  categorySlug: string;
  page: number;
  sortBy: PublicProductCatalogSort;
  priceMin: number | null;
  priceMax: number | null;
  inStock: boolean;
  onSale: boolean;
  brandValues: string[];
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
  const v = normalizeStringParam(value);
  const valid: PublicProductCatalogSort[] = [
    "recent", "oldest", "name", "name-desc", "price-asc", "price-desc", "bestseller", "highest-discount",
  ];
  return valid.includes(v as PublicProductCatalogSort) ? (v as PublicProductCatalogSort) : "recent";
}

function normalizePriceParam(value: string | string[] | undefined): number | null {
  const str = normalizeStringParam(value);
  if (!str) return null;
  const parsed = Number.parseFloat(str);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : null;
}

function normalizeBooleanParam(value: string | string[] | undefined): boolean {
  return normalizeStringParam(value) === "1";
}

function normalizeBrandValuesParam(value: string | string[] | undefined): string[] {
  const str = normalizeStringParam(value);
  if (!str) return [];
  return str.split(",").map((s) => s.trim()).filter(Boolean);
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
  href?: string;
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
    productAssignments: number;
  };
}): PublicCatalogCategorySummary {
  return {
    id: record.id,
    slug: record.slug,
    name: record.name,
    description: record.description,
    href: buildCategoryHref(record.slug),
    media: mapMediaAsset(record.mediaAsset),
    productCount: record._count.productAssignments,
  };
}

function mapCategoryOption(record: {
  id: string;
  slug: string;
  name: string;
  href: string;
  _count: {
    productAssignments: number;
  };
}): PublicCatalogCategoryOption {
  return {
    id: record.id,
    slug: record.slug,
    name: record.name,
    href: buildCategoryHref(record.slug),
    productCount: record._count.productAssignments,
  };
}

function dedupeCategoryReferences(
  categories: Array<{
    id: string;
    slug: string;
    name: string;
    href: string;
  }>,
): PublicCatalogCategoryReference[] {
  const seen = new Set<string>();

  return categories.filter((category) => {
    if (seen.has(category.id)) {
      return false;
    }

    seen.add(category.id);
    return true;
  });
}

function mapProductSummary(record: {
  id: string;
  slug: string;
  name: string;
  brand: string;
  description: string;
  href: string;
  price: number | DecimalLike;
  discountPrice: number | DecimalLike | null;
  stock: number;
  badge: string | null;
  badgeColor: string | null;
  categoryId: string | null;
  category?: {
    id: string;
    slug: string;
    name: string;
    href: string;
  } | null;
  categoryAssignments?: Array<{
    category: {
      id: string;
      slug: string;
      name: string;
      href: string;
    };
  }>;
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
  const categories = dedupeCategoryReferences([
    ...(record.category
      ? [
          {
            id: record.category.id,
            slug: record.category.slug,
            name: record.category.name,
            href: buildCategoryHref(record.category.slug),
          },
        ]
      : []),
    ...((record.categoryAssignments ?? []).map((assignment) => ({
      ...assignment.category,
      href: buildCategoryHref(assignment.category.slug),
    }))),
  ]);
  const baseItem = {
    id: record.id,
    slug: record.slug,
    name: record.name,
    brand: record.brand,
    description: record.description,
    href: `/productos/${record.slug}`,
    price: toNumberValue(record.price),
    discountPrice: record.discountPrice === null ? null : toNumberValue(record.discountPrice),
    stock: record.stock,
    media: mapMediaAsset(record.mediaAsset),
    category: categories[0] ?? null,
    categories,
  };

  return record.badge
    ? { ...baseItem, badge: record.badge, ...(record.badgeColor ? { badgeColor: record.badgeColor } : {}) }
    : baseItem;
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
    priceMin: normalizePriceParam(searchParams.precioMin),
    priceMax: normalizePriceParam(searchParams.precioMax),
    inStock: normalizeBooleanParam(searchParams.enStock),
    onSale: normalizeBooleanParam(searchParams.enOferta),
    brandValues: normalizeBrandValuesParam(searchParams.marcas),
  };
}

function buildPublicProductFilters(query: PublicCatalogSearchParams): PublicProductCatalogFilters {
  return {
    query: query.query,
    categorySlug: query.categorySlug,
    priceMin: query.priceMin,
    priceMax: query.priceMax,
    inStock: query.inStock,
    onSale: query.onSale,
    brandIds: [],
  };
}

export async function getPublicCategoryCatalogData(): Promise<PublicCategoryCatalogData> {
  const categories = await listPublicCategoryRecords();

  return {
    items: categories.map(mapCategorySummary),
  };
}

function mapBrandOption(record: { id: string; name: string; mediaAsset?: { publicUrl: string | null } | null }): PublicCatalogBrandOption {
  return {
    id: record.id,
    slug: slugifyCatalogName(record.name),
    name: record.name,
    logoUrl: record.mediaAsset?.publicUrl ?? null,
  };
}

export function resolveBrandIdsFromValues(
  brandValues: string[],
  brandOptions: PublicCatalogBrandOption[],
): string[] {
  if (brandValues.length === 0) {
    return [];
  }

  const normalizedValues = brandValues.map((value) => value.trim().toLowerCase()).filter(Boolean);
  const brandIds = new Set<string>();

  for (const value of normalizedValues) {
    const match = brandOptions.find((brand) => brand.id === value || brand.slug === value);
    if (match) {
      brandIds.add(match.id);
    }
  }

  return [...brandIds];
}

export function mapBrandIdsToSlugs(
  brandIds: string[],
  brandOptions: PublicCatalogBrandOption[],
): string[] {
  return brandIds
    .map((brandId) => brandOptions.find((brand) => brand.id === brandId)?.slug)
    .filter((slug): slug is string => Boolean(slug));
}

export async function getPublicProductCatalogData(
  searchParams: Record<string, string | string[] | undefined>,
): Promise<PublicProductCatalogData> {
  const query = parsePublicCatalogSearchParams(searchParams);
  const [categoryOptions, rawBrandOptions, maxPrice] = await Promise.all([
    listPublicCategoryOptions(),
    listPublicBrandOptions(),
    getMaxPublicProductPrice(),
  ]);
  const brandOptions = rawBrandOptions.map(mapBrandOption);
  const resolvedBrandIds = resolveBrandIdsFromValues(query.brandValues, brandOptions);
  const records = await listPublicProductRecords({
    ...query,
    brandIds: resolvedBrandIds,
    pageSize: PUBLIC_CATALOG_PAGE_SIZE,
  });

  return {
    items: records.items.map(mapProductSummary),
    filters: {
      ...buildPublicProductFilters(query),
      brandIds: resolvedBrandIds,
    },
    sortBy: query.sortBy,
    pagination: buildPagination(records.filteredCount, query.page),
    categoryOptions: categoryOptions.map(mapCategoryOption),
    brandOptions,
    maxPrice,
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
  const [rawBrandOptions, maxPrice] = await Promise.all([
    listPublicBrandOptions(slug),
    getMaxPublicProductPriceForScope({ categorySlug: slug }),
  ]);
  const brandOptions = rawBrandOptions.map(mapBrandOption);
  const resolvedBrandIds = resolveBrandIdsFromValues(query.brandValues, brandOptions);
  const records = await listPublicProductRecords({
    ...query,
    categorySlug: slug,
    brandIds: resolvedBrandIds,
    pageSize: PUBLIC_CATALOG_PAGE_SIZE,
  });

  return {
    category: mapCategorySummary(category),
    products: records.items.map(mapProductSummary),
    pagination: buildPagination(records.filteredCount, query.page),
    filters: {
      ...buildPublicProductFilters(query),
      brandIds: resolvedBrandIds,
    },
    sortBy: query.sortBy,
    brandOptions,
    maxPrice,
  };
}

export async function getPublicProductDetailData(
  slug: string,
): Promise<PublicProductDetailData | null> {
  const product = await findPublicProductRecordBySlug(slug);
  if (!product) {
    return null;
  }

  const categoryIds = product.categoryAssignments.map((a) => a.category.id);

  const [brandProductRecords, recommendedProductRecords] = await Promise.all([
    listProductsByBrand({ productId: product.id, brand: product.brand }),
    listRelatedPublicProductRecords({ productId: product.id, categoryIds }),
  ]);

  const brandProductIds = new Set(brandProductRecords.map((p) => p.id));

  return {
    product: mapProductSummary(product),
    brandProducts: brandProductRecords.map(mapProductSummary),
    recommendedProducts: recommendedProductRecords
      .filter((p) => !brandProductIds.has(p.id))
      .map(mapProductSummary),
  };
}