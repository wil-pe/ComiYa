"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { BASE_DISCOUNT, MIN_ORDER_CENTS, PAYMENT_METHODS, type PaymentMethod } from "@/config";
import type { FormState } from "@/actions/auth";
import { requireUser } from "@/lib/auth";
import { getCatalog } from "@/lib/catalog";
import { availableDates, isOpenForOrders, isValidSlot, weekdayOf } from "@/lib/dates";
import { db } from "@/lib/db";
import { createOrder, mapOrder, resolveItems } from "@/lib/orders";
import { formatSoles, totals } from "@/lib/pricing";

function isPaymentMethod(value: string): value is PaymentMethod {
  return value in PAYMENT_METHODS;
}

export async function placeOrder(_: FormState, formData: FormData): Promise<FormState> {
  const user = await requireUser("/carrito");
  if (!user.condo) return { error: "Primero indica tu condominio en Mi cuenta." };

  let requested: unknown = [];
  try {
    requested = JSON.parse(String(formData.get("items") ?? "[]"));
  } catch {}
  const date = String(formData.get("date") ?? "");
  const time = String(formData.get("time") ?? "");
  const payment = String(formData.get("payment") ?? "");
  const repeat = formData.get("repeat") === "on";
  const notes = String(formData.get("notes") ?? "").trim().slice(0, 300);

  const catalog = await getCatalog();
  const { lines, unavailable } = resolveItems(catalog, requested);
  if (unavailable.length) return { error: `Hoy no tenemos: ${unavailable.join(", ")}. Quítalos para continuar.` };
  if (!lines.length) return { error: "Tu pedido está vacío." };
  if (!availableDates().includes(date)) return { error: "Elige un día de entrega disponible." };
  if (!isValidSlot(time)) return { error: "Elige una hora de entrega válida." };
  if (!isPaymentMethod(payment)) return { error: "Elige cómo vas a pagar: Yape o Plin." };
  const { subtotal } = totals(
    lines.map(({ product, qty }) => ({ superPrice: product.superCents, qty })),
    BASE_DISCOUNT,
  );
  if (subtotal < MIN_ORDER_CENTS) return { error: `El pedido mínimo es de ${formatSoles(MIN_ORDER_CENTS)}.` };

  const sql = await db();
  let subscriptionId: number | null = null;
  if (repeat) {
    const items = lines.map(({ product, qty }) => ({ id: product.id, qty }));
    const [sub] = await sql`
      INSERT INTO subscriptions (user_id, weekday, delivery_time, start_date, items, payment_method)
      VALUES (${user.id}, ${weekdayOf(date)}, ${time}, ${date}, ${sql.json(items)}, ${payment})
      RETURNING id`;
    subscriptionId = sub.id;
  }

  const orderId = await createOrder({
    userId: user.id,
    condoId: user.condo.id,
    lines,
    date,
    time,
    paymentMethod: payment,
    subscriptionId,
    notes,
  });
  if (!orderId) {
    if (subscriptionId) await sql`DELETE FROM subscriptions WHERE id = ${subscriptionId}`;
    return { error: "No pudimos guardar tu pedido. Inténtalo otra vez." };
  }

  revalidatePath("/pedidos");
  redirect(`/pedidos/${orderId}?nuevo=1`);
}

async function ownOrder(userId: number, orderId: number) {
  const sql = await db();
  const [row] = await sql`SELECT * FROM orders WHERE id = ${orderId} AND user_id = ${userId}`;
  return row ? mapOrder(row) : null;
}

export async function reportPayment(_: FormState, formData: FormData): Promise<FormState> {
  const orderId = Number(formData.get("orderId"));
  const user = await requireUser(`/pedidos/${orderId}`);
  const order = await ownOrder(user.id, orderId);
  if (!order) return { error: "No encontramos ese pedido." };
  const reference = String(formData.get("reference") ?? "").replace(/\s/g, "");
  if (!/^\d{4,12}$/.test(reference)) {
    return { error: "Escribe el número de operación que aparece en tu Yape o Plin (solo números)." };
  }
  if (order.status !== "pendiente_pago" && order.status !== "pago_reportado") {
    return { error: "Este pedido ya no está esperando pago." };
  }
  const sql = await db();
  await sql`
    UPDATE orders SET payment_ref = ${reference}, status = 'pago_reportado', updated_at = now()
    WHERE id = ${order.id}`;
  revalidatePath(`/pedidos/${order.id}`);
  return { ok: "¡Gracias! Estamos verificando tu pago." };
}

export async function cancelOrder(formData: FormData) {
  const orderId = Number(formData.get("orderId"));
  const user = await requireUser(`/pedidos/${orderId}`);
  const order = await ownOrder(user.id, orderId);
  if (order && order.status === "pendiente_pago" && isOpenForOrders(order.deliveryDate)) {
    const sql = await db();
    await sql`UPDATE orders SET status = 'cancelado', updated_at = now() WHERE id = ${order.id}`;
  }
  revalidatePath("/pedidos");
  revalidatePath(`/pedidos/${orderId}`);
}

export async function toggleSubscription(formData: FormData) {
  const user = await requireUser("/pedidos");
  const id = Number(formData.get("subscriptionId"));
  const sql = await db();
  await sql`UPDATE subscriptions SET active = NOT active WHERE id = ${id} AND user_id = ${user.id}`;
  revalidatePath("/pedidos");
}

export async function deleteSubscription(formData: FormData) {
  const user = await requireUser("/pedidos");
  const id = Number(formData.get("subscriptionId"));
  const sql = await db();
  await sql`DELETE FROM subscriptions WHERE id = ${id} AND user_id = ${user.id}`;
  revalidatePath("/pedidos");
}
