"use client";

import Image from "next/image";
import { Trash2 } from "lucide-react";
import { CartItem as CartItemType, formatCurrency } from "@/store/cart-store";

interface CartItemProps {
  item: CartItemType;
  onQuantityChange: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
}

export default function CartItem({
  item,
  onQuantityChange,
  onRemove,
}: CartItemProps) {
  return (
    <div className="grid grid-cols-[112px_minmax(0,1fr)_auto] gap-x-4 border-b border-[#DDE3EC] bg-white p-4 last:border-b-0 sm:flex sm:items-center sm:gap-6 sm:p-6">

      <div className="relative col-start-1 row-span-2 h-[110px] w-[110px] flex-shrink-0 overflow-hidden rounded-[18px] bg-[#F8FAFC] sm:h-24 sm:w-24 sm:rounded-lg">
        <Image
          src={item.image_url}
          alt={item.name}
          fill
          sizes="110px"
          className="object-contain p-2"
        />
      </div>

      <div className="col-start-2 min-w-0 flex-1">
        <h3 className="text-[16px] font-bold leading-[1.3] text-slate-900">
          {item.name}
        </h3>

        <p className="mt-2 text-[14px] font-medium leading-none text-slate-500">
          {item.category_name || "Category"}
        </p>

        <div className="mt-4 flex h-11 w-fit items-center overflow-hidden rounded-full border border-[#DDE3EC] bg-white">
          <button
            type="button"
            onClick={() => onQuantityChange(item.id, item.quantity - 1)}
            className="flex h-full w-11 items-center justify-center text-[21px] font-normal text-slate-500 hover:bg-slate-100"
            aria-label={`Decrease quantity for ${item.name}`}
          >
            −
          </button>

          <span className="flex h-full min-w-9 items-center justify-center text-[16px] font-bold text-slate-900">
            {item.quantity}
          </span>

          <button
            type="button"
            onClick={() => onQuantityChange(item.id, item.quantity + 1)}
            className="flex h-full w-11 items-center justify-center text-[21px] font-normal text-slate-500 hover:bg-slate-100"
            aria-label={`Increase quantity for ${item.name}`}
          >
            +
          </button>
        </div>
      </div>

      <div className="col-start-3 row-span-2 flex flex-col items-end justify-between gap-4 text-right sm:w-auto">

        <h3 className="whitespace-nowrap text-[16px] font-bold leading-none text-slate-900 sm:text-lg">
          {formatCurrency(item.price * item.quantity)}
        </h3>

        <button
          type="button"
          onClick={() => onRemove(item.id)}
          className="flex min-h-11 items-center gap-1.5 text-[13px] font-medium text-slate-500 transition hover:text-red-500 sm:mt-6 sm:text-sm"
        >
          <Trash2 className="h-4 w-4" />
          <span>Remove</span>
        </button>

      </div>

    </div>
  );
}
