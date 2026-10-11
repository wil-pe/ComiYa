import Link from "next/link";
import { BASE_DISCOUNT, DELIVERY, GROUP_TIERS, MIN_ORDER_CENTS, PAYMENT_METHODS } from "@/config";
import { PRICES_OBSERVED_AT } from "@/data/products";
import { getCatalog } from "@/lib/catalog";
import { availableDates, formatCutoff, formatDateLong, formatTime } from "@/lib/dates";
import { formatSoles, lineTotal, percent, priceAt } from "@/lib/pricing";
import { formatQty } from "@/lib/units";

// Canasta típica de una familia para una semana.
const BASKET: [string, number][] = [
  ["pollo-entero", 2],
  ["pechuga-pollo", 1],
  ["carne-molida", 1],
  ["bonito", 1],
  ["huevos", 1],
  ["papa-amarilla", 2],
  ["tomate", 1],
  ["cebolla-roja", 1],
  ["lechuga", 1],
  ["limon", 1],
  ["culantro", 1],
  ["palta", 1],
  ["platano", 1],
  ["mandarina", 2],
];

export default async function Home() {
  const catalog = await getCatalog();
  const byId = new Map(catalog.map((p) => [p.id, p]));
  const basket = BASKET.flatMap(([id, qty]) => {
    const product = byId.get(id);
    return product ? [{ product, qty }] : [];
  });
  const superTotal = basket.reduce((sum, l) => sum + lineTotal(l.product.superCents, l.qty), 0);
  const ourTotal = basket.reduce((sum, l) => sum + lineTotal(priceAt(l.product.superCents), l.qty), 0);
  const weeklySavings = superTotal - ourTotal;
  const nextDate = availableDates()[0];

  return (
    <div>
      {/* Hero */}
      <section className="mx-auto max-w-5xl px-4 pt-8 pb-10 sm:pt-14">
        <div className="grid items-center gap-8 md:grid-cols-[1.15fr_1fr]">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full bg-sun-soft px-3 py-1 text-sm font-bold text-amber-900">
              🏢 Para condominios de Lima · piloto
            </p>
            <h1 className="mt-4 text-4xl leading-[1.05] font-black tracking-tight sm:text-5xl">
              El mercado, en tu puerta.
              <span className="block text-leaf">{percent(BASE_DISCOUNT)} más barato que el supermercado.</span>
            </h1>
            <p className="mt-4 text-lg text-stone-600">
              Pollo, carne, pescado, verduras, frutas y hierbas frescas del mercado. Tú eliges el día y la hora,
              nosotros hacemos las compras y te las llevamos a tu depa.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/productos"
                className="rounded-full bg-leaf px-6 py-3.5 text-center text-lg font-extrabold text-white shadow-md shadow-leaf/20 hover:bg-leaf-dark"
              >
                Ver productos y precios
              </Link>
              <Link
                href="/registro"
                className="rounded-full bg-white px-6 py-3.5 text-center text-lg font-bold ring-1 ring-stone-300 hover:ring-stone-400"
              >
                Crear mi cuenta
              </Link>
            </div>
            <ul className="mt-6 flex flex-wrap gap-2 text-sm font-semibold text-stone-700">
              <li className="rounded-full bg-white px-3 py-1.5 ring-1 ring-stone-200">🚚 Entrega gratis</li>
              <li className="rounded-full bg-white px-3 py-1.5 ring-1 ring-stone-200">📱 Pagas con Yape o Plin</li>
              <li className="rounded-full bg-white px-3 py-1.5 ring-1 ring-stone-200">🔁 Pedido fijo cada semana</li>
            </ul>
          </div>

          {/* Comparación de canasta */}
          <div className="rounded-[2rem] bg-white p-5 shadow-xl shadow-stone-300/40 ring-1 ring-stone-200">
            <p className="text-sm font-bold text-stone-500">Canasta familiar de la semana</p>
            <div className="mt-3 space-y-2">
              <div className="flex items-baseline justify-between">
                <span className="font-semibold text-stone-600">En el supermercado</span>
                <span className="text-xl font-bold whitespace-nowrap text-chili line-through decoration-2">{formatSoles(superTotal)}</span>
              </div>
              <div className="flex items-baseline justify-between">
                <span className="font-semibold">Con ComiYa, en tu puerta</span>
                <span className="text-3xl font-black whitespace-nowrap text-leaf">{formatSoles(ourTotal)}</span>
              </div>
            </div>
            <div className="mt-4 rounded-2xl bg-sun-soft p-4 text-center">
              <p className="text-sm font-bold text-amber-900">Ahorras cada semana</p>
              <p className="text-4xl font-black text-ink">{formatSoles(weeklySavings)}</p>
              <p className="text-sm font-semibold text-amber-900">
                ≈ {formatSoles(weeklySavings * 4)} al mes, sin hacer colas ni cargar bolsas
              </p>
            </div>
            <details className="mt-3 text-sm">
              <summary className="cursor-pointer font-semibold text-stone-500">¿Qué lleva la canasta?</summary>
              <ul className="mt-2 space-y-1">
                {basket.map(({ product, qty }) => (
                  <li key={product.id} className="flex justify-between gap-2">
                    <span>
                      {product.emoji} {product.name} · {formatQty(qty, product.unit)}
                    </span>
                    <span className="whitespace-nowrap">
                      <span className="text-stone-400 line-through">{formatSoles(lineTotal(product.superCents, qty))}</span>{" "}
                      <strong className="text-leaf">{formatSoles(lineTotal(priceAt(product.superCents), qty))}</strong>
                    </span>
                  </li>
                ))}
              </ul>
            </details>
            <p className="mt-3 text-xs text-stone-400">
              Precios de supermercado tomados de Tottus el {PRICES_OBSERVED_AT}.
            </p>
          </div>
        </div>
      </section>

      {/* Cómo funciona */}
      <section className="bg-white py-12">
        <div className="mx-auto max-w-5xl px-4">
          <h2 className="text-3xl font-black tracking-tight">Así de fácil</h2>
          <ol className="mt-6 grid gap-4 sm:grid-cols-3">
            {[
              ["🛒", "Elige tus productos", "Los de siempre: pollo, carne, pescado, verduras, frutas y hierbas. Ves el precio del súper y el nuestro."],
              ["📅", "Elige día y hora", "Por ejemplo: todos los martes a las 8:15 a. m. Lo programas una vez y llega solo cada semana."],
              ["📲", "Paga con Yape o Plin", "Escaneas el QR, pagas y listo. Te lo dejamos en tu condominio, fresquito del mercado."],
            ].map(([emoji, title, text], i) => (
              <li key={title} className="rounded-3xl bg-cream p-5">
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-2xl shadow-sm">{emoji}</span>
                  <span className="text-sm font-black text-leaf">PASO {i + 1}</span>
                </div>
                <h3 className="mt-3 text-xl font-extrabold">{title}</h3>
                <p className="mt-1 text-stone-600">{text}</p>
              </li>
            ))}
          </ol>
          {nextDate && (
            <p className="mt-6 rounded-2xl bg-leaf-soft px-4 py-3 font-semibold text-leaf-dark">
              📦 Próxima entrega disponible: <strong>{formatDateLong(nextDate)}</strong> · pide hasta el{" "}
              {formatCutoff(nextDate)}.
            </p>
          )}
        </div>
      </section>

      {/* Compra en grupo */}
      <section className="mx-auto max-w-5xl px-4 py-12">
        <div className="grid gap-8 md:grid-cols-2 md:items-center">
          <div>
            <p className="text-sm font-black tracking-wide text-leaf uppercase">Compra en grupo</p>
            <h2 className="mt-1 text-3xl font-black tracking-tight">Entre vecinos, todavía más barato</h2>
            <p className="mt-3 text-lg text-stone-600">
              Compramos al por mayor para todo tu condominio. Cuantos más vecinos piden para el mismo día, más baja
              el precio <strong>para todos</strong>.
            </p>
            <p className="mt-3 text-stone-600">
              Y nunca pierdes: si después de tu pedido se suman más vecinos, te devolvemos la diferencia como saldo
              para tu próxima compra.
            </p>
          </div>
          <div className="space-y-2">
            {GROUP_TIERS.map((tier, i) => (
              <div
                key={tier.minNeighbors}
                className="flex items-center justify-between rounded-2xl bg-white px-4 py-3 ring-1 ring-stone-200"
                style={{ marginLeft: `${i * 4}%` }}
              >
                <span className="font-bold">
                  {"🏠".repeat(Math.min(i + 1, 4))}{" "}
                  {tier.minNeighbors === 1 ? "Desde 1 vecino" : `${tier.minNeighbors}+ vecinos`}
                </span>
                <span className="rounded-full bg-leaf px-3 py-1 font-black text-white">−{percent(tier.discount)}</span>
              </div>
            ))}
            <p className="pt-1 text-sm text-stone-500">Descuento frente al precio del supermercado, en todos los productos.</p>
          </div>
        </div>
      </section>

      {/* Pagos y confianza */}
      <section className="bg-leaf py-12 text-white">
        <div className="mx-auto grid max-w-5xl gap-6 px-4 sm:grid-cols-3">
          <div>
            <p className="text-3xl">🥬</p>
            <h3 className="mt-2 text-xl font-extrabold">Fresco del mercado</h3>
            <p className="mt-1 text-white/80">Compramos temprano el mismo día de tu entrega. Escogemos como si fuera para nuestra casa.</p>
          </div>
          <div>
            <p className="text-3xl">🔁</p>
            <h3 className="mt-2 text-xl font-extrabold">Programa y olvídate</h3>
            <p className="mt-1 text-white/80">Tu pedido fijo llega cada semana. Lo pausas o cambias cuando quieras.</p>
          </div>
          <div>
            <p className="text-3xl">📲</p>
            <h3 className="mt-2 text-xl font-extrabold">Pago simple</h3>
            <p className="mt-1 text-white/80">
              {Object.values(PAYMENT_METHODS).map((m) => m.label).join(" o ")}. Sin tarjetas, sin complicaciones.
            </p>
          </div>
        </div>
      </section>

      {/* Preguntas */}
      <section className="mx-auto max-w-3xl px-4 py-12">
        <h2 className="text-3xl font-black tracking-tight">Preguntas frecuentes</h2>
        <div className="mt-6 space-y-3">
          {[
            ["¿Cómo pueden ser más baratos que el supermercado?", "Compramos directo en el mercado y al por mayor para todo el condominio. Sin locales caros ni intermediarios: el ahorro es para ti."],
            ["¿Hasta cuándo puedo pedir?", `Hasta las ${formatTime(`${DELIVERY.cutoffHourPreviousDay}:00`)} del día anterior a tu entrega. Así compramos todo fresco en la mañana.`],
            ["¿Cuánto cuesta el delivery?", `Nada. La entrega en tu condominio es gratis. El pedido mínimo es de ${formatSoles(MIN_ORDER_CENTS)}.`],
            ["¿Cómo pago?", "Con Yape o Plin: escaneas nuestro QR, pagas y nos escribes el número de operación. Confirmamos tu pago y listo."],
            ["¿Y si algo no llega bien?", "Nos escribes por WhatsApp y lo reponemos o te devolvemos el dinero como saldo. Así de simple."],
          ].map(([q, a]) => (
            <details key={q} className="group rounded-2xl bg-white p-4 ring-1 ring-stone-200">
              <summary className="flex cursor-pointer list-none items-center justify-between font-bold">
                {q}
                <span className="text-leaf transition group-open:rotate-45">＋</span>
              </summary>
              <p className="mt-2 text-stone-600">{a}</p>
            </details>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link
            href="/productos"
            className="inline-block rounded-full bg-leaf px-8 py-4 text-lg font-extrabold text-white shadow-md shadow-leaf/20 hover:bg-leaf-dark"
          >
            Empezar mi pedido
          </Link>
        </div>
      </section>
    </div>
  );
}
