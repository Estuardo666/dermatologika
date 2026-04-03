import type { ExternalProduct, ExternalProductMoney } from "@/types/external-product-api";

interface DecimalLike {
  toNumber(): number;
}

type NumberLike = number | DecimalLike | null | undefined;

interface ExistingProductSyncSnapshot {
  price?: NumberLike;
  discountPrice?: NumberLike;
  stock?: NumberLike;
}

export interface NormalizedSyncManagedProductFields {
  price: number;
  discountPrice: number | null;
  stock: number;
}

function normalizeMoneyValue(value: ExternalProductMoney | null | undefined): number | null {
  if (!value) {
    return null;
  }

  const amount = Number(value.amount);
  if (!Number.isFinite(amount) || amount < 0) {
    return null;
  }

  return Math.round(amount * 100) / 100;
}

function normalizeNumberish(value: NumberLike): number | null {
  if (value === null || value === undefined) {
    return null;
  }

  const numericValue = typeof value === "number" ? value : value.toNumber();
  if (!Number.isFinite(numericValue) || numericValue < 0) {
    return null;
  }

  return Math.round(numericValue * 100) / 100;
}

function normalizeStockValue(value: NumberLike): number | null {
  if (value === null || value === undefined) {
    return null;
  }

  const numericValue = typeof value === "number" ? value : value.toNumber();
  if (!Number.isFinite(numericValue) || numericValue < 0) {
    return null;
  }

  return Math.floor(numericValue);
}

export function normalizeSyncManagedProductFields(
  externalProduct: ExternalProduct,
  existingLocal: ExistingProductSyncSnapshot = {},
): NormalizedSyncManagedProductFields {
  const externalRegularPrice = normalizeMoneyValue(externalProduct.price);
  const externalDiscountPrice = normalizeMoneyValue(externalProduct.discountPrice);
  const localRegularPrice = normalizeNumberish(existingLocal.price);
  const localDiscountPrice = normalizeNumberish(existingLocal.discountPrice);
  const localStock = normalizeStockValue(existingLocal.stock) ?? 0;

  const price = externalRegularPrice ?? externalDiscountPrice ?? localRegularPrice ?? 0;
  const discountCandidate = externalDiscountPrice ?? (externalRegularPrice === null ? localDiscountPrice : null);
  const discountPrice = discountCandidate !== null && discountCandidate < price ? discountCandidate : null;

  const explicitQuantity = normalizeStockValue(externalProduct.availability?.quantity);
  const stock = explicitQuantity ?? (externalProduct.availability?.inStock === false ? 0 : localStock);

  return {
    price,
    discountPrice,
    stock,
  };
}