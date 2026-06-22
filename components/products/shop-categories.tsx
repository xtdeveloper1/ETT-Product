import Image from "next/image";
import Link from "next/link";
import { categoryHref, fetchCategories } from "@/services/category-service";

export default async function ShopCategories() {
  const categories = (await fetchCategories()).filter((category) => category.parent_id == null);
  return (
    <section className="max-w-7xl mx-auto px-6 py-10">

      <h2 className="text-4xl font-bold mb-8">
        All Product Categories
      </h2>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-4">

        {categories.map((item) => (
          <Link
            key={item.id}
            href={categoryHref(item)}
            className="group block bg-white rounded-3xl border overflow-hidden cursor-pointer hover:shadow-lg transition"
          >
            <div className="relative overflow-hidden">
              <Image
                src="/images/categories/street-light.jpg"
                alt={item.name}
                width={500}
                height={400}
                className="h-56 w-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>

            <div className="p-5">
              <h3 className="font-semibold text-lg">
                {item.name}
              </h3>
            </div>
          </Link>
        ))}

      </div>
    </section>
  );
}
