"use client";

import Link from "next/link";
import { formatCurrency } from "@/store/cart-store";
import { useCart } from "@/hooks/use-cart";

export default function CartSummary() {
  const { isLoaded, totals } = useCart();
  const hasItems = totals.itemCount > 0;

  return (
    <div className="h-fit rounded-[22px] border border-[#DDE3EC] bg-white p-7 md:sticky md:top-20 md:rounded-lg md:p-6">

      <h2 className="mb-7 text-[18px] font-bold text-slate-900 md:mb-6 md:text-xl">
        Order summary
      </h2>

      <div className="mb-7 space-y-5 md:mb-6 md:space-y-4">

        <div className="flex justify-between text-[16px] md:text-sm">
          <span className="font-medium text-slate-600">Subtotal</span>
          <span className="font-semibold text-slate-900">
            {isLoaded ? formatCurrency(totals.subtotal) : "Loading..."}
          </span>
        </div>

        <div className="hidden justify-between text-sm md:flex">
          <span className="font-medium text-slate-600">Items</span>
          <span className="font-semibold text-slate-900">
            {isLoaded ? totals.itemCount : 0}
          </span>
        </div>

        <div className="flex justify-between text-[16px] md:text-sm">
          <span className="font-medium text-slate-600">Shipping</span>
          <span className="font-semibold text-slate-900">
            Free
          </span>
        </div>

        <div className="flex justify-between border-t border-slate-200 pt-7 md:pt-4">
          <span className="text-[18px] font-bold text-slate-900 md:text-base">Total</span>
          <span className="text-[18px] font-bold text-slate-900 md:text-base">
            {isLoaded ? formatCurrency(totals.total) : "Loading..."}
          </span>
        </div>

      </div>

      <Link
        href={hasItems ? "/checkout" : "/shop"}
        className="flex h-11 w-full items-center justify-center rounded-full bg-[#315FCC] text-[16px] font-medium text-white transition hover:bg-blue-700 md:h-10 md:text-sm md:font-semibold"
      >
        {hasItems ? "Checkout" : "Shop products"}
      </Link>

      <p className="mt-4 text-center text-[13px] text-slate-500 md:text-xs">
        Secure payments via Razorpay · UPI · Cards · NetBanking
      </p>

    </div>
  );
}
