import { supabase } from "@/lib/supabase";

export interface ProductSpecification {
  id: string;
  product_id: string;
  spec_group: string;
  name: string;
  value: string;
  sort_order?: number;
}

export interface ProductFeature {
  id: string;
  product_id: string;
  feature: string;
}

export interface ProductImage {
  id: string;
  product_id: string;
  image_url: string;
  alt: string;
  is_primary: boolean;
  sort_order?: number;
}

export interface ProductDetailsData {
  specifications: ProductSpecification[];
  features: ProductFeature[];
  images: ProductImage[];
}

/**
 * Product Specifications
 */
export async function fetchProductSpecifications(
  productId: string | number
): Promise<ProductSpecification[]> {
  try {
    const { data, error } = await supabase
      .from("product_specifications")
      .select("*")
      .eq("product_id", productId);

    if (error) {
      console.error("Error fetching specifications:", error);
      return [];
    }

    return (data || []) as ProductSpecification[];
  } catch (err) {
    console.error("Failed to fetch specifications:", err);
    return [];
  }
}

/**
 * Group Specifications
 */
export function groupSpecificationsByGroup(
  specifications: ProductSpecification[]
): Record<string, ProductSpecification[]> {
  return specifications.reduce(
    (acc, spec) => {
      if (!acc[spec.spec_group]) {
        acc[spec.spec_group] = [];
      }

      acc[spec.spec_group].push(spec);
      return acc;
    },
    {} as Record<string, ProductSpecification[]>
  );
}

/**
 * Product Features
 */
export async function fetchProductFeatures(
  productId: string | number
): Promise<ProductFeature[]> {
  try {
    const { data, error } = await supabase
      .from("product_features")
      .select("*")
      .eq("product_id", productId);

    if (error) {
      console.error("Error fetching features:", error);
      return [];
    }

    return (data || []) as ProductFeature[];
  } catch (err) {
    console.error("Failed to fetch features:", err);
    return [];
  }
}

/**
 * Product Images
 */
export async function fetchProductImages(
  productId: string | number
): Promise<ProductImage[]> {
  try {
    const { data, error } = await supabase
      .from("product_images")
      .select("*")
      .eq("product_id", productId);

    if (error) {
      console.error("Error fetching images:", error);
      return [];
    }

    return (data || []) as ProductImage[];
  } catch (err) {
    console.error("Failed to fetch images:", err);
    return [];
  }
}

/**
 * Fetch Complete Product Details
 */
export async function fetchProductDetails(
  productId: string | number
): Promise<ProductDetailsData> {
  try {
    const [specifications, features, images] = await Promise.all([
      fetchProductSpecifications(productId),
      fetchProductFeatures(productId),
      fetchProductImages(productId),
    ]);

    return {
      specifications,
      features,
      images,
    };
  } catch (err) {
    console.error("Failed to fetch product details:", err);

    return {
      specifications: [],
      features: [],
      images: [],
    };
  }
}