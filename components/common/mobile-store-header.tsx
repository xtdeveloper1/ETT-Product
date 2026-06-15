"use client";

import Image from "next/image";
import Link from "next/link";
import { Menu, ShoppingBag, X } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/hooks/use-cart";

const MENU_LINKS = [
  { name: "Home", href: "/" },
  { name: "All Products", href: "/shop" },
  { name: "Solar Street Lights", href: "/shop?category=street-lights" },
  { name: "Solar Panels", href: "/shop?category=solar-panels" },
  { name: "Road Safety Products", href: "/shop?category=road-safety" },
  { name: "Contact", href: "/contact" },
];

export default function MobileStoreHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { isLoaded, totals } = useCart();

  return (
    <header className="sticky top-0 z-50 border-b border-[#E2E8F0] bg-[#FAFBFC]/95 backdrop-blur md:hidden">
      <div className="flex h-[64px] items-center justify-between px-[22px]">
        <Link href="/" className="flex min-w-0 items-center gap-1.5">
          <Image
            src="/images/brand/ett-green-logo.svg"
            alt="ETT logo"
            width={32}
            height={32}
            className="h-8 w-8 rounded-full object-contain flex-shrink-0"
            priority
          />
          <span className="truncate text-[12px] font-bold text-[#111827]">
            ENVIRO TECH
          </span>
        </Link>

        <div className="flex items-center gap-3">
          <Link
            href="/cart"
            aria-label="Cart"
            className="relative flex h-9 w-9 items-center justify-center rounded-full text-[#111827]"
          >
            <ShoppingBag className="h-[22px] w-[22px]" />
            <span className="absolute -right-0.5 -top-1 flex h-[22px] w-[22px] items-center justify-center rounded-full bg-[#315FCC] text-[11px] font-semibold text-white">
              {isLoaded ? totals.itemCount : 0}
            </span>
          </Link>

          <button
            type="button"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMenuOpen((open) => !open)}
            className="flex h-9 w-9 items-center justify-center rounded-full text-[#111827]"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav className="border-t border-[#E2E8F0] bg-[#FAFBFC] px-[22px] py-3 shadow-[0_18px_34px_rgba(15,23,42,0.06)]">
          <div className="flex flex-col gap-1">
            {MENU_LINKS.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="rounded-xl px-3 py-3 text-sm font-medium text-slate-700 hover:bg-white hover:text-[#315FCC]"
              >
                {link.name}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
