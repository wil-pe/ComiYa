import type { Metadata } from "next";
import { BASE_DISCOUNT } from "@/config";
import { CATEGORIES, PRICES_OBSERVED_AT } from "@/data/products";
import { ProductCard } from "@/components/product-card";
import { getCatalog } from "@/lib/catalog";
import { availableDates, formatCutoff, formatDateLong } from "@/lib/dates";
import { percent } from "@/lib/pricing";

export const metadata: Metadata = { title: "Productos · ComiYa" };

export default async function ProductsPage() {
  const catalog = await getCatalog();
  const nextDate = availableDates()[0];

  return (
    <div className="mx-auto max-w-5xl px-4 pt-6">
      <h1 className="text-3xl font-black tracking-tight">Productos del mercado</h1>
      <p className="mt-1 text-stone-600">
        Todos {percent(BASE_DISCOUNT)} más baratos que en el supermercado, y todavía menos si tus vecinos también
        piden.
      </p>
      {nextDate && (
        <p className="mt-3 inline-block rounded-full bg-leaf-soft px-3 py-1.5 text-sm font-bold text-leaf-dark">
          📦 Próxima entrega: {formatDateLong(nextDate)} · pide hasta el {formatCutoff(nextDate)}
        </p>
      )}

      <nav className="no-scrollbar sticky top-14 z-10 -mx-4 mt-4 flex gap-2 overflow-x-auto bg-cream/95 px-4 py-2 backdrop-blur">
        {CATEGORIES.map((category) => (
          <a
            key={category.id}
            href={`#${category.id}`}
            className="shrink-0 rounded-full bg-white px-3.5 py-2 text-sm font-bold whitespace-nowrap ring-1 ring-stone-200 hover:ring-leaf"
          >
            {category.emoji} {category.label}
          </a>
        ))}
      </nav>

      {CATEGORIES.map((category) => {
        const products = catalog.filter((p) => p.category === category.id);
        if (!products.length) return null;
        return (
          <section key={category.id} id={category.id} className="scroll-mt-32 pt-6">
            <h2 className="text-xl font-extrabold">
              {category.emoji} {category.label}
            </h2>
            <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>
        );
      })}

      <p className="mt-8 text-xs text-stone-400">
        Precio de supermercado: Tottus (o Plaza Vea / Metro cuando Tottus no tiene el producto), relevado el{" "}
        {PRICES_OBSERVED_AT}. En productos por kilo el peso final puede variar ligeramente.
      </p>
    </div>
  );
}
