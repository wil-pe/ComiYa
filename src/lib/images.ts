// Fotos guardadas en /public/fotos (ver /creditos para su origen).
export function productImage(id: string): string {
  return `/fotos/productos/${id}.jpg`;
}

export function categoryImage(id: string): string {
  return `/fotos/categorias/${id}.jpg`;
}

export const AMBIENTE = {
  mercado: "/fotos/ambiente/mercado.jpg",
  entrega: "/fotos/ambiente/entrega.jpg",
};
