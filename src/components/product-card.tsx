import type { Product } from "@/data/products";
import { BASE_DISCOUNT } from "@/config";
import { formatSoles, percent, priceAt } from "@/lib/pricing";
import { unitLabel } from "@/lib/units";
import { QtyControl } from "./qty-control";

export function ProductCard({ product }: { product: Product }) {
  const price = priceAt(product.superCents, BASE_DISCOUNT);
  return (
    <div className="flex flex-col rounded-3xl bg-white p-3 shadow-sm ring-1 ring-stone-200/70">
      <div className="relative flex h-20 items-center justify-center rounded-2xl bg-cream text-5xl" aria-hidden>
        {product.emoji}
        <span className="absolute top-1.5 right-1.5 rounded-full bg-sun px-2 py-0.5 text-xs font-extrabold text-ink">
          −{percent(BASE_DISCOUNT)}
        </span>
      </div>
      <h3 className="mt-2 leading-tight font-bold">{product.name}</h3>
      {product.note && <p className="text-xs text-stone-500">{product.note}</p>}
      <div className="mt-auto pt-2">
        <p className="text-xs text-stone-500">
          Supermercado <span className="text-chili line-through">{formatSoles(product.superCents)}</span>
        </p>
        <p className="text-lg leading-tight font-extrabold text-leaf">
          {formatSoles(price)} <span className="text-xs font-semibold text-stone-500">{unitLabel(product.unit)}</span>
        </p>
        <div className="mt-2">
          <QtyControl product={product} />
        </div>
      </div>
    </div>
  );
}
