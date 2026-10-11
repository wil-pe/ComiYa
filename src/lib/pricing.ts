import { BASE_DISCOUNT, GROUP_TIERS } from "@/config";

export function formatSoles(cents: number): string {
  return `S/ ${(cents / 100).toFixed(2)}`;
}

/** Precio ComiYa: precio de supermercado con descuento, redondeado hacia abajo a 10 céntimos. */
export function priceAt(superCents: number, discount: number = BASE_DISCOUNT): number {
  return Math.floor((superCents * (1 - discount)) / 10 + 1e-9) * 10;
}

export function lineTotal(unitCents: number, qty: number): number {
  return Math.round(unitCents * qty);
}

export function tierFor(neighbors: number) {
  let index = 0;
  GROUP_TIERS.forEach((tier, i) => {
    if (neighbors >= tier.minNeighbors) index = i;
  });
  const next = GROUP_TIERS[index + 1];
  return {
    index,
    discount: GROUP_TIERS[index].discount,
    next: next ? { ...next, missing: next.minNeighbors - neighbors } : null,
  };
}

export function percent(discount: number): string {
  return `${Math.round(discount * 100)}%`;
}

export type PricedLine = {
  id: string;
  name: string;
  emoji: string;
  unit: string;
  qty: number;
  superPrice: number;
  price: number;
};

export function totals(lines: { superPrice: number; qty: number }[], discount: number) {
  let superTotal = 0;
  let subtotal = 0;
  for (const line of lines) {
    superTotal += lineTotal(line.superPrice, line.qty);
    subtotal += lineTotal(priceAt(line.superPrice, discount), line.qty);
  }
  return { superTotal, subtotal, savings: superTotal - subtotal };
}
