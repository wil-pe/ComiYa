import type { FormState } from "@/actions/auth";

export function FormMessage({ state }: { state: FormState }) {
  if (state?.error) {
    return <p className="rounded-xl bg-red-50 p-3 text-sm font-semibold text-red-700">{state.error}</p>;
  }
  if (state?.ok) {
    return <p className="rounded-xl bg-leaf-soft p-3 text-sm font-semibold text-leaf-dark">{state.ok}</p>;
  }
  return null;
}

export const inputClass =
  "w-full rounded-2xl border-0 bg-white px-4 py-3 text-lg ring-1 ring-stone-300 focus:ring-2 focus:ring-leaf focus:outline-none";

export const buttonClass =
  "w-full rounded-full bg-leaf py-3.5 text-lg font-extrabold text-white shadow-md shadow-leaf/20 transition hover:bg-leaf-dark disabled:opacity-50";
