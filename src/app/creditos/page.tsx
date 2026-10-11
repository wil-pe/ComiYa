import type { Metadata } from "next";
import Image from "next/image";
import { PHOTO_CREDITS } from "@/data/photo-credits";

export const metadata: Metadata = { title: "Créditos de fotos · ComiYa" };

export default function CreditsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 pt-6">
      <h1 className="text-3xl font-black tracking-tight">Créditos de fotos</h1>
      <p className="mt-1 text-stone-600">
        Las fotos de productos son referenciales. Gracias a los fotógrafos que las comparten libremente. Todas
        fueron recortadas y comprimidas para la app; las fotos con licencia CC BY-SA se comparten bajo la misma
        licencia.
      </p>
      <ul className="mt-5 grid gap-2 sm:grid-cols-2">
        {PHOTO_CREDITS.map((credit) => (
          <li key={credit.file} className="flex items-center gap-3 rounded-2xl bg-white p-2 ring-1 ring-stone-200">
            <span className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-kraft">
              <Image src={credit.file} alt="" fill sizes="48px" className="object-cover" />
            </span>
            <span className="min-w-0 text-sm">
              <strong className="block truncate">{credit.subject}</strong>
              <a href={credit.url} target="_blank" rel="noreferrer" className="block truncate text-leaf">
                {credit.author ? `${credit.author} · ` : ""}
                {credit.source}
              </a>
              <span className="block truncate text-xs text-stone-500">{credit.license}</span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
