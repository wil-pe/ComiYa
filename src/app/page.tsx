import Image from "next/image";
import Link from "next/link";
import { BASE_DISCOUNT, DELIVERY, GROUP_TIERS, MIN_ORDER_CENTS, PAYMENT_METHODS } from "@/config";
import { CATEGORIES, PRICES_OBSERVED_AT } from "@/data/products";
import { getCatalog } from "@/lib/catalog";
import { availableDates, formatCutoff, formatDateLong, formatTime } from "@/lib/dates";
import { ambianceImage, categoryImage } from "@/lib/images";
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

// Productos que se muestran en la pizarra de la portada.
const FEATURED = ["pollo-entero", "pechuga-pollo", "carne-molida", "papa-amarilla", "tomate", "palta"];

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
  const featured = FEATURED.flatMap((id) => byId.get(id) ?? []);
  const heroPhoto = ambianceImage("mercado");
  const deliveryPhoto = ambianceImage("entrega");

  return (
    <div>
      {/* Hero: el puesto del mercado */}
      <section className="relative isolate overflow-hidden bg-board">
        {heroPhoto && (
          <Image
            src={heroPhoto}
            alt="Puesto de mercado lleno de frutas y verduras frescas"
            fill
            priority
            sizes="100vw"
            className="-z-10 object-cover"
          />
        )}
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-black/75 via-black/55 to-black/80 md:bg-gradient-to-r md:from-black/80 md:via-black/55 md:to-black/30" />
        <div className="mx-auto grid max-w-5xl items-center gap-8 px-4 pt-10 pb-12 sm:pt-16 md:grid-cols-[1.1fr_1fr]">
          <div className="text-white">
            <p className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-sm font-bold backdrop-blur">
              🏢 Para condominios de Lima · piloto
            </p>
            <p className="mt-4 font-hand text-3xl leading-none text-sun">¡Casero, casera!</p>
            <h1 className="mt-1 text-4xl leading-[1.05] font-black tracking-tight sm:text-5xl">
              El mercado, en tu puerta.
              <span className="block text-sun">{percent(BASE_DISCOUNT)} más barato que el supermercado.</span>
            </h1>
            <p className="mt-4 text-lg text-white/85">
              Pollo, carne, pescado, verduras, frutas y hierbas frescas del mercado. Tú eliges el día y la hora,
              nosotros hacemos las compras y te las llevamos a tu depa.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/productos"
                className="rounded-full bg-sun px-6 py-3.5 text-center text-lg font-extrabold text-ink shadow-md hover:brightness-105"
              >
                Ver productos y precios
              </Link>
              <Link
                href="/registro"
                className="rounded-full bg-white/15 px-6 py-3.5 text-center text-lg font-bold ring-1 ring-white/40 backdrop-blur hover:bg-white/25"
              >
                Crear mi cuenta
              </Link>
            </div>
            <ul className="mt-6 flex flex-wrap gap-2 text-sm font-semibold">
              <li className="rounded-full bg-white/15 px-3 py-1.5 backdrop-blur">🚚 Entrega gratis</li>
              <li className="rounded-full bg-white/15 px-3 py-1.5 backdrop-blur">📱 Pagas con Yape o Plin</li>
              <li className="rounded-full bg-white/15 px-3 py-1.5 backdrop-blur">🔁 Pedido fijo cada semana</li>
            </ul>
          </div>

          {/* Pizarra de precios */}
          <div className="pizarra marco-madera -rotate-1 rounded-2xl p-5 font-hand">
            <p className="text-center text-4xl leading-none font-bold">Precios de hoy</p>
            <p className="mt-1 text-center text-lg opacity-70">supermercado → ComiYa</p>
            <ul className="mt-4 space-y-1.5 text-xl sm:text-2xl">
              {featured.map((product) => (
                <li key={product.id} className="flex items-baseline gap-2">
                  <span className="whitespace-nowrap">
                    {product.name} <span className="text-base opacity-60">{product.unit === "kg" ? "kg" : ""}</span>
                  </span>
                  <span className="flex-1 border-b-2 border-dotted border-white/20" />
                  <span className="text-base whitespace-nowrap line-through opacity-55 sm:text-lg">
                    {formatSoles(product.superCents)}
                  </span>
                  <span className="font-bold whitespace-nowrap text-sun">{formatSoles(priceAt(product.superCents))}</span>
                </li>
              ))}
            </ul>
            <div className="mt-5 rounded-xl border-2 border-dashed border-white/30 p-3 text-center">
              <p className="text-xl leading-tight">Tu canasta de la semana</p>
              <p className="text-xl leading-tight">
                <span className="line-through opacity-60">{formatSoles(superTotal)}</span> →{" "}
                <span className="font-bold">{formatSoles(ourTotal)}</span>
              </p>
              <p className="text-4xl leading-tight font-bold text-sun">¡Ahorras {formatSoles(weeklySavings)}!</p>
              <p className="text-lg opacity-80">≈ {formatSoles(weeklySavings * 4)} al mes, sin colas ni bolsas</p>
            </div>
            <details className="mt-3 font-sans text-sm">
              <summary className="cursor-pointer font-semibold opacity-75">¿Qué lleva la canasta?</summary>
              <ul className="mt-2 space-y-1">
                {basket.map(({ product, qty }) => (
                  <li key={product.id} className="flex justify-between gap-2">
                    <span>
                      {product.name} · {formatQty(qty, product.unit)}
                    </span>
                    <span className="whitespace-nowrap">
                      <span className="line-through opacity-50">{formatSoles(lineTotal(product.superCents, qty))}</span>{" "}
                      <strong className="text-sun">{formatSoles(lineTotal(priceAt(product.superCents), qty))}</strong>
                    </span>
                  </li>
                ))}
              </ul>
            </details>
            <p className="mt-2 font-sans text-xs opacity-55">Precios de supermercado: Tottus, {PRICES_OBSERVED_AT}.</p>
          </div>
        </div>
      </section>

      {/* Qué hay en el puesto */}
      <section className="mx-auto max-w-5xl px-4 py-10">
        <p className="font-hand text-2xl leading-none text-leaf">Fresquito, del mercado a tu mesa</p>
        <h2 className="text-3xl font-black tracking-tight">¿Qué hay en el puesto?</h2>
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {CATEGORIES.map((category) => (
            <Link
              key={category.id}
              href={`/productos#${category.id}`}
              className="group relative aspect-[4/3] overflow-hidden rounded-3xl bg-board"
            >
              {categoryImage(category.id) ? (
                <Image
                  src={categoryImage(category.id)!}
                  alt=""
                  fill
                  sizes="(min-width: 640px) 25vw, 50vw"
                  className="object-cover transition duration-500 group-hover:scale-105"
                />
              ) : (
                <span className="absolute inset-0 flex items-center justify-center pb-6 text-5xl" aria-hidden>
                  {category.emoji}
                </span>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
              <span className="absolute bottom-2 left-3 font-hand text-2xl leading-none font-bold text-white sm:text-3xl">
                {category.label}
              </span>
            </Link>
          ))}
          <Link
            href="/productos"
            className="flex aspect-[4/3] flex-col items-center justify-center rounded-3xl bg-leaf p-3 text-center text-white"
          >
            <span className="font-hand text-3xl leading-none font-bold">Ver todo</span>
            <span className="mt-1 text-sm font-semibold text-white/80">{catalog.length} productos →</span>
          </Link>
        </div>
      </section>

      {/* Cómo funciona */}
      <section className="bg-white py-12">
        <div className="mx-auto grid max-w-5xl gap-8 px-4 md:grid-cols-[1fr_1.25fr] md:items-center">
          <div className="relative aspect-video overflow-hidden rounded-3xl bg-kraft md:aspect-[4/5]">
            {deliveryPhoto ? (
              <Image
                src={deliveryPhoto}
                alt="Bolsa de compras llena de verduras frescas"
                fill
                sizes="(min-width: 768px) 40vw, 100vw"
                className="object-cover"
              />
            ) : (
              <span className="absolute inset-0 flex items-center justify-center text-7xl" aria-hidden>🛍️</span>
            )}
            <span className="absolute bottom-3 left-3 rotate-[-3deg] rounded-xl bg-sun px-3 py-1 font-hand text-2xl font-bold text-ink shadow">
              ¡Listo en tu puerta!
            </span>
          </div>
          <div>
            <h2 className="text-3xl font-black tracking-tight">Así de fácil</h2>
            <ol className="mt-5 space-y-3">
              {[
                ["🛒", "Elige tus productos", "Los de siempre: pollo, carne, pescado, verduras, frutas y hierbas. Ves el precio del súper y el nuestro."],
                ["📅", "Elige día y hora", "Por ejemplo: todos los martes a las 8:15 a. m. Lo programas una vez y llega solo cada semana."],
                ["📲", "Paga con Yape o Plin", "Escaneas el QR, pagas y listo. Te lo dejamos en tu condominio, fresquito del mercado."],
              ].map(([emoji, title, text], i) => (
                <li key={title} className="flex gap-4 rounded-3xl bg-cream p-4">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-2xl shadow-sm">{emoji}</span>
                  <div>
                    <p className="text-xs font-black tracking-wide text-leaf">PASO {i + 1}</p>
                    <h3 className="text-lg leading-tight font-extrabold">{title}</h3>
                    <p className="mt-0.5 text-stone-600">{text}</p>
                  </div>
                </li>
              ))}
            </ol>
            {nextDate && (
              <p className="mt-4 rounded-2xl bg-leaf-soft px-4 py-3 font-semibold text-leaf-dark">
                📦 Próxima entrega disponible: <strong>{formatDateLong(nextDate)}</strong> · pide hasta el{" "}
                {formatCutoff(nextDate)}.
              </p>
            )}
          </div>
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
