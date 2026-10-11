"use client";

import { useActionState } from "react";
import { register } from "@/actions/auth";
import { CondoFields, type CondoOption } from "@/components/condo-fields";
import { buttonClass, FormMessage, inputClass } from "@/components/form-message";

export function RegisterForm({
  condos,
  defaultCondo,
  next,
}: {
  condos: CondoOption[];
  defaultCondo?: string;
  next: string;
}) {
  const [state, action, pending] = useActionState(register, undefined);
  const values = state?.values ?? {};
  return (
    <form action={action} className="mt-6 space-y-4">
      <input type="hidden" name="next" value={next} />
      <label className="block">
        <span className="text-sm font-bold">Tu nombre</span>
        <input name="name" autoComplete="name" defaultValue={values.name} placeholder="Ej.: Rosa Quispe" className={`${inputClass} mt-1`} required />
      </label>
      <label className="block">
        <span className="text-sm font-bold">Celular (WhatsApp)</span>
        <input
          name="phone"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          defaultValue={values.phone}
          placeholder="987 654 321"
          className={`${inputClass} mt-1`}
          required
        />
      </label>
      <label className="block">
        <span className="text-sm font-bold">Contraseña</span>
        <input name="password" type="password" autoComplete="new-password" minLength={6} placeholder="Mínimo 6 caracteres" className={`${inputClass} mt-1`} required />
      </label>
      <CondoFields
        condos={condos}
        defaultCondo={values.condo ?? defaultCondo}
        defaultName={values.condoName}
        defaultDistrict={values.condoDistrict}
      />
      <label className="block">
        <span className="text-sm font-bold">Torre y departamento</span>
        <input name="unit" defaultValue={values.unit} placeholder="Ej.: Torre B, dpto 1204" className={`${inputClass} mt-1`} required />
      </label>
      <FormMessage state={state} />
      <button type="submit" disabled={pending} className={buttonClass}>
        {pending ? "Creando…" : "Crear mi cuenta"}
      </button>
    </form>
  );
}
