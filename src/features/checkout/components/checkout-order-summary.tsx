"use client";

import { AlertCircle, CheckCircle2, Tag } from "lucide-react";

import type { CheckoutShippingMethod } from "@/config/checkout";
import { resolveCheckoutShippingBaseCost } from "@/config/checkout";
import type { CartItem } from "@/features/cart/types";
import type { CheckoutPricingPreview } from "@/types/checkout-pricing";

// ─── Price formatter ──────────────────────────────────────────────────────────

const fmt = new Intl.NumberFormat("es-EC", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
});

// ─── Props ────────────────────────────────────────────────────────────────────

interface CheckoutOrderSummaryProps {
  items: CartItem[];
  subtotal: number;
  shippingMethod: CheckoutShippingMethod;
  preview: CheckoutPricingPreview | null;
  discountCode: string;
  onDiscountCodeChange: (value: string) => void;
  onApplyDiscountCode: () => void;
  appliedCouponCode: string | null;
  isPricingLoading: boolean;
  pricingError: string | null;
  hasPendingCouponChanges: boolean;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function CheckoutOrderSummary({
  items,
  subtotal,
  shippingMethod,
  preview,
  discountCode,
  onDiscountCodeChange,
  onApplyDiscountCode,
  appliedCouponCode,
  isPricingLoading,
  pricingError,
  hasPendingCouponChanges,
}: CheckoutOrderSummaryProps) {
  const linePreviewById = new Map(preview?.lines.map((line) => [line.productId, line]) ?? []);
  const shippingBase = preview?.totals.shippingBase ?? resolveCheckoutShippingBaseCost(shippingMethod);
  const shippingDiscount = preview?.totals.shippingDiscount ?? 0;
  const shippingTotal = preview?.totals.shippingTotal ?? shippingBase;
  const merchandiseSubtotal = preview?.totals.merchandiseSubtotal ?? subtotal;
  const discountTotal = preview?.totals.discountTotal ?? 0;
  const total = preview?.totals.total ?? merchandiseSubtotal + shippingTotal;
  const invalidCouponCode = preview?.invalidCouponCode ?? null;
  const hasAppliedCoupon = appliedCouponCode !== null && invalidCouponCode === null;
  const couponButtonLabel = hasPendingCouponChanges
    ? discountCode.trim().length > 0 ? "Aplicar" : "Quitar"
    : "Aplicado";

  return (
    <div>
      {/* Items list */}
      <ul aria-label="Productos en tu pedido" className="mb-6 divide-y divide-border-soft">
        {items.map((item) => {
          const unitPrice = item.discountPrice ?? item.price ?? 0;
          const lineBaseSubtotal = unitPrice * item.quantity;
          const pricingLine = linePreviewById.get(item.id);
          const lineFinalSubtotal = pricingLine?.finalSubtotal ?? lineBaseSubtotal;

          return (
            <li key={item.id} className="flex items-center gap-3.5 py-4 first:pt-0">
              {/* Image with quantity badge */}
              <div className="relative shrink-0">
                <div className="h-16 w-16 overflow-hidden rounded-xl border border-border-soft bg-white">
                  {item.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element -- R2 assets use native img
                    <img
                      src={item.imageUrl}
                      alt={item.imageAlt}
                      className="h-full w-full object-contain p-1.5"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-surface-soft">
                      <span className="text-label-sm text-text-muted">
                        {item.name.slice(0, 1).toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>
                {/* Quantity badge */}
                <span
                  aria-label={`Cantidad: ${item.quantity}`}
                  className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-text-secondary px-1 text-[0.62rem] font-semibold leading-none text-white tabular-nums"
                >
                  {item.quantity}
                </span>
              </div>

              {/* Name + brand */}
              <div className="min-w-0 flex-1">
                <p className="line-clamp-2 text-body-sm font-medium leading-snug text-text-primary">
                  {item.name}
                </p>
                <p className="mt-0.5 text-caption text-text-muted">{item.brand}</p>
              </div>

              {/* Line price */}
              <div className="shrink-0 text-right">
                {pricingLine && pricingLine.discountTotal > 0 ? (
                  <span className="block text-[0.72rem] tabular-nums text-text-muted line-through">
                    {fmt.format(lineBaseSubtotal)}
                  </span>
                ) : null}
                <span className="text-label-sm font-semibold tabular-nums text-text-primary">
                  {fmt.format(lineFinalSubtotal)}
                </span>
              </div>
            </li>
          );
        })}
      </ul>

      {/* Discount code */}
      <div className="mb-6 flex gap-2">
        <div className="relative flex-1">
          <Tag
            className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted"
            aria-hidden="true"
          />
          <label htmlFor="discount-code" className="sr-only">
            Código de descuento
          </label>
          <input
            id="discount-code"
            type="text"
            value={discountCode}
            onChange={(e) => onDiscountCodeChange(e.target.value)}
            placeholder="Código de descuento"
            autoComplete="off"
            className="w-full rounded-md border border-border bg-white py-2.5 pl-10 pr-3.5 text-body-sm text-text-primary placeholder:text-text-muted transition-[border-color,box-shadow,background-color] duration-fast hover:border-border-brand hover:bg-brand-soft/20 focus:border-brand-primary focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
          />
        </div>
        <button
          type="button"
          onClick={onApplyDiscountCode}
          disabled={isPricingLoading || !hasPendingCouponChanges}
          className="shrink-0 rounded-md border border-border bg-white px-4 py-2.5 text-label-sm font-medium text-text-secondary transition-colors duration-fast hover:border-border-strong hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPricingLoading ? "Actualizando..." : couponButtonLabel}
        </button>
      </div>

      {pricingError ? (
        <div className="mb-6 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50/80 px-3.5 py-3 text-body-sm text-red-700">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          <span>{pricingError}</span>
        </div>
      ) : invalidCouponCode ? (
        <div className="mb-6 flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50/80 px-3.5 py-3 text-body-sm text-amber-800">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          <span>El código {invalidCouponCode} no está disponible para este pedido.</span>
        </div>
      ) : hasAppliedCoupon ? (
        <div className="mb-6 flex items-start gap-2 rounded-xl border border-emerald-200 bg-emerald-50/80 px-3.5 py-3 text-body-sm text-emerald-700">
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          <span>Código validado para este pedido.</span>
        </div>
      ) : null}

      {preview && preview.appliedPromotions.length > 0 ? (
        <div className="mb-6 flex items-start gap-3 rounded-lg border border-dashed border-border-strong bg-transparent px-3.5 py-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border-soft bg-white">
            <Tag className="h-4 w-4 text-text-primary" aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.08em] text-text-muted">Promo aplicada</p>
            <p className="mt-1 text-body-sm leading-relaxed text-text-primary">
              {preview.appliedPromotions.map((promotion) => promotion.promotionName).join(" · ")}
            </p>
          </div>
        </div>
      ) : null}

      {/* Totals */}
      <div className="space-y-2.5 border-t border-border-soft pt-5">
        <div className="flex items-center justify-between">
          <span className="text-body-sm text-text-secondary">Subtotal</span>
          <span className="text-body-sm tabular-nums text-text-primary">{fmt.format(merchandiseSubtotal)}</span>
        </div>

        {discountTotal > 0 ? (
          <div className="flex items-center justify-between">
            <span className="text-body-sm text-text-secondary">Descuentos</span>
            <span className="text-body-sm font-medium tabular-nums text-emerald-700">
              -{fmt.format(discountTotal)}
            </span>
          </div>
        ) : null}

        <div className="flex items-center justify-between">
          <span className="text-body-sm text-text-secondary">Envío</span>
          {shippingDiscount > 0 ? (
            <div className="flex items-center gap-2">
              <span className="text-[0.72rem] tabular-nums text-text-muted line-through">
                {fmt.format(shippingBase)}
              </span>
              <span className="text-body-sm font-medium tabular-nums text-emerald-700">Gratis</span>
            </div>
          ) : (
            <span className="text-body-sm font-medium tabular-nums text-text-primary">
              {shippingTotal === 0 ? "Gratis" : fmt.format(shippingTotal)}
            </span>
          )}
        </div>

        <div className="mt-1 flex items-center justify-between border-t border-border-soft pt-4">
          <span className="text-body-md font-semibold text-text-primary">Total</span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-label-xs font-medium uppercase tracking-wide text-text-muted">
              USD
            </span>
            <span className="text-headline-sm font-bold tabular-nums text-text-primary">
              {fmt.format(total)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
