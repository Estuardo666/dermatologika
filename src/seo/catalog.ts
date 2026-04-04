import type { Metadata } from "next";

import type {
  PublicCatalogCategorySummary,
  PublicCatalogProductSummary,
} from "@/types/public-catalog";

export function buildCategoryIndexMetadata(): Metadata {
  return {
    title: "Categorías",
    description:
      "Explora todas las categorías de productos dermatológicos en Dermatologika. Encuentra los productos ideales para tu piel.",
  };
}

export function buildProductIndexMetadata(): Metadata {
  return {
    title: "Tienda",
    description:
      "Descubre la tienda Dermatologika. Productos dermatológicos para el cuidado de la piel respaldados por especialistas.",
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