"use server";

import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { isAdminPhone, normalizePhone, requireUser, safeNext } from "@/lib/auth";
import { newCondoCode } from "@/lib/condos";
import { db, hasDatabase } from "@/lib/db";
import { createSession, deleteSession } from "@/lib/session";

export type FormState = {
  error?: string;
  ok?: string;
  values?: Record<string, string>;
} | undefined;

function field(formData: FormData, name: string): string {
  return String(formData.get(name) ?? "").trim();
}

/** Devuelve el id del condominio elegido o creado en el formulario. */
async function resolveCondo(formData: FormData): Promise<number | string> {
  const sql = await db();
  const choice = field(formData, "condo");
  if (choice === "nuevo") {
    const name = field(formData, "condoName");
    const district = field(formData, "condoDistrict");
    if (name.length < 3) return "Escribe el nombre de tu condominio.";
    const [existing] = await sql`
      SELECT id FROM condos WHERE lower(name) = lower(${name}) AND lower(district) = lower(${district})`;
    if (existing) return existing.id;
    for (let attempt = 0; attempt < 5; attempt++) {
      const [row] = await sql`
        INSERT INTO condos (name, district, code) VALUES (${name}, ${district}, ${newCondoCode()})
        ON CONFLICT (code) DO NOTHING RETURNING id`;
      if (row) return row.id;
    }
    return "No pudimos registrar el condominio. Inténtalo otra vez.";
  }
  const id = Number(choice);
  if (!Number.isInteger(id)) return "Elige tu condominio.";
  const [row] = await sql`SELECT id FROM condos WHERE id = ${id}`;
  return row ? row.id : "Elige tu condominio.";
}

export async function register(_: FormState, formData: FormData): Promise<FormState> {
  const values = {
    name: field(formData, "name"),
    phone: field(formData, "phone"),
    condo: field(formData, "condo"),
    condoName: field(formData, "condoName"),
    condoDistrict: field(formData, "condoDistrict"),
    unit: field(formData, "unit"),
  };
  if (!hasDatabase) return { error: "La base de datos todavía no está conectada.", values };
  const phone = normalizePhone(values.phone);
  const password = String(formData.get("password") ?? "");
  if (values.name.length < 2) return { error: "Escribe tu nombre.", values };
  if (!phone) return { error: "Escribe un celular válido de 9 dígitos (empieza con 9).", values };
  if (password.length < 6) return { error: "La contraseña debe tener al menos 6 caracteres.", values };
  if (!values.unit) return { error: "Indica tu torre y número de departamento.", values };

  const sql = await db();
  const [existing] = await sql`SELECT id FROM users WHERE phone = ${phone}`;
  if (existing) return { error: "Ese celular ya tiene una cuenta. Ingresa con tu contraseña.", values };

  const condoId = await resolveCondo(formData);
  if (typeof condoId === "string") return { error: condoId, values };

  const [{ count }] = await sql`SELECT COUNT(*)::int AS count FROM users`;
  // Sin ADMIN_PHONES configurado, la primera cuenta creada es la del administrador.
  const isAdmin = isAdminPhone(phone) || (count === 0 && !process.env.ADMIN_PHONES);
  const hash = await bcrypt.hash(password, 10);
  const [user] = await sql`
    INSERT INTO users (name, phone, password_hash, condo_id, unit, is_admin)
    VALUES (${values.name}, ${phone}, ${hash}, ${condoId}, ${values.unit}, ${isAdmin})
    ON CONFLICT (phone) DO NOTHING RETURNING id`;
  if (!user) return { error: "Ese celular ya tiene una cuenta. Ingresa con tu contraseña.", values };

  await createSession(user.id);
  redirect(safeNext(field(formData, "next")) ?? "/productos");
}

export async function login(_: FormState, formData: FormData): Promise<FormState> {
  const values = { phone: field(formData, "phone") };
  if (!hasDatabase) return { error: "La base de datos todavía no está conectada.", values };
  const phone = normalizePhone(values.phone);
  const password = String(formData.get("password") ?? "");
  if (!phone || !password) return { error: "Escribe tu celular y tu contraseña.", values };

  const sql = await db();
  const [user] = await sql`SELECT id, password_hash, is_admin FROM users WHERE phone = ${phone}`;
  if (!user || !(await bcrypt.compare(password, user.password_hash))) {
    return { error: "Celular o contraseña incorrectos.", values };
  }
  if (!user.is_admin && isAdminPhone(phone)) {
    await sql`UPDATE users SET is_admin = true WHERE id = ${user.id}`;
  }
  await createSession(user.id);
  redirect(safeNext(field(formData, "next")) ?? "/productos");
}

export async function logout() {
  await deleteSession();
  redirect("/");
}

export async function updateProfile(_: FormState, formData: FormData): Promise<FormState> {
  const user = await requireUser("/cuenta");
  const name = field(formData, "name");
  const unit = field(formData, "unit");
  if (name.length < 2) return { error: "Escribe tu nombre." };
  if (!unit) return { error: "Indica tu torre y número de departamento." };
  const condoId = await resolveCondo(formData);
  if (typeof condoId === "string") return { error: condoId };
  const sql = await db();
  await sql`UPDATE users SET name = ${name}, unit = ${unit}, condo_id = ${condoId} WHERE id = ${user.id}`;
  revalidatePath("/", "layout");
  return { ok: "Datos guardados." };
}

export async function changePassword(_: FormState, formData: FormData): Promise<FormState> {
  const user = await requireUser("/cuenta");
  const current = String(formData.get("current") ?? "");
  const next = String(formData.get("password") ?? "");
  if (next.length < 6) return { error: "La nueva contraseña debe tener al menos 6 caracteres." };
  const sql = await db();
  const [row] = await sql`SELECT password_hash FROM users WHERE id = ${user.id}`;
  if (!row || !(await bcrypt.compare(current, row.password_hash))) {
    return { error: "Tu contraseña actual no es correcta." };
  }
  await sql`UPDATE users SET password_hash = ${await bcrypt.hash(next, 10)} WHERE id = ${user.id}`;
  return { ok: "Contraseña actualizada." };
}
