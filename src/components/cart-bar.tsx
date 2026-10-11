"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Product } from "@/data/products";
import { BASE_DISCOUNT } from "@/config";
import { formatSoles, totals } from "@/lib/pricing";
import { useCart } from "./cart-store";

export function cartLines(products: Product[], cart: Record<string, number>) {
  return products
    .filter((product) => product.available && (cart[product.id] ?? 0) > 0)
    .map((product) => ({ product, qty: cart[product.id], superPrice: product.superCents }));
}

export function CartBar({ products }: { products: Product[] }) {
  const cart = useCart();
  const pathname = usePathname();
  const lines = cartLines(products, cart);
  if (!lines.length || pathname.startsWith("/carrito") || pathname.startsWith("/admin")) return null;
  const { subtotal, savings } = totals(lines, BASE_DISCOUNT);

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-30 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
      <Link
        href="/carrito"
        className="pointer-events-auto mx-auto flex max-w-xl items-center justify-between gap-3 rounded-full bg-leaf py-2.5 pr-3 pl-5 text-white shadow-lg shadow-leaf/30 transition active:scale-[0.98]"
      >
        <span className="min-w-0 leading-tight">
          <span className="block text-lg font-extrabold whitespace-nowrap">{formatSoles(subtotal)}</span>
          <span className="block truncate text-sm font-semibold opacity-90">
            Ahorras {formatSoles(savings)} · {lines.length} {lines.length === 1 ? "producto" : "productos"}
          </span>
        </span>
        <span className="shrink-0 rounded-full bg-white px-4 py-2 font-bold whitespace-nowrap text-leaf">Ver pedido →</span>
      </Link>
    </div>
  );
}

export function CartCount() {
  const cart = useCart();
  const count = Object.keys(cart).length;
  if (!count) return null;
  return (
    <span className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-chili px-1 text-xs font-bold text-white">
      {count}
    </span>
  );
}
