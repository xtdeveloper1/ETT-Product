"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import CartItem from "./cart-item";

export default function CartList() {
  const { items, isLoaded, updateQuantity, removeItem } = useCart();

  if (!isLoaded) {
    return (
      <div className="rounded-[22px] border border-[#DDE3EC] bg-white p-8 text-slate-500">
        Loading cart...
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="rounded-[22px] border border-[#DDE3EC] bg-white p-10 text-center">
        <ShoppingBag className="mx-auto h-10 w-10 text-slate-300" />
        <h2 className="mt-4 text-lg font-bold text-slate-900">
          Your cart is empty
        </h2>
        <p className="mt-2 text-sm text-slate-500">
          Add products from the shop and they will appear here.
        </p>
        <Link
          href="/shop"
          className="mt-6 inline-flex h-10 items-center justify-center rounded-full bg-blue-600 px-6 text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          Continue shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-[22px] border border-[#DDE3EC] bg-white">
      {items.map((item) => (
        <CartItem
          key={item.id}
          item={item}
          onQuantityChange={updateQuantity}
          onRemove={removeItem}
        />
      ))}
    </div>
  );
}
