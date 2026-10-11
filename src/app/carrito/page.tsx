import type { Metadata } from "next";
import { Checkout } from "./checkout";
import { getCurrentUser } from "@/lib/auth";
import { getCatalog } from "@/lib/catalog";
import { availableDates, formatCutoff, formatDateShort } from "@/lib/dates";
import { creditBalance, neighborCounts } from "@/lib/orders";

export const metadata: Metadata = { title: "Mi pedido · ComiYa" };

export default async function CartPage() {
  const [user, catalog] = await Promise.all([getCurrentUser(), getCatalog()]);
  const dates = availableDates();
  const counts = user?.condo ? await neighborCounts(user.condo.id, dates, user.id) : null;
  const credit = user ? await creditBalance(user.id) : 0;

  return (
    <div className="mx-auto max-w-2xl px-4 pt-6">
      <h1 className="text-3xl font-black tracking-tight">Mi pedido</h1>
      <Checkout
        products={catalog}
        user={user ? { name: user.name, condo: user.condo?.name ?? null, unit: user.unit } : null}
        credit={credit}
        dates={dates.map((date) => ({
          date,
          ...formatDateShort(date),
          cutoff: formatCutoff(date),
          // Vecinos que ya pidieron + tú.
          neighbors: counts ? counts[date].count + (counts[date].includesMe ? 0 : 1) : 1,
        }))}
      />
    </div>
  );
}
