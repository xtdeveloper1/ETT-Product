"use client";

export interface CartItem {
  id: string; // slug for cart key
  product_id?: number | string; // numeric ID from Supabase for order_items
  name: string;
  category_id: string | number;
  category_name?: string; // For display purposes
  price: number;
  old_price?: number;
  image_url: string;
  slug?: string;
  href?: string;
  quantity: number;
}

export type AddCartItemInput = Omit<CartItem, "quantity"> & {
  quantity?: number;
};

export const CART_STORAGE_KEY = "suryakart-cart";
export const CART_UPDATED_EVENT = "suryakart-cart-updated";

const isBrowser = () => typeof window !== "undefined";

export function readCart(): CartItem[] {
  if (!isBrowser()) {
    return [];
  }

  try {
    const value = window.localStorage.getItem(CART_STORAGE_KEY);
    if (!value) {
      return [];
    }

    const parsed = JSON.parse(value);
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter((item): item is CartItem => {
      return (
        typeof item?.id === "string" &&
        typeof item?.name === "string" &&
        (typeof item?.category_id === "string" || typeof item?.category_id === "number") &&
        typeof item?.price === "number" &&
        typeof item?.image_url === "string" &&
        typeof item?.quantity === "number"
      );
    });
  } catch {
    return [];
  }
}

export function writeCart(items: CartItem[]) {
  if (!isBrowser()) {
    return;
  }

  window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  window.dispatchEvent(new Event(CART_UPDATED_EVENT));
}

export function getCartTotals(items: CartItem[]) {
  const itemCount = items.reduce((total, item) => total + item.quantity, 0);
  const subtotal = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return {
    itemCount,
    subtotal,
    total: subtotal,
  };
}

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

export function clearCart() {
  if (!isBrowser()) {
    return;
  }

  window.localStorage.removeItem(CART_STORAGE_KEY);
  window.dispatchEvent(new Event(CART_UPDATED_EVENT));
}
