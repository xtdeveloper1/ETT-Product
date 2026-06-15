"use client";

import { useEffect, useMemo, useState } from "react";
import {
  AddCartItemInput,
  CART_UPDATED_EVENT,
  CartItem,
  getCartTotals,
  readCart,
  writeCart,
} from "@/store/cart-store";

export function useCart() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const syncCart = () => {
      setItems(readCart());
      setIsLoaded(true);
    };

    syncCart();
    window.addEventListener(CART_UPDATED_EVENT, syncCart);
    window.addEventListener("storage", syncCart);

    return () => {
      window.removeEventListener(CART_UPDATED_EVENT, syncCart);
      window.removeEventListener("storage", syncCart);
    };
  }, []);

  const saveItems = (nextItems: CartItem[]) => {
    setItems(nextItems);
    writeCart(nextItems);
  };

  const addItem = (product: AddCartItemInput) => {
    const quantity = Math.max(1, product.quantity ?? 1);
    const currentItems = readCart();
    const existingItem = currentItems.find((item) => item.id === product.id);

    const nextItems = existingItem
      ? currentItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      : [...currentItems, { ...product, quantity }];

    saveItems(nextItems);
  };

  const updateQuantity = (id: string, quantity: number) => {
    const nextQuantity = Math.max(0, quantity);
    const nextItems = readCart()
      .map((item) =>
        item.id === id ? { ...item, quantity: nextQuantity } : item
      )
      .filter((item) => item.quantity > 0);

    saveItems(nextItems);
  };

  const removeItem = (id: string) => {
    saveItems(readCart().filter((item) => item.id !== id));
  };

  const clearCart = () => {
    saveItems([]);
  };

  const totals = useMemo(() => getCartTotals(items), [items]);

  return {
    items,
    isLoaded,
    totals,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
  };
}
