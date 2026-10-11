"use client";

import { useActionState, useState } from "react";
import { BASE_DISCOUNT } from "@/config";
import type { CATEGORIES, Product } from "@/data/products";
import { savePrices } from "@/actions/admin";
import { buttonClass, FormMessage } from "@/components/form-message";
import { formatSoles, priceAt } from "@/lib/pricing";
import { unitLabel } from "@/lib/units";

export function PricesForm({ products, categories }: { products: Product[]; categories: typeof CATEGORIES }) {
  const [state, action, pending] = useActionState(savePrices, undefined);
  const [prices, setPrices] = useState<Record<string, string>>(() =>
    Object.fromEntries(products.map((p) => [p.id, (p.superCents / 100).toFixed(2)])),
  );

  return (
    <form action={action} className="mt-4 space-y-5">
      {categories.map((category) => (
        <section key={category.id} className="rounded-3xl bg-white p-4 ring-1 ring-stone-200">
          <h2 className="font-extrabold">
            {category.emoji} {category.label}
          </h2>
          <div className="mt-2 divide-y divide-stone-100">
            {products
              .filter((p) => p.category === category.id)
              .map((product) => {
                const cents = Math.round(Number(prices[product.id]?.replace(",", ".")) * 100);
                return (
                  <div key={product.id} className="flex flex-wrap items-center gap-x-3 gap-y-1 py-2">
                    <span className="min-w-40 flex-1 font-bold">
                      {product.emoji} {product.name}{" "}
                      <span className="text-xs font-semibold text-stone-500">({unitLabel(product.unit)})</span>
                    </span>
                    <label className="flex items-center gap-1 text-sm">
                      Súper S/
                      <input
                        name={`price_${product.id}`}
                        value={prices[product.id]}
                        onChange={(e) => setPrices({ ...prices, [product.id]: e.target.value })}
                        inputMode="decimal"
                        className="w-20 rounded-xl border-0 bg-cream px-2 py-1.5 text-right font-bold ring-1 ring-stone-200"
                      />
                    </label>
                    <span className="w-24 text-sm font-bold text-leaf">
                      → {Number.isFinite(cents) && cents > 0 ? formatSoles(priceAt(cents, BASE_DISCOUNT)) : "—"}
                    </span>
                    <label className="flex items-center gap-1.5 text-sm font-semibold">
                      <input
                        type="checkbox"
                        name={`available_${product.id}`}
                        defaultChecked={product.available}
                        className="h-5 w-5 accent-leaf"
                      />
                      Disponible
                    </label>
                  </div>
                );
              })}
          </div>
        </section>
      ))}
      <div className="sticky bottom-3 space-y-2">
        <FormMessage state={state} />
        <button type="submit" disabled={pending} className={buttonClass}>
          {pending ? "Guardando…" : "Guardar precios"}
        </button>
      </div>
    </form>
  );
}
