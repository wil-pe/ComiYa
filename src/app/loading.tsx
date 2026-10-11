export default function Loading() {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-2" role="status">
      <span className="animate-bounce text-5xl" aria-hidden>
        🧺
      </span>
      <span className="font-hand text-2xl text-leaf">Un ratito, casero…</span>
    </div>
  );
}
