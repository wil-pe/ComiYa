import type { CategoryId } from "./products";

// Información para la ficha de cada producto: cómo conservarlo, alérgenos y
// otros nombres con los que la gente lo busca. Recomendaciones de conservación
// basadas en las guías de inocuidad alimentaria (USDA FoodKeeper / FDA).

export type ProductInfo = {
  storage: string;
  allergens?: string[];
  aliases?: string[];
};

const BY_CATEGORY: Record<CategoryId, string> = {
  pollo: "Refrigéralo entre 0 y 4 °C y cocínalo en 1 o 2 días, o congélalo. No lo laves crudo: cocínalo bien, hasta que no quede rosado.",
  carnes: "Refrigérala entre 0 y 4 °C y cocínala en 3 a 5 días, o congélala en porciones.",
  pescados: "Guárdalo en la parte más fría del refrigerador y cocínalo en 1 o 2 días, o congélalo.",
  verduras: "Guárdala en el cajón de verduras del refrigerador, en una bolsa con algunos huecos.",
  hierbas: "Ponla como un ramo, con los tallos en un vaso con agua, dentro del refrigerador.",
  frutas: "Déjala a temperatura ambiente hasta que madure y luego pásala al refrigerador.",
  basicos: "Guárdalo bien cerrado, en un lugar fresco y seco.",
};

const INFO: Record<string, Partial<ProductInfo>> = {
  "pollo-entero": { aliases: ["gallina", "pollo"] },
  "pechuga-pollo": { aliases: ["filete de pollo", "pollo"] },
  "pierna-pollo": { aliases: ["muslo", "encuentro", "pollo"] },
  huevos: {
    storage: "Guárdalos en el refrigerador dentro de su bandeja. Duran de 3 a 5 semanas. Lávalos recién al momento de usarlos.",
    allergens: ["Huevo"],
  },
  "carne-molida": {
    storage: "Refrigérala y cocínala en 1 o 2 días, o congélala. Cocínala bien, sin partes rosadas.",
    aliases: ["carne picada", "res"],
  },
  bistec: { aliases: ["filete de res", "res", "carne"] },
  "carne-guiso": { aliases: ["res", "carne", "estofado", "seco"] },
  "asado-tira": { aliases: ["costilla de res", "res", "parrilla"] },
  "chuleta-cerdo": { aliases: ["chancho", "puerco"] },
  bonito: { allergens: ["Pescado"] },
  jurel: { allergens: ["Pescado"] },
  trucha: { allergens: ["Pescado"] },
  perico: { allergens: ["Pescado"], aliases: ["dorado", "mahi mahi"] },
  reineta: { allergens: ["Pescado"] },
  lechuga: { aliases: ["ensalada"] },
  tomate: { storage: "Déjalo fuera del refrigerador hasta que esté maduro; luego refrigéralo y consúmelo en pocos días." },
  "cebolla-roja": { storage: "En un lugar fresco, seco y ventilado, fuera del refrigerador y lejos de las papas.", aliases: ["cebolla"] },
  "papa-amarilla": { storage: "En un lugar fresco, oscuro y seco, fuera del refrigerador y lejos de la cebolla.", aliases: ["papa", "patata"] },
  "papa-blanca": { storage: "En un lugar fresco, oscuro y seco, fuera del refrigerador y lejos de la cebolla.", aliases: ["papa", "patata", "yungay"] },
  camote: { storage: "En un lugar fresco, oscuro y seco, fuera del refrigerador.", aliases: ["batata", "boniato"] },
  ajo: { storage: "En un lugar fresco, seco y ventilado. Una vez pelado, refrigéralo y úsalo en pocos días." },
  zapallo: { storage: "El trozo cortado, envuelto en el refrigerador por 4 o 5 días.", aliases: ["calabaza", "auyama", "loche"] },
  brocoli: { aliases: ["brocoli"] },
  pimiento: { aliases: ["morrón", "pimentón", "ají dulce"] },
  choclo: { storage: "Refrigéralo con su panca y cocínalo en 1 o 2 días: pierde dulzor rápido.", aliases: ["maíz", "elote", "mazorca"] },
  vainita: { aliases: ["ejote", "judía verde", "habichuela"] },
  palta: { storage: "Déjala madurar fuera del refrigerador; cuando ceda un poco al apretarla, refrigérala.", aliases: ["aguacate"] },
  culantro: { aliases: ["cilantro"] },
  hierbabuena: { aliases: ["menta"] },
  huacatay: { aliases: ["menta negra"] },
  "aji-amarillo": { storage: "En el refrigerador, en una bolsa de papel, hasta 1 o 2 semanas.", aliases: ["ají", "chile"] },
  rocoto: { storage: "En el refrigerador hasta 1 o 2 semanas.", aliases: ["ají", "chile", "picante"] },
  limon: { storage: "Unos días a temperatura ambiente, o 2 a 3 semanas en el refrigerador.", aliases: ["lima", "limón sutil"] },
  platano: { storage: "A temperatura ambiente, colgado o separado de otras frutas. No lo refrigeres verde.", aliases: ["banana", "banano", "guineo"] },
  manzana: { storage: "En el refrigerador se mantiene crocante por semanas." },
  mandarina: { storage: "Una semana a temperatura ambiente o más tiempo en el refrigerador." },
  naranja: { storage: "Una semana a temperatura ambiente o más tiempo en el refrigerador.", aliases: ["jugo"] },
  fresa: { storage: "En el refrigerador, sin lavar, y cómela en 1 a 3 días. Lávala justo antes de comer.", aliases: ["frutilla"] },
  uva: { storage: "En el refrigerador, sin lavar, por hasta una semana." },
  granadilla: { storage: "A temperatura ambiente; cuando la cáscara se ve un poco arrugada está más dulce." },
  "queso-fresco": {
    storage: "Refrigerado y bien tapado. Consúmelo en 5 a 7 días.",
    allergens: ["Leche"],
    aliases: ["queso"],
  },
  arroz: { storage: "En un envase bien cerrado, en un lugar fresco y seco." },
  lentejas: { storage: "En un envase bien cerrado, en un lugar fresco y seco.", aliases: ["menestra"] },
};

export function productInfo(id: string, category: CategoryId): ProductInfo {
  const info = INFO[id] ?? {};
  return { storage: info.storage ?? BY_CATEGORY[category], allergens: info.allergens, aliases: info.aliases };
}
