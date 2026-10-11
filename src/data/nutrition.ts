// Valores por 100 g de parte comestible, en crudo. Fuente por producto en `source`.
export type Nutrition = {
  kcal: number;
  protein: number | null;
  fat: number | null;
  carbs: number | null;
  fiber: number | null;
  highlights: { label: string; value: number; unit: string }[];
  source: string;
};

export const NUTRITION: Record<string, Nutrition> = {};
