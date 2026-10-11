"use client";

import type { Product } from "@/data/products";
import { formatQty } from "@/lib/units";
import { setQty, useCart } from "./cart-store";

export function QtyControl({ product, size = "md" }: { product: Product; size?: "md" | "sm" }) {
  const cart = useCart();
  const qty = cart[product.id] ?? 0;
  const height = size === "sm" ? "h-9" : "h-11";

  if (!product.available) {
    return (
      <div className={`${height} flex items-center justify-center rounded-full bg-stone-100 text-sm font-semibold text-stone-500`}>
        Agotado hoy
      </div>
    );
  }

  if (qty === 0) {
    return (
      <button
        type="button"
        onClick={() => setQty(product.id, product.step)}
        className={`${height} w-full rounded-full bg-leaf font-bold text-white shadow-sm transition active:scale-95 hover:bg-leaf-dark`}
      >
        Agregar
      </button>
    );
  }

  return (
    <div className={`${height} flex items-center justify-between rounded-full bg-leaf-soft p-1`}>
      <button
        type="button"
        aria-label={`Quitar ${product.name}`}
        onClick={() => setQty(product.id, Math.max(0, qty - product.step))}
        className="aspect-square h-full rounded-full bg-white text-xl font-bold text-leaf shadow-sm active:scale-90"
      >
        −
      </button>
      <span className="px-1 text-center text-sm font-bold text-leaf-dark">{formatQty(qty, product.unit)}</span>
      <button
        type="button"
        aria-label={`Agregar más ${product.name}`}
        onClick={() => setQty(product.id, Math.min(50, qty + product.step))}
        className="aspect-square h-full rounded-full bg-leaf text-xl font-bold text-white shadow-sm active:scale-90"
      >
        +
      </button>
    </div>
  );
}
