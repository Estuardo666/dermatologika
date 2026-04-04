"use client";

import { useState } from "react";
import { Tag } from "lucide-react";

import type { CartItem } from "@/features/cart/types";

// ─── Price formatter ──────────────────────────────────────────────────────────

const fmt = new Intl.NumberFormat("es-EC", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
});

// ─── Types ───────────────────────────────────────────────────────────────────

type ShippingMethod = "standard" | "pickup";

// ─── Props ────────────────────────────────────────────────────────────────────

interface CheckoutOrderSummaryProps {
  items: CartItem[];
  subtotal: number;
  shippingMethod: ShippingMethod;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function CheckoutOrderSummary({ items, subtotal, shippingMethod }: CheckoutOrderSummaryProps) {
  const [discountCode, setDiscountCode] = useState("");
  const shippingCost = shippingMethod === "standard" ? 6 : 0;
  const total = subtotal + shippingCost;

  return (
    <div>
      {/* Items list */}
      <ul aria-label="Productos en tu pedido" className="mb-6 divide-y divide-border-soft">
        {items.map((item) => {
          const unitPrice = item.discountPrice ?? item.price ?? 0;
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
              <span className="shrink-0 text-label-sm font-semibold tabular-nums text-text-primary">
                {fmt.format(unitPrice * item.quantity)}
              </span>
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
            onChange={(e) => setDiscountCode(e.target.value)}
            placeholder="Código de descuento"
            autoComplete="off"
            className="w-full rounded-md border border-border bg-white py-2.5 pl-10 pr-3.5 text-body-sm text-text-primary placeholder:text-text-muted transition-[border-color,box-shadow,background-color] duration-fast hover:border-border-brand hover:bg-brand-soft/20 focus:border-brand-primary focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
          />
        </div>
        <button
          type="button"
          className="shrink-0 rounded-md border border-border bg-white px-4 py-2.5 text-label-sm font-medium text-text-secondary transition-colors duration-fast hover:border-border-strong hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-1"
        >
          Aplicar
        </button>
      </div>

      {/* Totals */}
      <div className="space-y-2.5 border-t border-border-soft pt-5">
        <div className="flex items-center justify-between">
          <span className="text-body-sm text-text-secondary">Subtotal</span>
          <span className="text-body-sm tabular-nums text-text-primary">{fmt.format(subtotal)}</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-body-sm text-text-secondary">Envío</span>
          <span className="text-body-sm font-medium tabular-nums text-text-primary">
            {shippingCost === 0 ? "Gratis" : fmt.format(shippingCost)}
          </span>
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
