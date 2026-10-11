export function DatabaseMissing() {
  return (
    <div className="mt-6 rounded-3xl bg-white p-5 ring-2 ring-sun">
      <p className="text-lg font-extrabold">⚙️ Falta conectar la base de datos</p>
      <p className="mt-1 text-stone-600">
        Las cuentas y pedidos necesitan una base de datos Postgres. En Vercel: <strong>Storage → Neon → Create</strong>,
        conéctala al proyecto y vuelve a desplegar. Las tablas se crean solas.
      </p>
    </div>
  );
}
