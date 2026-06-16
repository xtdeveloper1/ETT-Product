"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import { formatCurrency } from "@/store/cart-store";

interface Product {
  id: number;
  name: string;
  price: number;
  old_price: number;
  image_url: string;
  slug: string;
  discount: string;
  rating: number;
  rating_count: number;
}

export default function RelatedProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRelatedProducts = async () => {
      try {
        const { data, error } = await supabase
          .from("products")
          .select("id, name, price, old_price, image_url, slug, discount, rating, rating_count")
          .limit(3);

        if (error) {
          console.error("Error fetching related products:", error);
        } else {
          setProducts(data || []);
        }
      } catch (error) {
        console.error("Failed to fetch related products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRelatedProducts();
  }, []);

  if (loading) {
    return (
      <section className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="text-lg md:text-xl font-bold mb-8 text-slate-900">
          You may also like
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white border border-slate-200 rounded-2xl overflow-hidden animate-pulse">
              <div className="bg-slate-200 h-64" />
              <div className="p-4 space-y-2">
                <div className="h-4 bg-slate-200 rounded w-3/4" />
                <div className="h-4 bg-slate-200 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (products.length === 0) {
    return null;
  }

  return (
    <section className="max-w-7xl mx-auto px-6 py-16">
      <h2 className="text-lg md:text-xl font-bold mb-8 text-slate-900">
        You may also like
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <Link 
            key={product.id} 
            href={`/product/${product.slug}`}
            className="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-lg transition block"
          >
            <div className="relative bg-slate-100 w-full overflow-hidden" style={{ paddingBottom: "100%" }}>
              {product.discount && (
                <span className="absolute top-3 left-3 z-10 bg-slate-900 text-white text-xs font-semibold px-2 py-1 rounded-full">
                  {product.discount}
                </span>
              )}
              <div className="absolute inset-0 flex items-center justify-center">
                <Image 
                  src={product.image_url || "/images/placeholder.jpg"} 
                  alt={product.name} 
                  width={300}
                  height={300}
                  className="w-full h-auto object-contain p-4"
                  unoptimized={(product.image_url || "").startsWith("http") || (product.image_url || "").includes("supabase")}
                />
              </div>
            </div>

            <div className="p-4">
              <h3 className="font-semibold text-sm text-slate-900 mb-2 line-clamp-2">
                {product.name}
              </h3>

              <div className="flex items-center gap-1 text-xs mb-3">
                <span className="text-blue-600">★</span>
                <span className="font-medium text-slate-600">
                  {product.rating} ({product.rating_count})
                </span>
              </div>

              <div className="flex items-center justify-between gap-2">
                <div>
                  <p className="text-base font-bold text-slate-900">
                    {formatCurrency(product.price)}
                  </p>
                  {product.old_price && (
                    <p className="text-xs line-through text-slate-400">
                      {formatCurrency(product.old_price)}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}