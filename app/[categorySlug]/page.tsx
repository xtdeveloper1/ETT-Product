import { notFound } from "next/navigation";
import CategoryListing from "@/components/categories/category-listing";
import { fetchCategoryBySlug } from "@/services/category-service";
import { fetchProductsForCategory } from "@/services/product-listing-service";

export default async function RootCategoryPage({ params }: { params: Promise<{ categorySlug: string }> }) {
  const { categorySlug } = await params;
  const parent = await fetchCategoryBySlug(categorySlug);

  if (!parent || parent.parent_id != null) notFound();

  const products = await fetchProductsForCategory(parent);

  return <CategoryListing parent={parent} products={products.map((product) => ({
    id: Number(product.id), category: parent.name, categoryId: String(product.category_id), name: product.name ?? "",
    price: Number(product.price ?? 0), oldPrice: Number(product.old_price ?? 0), rating: `${product.rating ?? 0} (${product.rating_count ?? 0})`,
    discount: product.discount ?? "", image: product.image_url ?? "", href: `/product/${product.slug}`,
  }))} />;
}
