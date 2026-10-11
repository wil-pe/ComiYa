import { GROUP_TIERS } from "@/config";
import { percent, tierFor } from "@/lib/pricing";

export function GroupProgress({ neighbors, condo, when }: { neighbors: number; condo: string; when: string }) {
  const tier = tierFor(neighbors);
  const last = GROUP_TIERS[GROUP_TIERS.length - 1].minNeighbors;
  const progress = Math.min(100, (neighbors / last) * 100);

  return (
    <div className="rounded-3xl bg-sun-soft p-4">
      <p className="font-bold text-amber-950">
        👥 {neighbors === 1 ? "Eres el primer vecino" : `${neighbors} vecinos`} de {condo}{" "}
        {neighbors === 1 ? "en pedir" : "piden"} para el {when}
      </p>
      <div className="relative mt-3 h-3 rounded-full bg-white">
        <div className="h-3 rounded-full bg-sun transition-all" style={{ width: `${Math.max(progress, 4)}%` }} />
        {GROUP_TIERS.map((t) => (
          <span
            key={t.minNeighbors}
            className="absolute top-1/2 h-4 w-0.5 -translate-y-1/2 bg-amber-900/30"
            style={{ left: `${(t.minNeighbors / last) * 100}%` }}
          />
        ))}
      </div>
      <p className="mt-2 text-sm text-amber-950">
        Precio de grupo: <strong>−{percent(tier.discount)}</strong>
        {tier.next && (
          <>
            {" "}· {tier.next.missing === 1 ? "falta 1 vecino" : `faltan ${tier.next.missing} vecinos`} para bajar a{" "}
            <strong>−{percent(tier.next.discount)}</strong>
          </>
        )}
      </p>
    </div>
  );
}
