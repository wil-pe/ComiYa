import type { Metadata } from "next";
import Link from "next/link";
import { unstable_rethrow } from "next/navigation";
import { PAYMENT_METHODS, type PaymentMethod } from "@/config";
import { deleteSubscription, toggleSubscription } from "@/actions/orders";
import { ReorderButton } from "@/components/reorder-button";
import { requireUser } from "@/lib/auth";
import { getCatalog } from "@/lib/catalog";
import { dayNamePlural, formatDateLong, formatTime, todayLima } from "@/lib/dates";
import { db } from "@/lib/db";
import { ORDER_STATUS } from "@/lib/order-status";
import { creditBalance, generateRecurringOrders, mapOrder, type Order } from "@/lib/orders";
import { formatSoles } from "@/lib/pricing";
import { formatQty } from "@/lib/units";

export const metadata: Metadata = { title: "Mis pedidos · ComiYa" };

function OrderRow({ order }: { order: Order }) {
  const status = ORDER_STATUS[order.status];
  return (
    <Link
      href={`/pedidos/${order.id}`}
      className="flex items-center justify-between gap-3 rounded-2xl bg-white p-4 ring-1 ring-stone-200 hover:ring-leaf"
    >
      <div className="min-w-0">
        <p className="font-extrabold first-letter:uppercase">{formatDateLong(order.deliveryDate)}</p>
        <p className="text-sm text-stone-500">
          {formatTime(order.deliveryTime)} · {order.items.length} productos · {formatSoles(order.total)}
          {order.subscriptionId ? " · 🔁" : ""}
        </p>
      </div>
      <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold ${status.className}`}>{status.label}</span>
    </Link>
  );
}

export default async function OrdersPage() {
  const user = await requireUser("/pedidos");
  try {
    await generateRecurringOrders(new Date(), user.id);
  } catch (error) {
    unstable_rethrow(error);
    console.error("No se pudieron generar los pedidos fijos", error);
  }
  const sql = await db();
  const [rows, subscriptions, credit, catalog] = await Promise.all([
    sql`SELECT * FROM orders WHERE user_id = ${user.id} ORDER BY delivery_date DESC, id DESC LIMIT 100`,
    sql`SELECT * FROM subscriptions WHERE user_id = ${user.id} ORDER BY id`,
    creditBalance(user.id),
    getCatalog(),
  ]);
  const orders = rows.map(mapOrder);
  const today = todayLima();
  const upcoming = orders
    .filter((o) => o.deliveryDate >= today && o.status !== "cancelado" && o.status !== "entregado")
    .reverse();
  const past = orders.filter((o) => !upcoming.includes(o));
  const names = new Map(catalog.map((p) => [p.id, p]));
  const toPay = upcoming.filter((o) => o.status === "pendiente_pago");
  const last = orders.find((o) => o.status !== "cancelado");

  return (
    <div className="mx-auto max-w-2xl space-y-6 px-4 pt-6">
      <div className="flex items-end justify-between gap-3">
        <h1 className="text-3xl font-black tracking-tight">Mis pedidos</h1>
        <Link href="/productos" className="rounded-full bg-leaf px-4 py-2 font-bold text-white">
          + Nuevo
        </Link>
      </div>

      {credit > 0 && (
        <p className="rounded-3xl bg-sun-soft p-4 font-bold text-amber-950">
          💰 Tienes {formatSoles(credit)} de saldo a favor. Se descuenta solo en tu próximo pedido.
        </p>
      )}

      {last && (
        <section className="flex items-center justify-between gap-3 rounded-3xl bg-white p-4 ring-1 ring-stone-200">
          <div className="min-w-0">
            <p className="font-extrabold">¿Lo mismo de siempre?</p>
            <p className="truncate text-sm text-stone-500">
              {last.items.map((item) => item.name).join(", ")}
            </p>
          </div>
          <ReorderButton items={last.items.map((item) => ({ id: item.id, qty: item.qty }))} className="shrink-0 rounded-full bg-leaf px-4 py-2.5 font-bold text-white">
            🔁 Volver a pedir
          </ReorderButton>
        </section>
      )}

      {toPay.length > 0 && (
        <p className="rounded-3xl bg-white p-4 font-bold ring-2 ring-sun">
          ⏳ {toPay.length === 1 ? "Tienes 1 pedido" : `Tienes ${toPay.length} pedidos`} por pagar. Ábrelo para ver el QR.
        </p>
      )}

      <section>
        <h2 className="text-lg font-extrabold">Próximas entregas</h2>
        <div className="mt-2 space-y-2">
          {upcoming.length ? (
            upcoming.map((order) => <OrderRow key={order.id} order={order} />)
          ) : (
            <p className="rounded-2xl bg-white p-4 text-stone-500 ring-1 ring-stone-200">
              No tienes entregas programadas. <Link href="/productos" className="font-bold text-leaf">Haz tu pedido</Link>
            </p>
          )}
        </div>
      </section>

      <section>
        <h2 className="text-lg font-extrabold">🔁 Pedidos fijos</h2>
        <p className="text-sm text-stone-500">
          Se preparan solos cada semana, 3 días antes de la entrega, y aparecen aquí para pagar.
        </p>
        <div className="mt-2 space-y-2">
          {subscriptions.length === 0 && (
            <p className="rounded-2xl bg-white p-4 text-stone-500 ring-1 ring-stone-200">
              Aún no tienes. Al confirmar un pedido marca «Repetir cada semana».
            </p>
          )}
          {subscriptions.map((sub) => (
            <div key={sub.id} className={`rounded-2xl bg-white p-4 ring-1 ring-stone-200 ${sub.active ? "" : "opacity-60"}`}>
              <p className="font-extrabold">
                Todos los {dayNamePlural(sub.weekday)} a las {formatTime(sub.delivery_time)}
                {!sub.active && <span className="ml-2 rounded-full bg-stone-200 px-2 py-0.5 text-xs">En pausa</span>}
              </p>
              <p className="mt-1 text-sm text-stone-600">
                {(sub.items as { id: string; qty: number }[])
                  .map((item) => {
                    const product = names.get(item.id);
                    return product ? `${product.name} ${formatQty(item.qty, product.unit)}` : null;
                  })
                  .filter(Boolean)
                  .join(" · ")}
              </p>
              <p className="text-sm text-stone-500">Pago con {PAYMENT_METHODS[sub.payment_method as PaymentMethod]?.label}</p>
              <div className="mt-3 flex gap-2">
                <form action={toggleSubscription}>
                  <input type="hidden" name="subscriptionId" value={sub.id} />
                  <button type="submit" className="rounded-full bg-leaf-soft px-4 py-2 text-sm font-bold text-leaf-dark">
                    {sub.active ? "Pausar" : "Reanudar"}
                  </button>
                </form>
                <form action={deleteSubscription}>
                  <input type="hidden" name="subscriptionId" value={sub.id} />
                  <button type="submit" className="rounded-full px-4 py-2 text-sm font-bold text-chili ring-1 ring-red-200">
                    Eliminar
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>
      </section>

      {past.length > 0 && (
        <section>
          <h2 className="text-lg font-extrabold">Historial</h2>
          <div className="mt-2 space-y-2">
            {past.map((order) => (
              <OrderRow key={order.id} order={order} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
