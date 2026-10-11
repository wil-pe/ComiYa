import "server-only";
import { PRODUCTS, type Product } from "@/data/products";
import { db, hasDatabase } from "@/lib/db";

export type { Product };

export async function getCatalog(): Promise<Product[]> {
  const base: Product[] = PRODUCTS.map(({ superPrice, ...product }) => ({
    ...product,
    superCents: Math.round(superPrice * 100),
    available: true,
  }));
  if (!hasDatabase) return base;
  try {
    const sql = await db();
    const rows = await sql<{ product_id: string; super_price: number | null; available: boolean }[]>`
      SELECT product_id, super_price, available FROM product_prices`;
    const overrides = new Map(rows.map((row) => [row.product_id, row]));
    return base.map((product) => {
      const override = overrides.get(product.id);
      if (!override) return product;
      return {
        ...product,
        superCents: override.super_price ?? product.superCents,
        available: override.available,
      };
    });
  } catch (error) {
    console.error("No se pudieron leer los precios", error);
    return base;
  }
}
