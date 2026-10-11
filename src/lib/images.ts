import { PHOTOS } from "@/data/photos";

// Fotos en /public/fotos (WebP). Devuelven null si todavía no hay foto,
// y la app muestra el emoji del producto en su lugar. Origen: /creditos.
const products = new Set<string>(PHOTOS.productos);
const categories = new Set<string>(PHOTOS.categorias);
const ambiance = new Set<string>(PHOTOS.ambiente);

export function productImage(id: string): string | null {
  return products.has(id) ? `/fotos/productos/${id}.webp` : null;
}

export function categoryImage(id: string): string | null {
  return categories.has(id) ? `/fotos/categorias/${id}.webp` : null;
}

export function ambianceImage(name: "mercado" | "entrega"): string | null {
  return ambiance.has(name) ? `/fotos/ambiente/${name}.webp` : null;
}
