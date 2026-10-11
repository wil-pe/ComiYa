import type { Product } from "@/data/products";
import { BASE_DISCOUNT } from "@/config";
import { formatSoles, percent, priceAt } from "@/lib/pricing";
import { unitLabel } from "@/lib/units";
import { ProductPhoto } from "./product-photo";
import { QtyControl } from "./qty-control";

export function ProductCard({ product }: { product: Product }) {
  const price = priceAt(product.superCents, BASE_DISCOUNT);
  return (
    <div className="flex flex-col overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-stone-200/80">
      <div className="relative">
        <ProductPhoto
          id={product.id}
          emoji={product.emoji}
          className={`aspect-square ${product.available ? "" : "grayscale"}`}
          sizes="(min-width: 1024px) 240px, (min-width: 640px) 33vw, 50vw"
        />
        <span className="absolute top-2 left-2 flex h-12 w-12 -rotate-12 items-center justify-center rounded-full bg-sun text-sm font-black text-ink shadow-md ring-2 ring-white">
          −{percent(BASE_DISCOUNT)}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-3 pt-2">
        <h3 className="leading-tight font-extrabold">{product.name}</h3>
        {product.note && <p className="text-xs text-stone-500">{product.note}</p>}
        <div className="mt-auto pt-2">
          <p className="text-xs text-stone-500">
            Supermercado <span className="text-chili line-through">{formatSoles(product.superCents)}</span>
          </p>
          <p className="pizarra mt-1 flex flex-wrap items-baseline justify-between gap-x-1 rounded-xl px-2.5 py-0.5 font-hand">
            <span className="text-[1.65rem] leading-tight font-bold whitespace-nowrap">{formatSoles(price)}</span>
            <span className="text-base leading-none whitespace-nowrap opacity-80">{unitLabel(product.unit)}</span>
          </p>
          <div className="mt-2">
            <QtyControl product={product} />
          </div>
        </div>
      </div>
    </div>
  );
}
