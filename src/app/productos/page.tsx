import type { Metadata } from "next";
import Image from "next/image";
import { BASE_DISCOUNT } from "@/config";
import { CATEGORIES, PRICES_OBSERVED_AT } from "@/data/products";
import { ProductCard } from "@/components/product-card";
import { getCatalog } from "@/lib/catalog";
import { availableDates, formatCutoff, formatDateLong } from "@/lib/dates";
import { categoryImage } from "@/lib/images";
import { percent } from "@/lib/pricing";

export const metadata: Metadata = { title: "Productos · ComiYa" };

export default async function ProductsPage() {
  const catalog = await getCatalog();
  const nextDate = availableDates()[0];

  return (
    <div className="mx-auto max-w-5xl px-4 pt-6">
      <p className="font-hand text-2xl leading-none text-leaf">¡Pase, casero!</p>
      <h1 className="text-3xl font-black tracking-tight">Nuestro puesto</h1>
      <p className="mt-1 text-stone-600">
        Todo {percent(BASE_DISCOUNT)} más barato que en el supermercado, y todavía menos si tus vecinos también piden.
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
            className="flex shrink-0 items-center gap-2 rounded-full bg-white py-1 pr-3.5 pl-1 text-sm font-bold whitespace-nowrap ring-1 ring-stone-200 hover:ring-leaf"
          >
            <span className="relative h-8 w-8 overflow-hidden rounded-full bg-kraft">
              <Image src={categoryImage(category.id)} alt="" fill sizes="32px" className="object-cover" />
            </span>
            {category.label}
          </a>
        ))}
      </nav>

      {CATEGORIES.map((category) => {
        const products = catalog.filter((p) => p.category === category.id);
        if (!products.length) return null;
        return (
          <section key={category.id} id={category.id} className="scroll-mt-32 pt-6">
            <div className="relative h-24 overflow-hidden rounded-3xl bg-board sm:h-28">
              <Image src={categoryImage(category.id)} alt="" fill sizes="(min-width: 1024px) 1000px, 100vw" className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/35 to-transparent" />
              <h2 className="absolute bottom-2 left-4 font-hand text-4xl font-bold text-white drop-shadow sm:text-5xl">
                {category.label}
              </h2>
            </div>
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
        {PRICES_OBSERVED_AT}. En productos por kilo el peso final puede variar ligeramente. Fotos referenciales.
      </p>
    </div>
  );
}
