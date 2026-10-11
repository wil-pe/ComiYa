"use client";

import { useActionState } from "react";
import { login } from "@/actions/auth";
import { buttonClass, FormMessage, inputClass } from "@/components/form-message";
import { BRAND } from "@/config";

export function LoginForm({ next }: { next: string }) {
  const [state, action, pending] = useActionState(login, undefined);
  return (
    <form action={action} className="mt-6 space-y-4">
      <input type="hidden" name="next" value={next} />
      <label className="block">
        <span className="text-sm font-bold">Celular</span>
        <input
          name="phone"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          defaultValue={state?.values?.phone}
          placeholder="987 654 321"
          className={`${inputClass} mt-1`}
          required
        />
      </label>
      <label className="block">
        <span className="text-sm font-bold">Contraseña</span>
        <input name="password" type="password" autoComplete="current-password" className={`${inputClass} mt-1`} required />
      </label>
      <FormMessage state={state} />
      <button type="submit" disabled={pending} className={buttonClass}>
        {pending ? "Ingresando…" : "Ingresar"}
      </button>
      <p className="text-center text-sm text-stone-500">
        ¿Olvidaste tu contraseña?{" "}
        <a
          href={`https://wa.me/${BRAND.whatsapp}?text=${encodeURIComponent("Hola, olvidé mi contraseña de ComiYa")}`}
          className="font-bold text-leaf"
          target="_blank"
          rel="noreferrer"
        >
          Escríbenos por WhatsApp
        </a>
      </p>
    </form>
  );
}
