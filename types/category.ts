export interface Category {
  id: string | number;
  name: string;
  slug: string;
  parent_id: string | number | null;
}

export interface CategoryNode extends Category {
  children: CategoryNode[];
}
