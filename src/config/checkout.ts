export type CheckoutShippingMethod = "standard" | "pickup";

export const CHECKOUT_CURRENCY = "USD";

export const CHECKOUT_SHIPPING_BASE_COSTS: Record<CheckoutShippingMethod, number> = {
  standard: 6,
  pickup: 0,
};

export function resolveCheckoutShippingBaseCost(method: CheckoutShippingMethod): number {
  return CHECKOUT_SHIPPING_BASE_COSTS[method] ?? 0;
}