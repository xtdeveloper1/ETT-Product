"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, ShoppingBag, ChevronDown, Menu, X } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/hooks/use-cart";

export default function Navbar() {
  const router = useRouter();
  const [shopOpen, setShopOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const { isLoaded, totals } = useCart();

  const categories = [
    { name: "All Products", href: "/shop" },
    { name: "Solar Street Lights", href: "/shop?category=street-lights" },
    { name: "Solar Panels", href: "/shop?category=solar-panels" },
   { name: "Road Safety Products", href: "/shop?category=road-safety" },
  ];

  const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const query = searchTerm.trim();
    router.push(query ? `/shop?search=${encodeURIComponent(query)}` : "/shop");
    setMobileSearchOpen(false);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-[#E2E8F0] bg-[#FAFBFC]/95 backdrop-blur">
      <div className="container-page flex h-auto items-center justify-between gap-3 py-3">

        {/* Logo */}

        <Link href="/" className="flex items-center flex-shrink-0">

          <Image
            src="/images/brand/ett-green-logo.png"
            alt="ETT logo"
            width={100}
            height={100}
            className="h-18 w-18 sm:h-16 sm:w-16 lg:h-20 lg:w-20 object-contain"
            priority
          />

        </Link>

        {/* Menu */}

        <nav className="hidden md:flex items-center gap-8">

          <Link
            href="/"
            className="text-base font-medium text-slate-700 hover:text-[#2D62A8]"
          >
            Home
          </Link>

          <div className="relative">

            <button
              onClick={() => setShopOpen(!shopOpen)}
              className="flex items-center gap-1 text-base font-medium text-slate-700 hover:text-[#2D62A8]"
            >
              Shop

              <ChevronDown
                size={16}
                className={`transition-transform ${
                  shopOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {shopOpen && (
              <div className="absolute left-0 top-10 w-60 overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white shadow-xl">

                {categories.map((category) => (
                  <Link
                    key={category.name}
                    href={category.href}
                    onClick={() => setShopOpen(false)}
                    className="block px-4 py-3 text-sm text-slate-600 hover:bg-[#FAFBFC] hover:text-[#2D62A8]"
                  >
                    {category.name}
                  </Link>
                ))}

              </div>
            )}

          </div>

          <Link
            href="/contact"
            className="text-base font-medium text-slate-700 hover:text-[#2D62A8]"
          >
            Contact
          </Link>

        </nav>

        {/* Search */}

        <form
          onSubmit={handleSearchSubmit}
          className="hidden lg:flex h-11 w-[280px] items-center gap-2 rounded-full border border-[#E2E8F0] bg-white px-4"
        >

          <button
            type="submit"
            aria-label="Search products"
            className="flex shrink-0 items-center justify-center text-slate-400 transition hover:text-[#2D62A8]"
          >
            <Search size={16} />
          </button>

          <input
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search products..."
            className="w-full bg-transparent text-base font-normal outline-none placeholder:text-slate-400"
          />

        </form>

        {/* Cart */}

        <div className="flex items-center gap-2">
        <button
          type="button"
          aria-label="Search products"
          onClick={() => setMobileSearchOpen((open) => !open)}
          className="hidden h-10 w-10 items-center justify-center rounded-full border border-[#E2E8F0] bg-white text-slate-700 transition hover:text-[#2D62A8] lg:hidden"
        >
          <Search size={18} />
        </button>

        <Link href="/cart" className="relative flex h-10 w-10 items-center justify-center rounded-full text-[#0F172A] transition hover:bg-white">

          <ShoppingBag className="h-5 w-5 text-slate-700" />

          <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#2D62A8] text-[9px] font-semibold text-white">
            {isLoaded ? totals.itemCount : 0}
          </span>

        </Link>

        <button
          type="button"
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          onClick={() => setMobileMenuOpen((open) => !open)}
          className="flex h-10 w-10 items-center justify-center rounded-full text-[#0F172A] transition hover:bg-white hover:text-[#2D62A8] md:hidden"
        >
          {mobileMenuOpen ? <X size={19} /> : <Menu size={19} />}
        </button>
        </div>

      </div>

      {mobileSearchOpen && (
        <form
          onSubmit={handleSearchSubmit}
          className="container-page pb-4 lg:hidden"
        >
          <div className="flex h-11 items-center gap-2 rounded-full border border-slate-200 bg-white px-4">
            <button
              type="submit"
              aria-label="Search products"
              className="flex shrink-0 items-center justify-center text-slate-400 transition hover:text-[#2D62A8]"
            >
              <Search size={16} />
            </button>

            <input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search products..."
              className="w-full min-w-0 bg-transparent text-base font-normal outline-none placeholder:text-slate-400"
            />
          </div>
        </form>
      )}

      {mobileMenuOpen && (
        <nav className="container-page border-t border-[#E2E8F0] bg-[#FAFBFC] py-3 shadow-[0_18px_34px_rgba(15,23,42,0.06)] md:hidden">
          <div className="flex flex-col gap-1">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-xl px-3 py-3 text-sm font-medium text-slate-700 hover:bg-white hover:text-[#2D62A8]"
            >
              Home
            </Link>

            {categories.map((category) => (
              <Link
                key={category.name}
                href={category.href}
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-xl px-3 py-3 text-sm font-medium text-slate-700 hover:bg-white hover:text-[#2D62A8]"
              >
                {category.name}
              </Link>
            ))}

            <Link
              href="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-xl px-3 py-3 text-sm font-medium text-slate-700 hover:bg-white hover:text-[#2D62A8]"
            >
              Contact
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
