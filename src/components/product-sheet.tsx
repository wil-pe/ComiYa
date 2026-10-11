"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
import { BASE_DISCOUNT, GROUP_TIERS } from "@/config";
import { NUTRITION } from "@/data/nutrition";
import { productInfo } from "@/data/product-info";
import { PRICES_OBSERVED_AT, type Product } from "@/data/products";
import { formatSoles, lineTotal, percent, priceAt } from "@/lib/pricing";
import { unitLabel } from "@/lib/units";
import { useCart } from "./cart-store";
import { ProductPhoto } from "./product-photo";
import { QtyControl } from "./qty-control";

// La ficha se abre con ?p=<id> en la URL: se puede compartir y el botón
// "atrás" del celular la cierra, como en cualquier app.
let openedInApp = false;

export function productHref(pathname: string, id: string) {
  return `${pathname}?p=${encodeURIComponent(id)}`;
}

export function markSheetOpened() {
  openedInApp = true;
}

function fmt(value: number | null, unit: string) {
  if (value === null) return "—";
  return `${value.toLocaleString("es-PE", { maximumFractionDigits: 1 })} ${unit}`;
}

export function ProductSheet({ products }: { products: Product[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const dialog = useRef<HTMLDialogElement>(null);
  const cart = useCart();
  const product = products.find((p) => p.id === params.get("p")) ?? null;

  useEffect(() => {
    const element = dialog.current;
    if (!element) return;
    if (product && !element.open) element.showModal();
    if (!product && element.open) element.close();
  }, [product]);

  function close() {
    if (openedInApp) {
      openedInApp = false;
      router.back();
    } else {
      router.replace(pathname, { scroll: false });
    }
  }

  const price = product ? priceAt(product.superCents, BASE_DISCOUNT) : 0;
  const info = product ? productInfo(product.id, product.category) : null;
  const nutrition = product ? NUTRITION[product.id] : undefined;
  const best = GROUP_TIERS[GROUP_TIERS.length - 1].discount;
  const qty = product ? (cart[product.id] ?? 0) : 0;

  return (
    <dialog
      ref={dialog}
      aria-labelledby="ficha-titulo"
      onCancel={(event) => {
        event.preventDefault();
        close();
      }}
      onClick={(event) => {
        if (event.target === dialog.current) close();
      }}
      className="ficha m-0 mt-auto max-h-[92dvh] w-full max-w-none overflow-y-auto rounded-t-[2rem] bg-cream p-0 text-ink shadow-2xl backdrop:bg-black/55 sm:m-auto sm:max-w-lg sm:rounded-[2rem]"
    >
      {product && info && (
        <div>
          <div className="relative">
            <ProductPhoto
              id={product.id}
              emoji={product.emoji}
              className="aspect-[4/3] w-full"
              sizes="(min-width: 640px) 512px, 100vw"
              priority
            />
            <span className="absolute top-3 left-1/2 h-1.5 w-12 -translate-x-1/2 rounded-full bg-white/80 sm:hidden" aria-hidden />
            <button
              type="button"
              onClick={close}
              aria-label="Cerrar ficha"
              className="absolute top-3 right-3 flex h-11 w-11 items-center justify-center rounded-full bg-white/95 text-xl font-bold shadow-md"
            >
              ✕
            </button>
            <span className="absolute bottom-3 left-3 flex h-14 w-14 -rotate-12 items-center justify-center rounded-full bg-sun font-black text-ink shadow-md ring-2 ring-white">
              −{percent(BASE_DISCOUNT)}
            </span>
          </div>

          <div className="space-y-5 p-5 pb-6">
            <div>
              <h2 id="ficha-titulo" className="text-2xl leading-tight font-black">
                {product.name}
              </h2>
              {product.note && <p className="text-stone-500">{product.note}</p>}
            </div>

            <div className="grid grid-cols-[1fr_auto] items-end gap-3">
              <div>
                <p className="text-sm text-stone-500">
                  Supermercado <span className="text-chili line-through">{formatSoles(product.superCents)}</span>
                </p>
                <p className="pizarra mt-1 inline-flex items-baseline gap-2 rounded-xl px-3 py-0.5 font-hand">
                  <span className="text-3xl font-bold">{formatSoles(price)}</span>
                  <span className="text-lg opacity-80">{unitLabel(product.unit)}</span>
                </p>
              </div>
              <p className="rounded-2xl bg-sun-soft px-3 py-2 text-center text-sm leading-tight font-bold text-amber-950">
                Ahorras
                <span className="block text-lg font-black">{formatSoles(product.superCents - price)}</span>
              </p>
            </div>
            <p className="text-sm text-stone-600">
              👥 Si tus vecinos también piden para el mismo día, el precio baja hasta −{percent(best)}.
            </p>

            <section aria-labelledby="ficha-nutricion">
              <h3 id="ficha-nutricion" className="flex items-baseline justify-between font-extrabold">
                Información nutricional
                <span className="text-xs font-semibold text-stone-500">por 100 g, en crudo</span>
              </h3>
              {nutrition ? (
                <>
                  <dl className="mt-2 divide-y divide-stone-200 rounded-2xl bg-white px-4 ring-1 ring-stone-200">
                    {[
                      ["Energía", fmt(nutrition.kcal, "kcal")],
                      ["Proteínas", fmt(nutrition.protein, "g")],
                      ["Grasas totales", fmt(nutrition.fat, "g")],
                      ["Carbohidratos", fmt(nutrition.carbs, "g")],
                      ["Fibra", fmt(nutrition.fiber, "g")],
                    ].map(([label, value]) => (
                      <div key={label} className="flex justify-between py-2">
                        <dt className={label === "Energía" ? "font-bold" : ""}>{label}</dt>
                        <dd className="font-bold tabular-nums">{value}</dd>
                      </div>
                    ))}
                  </dl>
                  {nutrition.highlights.length > 0 && (
                    <div className="mt-3">
                      <p className="text-sm font-bold">Destaca por</p>
                      <ul className="mt-1 flex flex-wrap gap-2">
                        {nutrition.highlights.map((h) => (
                          <li key={h.label} className="rounded-full bg-leaf-soft px-3 py-1 text-sm font-semibold text-leaf-dark">
                            {h.label}: {h.value.toLocaleString("es-PE", { maximumFractionDigits: 1 })} {h.unit}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  <p className="mt-2 text-xs text-stone-500">
                    Valores referenciales por 100 g de parte comestible, en crudo. Fuente: {nutrition.source}
                    {nutrition.source.startsWith("INS") && " (Tablas Peruanas de Composición de Alimentos)"}.
                    {Object.values(nutrition).includes(null) && " «—»: dato no disponible en la fuente."}
                  </p>
                </>
              ) : (
                <p className="mt-2 rounded-2xl bg-white p-4 text-sm text-stone-500 ring-1 ring-stone-200">
                  Estamos completando la información nutricional de este producto.
                </p>
              )}
            </section>

            {info.allergens && (
              <p className="rounded-2xl bg-amber-50 p-3 text-sm ring-1 ring-amber-200">
                ⚠️ <strong>Alérgenos:</strong> contiene {info.allergens.join(", ").toLowerCase()}.
              </p>
            )}

            <section>
              <h3 className="font-extrabold">Cómo conservarlo</h3>
              <p className="mt-1 text-stone-700">{info.storage}</p>
            </section>

            <section className="rounded-2xl bg-white p-4 text-sm text-stone-600 ring-1 ring-stone-200">
              🧺 Lo escogemos a mano en el mercado la mañana de tu entrega. Precio de referencia:{" "}
              {product.source ?? "Tottus"}, {PRICES_OBSERVED_AT}.
              {product.unit === "kg" && " El peso final puede variar ligeramente."}
            </section>
          </div>

          {/* Barra fija: precio y botón siempre a mano mientras se lee la ficha */}
          <div className="sticky bottom-0 z-10 border-t border-stone-200 bg-white/95 px-5 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-[0_-10px_24px_-14px_rgb(0_0_0/0.3)] backdrop-blur">
            <div className="flex items-center gap-3">
              <div className="shrink-0 leading-tight" aria-live="polite">
                <p className="font-hand text-[1.75rem] leading-none font-bold text-leaf-dark">
                  {formatSoles(qty ? lineTotal(price, qty) : price)}
                </p>
                <p className="text-xs font-semibold text-stone-500">
                  {qty ? "en tu pedido" : unitLabel(product.unit)}
                </p>
              </div>
              <div className="min-w-0 flex-1">
                <QtyControl product={product} />
              </div>
            </div>
          </div>
        </div>
      )}
    </dialog>
  );
}
