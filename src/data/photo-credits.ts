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
  { file: "/fotos/productos/pollo-entero.webp", subject: "Pollo entero", source: "Pexels", author: "Karyna Panchenko", license: "Licencia Pexels", url: "https://www.pexels.com/photo/10842249/" },
  { file: "/fotos/productos/pechuga-pollo.webp", subject: "Pechuga de pollo", source: "Pexels", author: "Leeloo The First", license: "Licencia Pexels", url: "https://www.pexels.com/photo/5769384/" },
  { file: "/fotos/productos/pierna-pollo.webp", subject: "Pierna con encuentro", source: "Unsplash", author: "Rimsha Noor", license: "Licencia Unsplash", url: "https://unsplash.com/photos/_VhofEs6mmM" },
  { file: "/fotos/productos/huevos.webp", subject: "Huevos pardos", source: "Pexels", author: "Engin Akyurt", license: "Licencia Pexels", url: "https://www.pexels.com/photo/10111498/" },
  { file: "/fotos/productos/carne-molida.webp", subject: "Carne molida de res", source: "Pexels", author: "Angele J", license: "Licencia Pexels", url: "https://www.pexels.com/photo/128401/" },
  { file: "/fotos/productos/bistec.webp", subject: "Bistec de res", source: "Pexels", author: "Leonora Brebner", license: "Licencia Pexels", url: "https://www.pexels.com/photo/9843971/" },
  { file: "/fotos/productos/carne-guiso.webp", subject: "Carne para guiso", source: "Unsplash", author: "Satmar Meats", license: "Licencia Unsplash", url: "https://unsplash.com/photos/SsneeyLFdHw" },
  { file: "/fotos/productos/asado-tira.webp", subject: "Asado de tira", source: "Pexels", author: "Domenico Scaglione", license: "Licencia Pexels", url: "https://www.pexels.com/photo/28881685/" },
  { file: "/fotos/productos/chuleta-cerdo.webp", subject: "Chuleta de cerdo", source: "Pexels", author: "Evgeniy Alekseyev", license: "Licencia Pexels", url: "https://www.pexels.com/photo/7333266/" },
  { file: "/fotos/productos/bonito.webp", subject: "Bonito", source: "Pexels", author: "Savaş Baştürk", license: "Licencia Pexels", url: "https://www.pexels.com/photo/5623929/" },
  { file: "/fotos/productos/jurel.webp", subject: "Jurel", source: "Pexels", author: "mehdi aydın", license: "Licencia Pexels", url: "https://www.pexels.com/photo/9143774/" },
  { file: "/fotos/productos/trucha.webp", subject: "Trucha", source: "Pexels", author: "Marcelo Verfe", license: "Licencia Pexels", url: "https://www.pexels.com/photo/28575465/" },
  { file: "/fotos/productos/perico.webp", subject: "Filete de perico", source: "Unsplash", author: "Food PhotoGraphy Mumbai", license: "Licencia Unsplash", url: "https://unsplash.com/photos/nwSCt6ImBZQ" },
  { file: "/fotos/productos/reineta.webp", subject: "Filete de reineta", source: "Pexels", author: "Deane Bayas", license: "Licencia Pexels", url: "https://www.pexels.com/photo/14062108/" },
  { file: "/fotos/productos/queso-fresco.webp", subject: "Queso fresco", source: "Pexels", author: "Osman Arabacı", license: "Licencia Pexels", url: "https://www.pexels.com/photo/26699217/" },
  { file: "/fotos/productos/arroz.webp", subject: "Arroz", source: "Pexels", author: "Mari M", license: "Licencia Pexels", url: "https://www.pexels.com/photo/17502263/" },
  { file: "/fotos/productos/lentejas.webp", subject: "Lentejas", source: "Pexels", author: "Mustafa Akın", license: "Licencia Pexels", url: "https://www.pexels.com/photo/36021103/" },
  { file: "/fotos/ambiente/mercado.webp", subject: "Puesto de mercado (portada)", source: "Pexels", author: "Gisela Degante", license: "Licencia Pexels", url: "https://www.pexels.com/photo/37464966/" },
  { file: "/fotos/categorias/pollo.webp", subject: "Categoría Pollo y huevos", source: "Pexels", author: "Towfiqu Barbhuiya", license: "Licencia Pexels", url: "https://www.pexels.com/photo/13111770/" },
  { file: "/fotos/categorias/carnes.webp", subject: "Categoría Carnes", source: "Pexels", author: "Eiliv Aceron", license: "Licencia Pexels", url: "https://www.pexels.com/photo/6896527/" },
  { file: "/fotos/categorias/pescados.webp", subject: "Categoría Pescados", source: "Pexels", author: "Mali Maeder", license: "Licencia Pexels", url: "https://www.pexels.com/photo/229789/" },
  { file: "/fotos/categorias/basicos.webp", subject: "Categoría Básicos", source: "Pexels", author: "Agung Pandit Wiguna", license: "Licencia Pexels", url: "https://www.pexels.com/photo/18778270/" },
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
