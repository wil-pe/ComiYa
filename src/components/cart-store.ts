"use client";

import { useSyncExternalStore } from "react";

export type CartState = Record<string, number>;

const KEY = "comiya_cart_v1";
const EMPTY: CartState = {};
const listeners = new Set<() => void>();
let snapshot: { raw: string | null; cart: CartState } = { raw: null, cart: EMPTY };

function read(): CartState {
  let raw: string | null = null;
  try {
    raw = window.localStorage.getItem(KEY);
  } catch {
    return snapshot.cart;
  }
  if (raw !== snapshot.raw) {
    let cart: CartState = EMPTY;
    try {
      const parsed = raw ? JSON.parse(raw) : {};
      if (parsed && typeof parsed === "object") cart = parsed;
    } catch {}
    snapshot = { raw, cart };
  }
  return snapshot.cart;
}

function write(cart: CartState) {
  const raw = JSON.stringify(cart);
  snapshot = { raw, cart };
  try {
    window.localStorage.setItem(KEY, raw);
  } catch {}
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  window.addEventListener("storage", listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", listener);
  };
}

export function useCart(): CartState {
  return useSyncExternalStore(subscribe, read, () => EMPTY);
}

export function setQty(id: string, qty: number) {
  const next = { ...read() };
  if (qty > 0) next[id] = Math.round(qty * 100) / 100;
  else delete next[id];
  write(next);
}

export function clearCart() {
  write({});
}

export function replaceCart(cart: CartState) {
  write(cart);
}
