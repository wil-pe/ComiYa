"use client";

import Image from "next/image";
import { Suspense, useMemo, useState } from "react";
import { BRAND } from "@/config";
import { productInfo } from "@/data/product-info";
import { CATEGORIES, type Product } from "@/data/products";
import { ProductCard } from "@/components/product-card";
import { ProductSheet } from "@/components/product-sheet";
import { categoryImage } from "@/lib/images";

function normalize(text: string) {
  return text.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();
}

function CategoryThumb({ id, emoji }: { id: string; emoji: string }) {
  const src = categoryImage(id);
  return (
    <span className="relative flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-kraft">
      {src ? <Image src={src} alt="" fill sizes="32px" className="object-cover" /> : emoji}
    </span>
  );
}

function Grid({ products }: { products: Product[] }) {
  return (
    <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

export function Catalog({ products }: { products: Product[] }) {
  const [query, setQuery] = useState("");

  // Texto donde buscar: nombre, categoría y otros nombres ("aguacate", "cilantro"…).
  const haystacks = useMemo(
    () =>
      new Map(
        products.map((p) => {
          const category = CATEGORIES.find((c) => c.id === p.category)?.label ?? "";
          const aliases = productInfo(p.id, p.category).aliases ?? [];
          return [p.id, normalize([p.name, category, ...aliases].join(" "))];
        }),
      ),
    [products],
  );
  const words = normalize(query).split(/\s+/).filter(Boolean);
  const results = words.length
    ? products.filter((p) => words.every((word) => haystacks.get(p.id)?.includes(word)))
    : null;

  return (
    <>
      <div className="sticky top-14 z-10 -mx-4 mt-4 bg-cream/95 px-4 pt-2 pb-2 backdrop-blur">
        <label className="relative block">
          <span className="sr-only">Buscar productos</span>
          <span className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-lg" aria-hidden>
            🔎
          </span>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Busca: pollo, palta, limón…"
            enterKeyHint="search"
            autoComplete="off"
            className="w-full rounded-full border-0 bg-white py-3 pr-4 pl-11 text-base ring-1 ring-stone-300 focus:ring-2 focus:ring-leaf focus:outline-none"
          />
        </label>
        {!results && (
          <nav className="no-scrollbar -mx-4 mt-2 flex gap-2 overflow-x-auto px-4" aria-label="Categorías">
            {CATEGORIES.map((category) => (
              <a
                key={category.id}
                href={`#${category.id}`}
                className="flex shrink-0 items-center gap-2 rounded-full bg-white py-1 pr-3.5 pl-1 text-sm font-bold whitespace-nowrap ring-1 ring-stone-200 hover:ring-leaf"
              >
                <CategoryThumb id={category.id} emoji={category.emoji} />
                {category.label}
              </a>
            ))}
          </nav>
        )}
      </div>

      {results ? (
        <section className="pt-4" aria-live="polite">
          <p className="font-bold">
            {results.length === 1 ? "1 producto" : `${results.length} productos`} para «{query.trim()}»
          </p>
          {results.length ? (
            <Grid products={results} />
          ) : (
            <div className="mt-3 rounded-3xl bg-white p-6 text-center ring-1 ring-stone-200">
              <p className="text-4xl">🧺</p>
              <p className="mt-2 font-bold">Todavía no lo tenemos en el puesto</p>
              <p className="text-stone-500">Cuéntanos qué buscas y lo traemos del mercado.</p>
              <a
                href={`https://wa.me/${BRAND.whatsapp}?text=${encodeURIComponent(`Hola, ¿pueden traerme ${query.trim()}?`)}`}
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-block rounded-full bg-[#25d366] px-5 py-2.5 font-bold text-white"
              >
                💬 Pedirlo por WhatsApp
              </a>
            </div>
          )}
        </section>
      ) : (
        CATEGORIES.map((category) => {
          const list = products.filter((p) => p.category === category.id);
          if (!list.length) return null;
          const banner = categoryImage(category.id);
          return (
            <section key={category.id} id={category.id} className="scroll-mt-40 pt-6">
              <div className="relative h-24 overflow-hidden rounded-3xl bg-board sm:h-28">
                {banner && <Image src={banner} alt="" fill sizes="(min-width: 1024px) 1000px, 100vw" className="object-cover" />}
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/35 to-transparent" />
                <h2 className="absolute bottom-2 left-4 font-hand text-4xl font-bold text-white drop-shadow sm:text-5xl">
                  {category.label}
                </h2>
              </div>
              <Grid products={list} />
            </section>
          );
        })
      )}

      <Suspense fallback={null}>
        <ProductSheet products={products} />
      </Suspense>
    </>
  );
}
