// Origen de cada foto de /public/fotos. Pexels y Unsplash no exigen atribución, pero la dejamos igual.
export type PhotoCredit = {
  file: string;
  subject: string;
  source: "Pexels" | "Unsplash" | "Wikimedia Commons";
  author?: string;
  license: string;
  url: string;
};

export const PHOTO_CREDITS: PhotoCredit[] = [
  { file: "/fotos/productos/lechuga.webp", subject: "Lechuga americana", source: "Pexels", author: "Joolsmagools", license: "Licencia Pexels", url: "https://www.pexels.com/photo/fresh-iceberg-lettuce-display-at-market-39584431/" },
  { file: "/fotos/productos/tomate.webp", subject: "Tomate italiano", source: "Pexels", author: "Budget Bizar", license: "Licencia Pexels", url: "https://www.pexels.com/photo/rows-of-ripe-rome-tomatoes-15636774/" },
  { file: "/fotos/productos/cebolla-roja.webp", subject: "Cebolla roja", source: "Pexels", author: "Engin Akyurt", license: "Licencia Pexels", url: "https://www.pexels.com/photo/abundance-of-red-onions-16701914/" },
  { file: "/fotos/productos/papa-amarilla.webp", subject: "Papa amarilla", source: "Pexels", author: "L. Lum", license: "Licencia Pexels", url: "https://www.pexels.com/photo/close-up-of-fresh-golden-potatoes-at-market-35522608/" },
  { file: "/fotos/productos/papa-blanca.webp", subject: "Papa blanca", source: "Pexels", author: "L. Lum", license: "Licencia Pexels", url: "https://www.pexels.com/photo/close-up-of-fresh-white-potatoes-35595249/" },
  { file: "/fotos/productos/camote.webp", subject: "Camote", source: "Pexels", author: "Jorge Romero", license: "Licencia Pexels", url: "https://www.pexels.com/photo/close-up-photo-of-sweet-potatoes-6060223/" },
  { file: "/fotos/productos/zanahoria.webp", subject: "Zanahoria", source: "Pexels", author: "Victoria Bowers", license: "Licencia Pexels", url: "https://www.pexels.com/photo/orange-carrots-in-close-up-photography-10487659/" },
  { file: "/fotos/productos/ajo.webp", subject: "Ajo", source: "Pexels", author: "Daniel Dan", license: "Licencia Pexels", url: "https://www.pexels.com/photo/fresh-garlic-in-close-up-photography-7543131/" },
  { file: "/fotos/productos/zapallo.webp", subject: "Zapallo macre", source: "Pexels", author: "abdellatif jellab", license: "Licencia Pexels", url: "https://www.pexels.com/photo/freshly-sliced-pumpkins-in-marrakech-market-35986642/" },
  { file: "/fotos/productos/brocoli.webp", subject: "Brócoli", source: "Pexels", author: "Mikhail Nilov", license: "Licencia Pexels", url: "https://www.pexels.com/photo/close-up-shot-of-a-broccoli-7676083/" },
  { file: "/fotos/productos/pimiento.webp", subject: "Pimiento", source: "Pexels", author: "TYPHOON BRO", license: "Licencia Pexels", url: "https://www.pexels.com/photo/fresh-red-bell-peppers-at-a-market-display-28486991/" },
  { file: "/fotos/productos/pepino.webp", subject: "Pepino", source: "Pexels", author: "aboodi vesakaran", license: "Licencia Pexels", url: "https://www.pexels.com/photo/a-bunch-of-cucumbers-17975573/" },
  { file: "/fotos/productos/choclo.webp", subject: "Choclo", source: "Pexels", author: "Arina Krasnikova", license: "Licencia Pexels", url: "https://www.pexels.com/photo/corn-in-close-up-photography-6316526/" },
  { file: "/fotos/productos/vainita.webp", subject: "Vainita", source: "Pexels", author: "Yulia Rozanova", license: "Licencia Pexels", url: "https://www.pexels.com/photo/close-up-photo-of-raw-green-beans-3004798/" },
  { file: "/fotos/productos/palta.webp", subject: "Palta hass", source: "Pexels", author: "Ivan Vi", license: "Licencia Pexels", url: "https://www.pexels.com/photo/close-up-one-whole-and-one-cut-in-half-avocado-19808819/" },
  { file: "/fotos/categorias/verduras.webp", subject: "Categoría Verduras", source: "Pexels", author: "Muhamad Guruh Budi Hartono", license: "Licencia Pexels", url: "https://www.pexels.com/photo/vibrant-display-of-fresh-market-vegetables-37321079/" },
];
