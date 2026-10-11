import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-md px-4 pt-16 text-center">
      <p className="text-6xl">🧺</p>
      <h1 className="mt-4 font-hand text-5xl font-bold text-leaf">¡Ups, casero!</h1>
      <p className="mt-2 text-lg text-stone-600">No encontramos esta página. Quizás ya se vendió.</p>
      <Link href="/productos" className="mt-6 inline-block rounded-full bg-leaf px-6 py-3 font-extrabold text-white">
        Volver al puesto
      </Link>
    </div>
  );
}
