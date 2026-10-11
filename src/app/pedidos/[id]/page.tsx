import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BRAND, PAYMENT_METHODS } from "@/config";
import { cancelOrder } from "@/actions/orders";
import { ClearCart } from "./clear-cart";
import { PaymentForm } from "./payment-form";
import { GroupProgress } from "@/components/group-progress";
import { InviteButton } from "@/components/invite-button";
import { ProductPhoto } from "@/components/product-photo";
import { requireUser } from "@/lib/auth";
import { formatCutoff, formatDateLong, formatTime, isOpenForOrders } from "@/lib/dates";
import { db } from "@/lib/db";
import { ORDER_STATUS } from "@/lib/order-status";
import { creditEarned, finalDiscountFor, mapOrder, neighborCounts } from "@/lib/orders";
import { formatSoles, lineTotal, percent } from "@/lib/pricing";
import { formatQty } from "@/lib/units";

export const metadata: Metadata = { title: "Pedido · ComiYa" };

export default async function OrderPage({ params, searchParams }: PageProps<"/pedidos/[id]">) {
  const { id } = await params;
  const { nuevo } = await searchParams;
  const user = await requireUser(`/pedidos/${id}`);
  const orderId = Number(id);
  if (!Number.isInteger(orderId)) notFound();

  const sql = await db();
  const [row] = await sql`SELECT * FROM orders WHERE id = ${orderId} AND user_id = ${user.id}`;
  if (!row) notFound();
  const order = mapOrder(row);

  const status = ORDER_STATUS[order.status];
  const method = PAYMENT_METHODS[order.paymentMethod];
  const open = isOpenForOrders(order.deliveryDate);
  const neighbors = (await neighborCounts(order.condoId, [order.deliveryDate]))[order.deliveryDate].count;
  const finalDiscount = await finalDiscountFor(order);
  const earned = finalDiscount ? creditEarned(order, finalDiscount) : 0;
  const waitingPayment = order.status === "pendiente_pago" || order.status === "pago_reportado";

  return (
    <div className="mx-auto max-w-2xl space-y-4 px-4 pt-6">
      {nuevo && <ClearCart />}
      <Link href="/pedidos" className="text-sm font-bold text-leaf">← Mis pedidos</Link>

      {nuevo && (
        <div className="rounded-3xl bg-leaf p-5 text-white">
          <p className="text-3xl">🎉</p>
          <p className="mt-1 text-2xl font-black">¡Pedido recibido!</p>
          <p className="text-white/85">Solo falta el pago para que lo compremos fresquito en el mercado.</p>
        </div>
      )}

      <section className="rounded-3xl bg-white p-4 ring-1 ring-stone-200">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-bold text-stone-500">Pedido #{order.id}</p>
            <p className="text-xl font-black first-letter:uppercase">{formatDateLong(order.deliveryDate)}</p>
            <p className="font-semibold">a las {formatTime(order.deliveryTime)}</p>
          </div>
          <span className={`rounded-full px-3 py-1 text-sm font-bold ${status.className}`}>{status.label}</span>
        </div>
        {order.subscriptionId && <p className="mt-2 text-sm font-semibold text-leaf">🔁 Pedido fijo semanal</p>}
        {user.condo && (
          <p className="mt-1 text-sm text-stone-500">
            Entrega en {user.condo.name}, {user.unit}
          </p>
        )}
      </section>

      {waitingPayment && (
        <section className="rounded-3xl bg-white p-4 ring-2 ring-sun">
          <h2 className="text-lg font-extrabold">
            {order.status === "pendiente_pago" ? `Paga ${formatSoles(order.total)} con ${method.label}` : "Pago en revisión"}
          </h2>
          {order.status === "pendiente_pago" ? (
            <>
              <ol className="mt-2 space-y-1 text-stone-700">
                <li>1. Abre {method.label} y escanea el QR (o paga al número).</li>
                <li>2. Paga exactamente <strong>{formatSoles(order.total)}</strong>.</li>
                <li>3. Escribe abajo el número de operación.</li>
              </ol>
              <div className="mt-4 flex flex-col items-center gap-3 rounded-2xl p-4" style={{ background: `${method.color}14` }}>
                <Image src={method.qr} alt={`QR de ${method.label}`} width={208} height={208} className="rounded-xl bg-white p-2" unoptimized />
                <p className="text-center">
                  <span className="block text-sm text-stone-500">o paga al número</span>
                  <span className="text-2xl font-black tracking-wide">{method.phone}</span>
                  <span className="block text-sm text-stone-500">a nombre de {method.holder}</span>
                </p>
              </div>
              {open && <p className="mt-3 text-sm text-stone-500">Paga antes del {formatCutoff(order.deliveryDate)} para asegurar tu entrega.</p>}
            </>
          ) : (
            <p className="mt-1 text-stone-600">
              Recibimos tu número de operación <strong>{order.paymentRef}</strong>. Te confirmamos en breve.
            </p>
          )}
          <PaymentForm orderId={order.id} current={order.paymentRef ?? ""} />
        </section>
      )}

      {order.status === "pagado" && (
        <p className="rounded-3xl bg-leaf-soft p-4 font-bold text-leaf-dark">
          ✅ Pago confirmado. Te lo llevamos el {formatDateLong(order.deliveryDate)} a las {formatTime(order.deliveryTime)}.
        </p>
      )}

      {user.condo && order.status !== "cancelado" && open && (
        <div className="space-y-3">
          <GroupProgress neighbors={neighbors} condo={user.condo.name} when={formatDateLong(order.deliveryDate)} />
          <p className="text-sm text-stone-600">
            Si al cierre se suman más vecinos y baja el precio, te devolvemos la diferencia como saldo.
          </p>
          <InviteButton condo={user.condo.name} code={user.condo.code} />
        </div>
      )}

      {earned > 0 && (
        <p className="rounded-3xl bg-sun-soft p-4 font-bold text-amber-950">
          👥 Al cierre se sumaron más vecinos (precio final −{percent(finalDiscount ?? 0)}). Te devolvimos{" "}
          {formatSoles(earned)} como saldo para tu próximo pedido.
        </p>
      )}

      <section className="rounded-3xl bg-white p-4 ring-1 ring-stone-200">
        <h2 className="font-extrabold">Tu pedido</h2>
        <ul className="mt-2 divide-y divide-stone-100">
          {order.items.map((item) => (
            <li key={item.id} className="flex items-center justify-between gap-3 py-2">
              <span className="flex items-center gap-3">
                <ProductPhoto id={item.id} emoji={item.emoji} className="h-11 w-11 shrink-0 rounded-xl" sizes="44px" />
                <span>
                  {item.name} <span className="text-stone-500">· {formatQty(item.qty, item.unit)}</span>
                </span>
              </span>
              <span className="font-bold whitespace-nowrap">{formatSoles(lineTotal(item.price, item.qty))}</span>
            </li>
          ))}
        </ul>
        <dl className="mt-3 space-y-1 border-t border-stone-100 pt-3 text-sm">
          <div className="flex justify-between text-stone-500">
            <dt>En el supermercado</dt>
            <dd className="line-through">{formatSoles(order.superTotal)}</dd>
          </div>
          <div className="flex justify-between">
            <dt>Precio ComiYa (−{percent(order.discount)})</dt>
            <dd>{formatSoles(order.subtotal)}</dd>
          </div>
          {order.creditUsed > 0 && (
            <div className="flex justify-between text-leaf">
              <dt>Saldo a favor usado</dt>
              <dd>−{formatSoles(order.creditUsed)}</dd>
            </div>
          )}
          <div className="flex justify-between text-base font-black">
            <dt>Total</dt>
            <dd>{formatSoles(order.total)}</dd>
          </div>
          <p className="pt-1 font-bold text-leaf">Ahorraste {formatSoles(order.superTotal - order.total)} 🎉</p>
        </dl>
        {order.notes && <p className="mt-3 rounded-xl bg-cream p-3 text-sm">📝 {order.notes}</p>}
      </section>

      <div className="flex flex-col gap-2 sm:flex-row">
        <a
          href={`https://wa.me/${BRAND.whatsapp}?text=${encodeURIComponent(`Hola, tengo una consulta sobre mi pedido #${order.id}`)}`}
          target="_blank"
          rel="noreferrer"
          className="flex-1 rounded-full bg-white py-3 text-center font-bold ring-1 ring-stone-300"
        >
          💬 Escríbenos por WhatsApp
        </a>
        {order.status === "pendiente_pago" && open && (
          <form action={cancelOrder} className="flex-1">
            <input type="hidden" name="orderId" value={order.id} />
            <button type="submit" className="w-full rounded-full py-3 font-bold text-chili ring-1 ring-red-200">
              Cancelar este pedido
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
