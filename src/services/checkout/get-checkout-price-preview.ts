import type {
  CheckoutPricingPreview,
  CheckoutPricingPreviewRequest,
  CheckoutPricingPreviewRouteResponse,
} from "@/types/checkout-pricing";

export async function getCheckoutPricePreview(
  input: CheckoutPricingPreviewRequest,
): Promise<CheckoutPricingPreview> {
  const response = await fetch("/api/checkout/price-preview", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });

  let payload: CheckoutPricingPreviewRouteResponse | null = null;
  try {
    payload = (await response.json()) as CheckoutPricingPreviewRouteResponse;
  } catch {
    throw new Error("Failed to parse checkout pricing preview response.");
  }

  if (!response.ok || !payload.success || !payload.data?.preview) {
    throw new Error(payload.error?.message ?? "Failed to calculate checkout pricing preview.");
  }

  return payload.data.preview;
}