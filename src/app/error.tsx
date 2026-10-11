"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto max-w-md px-4 pt-16 text-center">
      <p className="text-6xl">🥬</p>
      <h1 className="mt-4 font-hand text-5xl font-bold text-leaf">Algo se nos cayó</h1>
      <p className="mt-2 text-lg text-stone-600">Tuvimos un problema al cargar esta página. Inténtalo otra vez.</p>
      <div className="mt-6 flex flex-col gap-2">
        <button type="button" onClick={reset} className="rounded-full bg-leaf px-6 py-3 font-extrabold text-white">
          Reintentar
        </button>
        <Link href="/" className="rounded-full bg-white px-6 py-3 font-bold ring-1 ring-stone-300">
          Ir al inicio
        </Link>
      </div>
    </div>
  );
}
