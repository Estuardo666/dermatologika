"use client";

import type { AdminDeleteRouteResponse } from "@/types/admin-catalog";
import type {
  AdminPromotionFormData,
  AdminPromotionPreviewRequest,
  AdminPromotionPreviewRouteResponse,
  AdminPromotionRouteResponse,
} from "@/types/admin-promotions";

async function parseJsonResponse<T>(response: Response): Promise<T> {
  try {
    return (await response.json()) as T;
  } catch {
    throw new Error("Server returned an invalid JSON response.");
  }
}

export async function createPromotionClient(input: AdminPromotionFormData) {
  const response = await fetch("/api/admin/promotions", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(input),
  });

  const body = await parseJsonResponse<AdminPromotionRouteResponse>(response);
  if (!response.ok || !body.success || !body.data) {
    throw new Error(body.error?.message ?? "Failed to create promotion.");
  }

  return body.data.promotion;
}

export async function updatePromotionClient(id: string, input: AdminPromotionFormData) {
  const response = await fetch(`/api/admin/promotions/${id}`, {
    method: "PUT",
    headers: {
      "content-type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(input),
  });

  const body = await parseJsonResponse<AdminPromotionRouteResponse>(response);
  if (!response.ok || !body.success || !body.data) {
    throw new Error(body.error?.message ?? "Failed to update promotion.");
  }

  return body.data.promotion;
}

export async function deletePromotionClient(id: string) {
  const response = await fetch(`/api/admin/promotions/${id}`, {
    method: "DELETE",
    credentials: "include",
  });

  const body = await parseJsonResponse<AdminDeleteRouteResponse>(response);
  if (!response.ok || !body.success) {
    throw new Error(body.error?.message ?? "Failed to delete promotion.");
  }

  return id;
}

export async function previewPromotionClient(input: AdminPromotionPreviewRequest) {
  const response = await fetch("/api/admin/promotions/preview", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(input),
  });

  const body = await parseJsonResponse<AdminPromotionPreviewRouteResponse>(response);
  if (!response.ok || !body.success || !body.data) {
    throw new Error(body.error?.message ?? "Failed to simulate promotion.");
  }

  return body.data.preview;
}