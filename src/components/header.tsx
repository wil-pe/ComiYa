import Link from "next/link";
import { BRAND } from "@/config";
import { CartCount } from "./cart-bar";

export function Logo() {
  return (
    <span className="flex items-center gap-1.5 text-xl font-black tracking-tight text-leaf">
      <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-leaf text-lg" aria-hidden>
        🧺
      </span>
      {BRAND.name}
    </span>
  );
}

export function Header({ user }: { user: { name: string; isAdmin: boolean } | null }) {
  return (
    <header className="sticky top-0 z-20 border-b border-stone-200/70 bg-cream/90 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between gap-2 px-4">
        <Link href="/" aria-label="Inicio">
          <Logo />
        </Link>
        <nav className="flex items-center gap-1 text-sm font-bold sm:gap-2">
          <Link href="/productos" className="rounded-full px-2.5 py-2 hover:bg-white">
            Productos
          </Link>
          {user ? (
            <>
              <Link href="/pedidos" className="rounded-full px-2.5 py-2 hover:bg-white">
                Pedidos
              </Link>
              {user.isAdmin && (
                <Link href="/admin" className="hidden rounded-full px-2.5 py-2 hover:bg-white sm:block">
                  Admin
                </Link>
              )}
              <Link
                href="/cuenta"
                aria-label="Mi cuenta"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-leaf-soft font-black text-leaf"
              >
                {user.name.trim().charAt(0).toUpperCase() || "👤"}
              </Link>
            </>
          ) : (
            <Link href="/ingresar" className="rounded-full px-2.5 py-2 hover:bg-white">
              Ingresar
            </Link>
          )}
          <Link
            href="/carrito"
            aria-label="Mi pedido"
            className="relative flex h-9 w-9 items-center justify-center rounded-full bg-white text-lg shadow-sm ring-1 ring-stone-200"
          >
            🛒
            <CartCount />
          </Link>
        </nav>
      </div>
    </header>
  );
}
