import Link from "next/link";
import Navbar from "@/components/navbar/navbar";
import Footer from "@/components/common/footer";
import WhatsAppButton from "@/components/common/whatsapp-button";
import ShopProductsGrid from "@/components/products/shop-products-grid";

interface ListingProduct {
  id?: number;
  category: string;
  categoryId: string;
  name: string;
  price: number;
  oldPrice: number;
  rating: string;
  discount: string;
  image: string;
  href: string;
}

interface CategoryListingProps {
  parent: { name: string; slug: string };
  category?: { name: string; slug: string };
  products: ListingProduct[];
}

export default function CategoryListing({ parent, category, products }: CategoryListingProps) {
  const title = category?.name ?? parent.name;

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#F8FAFC]">
        <section className="mx-auto max-w-7xl px-[22px] py-8 sm:px-6 md:py-12">
          <nav aria-label="Breadcrumb" className="mb-5 flex flex-wrap items-center gap-2 text-sm text-slate-500">
            <Link href="/" className="hover:text-[#2D62A8]">Home</Link>
            <span aria-hidden="true">›</span>
            {category ? (
              <>
                <Link href={`/${parent.slug}`} className="hover:text-[#2D62A8]">{parent.name}</Link>
                <span aria-hidden="true">›</span>
                <span className="font-medium text-slate-900">{category.name}</span>
              </>
            ) : (
              <span className="font-medium text-slate-900">{parent.name}</span>
            )}
          </nav>

          <h1 className="mb-8 text-3xl font-bold text-slate-900">{title}</h1>
          <ShopProductsGrid products={products} />
        </section>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}

