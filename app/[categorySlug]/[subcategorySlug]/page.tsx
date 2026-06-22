import { notFound } from "next/navigation";
import CategoryListing from "@/components/categories/category-listing";
import { fetchCategoryBySlug } from "@/services/category-service";
import { fetchProductsForCategory } from "@/services/product-listing-service";

export default async function SubcategoryPage({ params }: { params: Promise<{ categorySlug: string; subcategorySlug: string }> }) {
  const { categorySlug, subcategorySlug } = await params;
  const [parent, category] = await Promise.all([
    fetchCategoryBySlug(categorySlug),
    fetchCategoryBySlug(subcategorySlug),
  ]);

  if (!parent || parent.parent_id != null || !category || String(category.parent_id) !== String(parent.id)) notFound();
  const products = await fetchProductsForCategory(category);

  return <CategoryListing parent={parent} category={category} products={products.map((product) => ({
    id: Number(product.id), category: category.name, categoryId: String(category.id), name: product.name ?? "",
    price: Number(product.price ?? 0), oldPrice: Number(product.old_price ?? 0), rating: `${product.rating ?? 0} (${product.rating_count ?? 0})`,
    discount: product.discount ?? "", image: product.image_url ?? "", href: `/product/${product.slug}`,
  }))} />;
}
