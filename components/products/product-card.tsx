"use client";

import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";
import { useCart } from "@/hooks/use-cart";

const parseCurrency = (value: string) => Number(value.replace(/[^\d]/g, ""));
const toProductId = (product: ProductProps["product"]) =>
  product.href?.split("/").filter(Boolean).pop() ||
  product.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

interface ProductProps {
  product: {
    category: string;
    name: string;
    price: string;
    oldPrice: string;
    rating: string;
    discount: string;
    image: string;
    href?: string;
  };
}

interface ProductCardProps extends ProductProps {
  product_id?: number; // numeric ID from Supabase
  category_id?: string | number; // category ID from Supabase
}

export default function ProductCard({ product, product_id, category_id }: ProductCardProps) {
  const { addItem } = useCart();
  const ratingParts = product.rating.split("(");
  const ratingValue = ratingParts[0].trim();
  const ratingCount = ratingParts[1] ? `(${ratingParts[1]}` : "";

  const handleAddToCart = () => {
    // Use href to extract slug, or fallback to product name
    const slug = toProductId(product);
    
    addItem({
      id: slug, // slug as the cart key
      product_id: product_id, // numeric ID from Supabase
      name: product.name,
      category_id: category_id ?? product.category, // Use category_id if provided, fallback to category name
      category_name: product.category,
      price: parseCurrency(product.price),
      old_price: parseCurrency(product.oldPrice),
      image_url: product.image, // Store image URL
      slug: slug, // Store slug
      href: product.href, // Store href
      quantity: 1,
    });
  };

  const content = (
    <>
      <div className="relative bg-white">
        <span className="absolute left-3 top-3 z-10 rounded-full bg-[#0B1220] px-3 py-1.5 text-[11px] font-bold leading-none tracking-[0.04em] text-white sm:left-3 sm:top-3 sm:text-xs">
          {product.discount}
        </span>

        <div className="relative h-[184px] w-full bg-white sm:aspect-square sm:h-auto">
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="h-full w-full object-contain p-4 sm:p-4"
          />
        </div>
      </div>

      <div className="px-4 pb-0 pt-3 sm:p-4 sm:pb-0">
        <p className="mb-2 text-[12px] font-semibold uppercase leading-[1.35] tracking-[0.18em] text-[#64748B] sm:text-xs">
          {product.category}
        </p>

        <h3 className="mb-2.5 line-clamp-2 min-h-[43px] text-[15px] font-bold leading-[1.35] text-[#0F172A] sm:text-sm">
          {product.name}
        </h3>

        <div className="mb-3 flex items-center gap-1 text-[13px] text-slate-600">
          <Star className="h-4 w-4 fill-[#315FCC] text-[#315FCC]" />
          <span className="font-medium text-[#1F2937]">{ratingValue}</span>
          {ratingCount && <span className="text-slate-500">{ratingCount}</span>}
        </div>
      </div>
    </>
  );

  return (
    <div className="overflow-hidden rounded-[21px] border border-[#DDE3EC] bg-white transition-all duration-300 hover:-translate-y-[3px] hover:shadow-[0_10px_24px_rgba(15,23,42,0.08)] sm:rounded-[16px]">
      {product.href ? (
        <Link href={product.href} className="block">
          {content}
        </Link>
      ) : (
        content
      )}

      <div className="px-4 pb-4 sm:px-4 sm:pb-4">
        <div className="flex items-end justify-between gap-2 pt-1">
          <div>
            <p className="text-[18px] font-bold leading-none text-[#0F172A] sm:text-base">
              {product.price}
            </p>
            <p className="mt-1 text-[13px] leading-none text-slate-400 line-through">
              {product.oldPrice}
            </p>
          </div>

          <button
            type="button"
            onClick={handleAddToCart}
            className="h-9 rounded-full bg-[#315FCC] px-4 text-[13px] font-medium text-white shadow-[0_2px_7px_rgba(45,98,168,0.25)] transition hover:bg-[#24538F] sm:px-5 sm:text-xs"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
