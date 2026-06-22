import { supabase } from "@/lib/supabase";
import type { Category } from "@/types/category";

export interface ListingProductRow {
  id: number | string;
  category_id: number | string | null;
  subcategory_id: number | string | null;
  name: string | null;
  slug: string | null;
  price: number | string | null;
  old_price: number | string | null;
  rating: number | string | null;
  rating_count: number | string | null;
  discount: string | null;
  image_url: string | null;
}

const PRODUCT_FIELDS = "id, name, slug, price, old_price, rating, rating_count, discount, image_url, category_id, subcategory_id";

export async function fetchProductsForCategory(category: Category): Promise<ListingProductRow[]> {
  const isSubcategory = category.parent_id != null;
  const queryColumn = isSubcategory ? "subcategory_id" : "category_id";

  console.info("[category-products] current category id:", isSubcategory ? category.parent_id : category.id);
  console.info("[category-products] current subcategory id:", isSubcategory ? category.id : null);

  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_FIELDS)
    .eq(queryColumn, category.id)
    .eq("is_active", true)
    .order("id", { ascending: true });

  if (error) throw error;

  const products = (data ?? []) as ListingProductRow[];
  console.info("[category-products] product count returned:", products.length);
  return products;
}

