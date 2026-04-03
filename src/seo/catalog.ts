import type { Metadata } from "next";

import type {
  PublicCatalogCategorySummary,
  PublicCatalogProductSummary,
} from "@/types/public-catalog";

export function buildCategoryIndexMetadata(): Metadata {
  return {
    title: "Categorias",
    description:
      "Explora las categorias activas del catalogo Dermatologika desde la copia local preparada para storefront.",
  };
}

export function buildProductIndexMetadata(): Metadata {
  return {
    title: "Productos",
    description:
      "Consulta el catalogo publico de productos Dermatologika con filtros basicos y media servida desde la base local.",
  };
}

export function buildCategoryMetadata(category: PublicCatalogCategorySummary): Metadata {
  return {
    title: category.name,
    description: category.description,
  };
}

export function buildProductMetadata(product: PublicCatalogProductSummary): Metadata {
  return {
    title: product.name,
    description: product.description,
  };
}