import "server-only";
import { db, hasDatabase } from "@/lib/db";

export async function listCondos() {
  if (!hasDatabase) return [];
  const sql = await db();
  const rows = await sql`SELECT id, name, district, code FROM condos ORDER BY name`;
  return rows.map((row) => ({ id: row.id as number, name: row.name as string, district: row.district as string, code: row.code as string }));
}

/** Código corto de invitación (sin letras que se confunden como O/0 o I/1). */
export function newCondoCode(): string {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 6; i++) code += alphabet[Math.floor(Math.random() * alphabet.length)];
  return code;
}
