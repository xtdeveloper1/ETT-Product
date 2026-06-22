"use client";

import { useState, useMemo, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Menu, Search, ShoppingBag, SlidersHorizontal } from "lucide-react";
import Navbar from "@/components/navbar/navbar";
import Footer from "@/components/common/footer";
import WhatsAppButton from "@/components/common/whatsapp-button";
import { useCart } from "@/hooks/use-cart";
import { supabase } from "@/lib/supabase";
import { buildCategoryTree, categoryHref, fetchCategories } from "@/services/category-service";
import type { Category, CategoryNode } from "@/types/category";

import ShopSidebar from "@/components/products/shop-sidebar";
import ShopToolbar from "@/components/products/shop-toolbar";
import ShopProductsGrid from "@/components/products/shop-products-grid";

interface Product {
  id?: number; // numeric ID from Supabase
  category: string;
  categoryId: string;
  parentCategoryId: string;
  name: string;
  price: number;
  oldPrice: number;
  rating: string;
  discount: string;
  image: string;
  href: string;
}

interface SupabaseProductRow {
  id: number;
  category_id: number | string | null;
  subcategory_id: number | string | null;
  name: string | null;
  slug: string | null;
  description: string | null;
  price: number | string | null;
  old_price: number | string | null;
  rating: number | string | null;
  rating_count: number | string | null;
  discount: string | null;
  image_url: string | null;
  featured: boolean | null;
}

