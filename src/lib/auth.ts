import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { db, hasDatabase } from "@/lib/db";
import { readSessionUserId } from "@/lib/session";

export type CurrentUser = {
  id: number;
  name: string;
  phone: string;
  unit: string;
  isAdmin: boolean;
  condo: { id: number; name: string; district: string; code: string } | null;
};

export const getCurrentUser = cache(async (): Promise<CurrentUser | null> => {
  if (!hasDatabase) return null;
  const userId = await readSessionUserId();
  if (!userId) return null;
  const sql = await db();
  const [row] = await sql`
    SELECT u.id, u.name, u.phone, u.unit, u.is_admin,
           c.id AS condo_id, c.name AS condo_name, c.district, c.code
    FROM users u LEFT JOIN condos c ON c.id = u.condo_id
    WHERE u.id = ${userId}`;
  if (!row) return null;
  return {
    id: row.id,
    name: row.name,
    phone: row.phone,
    unit: row.unit,
    isAdmin: row.is_admin,
    condo: row.condo_id
      ? { id: row.condo_id, name: row.condo_name, district: row.district, code: row.code }
      : null,
  };
});

export async function requireUser(next?: string): Promise<CurrentUser> {
  const user = await getCurrentUser();
  if (!user) redirect(next ? `/ingresar?next=${encodeURIComponent(next)}` : "/ingresar");
  return user;
}

export async function requireAdmin(): Promise<CurrentUser> {
  const user = await requireUser("/admin");
  if (!user.isAdmin) redirect("/");
  return user;
}

/** Normaliza un celular peruano a 9 dígitos (ej. "+51 987 654 321" → "987654321"). */
export function normalizePhone(input: string): string | null {
  let digits = input.replace(/\D/g, "");
  if (digits.length === 11 && digits.startsWith("51")) digits = digits.slice(2);
  return /^9\d{8}$/.test(digits) ? digits : null;
}

export function formatPhone(phone: string): string {
  return phone.replace(/^(\d{3})(\d{3})(\d{3})$/, "$1 $2 $3");
}

export function isAdminPhone(phone: string): boolean {
  return (process.env.ADMIN_PHONES ?? "")
    .split(",")
    .map((p) => normalizePhone(p.trim()))
    .includes(phone);
}

/** Solo permite volver a rutas internas (evita redirecciones a otros sitios). */
export function safeNext(next: unknown): string | null {
  return typeof next === "string" && next.startsWith("/") && !next.startsWith("//") && !next.startsWith("/\\")
    ? next
    : null;
}
