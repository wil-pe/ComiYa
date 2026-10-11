export const ORDER_STATUS = {
  pendiente_pago: { label: "Falta pagar", className: "bg-amber-100 text-amber-800" },
  pago_reportado: { label: "Pago en revisión", className: "bg-sky-100 text-sky-800" },
  pagado: { label: "Pagado", className: "bg-emerald-100 text-emerald-800" },
  entregado: { label: "Entregado", className: "bg-stone-200 text-stone-700" },
  cancelado: { label: "Cancelado", className: "bg-red-100 text-red-700" },
} as const;

export type OrderStatus = keyof typeof ORDER_STATUS;

export function isOrderStatus(value: string): value is OrderStatus {
  return value in ORDER_STATUS;
}
