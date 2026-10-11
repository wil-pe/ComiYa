import { hasDatabase } from "@/lib/db";
import { generateRecurringOrders } from "@/lib/orders";

// Vercel Cron llama a esta ruta cada día (ver vercel.json) para preparar los pedidos fijos.
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (secret && request.headers.get("authorization") !== `Bearer ${secret}`) {
    return Response.json({ error: "No autorizado" }, { status: 401 });
  }
  if (!hasDatabase) return Response.json({ created: 0, note: "Sin base de datos" });
  const created = await generateRecurringOrders();
  return Response.json({ created });
}
