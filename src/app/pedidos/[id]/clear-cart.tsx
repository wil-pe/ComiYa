"use client";

import { useEffect } from "react";
import { clearCart } from "@/components/cart-store";

export function ClearCart() {
  useEffect(() => {
    clearCart();
  }, []);
  return null;
}
