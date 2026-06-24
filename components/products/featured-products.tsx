import Link from "next/link";
import ProductCard from "./product-card";
import { supabase } from "@/lib/supabase";

export default async function FeaturedProducts() {
  const { data: products, error } = await supabase
    .from("products")
    .select("id, name, price, old_price, rating, rating_count, discount, image_url, slug, category_id")
    .eq("featured", true)
    .order("id", { ascending: true })
    .limit(4);

  if (error) {
    console.error("FeaturedProducts fetch error:", error);
    return null;
  }

  if (!products || products.length === 0) {
    return null;
  }

  return (
    <section className="container-page py-9 md:py-20">
      <div className="mx-auto max-w-[424px] lg:max-w-7xl">
        <div className="mb-5 flex items-center justify-between gap-4">
          <h2 className="text-[20px] font-bold leading-tight tracking-[-0.02em] text-[#0F172A] md:text-2xl">
            Featured products
          </h2>

          <Link
            href="/shop"
            className="shrink-0 text-sm font-medium text-[#2D62A8] hover:underline md:text-base"
          >
            View all
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-3.5 md:grid-cols-4 md:gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={{
                category: "",
                name: product.name || "",
                price: `₹${Number(product.price).toLocaleString()}`,
                oldPrice: `₹${Number(product.old_price).toLocaleString()}`,
                rating: `${product.rating} (${product.rating_count})`,
                discount: product.discount || "",
                image: product.image_url || "/images/placeholder.jpg",
                href: `/product/${product.slug}`,
              }}
              product_id={product.id}
              category_id={product.category_id}
            />
          ))}
        </div>
      </div>
    </section>
  );
}