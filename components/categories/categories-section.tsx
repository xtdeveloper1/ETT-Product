import Link from "next/link";
import CategoryCard from "./category-card";
import { fetchCategories } from "@/services/category-service";

async function getCategories() {
  try {
    return (await fetchCategories()).filter((category) => category.parent_id == null);
  } catch (error) {
    console.error("Failed to load categories:", error);
    return [];
  }
}

export default async function CategoriesSection() {
  const categories = await getCategories();

  return (
    <section className="container-page py-9 md:py-20">
      <div className="mx-auto max-w-[424px] lg:max-w-7xl">

        <div className="mb-5 flex items-center justify-between gap-4">
          <h2 className="text-[20px] font-bold tracking-[-0.02em] leading-tight text-[#0F172A] md:text-2xl">
            Browse categories
          </h2>

          <Link
            href="/shop"
            className="shrink-0 text-sm font-medium text-[#2D62A8] hover:underline md:text-base"
          >
            View all
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-x-3.5 gap-y-4 md:grid-cols-4 md:gap-6">
          {categories.map((item) => (
            <CategoryCard
              key={item.id}
              title={item.name}
              image="/images/categories/street-light.jpg"
              href={`/shop?category=${item.slug}`}
            />
          ))}
        </div>

      </div>
    </section>
  );
}
