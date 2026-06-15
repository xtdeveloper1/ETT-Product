import Image from "next/image";
import Link from "next/link";

const categories = [
  {
    title: "Solar Street Lights",
    image: "/images/categories/street-light.jpg",
    slug: "street-lights",
  },
  {
    title: "Solar Panels",
    image: "/images/categories/panel.jpg",
    slug: "solar-panels",
  },
  {
    title: "Solar Water Pumps",
    image: "/images/categories/pump.jpg",
    slug: "water-pumps",
  },
  {
    title: "Road Safety Products",
    image: "/images/categories/road.jpg",
    slug: "road-safety",
  },
];

export default function ShopCategories() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-10">

      <h2 className="text-4xl font-bold mb-8">
        All Product Categories
      </h2>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-4">

        {categories.map((item) => (
          <Link
            key={item.slug}
            href={`/shop?category=${item.slug}`}
            className="group block bg-white rounded-3xl border overflow-hidden cursor-pointer hover:shadow-lg transition"
          >
            <div className="relative overflow-hidden">
              <Image
                src={item.image}
                alt={item.title}
                width={500}
                height={400}
                className="h-56 w-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>

            <div className="p-5">
              <h3 className="font-semibold text-lg">
                {item.title}
              </h3>
            </div>
          </Link>
        ))}

      </div>
    </section>
  );
}
