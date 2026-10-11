import Link from "next/link";
import { requireAdmin } from "@/lib/auth";

export default async function AdminLayout({ children }: LayoutProps<"/admin">) {
  await requireAdmin();
  return (
    <div className="mx-auto max-w-5xl px-4 pt-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-black tracking-tight">🛠️ Administración</h1>
        <nav className="flex gap-1 rounded-full bg-white p-1 text-sm font-bold ring-1 ring-stone-200">
          <Link href="/admin" className="rounded-full px-3 py-1.5 hover:bg-leaf-soft">Pedidos</Link>
          <Link href="/admin/precios" className="rounded-full px-3 py-1.5 hover:bg-leaf-soft">Precios</Link>
          <Link href="/admin/condominios" className="rounded-full px-3 py-1.5 hover:bg-leaf-soft">Condominios</Link>
        </nav>
      </div>
      <div className="mt-5">{children}</div>
    </div>
  );
}
