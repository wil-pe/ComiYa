import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BASE_DISCOUNT, GROUP_TIERS } from "@/config";
import { db, hasDatabase } from "@/lib/db";
import { percent } from "@/lib/pricing";

export const metadata: Metadata = { title: "Únete a tus vecinos · ComiYa" };

export default async function JoinPage({ params }: PageProps<"/unete/[code]">) {
  const code = (await params).code.toUpperCase();
  if (!hasDatabase) notFound();
  const sql = await db();
  const [condo] = await sql`
    SELECT c.name, c.district, COUNT(u.id)::int AS members
    FROM condos c LEFT JOIN users u ON u.condo_id = c.id
    WHERE c.code = ${code} GROUP BY c.id`;
  if (!condo) notFound();

  return (
    <div className="mx-auto max-w-md px-4 pt-10 text-center">
      <p className="text-6xl">🏢</p>
      <h1 className="mt-4 text-3xl font-black tracking-tight">
        Tus vecinos de {condo.name} compran juntos
      </h1>
      <p className="mt-3 text-lg text-stone-600">
        Productos frescos del mercado, {percent(BASE_DISCOUNT)} más baratos que el supermercado, entregados en tu
        condominio. Entre más vecinos, más baja el precio: hasta −{percent(GROUP_TIERS[GROUP_TIERS.length - 1].discount)}.
      </p>
      {condo.members > 1 && (
        <p className="mt-4 inline-block rounded-full bg-sun-soft px-4 py-2 font-bold text-amber-950">
          👥 {condo.members} vecinos ya se unieron
        </p>
      )}
      <div className="mt-8 space-y-3">
        <Link href={`/registro?c=${code}`} className="block rounded-full bg-leaf py-4 text-lg font-extrabold text-white">
          Unirme a mis vecinos
        </Link>
        <Link href="/productos" className="block rounded-full bg-white py-3 font-bold ring-1 ring-stone-300">
          Ver productos y precios
        </Link>
      </div>
    </div>
  );
}
