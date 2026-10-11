import "server-only";
import postgres from "postgres";

const url = process.env.DATABASE_URL ?? process.env.POSTGRES_URL;

export const hasDatabase = Boolean(url);

type Sql = postgres.Sql;

const globalForDb = globalThis as unknown as {
  comiyaSql?: Sql;
  comiyaSchema?: Promise<void>;
};

function client(): Sql {
  if (!url) {
    throw new Error("Falta DATABASE_URL: conecta una base de datos Postgres (Neon) en Vercel.");
  }
  globalForDb.comiyaSql ??= postgres(url, {
    max: 5,
    idle_timeout: 20,
    prepare: false,
    onnotice: () => {},
  });
  return globalForDb.comiyaSql;
}

async function createSchema(sql: Sql) {
  await sql`
    CREATE TABLE IF NOT EXISTS condos (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      district TEXT NOT NULL DEFAULT '',
      code TEXT NOT NULL UNIQUE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )`;
  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      phone TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      condo_id INTEGER REFERENCES condos(id),
      unit TEXT NOT NULL DEFAULT '',
      is_admin BOOLEAN NOT NULL DEFAULT false,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )`;
  await sql`
    CREATE TABLE IF NOT EXISTS subscriptions (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      weekday SMALLINT NOT NULL,
      delivery_time TEXT NOT NULL,
      start_date TEXT NOT NULL,
      items JSONB NOT NULL,
      payment_method TEXT NOT NULL,
      active BOOLEAN NOT NULL DEFAULT true,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )`;
  await sql`
    CREATE TABLE IF NOT EXISTS orders (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      condo_id INTEGER NOT NULL REFERENCES condos(id),
      subscription_id INTEGER REFERENCES subscriptions(id) ON DELETE SET NULL,
      delivery_date TEXT NOT NULL,
      delivery_time TEXT NOT NULL,
      items JSONB NOT NULL,
      super_total INTEGER NOT NULL,
      discount_bp INTEGER NOT NULL,
      subtotal INTEGER NOT NULL,
      credit_used INTEGER NOT NULL DEFAULT 0,
      total INTEGER NOT NULL,
      payment_method TEXT NOT NULL,
      payment_ref TEXT,
      status TEXT NOT NULL DEFAULT 'pendiente_pago',
      notes TEXT NOT NULL DEFAULT '',
      created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )`;
  await sql`
    CREATE UNIQUE INDEX IF NOT EXISTS orders_subscription_date
      ON orders (subscription_id, delivery_date) WHERE subscription_id IS NOT NULL`;
  await sql`CREATE INDEX IF NOT EXISTS orders_condo_date ON orders (condo_id, delivery_date)`;
  await sql`CREATE INDEX IF NOT EXISTS orders_user ON orders (user_id)`;
  // Columnas agregadas después de la primera versión.
  await sql`ALTER TABLE orders ADD COLUMN IF NOT EXISTS substitution TEXT NOT NULL DEFAULT 'similar'`;
  await sql`ALTER TABLE orders ADD COLUMN IF NOT EXISTS refund INTEGER NOT NULL DEFAULT 0`;
  await sql`ALTER TABLE orders ADD COLUMN IF NOT EXISTS refund_note TEXT NOT NULL DEFAULT ''`;
  await sql`ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS substitution TEXT NOT NULL DEFAULT 'similar'`;
  await sql`
    CREATE TABLE IF NOT EXISTS product_prices (
      product_id TEXT PRIMARY KEY,
      super_price INTEGER,
      available BOOLEAN NOT NULL DEFAULT true,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )`;
}

/** Cliente SQL listo para usar (crea las tablas la primera vez). */
export async function db(): Promise<Sql> {
  const sql = client();
  globalForDb.comiyaSchema ??= createSchema(sql).catch((error) => {
    globalForDb.comiyaSchema = undefined;
    throw error;
  });
  await globalForDb.comiyaSchema;
  return sql;
}
