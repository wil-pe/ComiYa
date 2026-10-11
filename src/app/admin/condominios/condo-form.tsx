"use client";

import { useActionState } from "react";
import { createCondo } from "@/actions/admin";
import { FormMessage, inputClass } from "@/components/form-message";

export function CondoForm() {
  const [state, action, pending] = useActionState(createCondo, undefined);
  return (
    <form action={action} className="mt-3 space-y-3">
      <div className="grid gap-2 sm:grid-cols-[2fr_1fr_auto]">
        <input name="name" placeholder="Nombre del condominio" className={inputClass} required />
        <input name="district" placeholder="Distrito" className={inputClass} />
        <button type="submit" disabled={pending} className="rounded-full bg-leaf px-5 py-3 font-bold text-white disabled:opacity-50">
          Agregar
        </button>
      </div>
      <FormMessage state={state} />
    </form>
  );
}
