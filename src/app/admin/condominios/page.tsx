import type { Metadata } from "next";
import { CondoForm } from "./condo-form";
import { db } from "@/lib/db";

export const metadata: Metadata = { title: "Condominios · Admin ComiYa" };

export default async function CondosPage() {
  const sql = await db();
  const condos = await sql`
    SELECT c.id, c.name, c.district, c.code,
           (SELECT COUNT(*)::int FROM users u WHERE u.condo_id = c.id) AS members,
           (SELECT COUNT(*)::int FROM orders o WHERE o.condo_id = c.id AND o.status <> 'cancelado') AS orders
    FROM condos c ORDER BY members DESC, c.name`;

  return (
    <div className="space-y-5">
      <section className="rounded-3xl bg-white p-4 ring-1 ring-stone-200">
        <h2 className="font-extrabold">Agregar condominio</h2>
        <p className="text-sm text-stone-500">
          Comparte el enlace <code>/unete/CÓDIGO</code> en el grupo de WhatsApp del condominio.
        </p>
        <CondoForm />
      </section>
      <section className="overflow-x-auto rounded-3xl bg-white p-4 ring-1 ring-stone-200">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-stone-500">
              <th className="py-1">Condominio</th>
              <th className="py-1">Código</th>
              <th className="py-1 text-right">Vecinos</th>
              <th className="py-1 text-right">Pedidos</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {condos.map((condo) => (
              <tr key={condo.id}>
                <td className="py-2">
                  <strong>{condo.name}</strong>
                  <span className="text-stone-500">{condo.district ? ` · ${condo.district}` : ""}</span>
                </td>
                <td className="py-2">
                  <a href={`/unete/${condo.code}`} className="font-mono font-bold text-leaf">
                    {condo.code}
                  </a>
                </td>
                <td className="py-2 text-right">{condo.members}</td>
                <td className="py-2 text-right">{condo.orders}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {condos.length === 0 && <p className="py-4 text-center text-stone-500">Aún no hay condominios.</p>}
      </section>
    </div>
  );
}
