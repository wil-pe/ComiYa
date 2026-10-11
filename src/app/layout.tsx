import type { Metadata, Viewport } from "next";
import { Caveat, Nunito } from "next/font/google";
import Link from "next/link";
import { unstable_rethrow } from "next/navigation";
import { BRAND } from "@/config";
import { CartBar } from "@/components/cart-bar";
import { Header } from "@/components/header";
import { getCurrentUser } from "@/lib/auth";
import { getCatalog } from "@/lib/catalog";
import "./globals.css";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
});

// Letra a mano, como los precios escritos con tiza en el mercado.
const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
  weight: ["600", "700"],
});

export const metadata: Metadata = {
  title: `${BRAND.name} · ${BRAND.tagline}`,
  description:
    "Pollo, carne, pescado, verduras y frutas del mercado, 25% más baratos que en el supermercado y entregados en tu condominio.",
};

// Precios, fechas de entrega y sesión cambian en cada visita.
export const dynamic = "force-dynamic";

export const viewport: Viewport = {
  themeColor: "#1d7a3e",
};

async function safeUser() {
  try {
    return await getCurrentUser();
  } catch (error) {
    unstable_rethrow(error);
    console.error("No se pudo leer la sesión", error);
    return null;
  }
}

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const [user, catalog] = await Promise.all([safeUser(), getCatalog()]);
  return (
    <html lang="es-PE" className={`${nunito.variable} ${caveat.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col font-sans">
        <div className="toldo relative z-30" aria-hidden />
        <Header user={user ? { name: user.name, isAdmin: user.isAdmin } : null} />
        <main className="flex-1 pb-10">{children}</main>
        <footer className="border-t border-stone-200 bg-white/60">
          <div className="mx-auto flex max-w-5xl flex-col gap-2 px-4 py-6 pb-28 text-sm text-stone-500 sm:flex-row sm:justify-between">
            <p>
              <strong className="text-ink">{BRAND.name}</strong> · {BRAND.tagline}. Proyecto piloto en Lima.
            </p>
            <p className="flex gap-4">
              <Link href="/productos" className="hover:text-ink">Productos</Link>
              <Link href="/creditos" className="hover:text-ink">Créditos de fotos</Link>
              <a href={`https://wa.me/${BRAND.whatsapp}`} className="hover:text-ink" target="_blank" rel="noreferrer">
                WhatsApp
              </a>
            </p>
          </div>
        </footer>
        <CartBar products={catalog} />
      </body>
    </html>
  );
}
