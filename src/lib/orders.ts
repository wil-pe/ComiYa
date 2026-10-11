import "server-only";
import type postgres from "postgres";
import { DELIVERY, type PaymentMethod } from "@/config";
import { getCatalog, type Product } from "@/lib/catalog";
import { addDays, availableDates, isOpenForOrders, todayLima, weekdayOf } from "@/lib/dates";
import { db } from "@/lib/db";
import type { OrderStatus } from "@/lib/order-status";
import { priceAt, tierFor, totals, type PricedLine } from "@/lib/pricing";

type Sql = postgres.Sql | postgres.TransactionSql;

export type Order = {
  id: number;
  userId: number;
  condoId: number;
  subscriptionId: number | null;
  deliveryDate: string;
  deliveryTime: string;
  items: PricedLine[];
  superTotal: number;
  discount: number;
  subtotal: number;
  creditUsed: number;
  total: number;
  paymentMethod: PaymentMethod;
  paymentRef: string | null;
  status: OrderStatus;
  notes: string;
  createdAt: Date;
};

// Pedidos que cuentan para el precio de grupo y para el saldo a favor.
const PAID = ["pagado", "entregado"];

export function mapOrder(row: postgres.Row): Order {
  return {
    id: row.id,
    userId: row.user_id,
    condoId: row.condo_id,
    subscriptionId: row.subscription_id,
    deliveryDate: row.delivery_date,
    deliveryTime: row.delivery_time,
    items: row.items,
    superTotal: row.super_total,
    discount: row.discount_bp / 10000,
    subtotal: row.subtotal,
    creditUsed: row.credit_used,
    total: row.total,
    paymentMethod: row.payment_method,
    paymentRef: row.payment_ref,
    status: row.status,
    notes: row.notes,
    createdAt: row.created_at,
  };
}

export type RequestedItem = { id: string; qty: number };

/** Valida lo que pide el cliente contra el catálogo (nunca se confía en precios del navegador). */
export function resolveItems(catalog: Product[], requested: unknown) {
  const byId = new Map(catalog.map((product) => [product.id, product]));
  const lines: { product: Product; qty: number }[] = [];
  const unavailable: string[] = [];
  if (!Array.isArray(requested)) return { lines, unavailable };
  for (const item of requested) {
    const product = byId.get(String(item?.id));
    const qty = Number(item?.qty);
    if (!product || !Number.isFinite(qty) || qty <= 0 || qty > 50) continue;
    const steps = qty / product.step;
    if (Math.abs(steps - Math.round(steps)) > 1e-6) continue;
    if (!product.available) {
      unavailable.push(product.name);
      continue;
    }
    lines.push({ product, qty });
  }
  return { lines, unavailable };
}

/** Vecinos (hogares distintos) del condominio con pedido para cada fecha. */
export async function neighborCounts(condoId: number, dates: string[], userId?: number) {
  const result: Record<string, { count: number; includesMe: boolean }> = {};
  for (const date of dates) result[date] = { count: 0, includesMe: false };
  if (!dates.length) return result;
  const sql = await db();
  const rows = await sql`
    SELECT delivery_date,
           COUNT(DISTINCT user_id)::int AS n,
           BOOL_OR(user_id = ${userId ?? -1}) AS mine
    FROM orders
    WHERE condo_id = ${condoId} AND status <> 'cancelado' AND delivery_date IN ${sql(dates)}
    GROUP BY delivery_date`;
  for (const row of rows) result[row.delivery_date] = { count: row.n, includesMe: row.mine };
  return result;
}

/** Cuánto se le devuelve a un pedido si al cierre se sumaron más vecinos. */
export function creditEarned(order: Pick<Order, "items" | "discount" | "subtotal">, finalDiscount: number) {
  if (finalDiscount <= order.discount) return 0;
  return Math.max(0, order.subtotal - totals(order.items, finalDiscount).subtotal);
}

async function finalCounts(sql: Sql, orders: Pick<Order, "condoId" | "deliveryDate">[]) {
  const counts = new Map<string, number>();
  if (!orders.length) return counts;
  const dates = [...new Set(orders.map((o) => o.deliveryDate))];
  const condos = [...new Set(orders.map((o) => o.condoId))];
  const rows = await sql`
    SELECT condo_id, delivery_date, COUNT(DISTINCT user_id)::int AS n
    FROM orders
    WHERE status IN ${sql(PAID)} AND delivery_date IN ${sql(dates)} AND condo_id IN ${sql(condos)}
    GROUP BY condo_id, delivery_date`;
  for (const row of rows) counts.set(`${row.condo_id}:${row.delivery_date}`, row.n);
  return counts;
}

