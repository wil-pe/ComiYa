"use client";

import { useRouter } from "next/navigation";
import { replaceCart, useCart } from "./cart-store";

/** Pone los productos de un pedido anterior en el carrito y lleva al carrito. */
export function ReorderButton({
  items,
  className,
  children = "🔁 Volver a pedir",
}: {
  items: { id: string; qty: number }[];
  className?: string;
  children?: React.ReactNode;
}) {
  const router = useRouter();
  const cart = useCart();
  return (
    <button
      type="button"
      onClick={() => {
        const next = { ...cart };
        for (const item of items) next[item.id] = item.qty;
        replaceCart(next);
        router.push("/carrito");
      }}
      className={className ?? "rounded-full bg-leaf px-4 py-2.5 font-bold text-white shadow-sm active:scale-95"}
    >
      {children}
    </button>
  );
}
