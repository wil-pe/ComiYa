"use client";

import { useActionState } from "react";
import { reportPayment } from "@/actions/orders";
import { FormMessage, inputClass } from "@/components/form-message";

export function PaymentForm({ orderId, current }: { orderId: number; current: string }) {
  const [state, action, pending] = useActionState(reportPayment, undefined);
  return (
    <form action={action} className="mt-4 space-y-2">
      <input type="hidden" name="orderId" value={orderId} />
      <label className="block text-sm font-bold" htmlFor="reference">
        {current ? "¿Te equivocaste? Corrige el número de operación" : "Número de operación"}
      </label>
      <div className="flex gap-2">
        <input
          id="reference"
          name="reference"
          inputMode="numeric"
          autoComplete="off"
          placeholder="Ej.: 12345678"
          defaultValue={current}
          className={`${inputClass} flex-1`}
        />
        <button
          type="submit"
          disabled={pending}
          className="shrink-0 rounded-full bg-leaf px-5 font-extrabold text-white disabled:opacity-50"
        >
          {pending ? "…" : "Ya pagué"}
        </button>
      </div>
      <FormMessage state={state} />
    </form>
  );
}
