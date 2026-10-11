// Catálogo del piloto. `superPrice` es el precio de referencia en supermercado (S/ por unidad de venta),
// relevado en tottus.com.pe (o Plaza Vea / Metro si Tottus no tenía el producto).
// El precio ComiYa se calcula solo: superPrice − 25 % (o más con la compra en grupo).
// Los precios se pueden corregir desde /admin/precios sin tocar este archivo.

export type CategoryId = "pollo" | "carnes" | "pescados" | "verduras" | "hierbas" | "frutas" | "basicos";

export const CATEGORIES: { id: CategoryId; label: string; emoji: string }[] = [
  { id: "pollo", label: "Pollo y huevos", emoji: "🐔" },
  { id: "carnes", label: "Carnes", emoji: "🥩" },
  { id: "pescados", label: "Pescados", emoji: "🐟" },
  { id: "verduras", label: "Verduras", emoji: "🥬" },
  { id: "hierbas", label: "Hierbas y ajíes", emoji: "🌿" },
  { id: "frutas", label: "Frutas", emoji: "🍊" },
  { id: "basicos", label: "Básicos", emoji: "🍚" },
];

export type Unit = "kg" | "un" | "atado" | "plancha";

export type ProductDefinition = {
  id: string;
  name: string;
  category: CategoryId;
  emoji: string;
  unit: Unit;
  /** Incremento al pedir (0.5 = medio kilo). */
  step: number;
  /** Precio Tottus de referencia, en soles por unidad de venta. */
  superPrice: number;
  /** Supermercado de referencia si no es Tottus. */
  source?: string;
  note?: string;
};

export const PRICES_OBSERVED_AT = "10 de octubre de 2026";

