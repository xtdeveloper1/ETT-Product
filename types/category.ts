export interface Category {
  id: string | number;
  name: string;
  slug: string;
  parent_id: string | number | null;
  image_url?: string | null;
}

export interface CategoryNode extends Category {
  children: CategoryNode[];
}
