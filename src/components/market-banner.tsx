import Image from "next/image";
import { AMBIENTE } from "@/lib/images";

export function MarketBanner({ title }: { title: string }) {
  return (
    <div className="relative h-28 overflow-hidden rounded-3xl bg-board">
      <Image src={AMBIENTE.mercado} alt="" fill sizes="(min-width: 448px) 448px, 100vw" className="object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/10" />
      <p className="absolute bottom-2 left-4 font-hand text-4xl font-bold text-white drop-shadow">{title}</p>
    </div>
  );
}
