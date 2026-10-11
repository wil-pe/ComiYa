"use client";

import { useActionState } from "react";
import { changePassword, updateProfile } from "@/actions/auth";
import { CondoFields, type CondoOption } from "@/components/condo-fields";
import { buttonClass, FormMessage, inputClass } from "@/components/form-message";

export function ProfileForm({
  condos,
  name,
  unit,
  condoId,
}: {
  condos: CondoOption[];
  name: string;
  unit: string;
  condoId: string;
}) {
  const [state, action, pending] = useActionState(updateProfile, undefined);
  return (
    <form action={action} className="mt-3 space-y-4">
      <label className="block">
        <span className="text-sm font-bold">Nombre</span>
        <input name="name" defaultValue={name} className={`${inputClass} mt-1`} required />
      </label>
      <CondoFields condos={condos} defaultCondo={condoId} />
      <label className="block">
        <span className="text-sm font-bold">Torre y departamento</span>
        <input name="unit" defaultValue={unit} className={`${inputClass} mt-1`} required />
      </label>
      <FormMessage state={state} />
      <button type="submit" disabled={pending} className={buttonClass}>
        {pending ? "Guardando…" : "Guardar"}
      </button>
    </form>
  );
}

export function PasswordForm() {
  const [state, action, pending] = useActionState(changePassword, undefined);
  return (
    <form action={action} className="mt-3 space-y-4">
      <label className="block">
        <span className="text-sm font-bold">Contraseña actual</span>
        <input name="current" type="password" autoComplete="current-password" className={`${inputClass} mt-1`} required />
      </label>
      <label className="block">
        <span className="text-sm font-bold">Nueva contraseña</span>
        <input name="password" type="password" autoComplete="new-password" minLength={6} className={`${inputClass} mt-1`} required />
      </label>
      <FormMessage state={state} />
      <button type="submit" disabled={pending} className={buttonClass}>
        {pending ? "Guardando…" : "Cambiar contraseña"}
      </button>
    </form>
  );
}
