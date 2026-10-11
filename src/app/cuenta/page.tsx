import type { Metadata } from "next";
import Link from "next/link";
import { logout } from "@/actions/auth";
import { PasswordForm, ProfileForm } from "./forms";
import { InviteButton } from "@/components/invite-button";
import { formatPhone, requireUser } from "@/lib/auth";
import { listCondos } from "@/lib/condos";
import { creditBalance } from "@/lib/orders";
import { formatSoles } from "@/lib/pricing";

export const metadata: Metadata = { title: "Mi cuenta · ComiYa" };

export default async function AccountPage() {
  const user = await requireUser("/cuenta");
  const [condos, credit] = await Promise.all([listCondos(), creditBalance(user.id)]);

  return (
    <div className="mx-auto max-w-md space-y-6 px-4 pt-6">
      <div>
        <h1 className="text-3xl font-black tracking-tight">Hola, {user.name.split(" ")[0]}</h1>
        <p className="text-stone-500">{formatPhone(user.phone)}</p>
      </div>

      {credit > 0 && (
        <p className="rounded-3xl bg-sun-soft p-4 font-bold text-amber-950">💰 Saldo a favor: {formatSoles(credit)}</p>
      )}

      {user.condo && (
        <section id="invitar" className="rounded-3xl bg-leaf p-5 text-white">
          <p className="text-xl font-black">Invita a tus vecinos</p>
          <p className="mt-1 text-white/85">
            Cuantos más vecinos de {user.condo.name} piden para el mismo día, más barato le sale a todos.
          </p>
          <div className="mt-4">
            <InviteButton condo={user.condo.name} code={user.condo.code} />
          </div>
          <p className="mt-3 text-sm text-white/70">Código de tu condominio: {user.condo.code}</p>
        </section>
      )}

      <section className="rounded-3xl bg-white p-5 ring-1 ring-stone-200">
        <h2 className="text-lg font-extrabold">Mis datos de entrega</h2>
        <ProfileForm
          condos={condos.map(({ id, name, district }) => ({ id, name, district }))}
          name={user.name}
          unit={user.unit}
          condoId={user.condo ? String(user.condo.id) : ""}
        />
      </section>

      <section className="rounded-3xl bg-white p-5 ring-1 ring-stone-200">
        <h2 className="text-lg font-extrabold">Cambiar contraseña</h2>
        <PasswordForm />
      </section>

      {user.isAdmin && (
        <Link href="/admin" className="block rounded-full bg-ink py-3 text-center font-bold text-white">
          🛠️ Panel de administración
        </Link>
      )}

      <form action={logout}>
        <button type="submit" className="w-full rounded-full py-3 font-bold text-chili ring-1 ring-red-200">
          Cerrar sesión
        </button>
      </form>
    </div>
  );
}
