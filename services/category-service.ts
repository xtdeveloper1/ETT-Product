import { supabase } from "@/lib/supabase";
import type { Category, CategoryNode } from "@/types/category";

export async function fetchCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from("categories")
    .select("id, name, slug, parent_id")
    .order("name", { ascending: true });

  if (error) throw error;
  return (data ?? []) as Category[];
}

export async function fetchCategoryBySlug(slug: string): Promise<Category | null> {
  const { data, error } = await supabase
    .from("categories")
    .select("id, name, slug, parent_id")
    .eq("slug", slug)
    .maybeSingle();

  if (error) throw error;
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
  if (parent) return `/${parent.slug}/${category.slug}`;
  return `/shop?category=${category.slug}`;
}
