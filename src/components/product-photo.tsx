import Image from "next/image";
import { productImage } from "@/lib/images";

/** Foto del producto, o su emoji mientras no tenga foto. */
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
  const src = productImage(id);
  return (
    <div className={`relative overflow-hidden bg-kraft/50 ${className}`}>
      {src ? (
        <Image src={src} alt="" fill sizes={sizes} priority={priority} className="object-cover" />
      ) : (
        <span className="absolute inset-0 flex items-center justify-center text-4xl" aria-hidden>
          {emoji}
        </span>
      )}
    </div>
  );
}
