import type { Metadata } from "next";
import { PricesForm } from "./prices-form";
import { CATEGORIES, PRICES_OBSERVED_AT } from "@/data/products";
import { getCatalog } from "@/lib/catalog";

export const metadata: Metadata = { title: "Precios · Admin ComiYa" };

export default async function PricesPage() {
  const catalog = await getCatalog();
  return (
    <div>
      <p className="text-stone-600">
        Escribe el <strong>precio del supermercado</strong> (Tottus). El precio ComiYa se calcula solo con el descuento.
        Desmarca «Disponible» si un producto no se consigue esta semana. Precios base relevados el {PRICES_OBSERVED_AT}.
      </p>
      <PricesForm products={catalog} categories={CATEGORIES} />
    </div>
  );
}
