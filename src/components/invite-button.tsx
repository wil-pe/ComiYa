"use client";

import { BASE_DISCOUNT } from "@/config";
import { percent } from "@/lib/pricing";

export function InviteButton({
  condo,
  code,
  className,
  children,
}: {
  condo: string;
  code: string;
  className?: string;
  children?: React.ReactNode;
}) {
  function share() {
    const link = `${window.location.origin}/unete/${code}`;
    const text =
      `¡Hola vecino! Estoy pidiendo del mercado con ComiYa: ${percent(BASE_DISCOUNT)} más barato que el supermercado ` +
      `y te lo traen al depa. Mientras más vecinos de ${condo} pidamos, más baja el precio para todos 👉 ${link}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank", "noopener");
  }

  return (
    <button
      type="button"
      onClick={share}
      className={
        className ??
        "inline-flex items-center gap-2 rounded-full bg-[#25d366] px-4 py-2.5 font-bold text-white shadow-sm active:scale-95"
      }
    >
      {children ?? "💬 Invitar vecinos por WhatsApp"}
    </button>
  );
}
