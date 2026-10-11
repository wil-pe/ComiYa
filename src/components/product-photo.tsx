import Image from "next/image";
import { productImage } from "@/lib/images";

/** Foto del producto; el emoji queda detrás por si la foto no carga. */
export function ProductPhoto({
  id,
  emoji,
  className = "",
  sizes = "200px",
  priority = false,
}: {
  id: string;
  emoji: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
}) {
  return (
    <div className={`relative overflow-hidden bg-kraft/50 ${className}`}>
      <span className="absolute inset-0 flex items-center justify-center text-3xl" aria-hidden>
        {emoji}
      </span>
      <Image src={productImage(id)} alt="" fill sizes={sizes} priority={priority} className="object-cover" />
    </div>
  );
}
