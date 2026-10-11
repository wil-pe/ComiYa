"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { BASE_DISCOUNT, GROUP_TIERS, MIN_ORDER_CENTS, PAYMENT_METHODS, type PaymentMethod } from "@/config";
import type { Product } from "@/data/products";
import { placeOrder } from "@/actions/orders";
import { cartLines } from "@/components/cart-bar";
import { useCart } from "@/components/cart-store";
import { GroupProgress } from "@/components/group-progress";
import { QtyControl } from "@/components/qty-control";
import { dayNamePlural, formatTime, slotOptions, weekdayOf } from "@/lib/dates";
import { formatSoles, lineTotal, percent, priceAt, tierFor, totals } from "@/lib/pricing";

type DateOption = {
  date: string;
  day: string;
  num: number;
  month: string;
  cutoff: string;
  neighbors: number;
};

export function Checkout({
  products,
  user,
  credit,
  dates,
}: {
  products: Product[];
  user: { name: string; condo: string | null; unit: string } | null;
  credit: number;
  dates: DateOption[];
}) {
  const cart = useCart();
  const [date, setDate] = useState(dates[0]?.date ?? "");
  const [time, setTime] = useState("08:00");
  const [repeat, setRepeat] = useState(false);
  const [payment, setPayment] = useState<PaymentMethod>("yape");
  const [notes, setNotes] = useState("");
  const [state, action, pending] = useActionState(placeOrder, undefined);

  const lines = cartLines(products, cart);
  const unavailable = products.filter((p) => !p.available && (cart[p.id] ?? 0) > 0);
  const selected = dates.find((d) => d.date === date) ?? dates[0];
  const discount = user?.condo && selected ? tierFor(selected.neighbors).discount : BASE_DISCOUNT;
  const { superTotal, subtotal, savings } = totals(lines, discount);
  const baseSubtotal = totals(lines, BASE_DISCOUNT).subtotal;
  const creditUsed = Math.min(credit, subtotal);
  const total = subtotal - creditUsed;
  const belowMinimum = baseSubtotal < MIN_ORDER_CENTS;

  if (!lines.length) {
    return (
      <div className="mt-8 rounded-3xl bg-white p-8 text-center ring-1 ring-stone-200">
        <p className="text-5xl">🧺</p>
        <p className="mt-3 text-lg font-bold">Tu pedido está vacío</p>
        <p className="text-stone-500">Agrega pollo, verduras, frutas… lo que necesites para la semana.</p>
        <Link href="/productos" className="mt-5 inline-block rounded-full bg-leaf px-6 py-3 font-bold text-white">
          Ver productos
        </Link>
      </div>
    );
  }

  return (
    <div className="mt-4 space-y-5">
      {/* Productos */}
      <section className="rounded-3xl bg-white p-4 ring-1 ring-stone-200">
        <ul className="divide-y divide-stone-100">
          {lines.map(({ product, qty }) => (
            <li key={product.id} className="flex items-center gap-3 py-3">
              <span className="text-3xl" aria-hidden>{product.emoji}</span>
              <div className="min-w-0 flex-1">
                <p className="leading-tight font-bold">{product.name}</p>
                <p className="text-sm">
                  <span className="text-stone-400 line-through">{formatSoles(lineTotal(product.superCents, qty))}</span>{" "}
                  <strong className="text-leaf">{formatSoles(lineTotal(priceAt(product.superCents, discount), qty))}</strong>
                </p>
              </div>
              <div className="w-36 shrink-0">
                <QtyControl product={product} size="sm" />
              </div>
            </li>
          ))}
        </ul>
        {unavailable.length > 0 && (
          <p className="mt-2 rounded-xl bg-red-50 p-3 text-sm text-red-700">
            Hoy no tenemos {unavailable.map((p) => p.name).join(", ")}; no se incluirá en tu pedido.
          </p>
        )}
        <Link href="/productos" className="mt-2 inline-block text-sm font-bold text-leaf">
          + Agregar más productos
        </Link>
      </section>

      {/* Entrega */}
      <section className="rounded-3xl bg-white p-4 ring-1 ring-stone-200">
        <h2 className="text-lg font-extrabold">¿Cuándo te lo llevamos?</h2>
        {dates.length === 0 ? (
          <p className="mt-2 text-stone-500">No hay fechas disponibles por ahora.</p>
        ) : (
          <>
            <div className="no-scrollbar -mx-4 mt-3 flex gap-2 overflow-x-auto px-4 pb-1">
              {dates.map((d) => (
                <button
                  key={d.date}
                  type="button"
                  onClick={() => setDate(d.date)}
                  className={`flex w-16 shrink-0 flex-col items-center rounded-2xl py-2 font-bold ring-1 transition ${
                    d.date === date ? "bg-leaf text-white ring-leaf" : "bg-cream ring-stone-200"
                  }`}
                >
                  <span className="text-xs uppercase">{d.day}</span>
                  <span className="text-2xl leading-none font-black">{d.num}</span>
                  <span className="text-xs">{d.month}</span>
                </button>
              ))}
            </div>
            {selected && <p className="mt-2 text-sm text-stone-500">Puedes pedir para este día hasta el {selected.cutoff}.</p>}

            <label className="mt-4 block text-sm font-bold" htmlFor="time">
              Hora de entrega
            </label>
            <select
              id="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="mt-1 w-full rounded-2xl border-0 bg-cream px-4 py-3 text-lg font-bold ring-1 ring-stone-200"
            >
              {slotOptions().map((slot) => (
                <option key={slot} value={slot}>
                  {formatTime(slot)}
                </option>
              ))}
            </select>

            <label className="mt-4 flex cursor-pointer items-center gap-3 rounded-2xl bg-leaf-soft p-4">
              <input
                type="checkbox"
                checked={repeat}
                onChange={(e) => setRepeat(e.target.checked)}
                className="h-6 w-6 accent-leaf"
              />
              <span>
                <span className="block font-extrabold text-leaf-dark">
                  🔁 Repetir todos los {selected ? dayNamePlural(weekdayOf(selected.date)) : "días"} a las {formatTime(time)}
                </span>
                <span className="block text-sm text-leaf-dark/80">
                  Te preparamos este mismo pedido cada semana. Lo pausas cuando quieras.
                </span>
              </span>
            </label>
          </>
        )}
      </section>

      {/* Compra en grupo */}
      {user?.condo && selected ? (
        <GroupProgress
          neighbors={selected.neighbors}
          condo={user.condo}
          when={`${selected.day} ${selected.num}`}
        />
      ) : (
        <p className="rounded-3xl bg-sun-soft p-4 text-sm font-semibold text-amber-950">
          👥 Compra en grupo: cuando tus vecinos también piden para el mismo día, el precio baja hasta −{percent(GROUP_TIERS[GROUP_TIERS.length - 1].discount)}.
        </p>
      )}

      {/* Pago */}
      <section className="rounded-3xl bg-white p-4 ring-1 ring-stone-200">
        <h2 className="text-lg font-extrabold">¿Cómo vas a pagar?</h2>
        <div className="mt-3 grid grid-cols-2 gap-2">
          {(Object.keys(PAYMENT_METHODS) as PaymentMethod[]).map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => setPayment(key)}
              className={`rounded-2xl py-3 text-lg font-black ring-2 transition ${
                payment === key ? "text-white" : "bg-white ring-stone-200"
              }`}
              style={payment === key ? { background: PAYMENT_METHODS[key].color, boxShadow: "none" } : undefined}
            >
              {PAYMENT_METHODS[key].label}
            </button>
          ))}
        </div>
        <p className="mt-2 text-sm text-stone-500">Al confirmar te mostramos el QR para pagar.</p>

        <label className="mt-4 block text-sm font-bold" htmlFor="notes">
          Indicaciones (opcional)
        </label>
        <textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          maxLength={300}
          rows={2}
          placeholder="Ej.: pollo trozado en 8, paltas para comer el mismo día"
          className="mt-1 w-full rounded-2xl border-0 bg-cream px-4 py-3 ring-1 ring-stone-200"
        />
      </section>

      {/* Resumen */}
      <section className="rounded-3xl bg-white p-4 ring-1 ring-stone-200">
        <dl className="space-y-1.5">
          <div className="flex justify-between text-stone-500">
            <dt>En el supermercado</dt>
            <dd className="line-through">{formatSoles(superTotal)}</dd>
          </div>
          <div className="flex justify-between">
            <dt>Precio ComiYa (−{percent(discount)})</dt>
            <dd className="font-bold">{formatSoles(subtotal)}</dd>
          </div>
          {creditUsed > 0 && (
            <div className="flex justify-between text-leaf">
              <dt>Tu saldo a favor</dt>
              <dd className="font-bold">−{formatSoles(creditUsed)}</dd>
            </div>
          )}
          <div className="flex justify-between">
            <dt>Entrega en tu condominio</dt>
            <dd className="font-bold text-leaf">Gratis</dd>
          </div>
          <div className="flex justify-between border-t border-stone-100 pt-2 text-xl font-black">
            <dt>Total</dt>
            <dd>{formatSoles(total)}</dd>
          </div>
        </dl>
        <p className="mt-3 rounded-2xl bg-sun-soft px-4 py-2 text-center font-extrabold text-amber-950">
          🎉 Ahorras {formatSoles(savings + creditUsed)} frente al supermercado
        </p>

        {belowMinimum && (
          <p className="mt-3 text-center text-sm font-semibold text-chili">
            El pedido mínimo es {formatSoles(MIN_ORDER_CENTS)}. Te faltan {formatSoles(MIN_ORDER_CENTS - baseSubtotal)}.
          </p>
        )}

        {!user ? (
          <div className="mt-4 space-y-2">
            <p className="text-center text-sm text-stone-500">Para confirmar tu pedido, ingresa a tu cuenta.</p>
            <Link href="/registro?next=/carrito" className="block rounded-full bg-leaf py-3.5 text-center text-lg font-extrabold text-white">
              Crear mi cuenta
            </Link>
            <Link href="/ingresar?next=/carrito" className="block rounded-full bg-white py-3 text-center font-bold ring-1 ring-stone-300">
              Ya tengo cuenta
            </Link>
          </div>
        ) : !user.condo ? (
          <Link href="/cuenta" className="mt-4 block rounded-full bg-leaf py-3.5 text-center text-lg font-extrabold text-white">
            Indica tu condominio para continuar
          </Link>
        ) : (
          <form action={action} className="mt-4">
            <input
              type="hidden"
              name="items"
              value={JSON.stringify(lines.map(({ product, qty }) => ({ id: product.id, qty })))}
            />
            <input type="hidden" name="date" value={date} />
            <input type="hidden" name="time" value={time} />
            <input type="hidden" name="payment" value={payment} />
            <input type="hidden" name="notes" value={notes} />
            {repeat && <input type="hidden" name="repeat" value="on" />}
            {state?.error && <p className="mb-3 rounded-xl bg-red-50 p-3 text-sm font-semibold text-red-700">{state.error}</p>}
            <button
              type="submit"
              disabled={pending || belowMinimum || !selected}
              className="w-full rounded-full bg-leaf py-4 text-lg font-extrabold text-white shadow-md shadow-leaf/20 transition hover:bg-leaf-dark disabled:opacity-50"
            >
              {pending ? "Guardando…" : `Confirmar pedido · ${formatSoles(total)}`}
            </button>
            <p className="mt-2 text-center text-xs text-stone-500">
              Entrega para {user.name} · {user.condo}, {user.unit}
            </p>
          </form>
        )}
      </section>
    </div>
  );
}