/** Precio final de grupo (solo cuando el pedido ya cerró). */
export async function finalDiscountFor(order: Order): Promise<number | null> {
  if (isOpenForOrders(order.deliveryDate) || !PAID.includes(order.status)) return null;
  const sql = await db();
  const counts = await finalCounts(sql, [order]);
  return tierFor(counts.get(`${order.condoId}:${order.deliveryDate}`) ?? 0).discount;
}

/** Saldo a favor: lo devuelto por compras en grupo menos lo ya usado. */
export async function creditBalance(userId: number, sqlArg?: Sql): Promise<number> {
  const sql = sqlArg ?? (await db());
  const rows = await sql`
    SELECT * FROM orders WHERE user_id = ${userId} AND status IN ${sql(PAID)}`;
  const closed = rows.map(mapOrder).filter((order) => !isOpenForOrders(order.deliveryDate));
  const counts = await finalCounts(sql, closed);
  let earned = 0;
  for (const order of closed) {
    const n = counts.get(`${order.condoId}:${order.deliveryDate}`) ?? 0;
    earned += creditEarned(order, tierFor(n).discount);
  }
  const [{ used }] = await sql`
    SELECT COALESCE(SUM(credit_used), 0)::int AS used
    FROM orders WHERE user_id = ${userId} AND status <> 'cancelado'`;
  return Math.max(0, earned - used);
}

export async function createOrder(params: {
  userId: number;
  condoId: number;
  lines: { product: Product; qty: number }[];
  date: string;
  time: string;
  paymentMethod: PaymentMethod;
  subscriptionId?: number | null;
  notes?: string;
}): Promise<number | null> {
  const sql = await db();
  return sql.begin(async (tx) => {
    const [{ n }] = await tx`
      SELECT COUNT(DISTINCT user_id)::int AS n FROM orders
      WHERE condo_id = ${params.condoId} AND delivery_date = ${params.date}
        AND status <> 'cancelado' AND user_id <> ${params.userId}`;
    const discount = tierFor(n + 1).discount;
    const items: PricedLine[] = params.lines.map(({ product, qty }) => ({
      id: product.id,
      name: product.name,
      emoji: product.emoji,
      unit: product.unit,
      qty,
      superPrice: product.superCents,
      price: priceAt(product.superCents, discount),
    }));
    const { superTotal, subtotal } = totals(items, discount);
    const creditUsed = Math.min(await creditBalance(params.userId, tx), subtotal);
    const total = subtotal - creditUsed + DELIVERY.fee;
    const [row] = await tx`
      INSERT INTO orders (user_id, condo_id, subscription_id, delivery_date, delivery_time, items,
                          super_total, discount_bp, subtotal, credit_used, total, payment_method, notes)
      VALUES (${params.userId}, ${params.condoId}, ${params.subscriptionId ?? null}, ${params.date},
              ${params.time}, ${tx.json(items as unknown as postgres.JSONValue)}, ${superTotal},
              ${Math.round(discount * 10000)}, ${subtotal}, ${creditUsed}, ${total},
              ${params.paymentMethod}, ${params.notes ?? ""})
      ON CONFLICT DO NOTHING
      RETURNING id`;
    return row?.id ?? null;
  });
}

/**
 * Crea los pedidos de las suscripciones semanales cuyo día de entrega cae en los
 * próximos 3 días. Es idempotente: se puede llamar cuantas veces se quiera.
 */
export async function generateRecurringOrders(now = new Date(), onlyUserId?: number): Promise<number> {
  const windowEnd = addDays(todayLima(now), 3);
  const dates = availableDates(now).filter((date) => date <= windowEnd);
  if (!dates.length) return 0;
  const sql = await db();
  const subscriptions = await sql`
    SELECT s.*, u.condo_id
    FROM subscriptions s JOIN users u ON u.id = s.user_id
    WHERE s.active AND u.condo_id IS NOT NULL
      ${onlyUserId ? sql`AND s.user_id = ${onlyUserId}` : sql``}`;
  if (!subscriptions.length) return 0;
  const catalog = await getCatalog();
  let created = 0;
  for (const sub of subscriptions) {
    for (const date of dates) {
      if (weekdayOf(date) !== sub.weekday || date < sub.start_date) continue;
      const [exists] = await sql`
        SELECT 1 FROM orders WHERE subscription_id = ${sub.id} AND delivery_date = ${date}`;
      if (exists) continue;
      const { lines } = resolveItems(catalog, sub.items);
      if (!lines.length) continue;
      const id = await createOrder({
        userId: sub.user_id,
        condoId: sub.condo_id,
        lines,
        date,
        time: sub.delivery_time,
        paymentMethod: sub.payment_method,
        subscriptionId: sub.id,
      });
      if (id) created++;
    }
  }
  return created;
}
