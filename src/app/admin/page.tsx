import type { Metadata } from "next";
import Link from "next/link";
import { unstable_rethrow } from "next/navigation";
import type postgres from "postgres";
import { PAYMENT_METHODS, SUBSTITUTIONS } from "@/config";
import { refundOrder, setOrderStatus } from "@/actions/admin";
import { formatPhone, requireAdmin } from "@/lib/auth";
import { addDays, availableDates, formatDateLong, formatDateShort, formatTime, isValidDate, todayLima } from "@/lib/dates";
import { db } from "@/lib/db";
import { ORDER_STATUS, type OrderStatus } from "@/lib/order-status";
import { generateRecurringOrders, mapOrder, type Order } from "@/lib/orders";
import { formatSoles, lineTotal, percent } from "@/lib/pricing";
import { formatQty } from "@/lib/units";

export const metadata: Metadata = { title: "Admin · ComiYa" };

type AdminOrder = Order & { customer: string; phone: string; unit: string; condo: string };

function StatusForm({ order }: { order: AdminOrder }) {
  return (
    <form action={setOrderStatus} className="flex gap-1">
      <input type="hidden" name="orderId" value={order.id} />
      <select
        name="status"
        defaultValue={order.status}
        className="rounded-full border-0 bg-cream px-3 py-1.5 text-sm font-bold ring-1 ring-stone-200"
      >
        {(Object.keys(ORDER_STATUS) as OrderStatus[]).map((status) => (
          <option key={status} value={status}>
            {ORDER_STATUS[status].label}
          </option>
        ))}
      </select>
      <button type="submit" className="rounded-full bg-ink px-3 py-1.5 text-sm font-bold text-white">
        OK
      </button>
    </form>
  );
}

function RefundForm({ order }: { order: AdminOrder }) {
  return (
    <form action={refundOrder} className="flex items-center gap-1 text-sm">
      <input type="hidden" name="orderId" value={order.id} />
      <span className="font-semibold text-stone-500">Devolver S/</span>
      <input
        name="amount"
        inputMode="decimal"
        defaultValue={order.refund ? (order.refund / 100).toFixed(2) : ""}
        placeholder="0.00"
        aria-label="Monto a devolver como saldo"
        className="w-16 rounded-full border-0 bg-cream px-2 py-1 text-right font-bold ring-1 ring-stone-200"
      />
      <input
        name="note"
        defaultValue={order.refundNote}
        placeholder="motivo"
        aria-label="Motivo de la devolución"
        className="w-24 rounded-full border-0 bg-cream px-2 py-1 ring-1 ring-stone-200"
      />
      <button type="submit" className="rounded-full bg-ink px-2.5 py-1 font-bold text-white">
        OK
      </button>
    </form>
  );
}

function QuickConfirm({ order }: { order: AdminOrder }) {
  return (
    <form action={setOrderStatus}>
      <input type="hidden" name="orderId" value={order.id} />
      <input type="hidden" name="status" value="pagado" />
      <button type="submit" className="rounded-full bg-leaf px-3 py-1.5 text-sm font-bold text-white">
        ✓ Confirmar pago
      </button>
    </form>
  );
}