export const PRODUCTS: ProductDefinition[] = [
  // Pollo y huevos
  { id: "pollo-entero", name: "Pollo entero", category: "pollo", emoji: "🐔", unit: "kg", step: 0.5, superPrice: 8.2, note: "Un pollo pesa aprox. 2 kg" },
  { id: "pechuga-pollo", name: "Pechuga de pollo", category: "pollo", emoji: "🍗", unit: "kg", step: 0.5, superPrice: 14.9 },
  { id: "pierna-pollo", name: "Pierna con encuentro", category: "pollo", emoji: "🍗", unit: "kg", step: 0.5, superPrice: 11.5, source: "Plaza Vea" },
  { id: "huevos", name: "Huevos pardos", category: "pollo", emoji: "🥚", unit: "plancha", step: 1, superPrice: 15.8, note: "Plancha de 30 huevos" },

  // Carnes
  { id: "carne-molida", name: "Carne molida de res", category: "carnes", emoji: "🥩", unit: "kg", step: 0.5, superPrice: 28.9 },
  { id: "bistec", name: "Bistec de res", category: "carnes", emoji: "🥩", unit: "kg", step: 0.5, superPrice: 43.9 },
  { id: "carne-guiso", name: "Carne para guiso", category: "carnes", emoji: "🍖", unit: "kg", step: 0.5, superPrice: 38.9 },
  { id: "asado-tira", name: "Asado de tira", category: "carnes", emoji: "🍖", unit: "kg", step: 0.5, superPrice: 37.9 },
  { id: "chuleta-cerdo", name: "Chuleta de cerdo", category: "carnes", emoji: "🐖", unit: "kg", step: 0.5, superPrice: 18.9 },

  // Pescados
  { id: "bonito", name: "Bonito", category: "pescados", emoji: "🐟", unit: "kg", step: 0.5, superPrice: 8.9, note: "Entero, te lo limpiamos" },
  { id: "jurel", name: "Jurel", category: "pescados", emoji: "🐟", unit: "kg", step: 0.5, superPrice: 20.9, source: "Metro", note: "Entero, te lo limpiamos" },
  { id: "trucha", name: "Trucha", category: "pescados", emoji: "🐟", unit: "kg", step: 0.5, superPrice: 20.9 },
  { id: "perico", name: "Filete de perico", category: "pescados", emoji: "🐠", unit: "kg", step: 0.5, superPrice: 46.9 },
  { id: "reineta", name: "Filete de reineta", category: "pescados", emoji: "🐠", unit: "kg", step: 0.5, superPrice: 37.0, source: "Metro" },

  // Verduras
  { id: "lechuga", name: "Lechuga americana", category: "verduras", emoji: "🥬", unit: "un", step: 1, superPrice: 2.9 },
  { id: "tomate", name: "Tomate italiano", category: "verduras", emoji: "🍅", unit: "kg", step: 0.5, superPrice: 7.7 },
  { id: "cebolla-roja", name: "Cebolla roja", category: "verduras", emoji: "🧅", unit: "kg", step: 0.5, superPrice: 3.99 },
  { id: "papa-amarilla", name: "Papa amarilla", category: "verduras", emoji: "🥔", unit: "kg", step: 0.5, superPrice: 8.39 },
  { id: "papa-blanca", name: "Papa blanca", category: "verduras", emoji: "🥔", unit: "kg", step: 0.5, superPrice: 2.29 },
  { id: "camote", name: "Camote", category: "verduras", emoji: "🍠", unit: "kg", step: 0.5, superPrice: 3.69 },
  { id: "zanahoria", name: "Zanahoria", category: "verduras", emoji: "🥕", unit: "kg", step: 0.5, superPrice: 3.79 },
  { id: "ajo", name: "Ajo", category: "verduras", emoji: "🧄", unit: "kg", step: 0.25, superPrice: 19.99 },
  { id: "zapallo", name: "Zapallo macre", category: "verduras", emoji: "🎃", unit: "kg", step: 0.5, superPrice: 3.7 },
  { id: "brocoli", name: "Brócoli", category: "verduras", emoji: "🥦", unit: "kg", step: 0.5, superPrice: 5.9, note: "Un brócoli ≈ 500 g" },
  { id: "pimiento", name: "Pimiento", category: "verduras", emoji: "🫑", unit: "kg", step: 0.5, superPrice: 13.49 },
  { id: "pepino", name: "Pepino", category: "verduras", emoji: "🥒", unit: "kg", step: 0.5, superPrice: 3.2 },
  { id: "choclo", name: "Choclo", category: "verduras", emoji: "🌽", unit: "un", step: 1, superPrice: 2.6 },
  { id: "vainita", name: "Vainita", category: "verduras", emoji: "🫛", unit: "kg", step: 0.5, superPrice: 7.9 },
  { id: "palta", name: "Palta hass", category: "verduras", emoji: "🥑", unit: "kg", step: 0.5, superPrice: 8.49 },

  // Hierbas y ajíes
  { id: "culantro", name: "Culantro", category: "hierbas", emoji: "🌿", unit: "atado", step: 1, superPrice: 1.49 },
  { id: "perejil", name: "Perejil", category: "hierbas", emoji: "🌿", unit: "atado", step: 1, superPrice: 1.79 },
  { id: "hierbabuena", name: "Hierbabuena", category: "hierbas", emoji: "🌱", unit: "atado", step: 1, superPrice: 1.39 },
  { id: "huacatay", name: "Huacatay", category: "hierbas", emoji: "🌱", unit: "atado", step: 1, superPrice: 2.99 },
  { id: "aji-amarillo", name: "Ají amarillo", category: "hierbas", emoji: "🌶️", unit: "kg", step: 0.25, superPrice: 14.29 },
  { id: "rocoto", name: "Rocoto", category: "hierbas", emoji: "🌶️", unit: "un", step: 1, superPrice: 2.99 },
  { id: "limon", name: "Limón", category: "hierbas", emoji: "🍋", unit: "kg", step: 0.5, superPrice: 4.2 },

  // Frutas
  { id: "platano", name: "Plátano de seda", category: "frutas", emoji: "🍌", unit: "kg", step: 0.5, superPrice: 3.99 },
  { id: "manzana", name: "Manzana delicia", category: "frutas", emoji: "🍎", unit: "kg", step: 0.5, superPrice: 5.9 },
  { id: "mandarina", name: "Mandarina", category: "frutas", emoji: "🍊", unit: "kg", step: 0.5, superPrice: 2.49 },
  { id: "naranja", name: "Naranja para jugo", category: "frutas", emoji: "🍊", unit: "kg", step: 0.5, superPrice: 2.79 },
  { id: "papaya", name: "Papaya", category: "frutas", emoji: "🥭", unit: "kg", step: 0.5, superPrice: 5.69, source: "Plaza Vea" },
  { id: "pina", name: "Piña golden", category: "frutas", emoji: "🍍", unit: "un", step: 1, superPrice: 10.7, note: "Aprox. 2 kg" },
  { id: "fresa", name: "Fresa", category: "frutas", emoji: "🍓", unit: "kg", step: 0.5, superPrice: 25.98 },
  { id: "granadilla", name: "Granadilla", category: "frutas", emoji: "🟠", unit: "un", step: 1, superPrice: 1.1 },
  { id: "uva", name: "Uva roja", category: "frutas", emoji: "🍇", unit: "kg", step: 0.5, superPrice: 17.99 },

  // Básicos (pocos envasados)
  { id: "queso-fresco", name: "Queso fresco", category: "basicos", emoji: "🧀", unit: "kg", step: 0.25, superPrice: 30.9 },
  { id: "arroz", name: "Arroz extra a granel", category: "basicos", emoji: "🍚", unit: "kg", step: 1, superPrice: 3.98 },
  { id: "lentejas", name: "Lentejas", category: "basicos", emoji: "🫘", unit: "kg", step: 0.5, superPrice: 8.6 },
];

/** Producto listo para mostrar: precio de referencia en céntimos y disponibilidad. */
export type Product = Omit<ProductDefinition, "superPrice"> & {
  superCents: number;
  available: boolean;
};