export default function ShopPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { isLoaded, totals } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  
  const [priceRange, setPriceRange] = useState(100000);
  const [sortBy, setSortBy] = useState("featured");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearch, setMobileSearch] = useState(searchParams.get("search") ?? "");
  const selectedCategory = searchParams.get("category") || "all";
  const searchQuery = searchParams.get("search")?.trim() ?? "";

  useEffect(() => {
    let isMounted = true;

    const fetchProducts = async () => {
      const [productResult, categoryResult] = await Promise.all([
        supabase.from("products").select(`
          id,
          category_id,
          subcategory_id,
          name,
          slug,
          description,
          price,
          old_price,
          rating,
          rating_count,
          discount,
          image_url,
          featured
        `).order("id", { ascending: true }),
        fetchCategories(),
      ]);

      if (productResult.error) {
        console.error(productResult.error);
        return;
      }

      if (!isMounted) {
        return;
      }

      const categoryRows = categoryResult as Category[];
      const categoryById = new Map(categoryRows.map((category) => [String(category.id), category]));
      const mappedProducts = ((productResult.data ?? []) as SupabaseProductRow[]).map((product) => {
        const parent = categoryById.get(String(product.category_id));
        const subcategory = product.subcategory_id == null
          ? undefined
          : categoryById.get(String(product.subcategory_id));

        return {
          id: product.id,
          category: subcategory?.name ?? parent?.name ?? "",
          categoryId: subcategory?.slug ?? parent?.slug ?? String(product.category_id ?? ""),
          parentCategoryId: subcategory ? (parent?.slug ?? "") : "",
          name: product.name ?? "",
          price: Number(product.price ?? 0),
          oldPrice: Number(product.old_price ?? 0),
          rating: `${product.rating ?? 0} (${product.rating_count ?? 0})`,
          discount: product.discount ?? "",
          image: product.image_url ?? "",
          href: `/product/${product.slug ?? ""}`,
        };
      });

      setProducts(mappedProducts);
      setCategories(categoryRows);
    };

    fetchProducts();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleCategoryChange = (category: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (category === "all") {
      params.delete("category");
    } else {
      params.set("category", category);
    }

    const queryString = params.toString();
    router.replace(queryString ? `/shop?${queryString}` : "/shop", { scroll: false });
  };

  const handleMobileSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const query = mobileSearch.trim();
    router.replace(query ? `/shop?search=${encodeURIComponent(query)}` : "/shop", { scroll: false });
  };

  // Filter and sort products
  const filteredAndSortedProducts = useMemo(() => {
    let result = [...products];

    // Filter by category
    if (selectedCategory !== "all") {
      result = result.filter(p => p.categoryId === selectedCategory || p.parentCategoryId === selectedCategory);
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter((p) =>
        [p.name, p.category, p.categoryId, p.parentCategoryId].some((value) =>
          value.toLowerCase().includes(query)
        )
      );
    }

    // Filter by price
    result = result.filter(p => p.price <= priceRange);

    // Sort
    if (sortBy === "price-high") {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === "price-low") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === "newest") {
      // Keep reverse order for newest
      result.reverse();
    }
    // Default 'featured' keeps original order

    return result;
  }, [products, selectedCategory, searchQuery, priceRange, sortBy]);

  useEffect(() => {
    if (selectedCategory === "all") return;
    const current = categories.find((category) => category.slug === selectedCategory);
    console.info("[shop-filter] current category id:", current?.parent_id ?? current?.id ?? null);
    console.info("[shop-filter] current subcategory id:", current?.parent_id != null ? current.id : null);
    console.info("[shop-filter] product count returned:", filteredAndSortedProducts.length);
  }, [categories, filteredAndSortedProducts.length, selectedCategory]);

  return (
    <>
      <div className="hidden md:block">
        <Navbar />
      </div>

      <main className="min-h-screen bg-[#F6F8FC] md:bg-[#F8FAFC]">
        <header className="sticky top-0 z-50 border-b border-[#E2E8F0] bg-[#FAFBFC]/95 backdrop-blur md:hidden">
          <div className="flex h-[74px] items-center justify-between px-[22px]">
            <Link href="/" className="flex min-w-0 items-center gap-2.5">
              <Image
                src="/images/brand/ett-green-logo.svg"
                alt="ETT logo"
                width={40}
                height={40}
                className="h-10 w-10 rounded-full object-contain"
                priority
              />
              <span className="truncate text-[13px] font-bold text-[#111827] sm:text-[16px]">
                ENVIRO TECH TECHNOLOGIES
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
                aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
                onClick={() => setMobileMenuOpen((open) => !open)}
                className="flex h-9 w-9 items-center justify-center rounded-full text-[#111827]"
              >
                <Menu size={22} />
              </button>
            </div>
          </div>

          {mobileMenuOpen && (
            <nav className="border-t border-[#E2E8F0] bg-[#FAFBFC] px-[22px] py-3 shadow-[0_18px_34px_rgba(15,23,42,0.06)]">
              <div className="flex flex-col gap-1">
                <Link href="/" onClick={() => setMobileMenuOpen(false)} className="rounded-xl px-3 py-3 text-sm font-medium text-slate-700 hover:bg-white hover:text-[#315FCC]">Home</Link>
                <Link href="/shop" onClick={() => setMobileMenuOpen(false)} className="rounded-xl px-3 py-3 text-sm font-medium text-slate-700 hover:bg-white hover:text-[#315FCC]">All Products</Link>
                {buildCategoryTree(categories).map((category: CategoryNode) => (
                  <div key={category.id}>
                    <Link href={categoryHref(category)} onClick={() => setMobileMenuOpen(false)} className="block rounded-xl px-3 py-3 text-sm font-medium text-slate-700 hover:bg-white hover:text-[#315FCC]">{category.name}</Link>
                    {category.children.map((child) => (
                      <Link key={child.id} href={categoryHref(child, category)} onClick={() => setMobileMenuOpen(false)} className="ml-4 block rounded-xl px-3 py-2 text-sm text-slate-600 hover:bg-white hover:text-[#315FCC]">{child.name}</Link>
                    ))}
                  </div>
                ))}
                <Link href="/contact" onClick={() => setMobileMenuOpen(false)} className="rounded-xl px-3 py-3 text-sm font-medium text-slate-700 hover:bg-white hover:text-[#315FCC]">Contact</Link>
              </div>
            </nav>
          )}
        </header>

        <section className="mx-auto max-w-7xl px-[22px] py-4 sm:px-6 md:py-12">
          <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end sm:gap-8 md:mb-8">
            <div>
              <p className="mb-1.5 text-[13px] font-semibold uppercase tracking-[0.18em] text-[#697282] md:mb-2 md:text-sm">CATALOGUE</p>
              <h1 className="text-[29px] font-bold leading-[1.1] text-slate-900 md:text-xl">
                {searchQuery ? `Search results for "${searchQuery}"` : "All solar products"}
              </h1>
            </div>

            <div className="grid w-full grid-cols-[minmax(0,0.42fr)_minmax(0,1fr)_auto] gap-2 md:hidden">
              <form
                onSubmit={handleMobileSearchSubmit}
                className="flex h-12 min-w-0 items-center gap-1 overflow-hidden rounded-full border border-[#DDE3EC] bg-[#F8FAFC] px-3 text-[17px] text-[#697282] shadow-[0_2px_10px_rgba(15,23,42,0.04)]"
              >
                <button type="submit" aria-label="Search products" className="shrink-0">
                  <Search className="h-[17px] w-[17px]" />
                </button>
                <input
                  value={mobileSearch}
                  onChange={(event) => setMobileSearch(event.target.value)}
                  placeholder="Search"
                  className="min-w-0 bg-transparent outline-none placeholder:text-[#697282]"
                />
              </form>

              <ShopToolbar sortBy={sortBy} onSortChange={setSortBy} />

              <button
                type="button"
                onClick={() => setMobileFiltersOpen((open) => !open)}
                className="flex h-12 items-center justify-center gap-2 rounded-full border border-[#DDE3EC] bg-[#F8FAFC] px-4 text-[15px] font-semibold text-[#111827] shadow-[0_2px_10px_rgba(15,23,42,0.04)]"
              >
                <SlidersHorizontal className="h-[18px] w-[18px]" />
                Filters
              </button>
            </div>

            <div className="hidden md:block">
              <ShopToolbar sortBy={sortBy} onSortChange={setSortBy} />
            </div>
          </div>

          {mobileFiltersOpen && (
            <div className="mb-6 md:hidden">
              <ShopSidebar 
                selectedCategory={selectedCategory}
                onCategoryChange={handleCategoryChange}
                priceRange={priceRange}
                onPriceChange={setPriceRange}
              />
            </div>
          )}

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            <div className="hidden lg:col-span-3 lg:block">
              <ShopSidebar 
                selectedCategory={selectedCategory}
                onCategoryChange={handleCategoryChange}
                priceRange={priceRange}
                onPriceChange={setPriceRange}
              />
            </div>

            <div className="lg:col-span-9">
              <ShopProductsGrid products={filteredAndSortedProducts} />
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <WhatsAppButton />
    </>
  );
}
