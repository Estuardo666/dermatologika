"use client";

import type {
  AdminCatalogBulkActionInput,
  AdminCatalogBulkRouteResponse,
  AdminCatalogEditorData,
  AdminCatalogRouteResponse,
  AdminCategoryFormData,
  AdminCategoryRouteResponse,
  AdminDeleteRouteResponse,
  AdminProductFormData,
  AdminProductRouteResponse,
} from "@/types/admin-catalog";

async function parseJsonResponse<T>(response: Response): Promise<T> {
  try {
    return (await response.json()) as T;
  } catch {
    throw new Error("Server returned an invalid JSON response.");
  }
}

export async function fetchCatalogAdminData(): Promise<AdminCatalogEditorData> {
  const response = await fetch("/api/admin/catalog", {
    method: "GET",
    credentials: "include",
  });

  const body = await parseJsonResponse<AdminCatalogRouteResponse>(response);
  if (!response.ok || !body.success || !body.data) {
    throw new Error(body.error?.message ?? "Failed to load catalog admin data.");
  }

  return body.data;
}

export async function createCategoryClient(input: AdminCategoryFormData) {
  const response = await fetch("/api/admin/catalog/categories", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(input),
  });

  const body = await parseJsonResponse<AdminCategoryRouteResponse>(response);
  if (!response.ok || !body.success || !body.data) {
    throw new Error(body.error?.message ?? "Failed to create category.");
  }

  return body.data.category;
}

export async function updateCategoryClient(id: string, input: AdminCategoryFormData) {
  const response = await fetch(`/api/admin/catalog/categories/${id}`, {
    method: "PUT",
    headers: {
      "content-type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(input),
  });

  const body = await parseJsonResponse<AdminCategoryRouteResponse>(response);
  if (!response.ok || !body.success || !body.data) {
    throw new Error(body.error?.message ?? "Failed to update category.");
  }

  return body.data.category;
}

export async function deleteCategoryClient(id: string) {
  const response = await fetch(`/api/admin/catalog/categories/${id}`, {
    method: "DELETE",
    credentials: "include",
  });

  const body = await parseJsonResponse<AdminDeleteRouteResponse>(response);
  if (!response.ok || !body.success || !body.data) {
    throw new Error(body.error?.message ?? "Failed to delete category.");
  }

  return body.data.deletedId;
}

export async function createProductClient(input: AdminProductFormData) {
  const response = await fetch("/api/admin/catalog/products", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(input),
  });

  const body = await parseJsonResponse<AdminProductRouteResponse>(response);
  if (!response.ok || !body.success || !body.data) {
    throw new Error(body.error?.message ?? "Failed to create product.");
  }

  return body.data.product;
}

export async function updateProductClient(id: string, input: AdminProductFormData) {
  const response = await fetch(`/api/admin/catalog/products/${id}`, {
    method: "PUT",
    headers: {
      "content-type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(input),
  });

  const body = await parseJsonResponse<AdminProductRouteResponse>(response);
  if (!response.ok || !body.success || !body.data) {
    throw new Error(body.error?.message ?? "Failed to update product.");
  }

  return body.data.product;
}

export async function deleteProductClient(id: string) {
  const response = await fetch(`/api/admin/catalog/products/${id}`, {
    method: "DELETE",
    credentials: "include",
  });

  const body = await parseJsonResponse<AdminDeleteRouteResponse>(response);
  if (!response.ok || !body.success || !body.data) {
    throw new Error(body.error?.message ?? "Failed to delete product.");
  }

  return body.data.deletedId;
}

export async function applyCategoryBulkActionClient(input: AdminCatalogBulkActionInput) {
  const response = await fetch("/api/admin/catalog/categories/bulk", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(input),
  });

  const body = await parseJsonResponse<AdminCatalogBulkRouteResponse>(response);
  if (!response.ok || !body.success || !body.data) {
    throw new Error(body.error?.message ?? "Failed to apply bulk category action.");
  }

  return body.data;
}

export async function applyProductBulkActionClient(input: AdminCatalogBulkActionInput) {
  const response = await fetch("/api/admin/catalog/products/bulk", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(input),
  });

  const body = await parseJsonResponse<AdminCatalogBulkRouteResponse>(response);
  if (!response.ok || !body.success || !body.data) {
    throw new Error(body.error?.message ?? "Failed to apply bulk product action.");
  }

  return body.data;
}
