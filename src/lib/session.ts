import "server-only";
import { createHash } from "node:crypto";
import { cookies } from "next/headers";
import { jwtVerify, SignJWT } from "jose";

const COOKIE = "comiya_session";
const MAX_AGE_SECONDS = 60 * 60 * 24 * 60;

function secret(): Uint8Array {
  // AUTH_SECRET es lo recomendado; si falta, se deriva de la URL de la base de datos
  // (que también es secreta) para que el despliegue funcione sin configuración extra.
  const base =
    process.env.AUTH_SECRET ??
    process.env.DATABASE_URL ??
    process.env.POSTGRES_URL ??
    "comiya-dev-secret";
  return createHash("sha256").update(`comiya-session:${base}`).digest();
}

export async function createSession(userId: number) {
  const token = await new SignJWT({ uid: userId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${MAX_AGE_SECONDS}s`)
    .sign(secret());
  (await cookies()).set(COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE_SECONDS,
  });
}

export async function readSessionUserId(): Promise<number | null> {
  const token = (await cookies()).get(COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret(), { algorithms: ["HS256"] });
    return typeof payload.uid === "number" ? payload.uid : null;
  } catch {
    return null;
  }
}

export async function deleteSession() {
  (await cookies()).delete(COOKIE);
}