export default async function AdminPage({ searchParams }: PageProps<"/admin">) {
  await requireAdmin();
  const params = await searchParams;
  let generated = 0;
  try {
    generated = await generateRecurringOrders();
  } catch (error) {
    unstable_rethrow(error);
    console.error("No se pudieron generar los pedidos fijos", error);
  }

  const sql = await db();
  const today = todayLima();
  const dateRows = await sql`
    SELECT DISTINCT delivery_date FROM orders WHERE delivery_date >= ${addDays(today, -7)} ORDER BY delivery_date`;
  const dates = [...new Set([...dateRows.map((r) => r.delivery_date as string), ...availableDates().slice(0, 3)])].sort();
  const requested = typeof params.fecha === "string" && isValidDate(params.fecha) ? params.fecha : null;
  const date = requested ?? dates.find((d) => d >= today) ?? dates[dates.length - 1] ?? today;
  const view = params.vista === "compras" ? "compras" : "pedidos";

  const select = () => sql`
    SELECT o.*, u.name AS customer, u.phone, u.unit, c.name AS condo
    FROM orders o JOIN users u ON u.id = o.user_id JOIN condos c ON c.id = o.condo_id`;
  const toAdminOrder = (row: postgres.Row): AdminOrder => ({
    ...mapOrder(row),
    customer: row.customer,
    phone: row.phone,
    unit: row.unit,
    condo: row.condo,
  });
  const [dayRows, reportedRows] = await Promise.all([
    sql`${select()} WHERE o.delivery_date = ${date} ORDER BY c.name, o.delivery_time, o.id`,
    sql`${select()} WHERE o.status = 'pago_reportado' ORDER BY o.delivery_date, o.id`,
  ]);
  const orders = dayRows.map(toAdminOrder);
  const reported = reportedRows.map(toAdminOrder);
  const active = orders.filter((o) => o.status !== "cancelado");
  const paid = active.filter((o) => o.status === "pagado" || o.status === "entregado");

  const byCondo = new Map<string, AdminOrder[]>();
  for (const order of orders) byCondo.set(order.condo, [...(byCondo.get(order.condo) ?? []), order]);

  const shopping = new Map<string, { name: string; emoji: string; unit: string; qty: number; cost: number; orders: number }>();
  for (const order of active) {
    for (const item of order.items) {
      const entry = shopping.get(item.id) ?? { name: item.name, emoji: item.emoji, unit: item.unit, qty: 0, cost: 0, orders: 0 };
      entry.qty += item.qty;
      entry.cost += lineTotal(item.price, item.qty);
      entry.orders += 1;
      shopping.set(item.id, entry);
    }
  }

  return (
    <div className="space-y-5">
      {generated > 0 && (
        <p className="rounded-2xl bg-leaf-soft p-3 text-sm font-bold text-leaf-dark">
          🔁 Se generaron {generated} pedidos fijos de esta semana.
        </p>
      )}

      {reported.length > 0 && (
        <section className="rounded-3xl bg-white p-4 ring-2 ring-sky-300">
          <h2 className="font-extrabold">💳 Pagos por verificar ({reported.length})</h2>
          <p className="text-sm text-stone-500">Revisa en tu Yape / Plin que el número de operación y el monto coincidan.</p>
          <ul className="mt-2 divide-y divide-stone-100">
            {reported.map((order) => (
              <li key={order.id} className="flex flex-wrap items-center justify-between gap-2 py-2">
                <span className="text-sm">
                  <strong>#{order.id}</strong> {order.customer} · {PAYMENT_METHODS[order.paymentMethod]?.label}{" "}
                  <strong>{formatSoles(order.total)}</strong> · Op. <strong>{order.paymentRef}</strong> ·{" "}
                  {formatDateShort(order.deliveryDate).day} {formatDateShort(order.deliveryDate).num}
                </span>
                <QuickConfirm order={order} />
              </li>
            ))}
          </ul>
        </section>
      )}

      <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4">
        {dates.map((d) => {
          const short = formatDateShort(d);
          return (
            <Link
              key={d}
              href={`/admin?fecha=${d}&vista=${view}`}
              className={`flex w-16 shrink-0 flex-col items-center rounded-2xl py-2 font-bold ring-1 ${
                d === date ? "bg-leaf text-white ring-leaf" : "bg-white ring-stone-200"
              } ${d < today ? "opacity-60" : ""}`}
            >
              <span className="text-xs uppercase">{short.day}</span>
              <span className="text-xl leading-none font-black">{short.num}</span>
              <span className="text-xs">{short.month}</span>
            </Link>
          );
        })}
      </div>

      <div className="grid grid-cols-3 gap-2">
        <div className="rounded-2xl bg-white p-3 ring-1 ring-stone-200">
          <p className="text-xs font-bold text-stone-500">Pedidos</p>
          <p className="text-2xl font-black">{active.length}</p>
        </div>
        <div className="rounded-2xl bg-white p-3 ring-1 ring-stone-200">
          <p className="text-xs font-bold text-stone-500">Pagados</p>
          <p className="text-2xl font-black">{paid.length}</p>
        </div>
        <div className="rounded-2xl bg-white p-3 ring-1 ring-stone-200">
          <p className="text-xs font-bold text-stone-500">Cobrado</p>
          <p className="text-2xl font-black">{formatSoles(paid.reduce((s, o) => s + o.total, 0))}</p>
        </div>
      </div>

      <div className="flex items-center justify-between gap-2">
        <h2 className="text-xl font-extrabold first-letter:uppercase">{formatDateLong(date)}</h2>
        <div className="flex gap-1 rounded-full bg-white p-1 text-sm font-bold ring-1 ring-stone-200">
          <Link href={`/admin?fecha=${date}`} className={`rounded-full px-3 py-1.5 ${view === "pedidos" ? "bg-leaf text-white" : ""}`}>
            Reparto
          </Link>
          <Link href={`/admin?fecha=${date}&vista=compras`} className={`rounded-full px-3 py-1.5 ${view === "compras" ? "bg-leaf text-white" : ""}`}>
            Lista de compras
          </Link>
        </div>
      </div>

      {view === "compras" ? (
        <section className="rounded-3xl bg-white p-4 ring-1 ring-stone-200">
          <p className="text-sm text-stone-500">Todo lo que hay que comprar en el mercado para este día (pedidos no cancelados).</p>
          <table className="mt-3 w-full text-sm">
            <thead>
              <tr className="text-left text-stone-500">
                <th className="py-1">Producto</th>
                <th className="py-1">Cantidad</th>
                <th className="py-1 text-right">Pedidos</th>
                <th className="py-1 text-right">Vendido</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {[...shopping.values()]
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((item) => (
                  <tr key={item.name}>
                    <td className="py-2 font-bold">
                      {item.emoji} {item.name}
                    </td>
                    <td className="py-2 font-black">{formatQty(item.qty, item.unit)}</td>
                    <td className="py-2 text-right">{item.orders}</td>
                    <td className="py-2 text-right">{formatSoles(item.cost)}</td>
                  </tr>
                ))}
            </tbody>
          </table>
          {shopping.size === 0 && <p className="py-4 text-center text-stone-500">Nada que comprar todavía.</p>}
        </section>
      ) : orders.length === 0 ? (
        <p className="rounded-3xl bg-white p-6 text-center text-stone-500 ring-1 ring-stone-200">Sin pedidos para este día.</p>
      ) : (
        [...byCondo.entries()].map(([condo, list]) => (
          <section key={condo} className="space-y-2">
            <h3 className="font-extrabold">
              🏢 {condo}{" "}
              <span className="text-sm font-semibold text-stone-500">
                · {new Set(list.filter((o) => o.status !== "cancelado").map((o) => o.userId)).size} hogares
              </span>
            </h3>
            {list.map((order) => (
              <div
                key={order.id}
                className={`rounded-2xl bg-white p-4 ring-1 ring-stone-200 ${order.status === "cancelado" ? "opacity-50" : ""}`}
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="font-extrabold">
                      {formatTime(order.deliveryTime)} · {order.customer} · {order.unit}
                    </p>
                    <p className="text-sm text-stone-500">
                      #{order.id} ·{" "}
                      <a href={`https://wa.me/51${order.phone}`} target="_blank" rel="noreferrer" className="font-bold text-leaf">
                        {formatPhone(order.phone)}
                      </a>{" "}
                      · {PAYMENT_METHODS[order.paymentMethod]?.label}
                      {order.paymentRef ? ` op. ${order.paymentRef}` : ""} · −{percent(order.discount)}
                      {order.subscriptionId ? " · 🔁 fijo" : ""}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${ORDER_STATUS[order.status].className}`}>
                      {ORDER_STATUS[order.status].label}
                    </span>
                    <StatusForm order={order} />
                  </div>
                </div>
                <p className="mt-2 text-sm">
                  {order.items.map((item) => `${item.emoji} ${item.name} ${formatQty(item.qty, item.unit)}`).join(" · ")}
                </p>
                {order.notes && <p className="mt-1 text-sm font-semibold text-amber-800">📝 {order.notes}</p>}
                <p className="mt-1 text-sm">
                  Si falta algo: <strong>{SUBSTITUTIONS[order.substitution]?.label ?? "—"}</strong>
                </p>
                <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
                  <p className="text-sm font-black">Total {formatSoles(order.total)}</p>
                  <RefundForm order={order} />
                </div>
              </div>
            ))}
          </section>
        ))
      )}
    </div>
  );
}
