import type { MetadataRoute } from "next";
import { BRAND } from "@/config";

// Permite "Agregar a pantalla de inicio" en el celular y abrirla como una app.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${BRAND.name} · ${BRAND.tagline}`,
    short_name: BRAND.name,
    description: "Productos frescos del mercado, 25% más baratos que el supermercado, entregados en tu condominio.",
    start_url: "/productos",
    display: "standalone",
    background_color: "#fbf7ee",
    theme_color: "#1d7a3e",
    lang: "es-PE",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
