"use server";

import { revalidatePath } from "next/cache";
import type { FormState } from "@/actions/auth";
import { PRODUCTS } from "@/data/products";
import { requireAdmin } from "@/lib/auth";
import { newCondoCode } from "@/lib/condos";
import { db } from "@/lib/db";
import { isOrderStatus } from "@/lib/order-status";

export async function setOrderStatus(formData: FormData) {
  await requireAdmin();
  const orderId = Number(formData.get("orderId"));
  const status = String(formData.get("status") ?? "");
  if (!Number.isInteger(orderId) || !isOrderStatus(status)) return;
  const sql = await db();
  await sql`UPDATE orders SET status = ${status}, updated_at = now() WHERE id = ${orderId}`;
  revalidatePath("/admin");
}

export async function savePrices(_: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const sql = await db();
  const errors: string[] = [];
  for (const product of PRODUCTS) {
    const raw = String(formData.get(`price_${product.id}`) ?? "").replace(",", ".").trim();
    const soles = Number(raw);
    if (!raw || !Number.isFinite(soles) || soles <= 0 || soles > 1000) {
      errors.push(product.name);
      continue;
    }
    const cents = Math.round(soles * 100);
    const available = formData.get(`available_${product.id}`) === "on";
    // Si el precio es el del catálogo base no se guarda, así una actualización del catálogo sigue aplicando.
    const override = cents === Math.round(product.superPrice * 100) ? null : cents;
    await sql`
      INSERT INTO product_prices (product_id, super_price, available, updated_at)
      VALUES (${product.id}, ${override}, ${available}, now())
      ON CONFLICT (product_id) DO UPDATE
        SET super_price = EXCLUDED.super_price, available = EXCLUDED.available, updated_at = now()`;
  }
  revalidatePath("/", "layout");
  if (errors.length) return { error: `Precio inválido en: ${errors.join(", ")}. El resto se guardó.` };
  return { ok: "Precios guardados. Ya se ven en la tienda." };
}

export async function createCondo(_: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const name = String(formData.get("name") ?? "").trim();
  const district = String(formData.get("district") ?? "").trim();
  if (name.length < 3) return { error: "Escribe el nombre del condominio." };
  const sql = await db();
  for (let attempt = 0; attempt < 5; attempt++) {
    const code = newCondoCode();
    const [row] = await sql`
      INSERT INTO condos (name, district, code) VALUES (${name}, ${district}, ${code})
      ON CONFLICT (code) DO NOTHING RETURNING id`;
    if (row) {
      revalidatePath("/admin/condominios");
      return { ok: `Condominio creado. Código de invitación: ${code}` };
    }
  }
  return { error: "No se pudo crear. Inténtalo otra vez." };
}
