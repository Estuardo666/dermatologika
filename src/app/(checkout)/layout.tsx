import type { ReactNode } from "react";

import { CartProvider } from "@/features/cart/context/cart-context";

export default function CheckoutLayout({ children }: { children: ReactNode }) {
  return <CartProvider>{children}</CartProvider>;
}
