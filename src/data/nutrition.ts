// Valores por 100 g de parte comestible, en crudo. Fuente por producto en `source`:
// Tablas Peruanas de Composición de Alimentos (INS-CENAN, 10ª ed. 2017) y, cuando
// no tienen el corte o la forma, USDA FoodData Central (SR Legacy).
export type Nutrition = {
  kcal: number;
  protein: number | null;
  fat: number | null;
  carbs: number | null;
  fiber: number | null;
  highlights: { label: string; value: number; unit: string }[];
  source: string;
};

export const NUTRITION: Record<string, Nutrition> = {
  "pollo-entero": {
    kcal: 215, protein: 18.6, fat: 15.1, carbs: 0.0, fiber: 0.0,
    highlights: [{ label: "Vitamina B3 (niacina)", value: 6.8, unit: "mg" }, { label: "Fósforo", value: 147, unit: "mg" }, { label: "Selenio", value: 14, unit: "µg" }],
    source: "USDA FDC 171447",
  },
  "pechuga-pollo": {
    kcal: 120, protein: 22.5, fat: 2.6, carbs: 0.0, fiber: 0.0,
    highlights: [{ label: "Vitamina B3 (niacina)", value: 9.6, unit: "mg" }, { label: "Vitamina B6", value: 0.81, unit: "mg" }, { label: "Selenio", value: 23, unit: "µg" }],
    source: "USDA FDC 171077",
  },
  "pierna-pollo": {
    kcal: 214, protein: 16.4, fat: 16.0, carbs: 0.2, fiber: 0.0,
    highlights: [{ label: "Vitamina B3 (niacina)", value: 4.7, unit: "mg" }, { label: "Zinc", value: 1.5, unit: "mg" }, { label: "Selenio", value: 18, unit: "µg" }],
    source: "USDA FDC 172378",
  },
  "huevos": {
    kcal: 156, protein: 12.7, fat: 11.1, carbs: null, fiber: null,
    highlights: [{ label: "Vitamina A", value: 140, unit: "µg ER" }, { label: "Vitamina B2 (riboflavina)", value: 0.26, unit: "mg" }, { label: "Hierro", value: 2.6, unit: "mg" }],
    source: "INS-CENAN 2017, código J-4",
  },
  "carne-molida": {
    kcal: 215, protein: 18.6, fat: 15.0, carbs: 0.0, fiber: 0.0,
    highlights: [{ label: "Zinc", value: 4.5, unit: "mg" }, { label: "Vitamina B12", value: 2.2, unit: "µg" }, { label: "Hierro", value: 2.1, unit: "mg" }],
    source: "USDA FDC 171796",
  },
  "bistec": {
    kcal: 105, protein: 21.3, fat: 1.6, carbs: 0.0, fiber: 0.0,
    highlights: [{ label: "Zinc", value: 4.3, unit: "mg" }, { label: "Hierro", value: 3.4, unit: "mg" }, { label: "Vitamina B3 (niacina)", value: 6.8, unit: "mg" }],
    source: "INS-CENAN 2017, código F-35",
  },
  "carne-guiso": {
    kcal: 128, protein: 21.8, fat: 4.5, carbs: 0.2, fiber: 0.0,
    highlights: [{ label: "Zinc", value: 5.4, unit: "mg" }, { label: "Vitamina B12", value: 2.3, unit: "µg" }, { label: "Hierro", value: 2.1, unit: "mg" }],
    source: "USDA FDC 171206",
  },
  "asado-tira": {
    kcal: 390, protein: 14.4, fat: 36.2, carbs: 0.4, fiber: 0.0,
    highlights: [{ label: "Vitamina B12", value: 2.6, unit: "µg" }, { label: "Zinc", value: 3.2, unit: "mg" }, { label: "Hierro", value: 1.6, unit: "mg" }],
    source: "USDA FDC 169439",
  },
  "chuleta-cerdo": {
    kcal: 170, protein: 20.7, fat: 9.0, carbs: 0.0, fiber: 0.0,
    highlights: [{ label: "Vitamina B1 (tiamina)", value: 0.49, unit: "mg" }, { label: "Selenio", value: 34, unit: "µg" }, { label: "Vitamina B3 (niacina)", value: 6.6, unit: "mg" }],
    source: "USDA FDC 168238",
  },
  "bonito": {
    kcal: 138, protein: 23.4, fat: 4.2, carbs: null, fiber: null,
    highlights: [{ label: "Vitamina B3 (niacina)", value: 12.8, unit: "mg" }, { label: "Fósforo", value: 258, unit: "mg" }, { label: "Potasio", value: 293, unit: "mg" }],
    source: "INS-CENAN 2017, código E-27",
  },
  "jurel": {
    kcal: 120, protein: 19.7, fat: 4.0, carbs: null, fiber: null,
    highlights: [{ label: "Fósforo", value: 325, unit: "mg" }, { label: "Hierro", value: 1.8, unit: "mg" }],
    source: "INS-CENAN 2017, código E-50",
  },
  "trucha": {
    kcal: 111, protein: 19.5, fat: 3.1, carbs: null, fiber: null,
    highlights: [{ label: "Fósforo", value: 245, unit: "mg" }, { label: "Vitamina B3 (niacina)", value: 4.5, unit: "mg" }, { label: "Omega-3 (EPA+DHA)", value: 0.59, unit: "g" }],
    source: "INS-CENAN 2017, código E-83; omega-3: USDA FDC 175154",
  },
  "perico": {
    kcal: 91, protein: 20.5, fat: 0.4, carbs: 0.0, fiber: null,
    highlights: [{ label: "Selenio", value: 37, unit: "µg" }, { label: "Vitamina B3 (niacina)", value: 6.1, unit: "mg" }, { label: "Potasio", value: 416, unit: "mg" }],
    source: "INS-CENAN 2017, código E-67; selenio, niacina, potasio: USDA FDC 171959",
  },
  "reineta": {
    kcal: 106, protein: 19.2, fat: 2.7, carbs: 0.0, fiber: null,
    highlights: [{ label: "Vitamina B3 (niacina)", value: 3.6, unit: "mg" }, { label: "Fósforo", value: 132, unit: "mg" }, { label: "Calcio", value: 126, unit: "mg" }],
    source: "INS-CENAN 2017, código E-61",
  },
  "lechuga": {
    kcal: 7, protein: 0.6, fat: 0.1, carbs: 2.4, fiber: 1.2,
    highlights: [{ label: "Calcio", value: 52, unit: "mg" }, { label: "Vitamina A", value: 25, unit: "µg ER" }],
    source: "INS-CENAN 2017, código B-53",
  },
  "tomate": {
    kcal: 15, protein: 0.8, fat: 0.2, carbs: 4.3, fiber: 1.2,
    highlights: [{ label: "Vitamina C", value: 18.4, unit: "mg" }, { label: "Vitamina A", value: 42, unit: "µg ER" }],
    source: "INS-CENAN 2017, código B-79",
  },
  "cebolla-roja": {
    kcal: 28, protein: 1.4, fat: 0.4, carbs: 8.5, fiber: 2.5,
    highlights: [{ label: "Vitamina C", value: 9.8, unit: "mg" }, { label: "Potasio", value: 168, unit: "mg" }],
    source: "INS-CENAN 2017, código B-102",
  },
  "papa-amarilla": {
    kcal: 101, protein: 2.0, fat: 0.4, carbs: 23.3, fiber: 0.4,
    highlights: [{ label: "Vitamina C", value: 9.0, unit: "mg" }, { label: "Vitamina B3 (niacina)", value: 1.9, unit: "mg" }, { label: "Fósforo", value: 52, unit: "mg" }],
    source: "INS-CENAN 2017, código U-18",
  },
  "papa-blanca": {
    kcal: 87, protein: 2.1, fat: 0.1, carbs: 22.3, fiber: 2.4,
    highlights: [{ label: "Vitamina C", value: 14.0, unit: "mg" }, { label: "Vitamina B3 (niacina)", value: 1.7, unit: "mg" }, { label: "Fósforo", value: 47, unit: "mg" }],
    source: "INS-CENAN 2017, código U-19",
  },
  "camote": {
    kcal: 95, protein: 2.0, fat: 0.0, carbs: 23.4, fiber: 2.9,
    highlights: [{ label: "Vitamina A", value: 517, unit: "µg ER" }, { label: "Vitamina C", value: 22, unit: "mg" }],
    source: "INS-CENAN 2017, código U-3",
  },
  "zanahoria": {
    kcal: 19, protein: 1.0, fat: 0.3, carbs: 7.6, fiber: 4.1,
    highlights: [{ label: "Vitamina A", value: 1092, unit: "µg ER" }],
    source: "INS-CENAN 2017, código B-85",
  },
  "ajo": {
    kcal: 121, protein: 5.6, fat: 0.8, carbs: 30.4, fiber: 2.1,
    highlights: [{ label: "Fósforo", value: 180, unit: "mg" }, { label: "Potasio", value: 250, unit: "mg" }, { label: "Vitamina C", value: 9.1, unit: "mg" }],
    source: "INS-CENAN 2017, código B-13",
  },
  "zapallo": {
    kcal: 26, protein: 0.7, fat: 0.2, carbs: 6.4, fiber: null,
    highlights: [{ label: "Vitamina A", value: 68, unit: "µg ER" }, { label: "Vitamina C", value: 5.7, unit: "mg" }],
    source: "INS-CENAN 2017, código B-89",
  },
  "brocoli": {
    kcal: 32, protein: 3.9, fat: 1.3, carbs: 4.0, fiber: 0.7,
    highlights: [{ label: "Vitamina C", value: 114, unit: "mg" }, { label: "Calcio", value: 93, unit: "mg" }, { label: "Vitamina A", value: 66, unit: "µg ER" }],
    source: "INS-CENAN 2017, código B-21",
  },
  "pimiento": {
    kcal: 27, protein: 1.2, fat: 1.3, carbs: 4.6, fiber: 0.9,
    highlights: [{ label: "Vitamina C", value: 108, unit: "mg" }, { label: "Vitamina A", value: 200, unit: "µg ER" }],
    source: "INS-CENAN 2017, código B-69",
  },
  "pepino": {
    kcal: 9, protein: 0.5, fat: 0.1, carbs: 2.6, fiber: 0.7,
    highlights: [{ label: "Vitamina C", value: 12.6, unit: "mg" }, { label: "Calcio", value: 20, unit: "mg" }],
    source: "INS-CENAN 2017, código B-67",
  },
  "choclo": {
    kcal: 104, protein: 3.3, fat: 0.8, carbs: 27.8, fiber: 2.7,
    highlights: [{ label: "Fósforo", value: 113, unit: "mg" }, { label: "Vitamina B3 (niacina)", value: 1.4, unit: "mg" }, { label: "Vitamina B1 (tiamina)", value: 0.14, unit: "mg" }],
    source: "INS-CENAN 2017, código A-34",
  },
  "vainita": {
    kcal: 25, protein: 2.4, fat: 0.3, carbs: 8.1, fiber: 3.4,
    highlights: [{ label: "Calcio", value: 88, unit: "mg" }, { label: "Hierro", value: 1.4, unit: "mg" }, { label: "Vitamina C", value: 9.6, unit: "mg" }],
    source: "INS-CENAN 2017, código B-84",
  },
  "palta": {
    kcal: 167, protein: 2.0, fat: 15.4, carbs: 8.6, fiber: 6.8,
    highlights: [{ label: "Potasio", value: 507, unit: "mg" }, { label: "Folato", value: 89, unit: "µg" }, { label: "Vitamina E", value: 2.0, unit: "mg" }],
    source: "USDA FDC 171706",
  },
  "culantro": {
    kcal: 34, protein: 3.3, fat: 1.3, carbs: 7.0, fiber: 2.8,
    highlights: [{ label: "Vitamina A", value: 1431, unit: "µg ER" }, { label: "Hierro", value: 5.3, unit: "mg" }, { label: "Vitamina C", value: 37, unit: "mg" }],
    source: "INS-CENAN 2017, código B-39",
  },
  "perejil": {
    kcal: 41, protein: 4.8, fat: 0.7, carbs: 9.9, fiber: 3.3,
    highlights: [{ label: "Vitamina C", value: 96, unit: "mg" }, { label: "Hierro", value: 8.7, unit: "mg" }, { label: "Vitamina A", value: 421, unit: "µg ER" }],
    source: "INS-CENAN 2017, código B-68",
  },
  "hierbabuena": {
    kcal: 41, protein: 3.1, fat: 1.0, carbs: 7.0, fiber: null,
    highlights: [{ label: "Hierro", value: 9.1, unit: "mg" }, { label: "Calcio", value: 206, unit: "mg" }, { label: "Vitamina A", value: 212, unit: "µg ER" }],
    source: "INS-CENAN 2017, código B-47",
  },
  "huacatay": {
    kcal: 50, protein: 5.0, fat: 0.8, carbs: 8.8, fiber: null,
    highlights: [{ label: "Calcio", value: 412, unit: "mg" }, { label: "Hierro", value: 8.7, unit: "mg" }, { label: "Vitamina A", value: 426, unit: "µg ER" }],
    source: "INS-CENAN 2017, código B-48",
  },
  "aji-amarillo": {
    kcal: 39, protein: 0.9, fat: 0.7, carbs: 8.8, fiber: null,
    highlights: [{ label: "Vitamina C", value: 60, unit: "mg" }, { label: "Vitamina A", value: 445, unit: "µg ER" }, { label: "Vitamina B2 (riboflavina)", value: 0.58, unit: "mg" }],
    source: "INS-CENAN 2017, código B-3",
  },
  "rocoto": {
    kcal: 36, protein: 1.2, fat: 0.5, carbs: 8.2, fiber: null,
    highlights: [{ label: "Vitamina C", value: 14.9, unit: "mg" }, { label: "Vitamina B3 (niacina)", value: 1.2, unit: "mg" }],
    source: "INS-CENAN 2017, código B-76",
  },
  "limon": {
    kcal: 30, protein: 0.7, fat: 0.2, carbs: 10.5, fiber: 2.8,
    highlights: [{ label: "Vitamina C", value: 29, unit: "mg" }, { label: "Calcio", value: 33, unit: "mg" }],
    source: "USDA FDC 168155",
  },
  "platano": {
    kcal: 74, protein: 1.5, fat: 0.3, carbs: 21.0, fiber: 2.6,
    highlights: [{ label: "Potasio", value: 358, unit: "mg" }, { label: "Vitamina B6", value: 0.37, unit: "mg" }],
    source: "INS-CENAN 2017, código C-71; potasio, vitamina B6: USDA FDC 173944",
  },
  "manzana": {
    kcal: 52, protein: 0.3, fat: 0.1, carbs: 16.5, fiber: 2.6,
    highlights: [{ label: "Potasio", value: 104, unit: "mg" }],
    source: "INS-CENAN 2017, código C-116; potasio: USDA FDC 168201",
  },
  "mandarina": {
    kcal: 29, protein: 0.6, fat: 0.3, carbs: 8.6, fiber: 1.8,
    highlights: [{ label: "Vitamina C", value: 49, unit: "mg" }, { label: "Vitamina A", value: 34, unit: "µg ER" }],
    source: "INS-CENAN 2017, código C-40",
  },
  "naranja": {
    kcal: 31, protein: 0.6, fat: 0.2, carbs: 10.1, fiber: 2.4,
    highlights: [{ label: "Vitamina C", value: 92, unit: "mg" }, { label: "Vitamina B1 (tiamina)", value: 0.09, unit: "mg" }],
    source: "INS-CENAN 2017, código C-48",
  },
  "papaya": {
    kcal: 25, protein: 0.4, fat: 0.1, carbs: 8.2, fiber: 1.8,
    highlights: [{ label: "Vitamina C", value: 48, unit: "mg" }, { label: "Vitamina A", value: 55, unit: "µg ER" }],
    source: "INS-CENAN 2017, código C-59",
  },
  "pina": {
    kcal: 33, protein: 0.4, fat: 0.2, carbs: 9.8, fiber: 1.4,
    highlights: [{ label: "Vitamina C", value: 19.9, unit: "mg" }, { label: "Manganeso", value: 0.93, unit: "mg" }],
    source: "INS-CENAN 2017, código C-69; manganeso: USDA FDC 169124",
  },
  "fresa": {
    kcal: 34, protein: 0.7, fat: 0.8, carbs: 8.9, fiber: 2.0,
    highlights: [{ label: "Vitamina C", value: 42, unit: "mg" }, { label: "Hierro", value: 1.2, unit: "mg" }],
    source: "INS-CENAN 2017, código C-18",
  },
  "granadilla": {
    kcal: 51, protein: 2.5, fat: 2.7, carbs: 11.4, fiber: 5.8,
    highlights: [{ label: "Potasio", value: 338, unit: "mg" }, { label: "Fósforo", value: 128, unit: "mg" }, { label: "Vitamina B3 (niacina)", value: 2.1, unit: "mg" }],
    source: "INS-CENAN 2017, código C-20",
  },
  "uva": {
    kcal: 63, protein: 0.4, fat: 0.1, carbs: 17.7, fiber: 0.9,
    highlights: [{ label: "Potasio", value: 191, unit: "mg" }, { label: "Vitamina K", value: 15, unit: "µg" }],
    source: "INS-CENAN 2017, código C-95; potasio, vitamina K: USDA FDC 174683",
  },
  "queso-fresco": {
    kcal: 264, protein: 17.5, fat: 20.1, carbs: 3.3, fiber: 0.0,
    highlights: [{ label: "Calcio", value: 783, unit: "mg" }, { label: "Fósforo", value: 375, unit: "mg" }, { label: "Vitamina A", value: 420, unit: "µg ER" }],
    source: "INS-CENAN 2017, código G-14",
  },
  "arroz": {
    kcal: 358, protein: 7.8, fat: 0.7, carbs: 77.6, fiber: null,
    highlights: [{ label: "Vitamina B3 (niacina)", value: 2.2, unit: "mg" }, { label: "Fósforo", value: 134, unit: "mg" }, { label: "Zinc", value: 1.5, unit: "mg" }],
    source: "INS-CENAN 2017, código A-3",
  },
  "lentejas": {
    kcal: 352, protein: 24.6, fat: 1.1, carbs: 63.4, fiber: 10.7,
    highlights: [{ label: "Hierro", value: 6.5, unit: "mg" }, { label: "Folato", value: 479, unit: "µg" }, { label: "Potasio", value: 677, unit: "mg" }],
    source: "USDA FDC 172420",
  },
};
