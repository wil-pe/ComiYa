// Configuración del negocio. Todo lo que se ajusta seguido está aquí.

export const BRAND = {
  name: "ComiYa",
  tagline: "Del mercado a tu puerta",
  // Número de WhatsApp para atención (formato internacional sin "+").
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP ?? "51900000000",
};

// Descuento base frente al precio de supermercado (Tottus).
export const BASE_DISCOUNT = 0.25;

// Compra en grupo: cuantos más vecinos del mismo condominio piden para el
// mismo día, más baja el precio para todos.
export const GROUP_TIERS = [
  { minNeighbors: 1, discount: 0.25 },
  { minNeighbors: 5, discount: 0.27 },
  { minNeighbors: 10, discount: 0.29 },
  { minNeighbors: 20, discount: 0.3 },
] as const;

export const DELIVERY = {
  // Días con entrega (0 = domingo … 6 = sábado).
  weekdays: [1, 2, 3, 4, 5, 6],
  firstSlot: "07:00",
  lastSlot: "20:00",
  slotStepMinutes: 15,
  // Los pedidos de un día se cierran la víspera a esta hora (hora de Lima).
  cutoffHourPreviousDay: 20,
  // Cuántos días hacia adelante se puede programar.
  daysAhead: 14,
  fee: 0,
};

// Pedido mínimo en céntimos.
export const MIN_ORDER_CENTS = 3000;

// Pagos con Yape / Plin. Reemplaza los QR en /public/qr/ por los tuyos.
export const PAYMENT_METHODS = {
  yape: {
    label: "Yape",
    qr: "/qr/yape.svg",
    phone: process.env.NEXT_PUBLIC_YAPE_PHONE ?? "900 000 000",
    holder: process.env.NEXT_PUBLIC_PAYMENT_HOLDER ?? "ComiYa",
    color: "#742284",
  },
  plin: {
    label: "Plin",
    qr: "/qr/plin.svg",
    phone: process.env.NEXT_PUBLIC_PLIN_PHONE ?? "900 000 000",
    holder: process.env.NEXT_PUBLIC_PAYMENT_HOLDER ?? "ComiYa",
    color: "#00b5c8",
  },
} as const;

export type PaymentMethod = keyof typeof PAYMENT_METHODS;
