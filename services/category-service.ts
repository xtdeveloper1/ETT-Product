import { supabase } from "@/lib/supabase";
import type { Category, CategoryNode } from "@/types/category";

export async function fetchCategories(): Promise<Category[]> {
  console.time("fetchCategories");
  const { data, error } = await supabase
    .from("categories")
    .select("id, name, slug, parent_id, image_url")
    .order("name", { ascending: true });
  console.timeEnd("fetchCategories");

  if (error) {
    console.warn("[fetchCategories] Supabase error:", error instanceof Error ? error.message : JSON.stringify(error));
    throw new Error(error.message ?? JSON.stringify(error));
  }

  console.info("[fetchCategories] loaded categories:", (data ?? []).length);
  return (data ?? []) as Category[];
}

export async function fetchCategoryBySlug(slug: string): Promise<Category | null> {
  console.time(`fetchCategoryBySlug:${slug}`);
  const { data, error } = await supabase
    .from("categories")
    .select("id, name, slug, parent_id, image_url")
    .eq("slug", slug)
    .maybeSingle();
  console.timeEnd(`fetchCategoryBySlug:${slug}`);

  if (error) {
    console.warn(`[fetchCategoryBySlug:${slug}] Supabase error:`, error instanceof Error ? error.message : JSON.stringify(error));
    throw new Error(error.message ?? JSON.stringify(error));
  }
  return data as Category | null;
}

export function buildCategoryTree(categories: Category[]): CategoryNode[] {
  const nodes = new Map<string, CategoryNode>();
  categories.forEach((category) => {
    nodes.set(String(category.id), { ...category, children: [] });
  });

  const roots: CategoryNode[] = [];
  nodes.forEach((node) => {
    const parent = node.parent_id == null ? null : nodes.get(String(node.parent_id));
    if (parent) parent.children.push(node);
    else roots.push(node);
  });
  return roots;
}

export function categoryHref(category: Category, parent?: Category): string {
  if ((category as any).href) return (category as any).href;
  if (parent) return `/${parent.slug}/${category.slug}`;
  // Link root categories to their dedicated page for consistent server-side rendering
  return `/${category.slug}`;
}
