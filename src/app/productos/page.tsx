import type { Metadata } from "next";
import { Catalog } from "./catalog";
import { BASE_DISCOUNT } from "@/config";
import { PRICES_OBSERVED_AT } from "@/data/products";
import { getCatalog } from "@/lib/catalog";
import { availableDates, formatCutoff, formatDateLong } from "@/lib/dates";
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
        Toca una foto para ver su ficha.
      </p>
      {nextDate && (
        <p className="mt-3 inline-block rounded-full bg-leaf-soft px-3 py-1.5 text-sm font-bold text-leaf-dark">
          📦 Próxima entrega: {formatDateLong(nextDate)} · pide hasta el {formatCutoff(nextDate)}
        </p>
      )}

      <Catalog products={catalog} />

      <p className="mt-8 text-xs text-stone-400">
        Precio de supermercado: Tottus (o Plaza Vea / Metro cuando Tottus no tiene el producto), relevado el{" "}
        {PRICES_OBSERVED_AT}. En productos por kilo el peso final puede variar ligeramente. Fotos referenciales.
      </p>
    </div>
  );
}
