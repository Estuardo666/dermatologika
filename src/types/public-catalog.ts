import type { MediaAsset } from "@/types/media";

export type PublicProductCatalogSort = "recent" | "name";

export interface PublicCatalogPagination {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface PublicCatalogCategoryReference {
  id: string;
  slug: string;
  name: string;
  href: string;
}

export interface PublicCatalogCategorySummary extends PublicCatalogCategoryReference {
  description: string;
  media: MediaAsset | null;
  productCount: number;
}

export interface PublicCatalogProductSummary {
  id: string;
  slug: string;
  name: string;
  brand: string;
  description: string;
  href: string;
  price: number;
  discountPrice: number | null;
  stock: number;
  badge?: string;
  badgeColor?: string;
  media: MediaAsset | null;
  category: PublicCatalogCategoryReference | null;
  categories: PublicCatalogCategoryReference[];
}

export interface PublicCatalogCategoryOption {
  id: string;
  slug: string;
  name: string;
  href: string;
  productCount: number;
}

export interface PublicCatalogBrandOption {
  id: string;
  name: string;
  logoUrl: string | null;
}

export interface PublicProductCatalogFilters {
  query: string;
  categorySlug: string;
}

export interface PublicProductCatalogData {
  items: PublicCatalogProductSummary[];
  filters: PublicProductCatalogFilters;
  sortBy: PublicProductCatalogSort;
  pagination: PublicCatalogPagination;
  categoryOptions: PublicCatalogCategoryOption[];
  brandOptions: PublicCatalogBrandOption[];
}

export interface PublicCategoryCatalogData {
  items: PublicCatalogCategorySummary[];
}

export interface PublicCategoryDetailData {
  category: PublicCatalogCategorySummary;
  products: PublicCatalogProductSummary[];
  pagination: PublicCatalogPagination;
}

export interface PublicProductDetailData {
  product: PublicCatalogProductSummary;
  brandProducts: PublicCatalogProductSummary[];
  recommendedProducts: PublicCatalogProductSummary[];
}