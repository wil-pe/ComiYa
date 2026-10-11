import type { Unit } from "@/data/products";

const NAMES: Record<string, [string, string]> = {
  un: ["unidad", "unidades"],
  atado: ["atado", "atados"],
  plancha: ["plancha", "planchas"],
};

export function formatQty(qty: number, unit: Unit | string): string {
  if (unit === "kg") {
    return qty < 1 ? `${Math.round(qty * 1000)} g` : `${qty.toLocaleString("es-PE")} kg`;
  }
  const [one, many] = NAMES[unit] ?? NAMES.un;
  return `${qty} ${qty === 1 ? one : many}`;
}

export function unitLabel(unit: Unit | string): string {
  if (unit === "kg") return "el kilo";
  if (unit === "atado") return "el atado";
  if (unit === "plancha") return "la plancha";
  return "la unidad";
}
