import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { LoginForm } from "./login-form";
import { DatabaseMissing } from "@/components/database-missing";
import { MarketBanner } from "@/components/market-banner";
import { getCurrentUser, safeNext } from "@/lib/auth";
import { hasDatabase } from "@/lib/db";

export const metadata: Metadata = { title: "Ingresar · ComiYa" };

export default async function LoginPage({ searchParams }: PageProps<"/ingresar">) {
  const next = safeNext((await searchParams).next);
  if (await getCurrentUser()) redirect(next ?? "/productos");

  return (
    <div className="mx-auto max-w-md px-4 pt-6">
      <MarketBanner title="¡Hola de nuevo, casero!" />
      <h1 className="mt-5 text-3xl font-black tracking-tight">Ingresa a tu cuenta</h1>
      <p className="mt-1 text-stone-600">Con tu celular y tu contraseña.</p>
      {hasDatabase ? <LoginForm next={next ?? ""} /> : <DatabaseMissing />}
      <p className="mt-6 text-center text-stone-600">
        ¿Primera vez?{" "}
        <Link href={`/registro${next ? `?next=${encodeURIComponent(next)}` : ""}`} className="font-bold text-leaf">
          Crea tu cuenta
        </Link>
      </p>
    </div>
  );
}
