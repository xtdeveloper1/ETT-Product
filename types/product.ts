// Database types
export interface DatabaseProduct {
  id: string | number;
  category_id: string | number;
  subcategory_id: string | number | null;
  name: string;
  slug: string;
  description: string;
  price: number;
  old_price: number | null;
  rating: number | null;
  rating_count: number | null;
  discount: string | null;
  image_url: string;
  featured: boolean;
  created_at: string;
  short_description: string | null;
  stock: number;
  is_active: boolean;
}

export interface DatabaseProductImage {
  id: string | number;
  product_id: string | number;
  image_url: string;
}

export interface DatabaseProductFeature {
  id: string | number;
  product_id: string | number;
  feature: string;
}

export interface DatabaseProductSpecification {
  id: string | number;
  product_id: string | number;
  spec_key: string;
  spec_value: string;
}

export interface DatabaseCategory {
  id: string | number;
  name: string;
  slug?: string;
  parent_id?: string | number | null;
}

// UI types
export interface Product extends DatabaseProduct {
  category?: DatabaseCategory;
}

export interface ProductWithDetails extends Product {
  images: DatabaseProductImage[];
  features: DatabaseProductFeature[];
  specifications: DatabaseProductSpecification[];
}

// Form types
export interface ProductFormData {
  name: string;
  slug: string;
  category_id: string;
  price: string;
  old_price: string;
  description: string;
  stock: string;
  featured: boolean;
  is_active: boolean;
  short_description?: string;
}

export interface UploadedImage {
  file?: File;
  preview: string;
  url?: string;
  id?: string | number;
}

// Cart types
export interface CartItem {
  id: string | number;
  name: string;
  price: number;
  image_url: string;
  category_id: string | number;
  quantity: number;
  slug: string;
}
