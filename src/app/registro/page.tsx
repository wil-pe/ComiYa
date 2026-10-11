import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { RegisterForm } from "./register-form";
import { DatabaseMissing } from "@/components/database-missing";
import { MarketBanner } from "@/components/market-banner";
import { getCurrentUser, safeNext } from "@/lib/auth";
import { listCondos } from "@/lib/condos";
import { hasDatabase } from "@/lib/db";

export const metadata: Metadata = { title: "Crear cuenta · ComiYa" };

export default async function RegisterPage({ searchParams }: PageProps<"/registro">) {
  const { next: rawNext, c } = await searchParams;
  const next = safeNext(rawNext);
  if (await getCurrentUser()) redirect(next ?? "/productos");
  const condos = await listCondos();
  const invited = typeof c === "string" ? condos.find((condo) => condo.code === c.toUpperCase()) : undefined;

  return (
    <div className="mx-auto max-w-md px-4 pt-6">
      <MarketBanner title="¡Bienvenido al puesto!" />
      <h1 className="mt-5 text-3xl font-black tracking-tight">Crea tu cuenta</h1>
      <p className="mt-1 text-stone-600">Es gratis y toma un minuto. Así sabemos dónde llevarte tu pedido.</p>
      {invited && (
        <p className="mt-4 rounded-2xl bg-sun-soft p-3 font-bold text-amber-950">
          👋 Tus vecinos de {invited.name} ya compran juntos. ¡Súmate!
        </p>
      )}
      {hasDatabase ? (
        <RegisterForm
          condos={condos.map(({ id, name, district }) => ({ id, name, district }))}
          defaultCondo={invited ? String(invited.id) : undefined}
          next={next ?? ""}
        />
      ) : (
        <DatabaseMissing />
      )}
      <p className="mt-6 text-center text-stone-600">
        ¿Ya tienes cuenta?{" "}
        <Link href={`/ingresar${next ? `?next=${encodeURIComponent(next)}` : ""}`} className="font-bold text-leaf">
          Ingresa aquí
        </Link>
      </p>
    </div>
  );
}
