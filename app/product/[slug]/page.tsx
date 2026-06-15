import Navbar from "@/components/navbar/navbar";
import ProductGallery from "@/components/products/product-gallery";
import ProductDetails, {
  type ProductDetailsProduct,
} from "@/components/products/product-details";
import ProductDescription from "@/components/products/product-description";
import ProductSpecifications from "@/components/products/product-specifications";
import RelatedProducts from "@/components/products/related-products";
import Footer from "@/components/common/footer";
import WhatsAppButton from "@/components/common/whatsapp-button";
import { supabase } from "@/lib/supabase";
import { fetchProductDetails } from "@/services/product-details-service";
import { notFound } from "next/navigation";

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

interface SupabaseProductRow {
  id: number | string;
  category_id: number | string | null;
  name: string | null;
  slug: string | null;
  description: string | null;
  price: number | string | null;
  old_price: number | string | null;
  rating: number | string | null;
  rating_count: number | string | null;
  discount: string | null;
  image_url: string | null;
  featured: boolean | null;
}

const getSaveLabel = (discount: string | null) => {
  if (!discount) return "";

  return `Save ${discount.replace(/\s*off$/i, "")}`;
};

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;

  const sanitizedSlug = slug
    .toLowerCase()
    .trim()
    .replace(/%20/g, "-")
    .replace(/[^\w-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");

  const { data, error } = await supabase
    .from("products")
    .select(
      `
      id,
      category_id,
      name,
      slug,
      description,
      price,
      old_price,
      rating,
      rating_count,
      discount,
      image_url,
      featured
    `
    )
    .eq("slug", sanitizedSlug)
    .single();

  if (error || !data) {
    console.error("Product not found:", error);
    notFound();
  }

  const productRow = data as SupabaseProductRow;

  const productSlug = productRow.slug ?? slug;
  const productId = productRow.id;

  // Fetch category name
  let categoryName = "";

  if (productRow.category_id) {
    const { data: categoryData } = await supabase
      .from("categories")
      .select("name")
      .eq("id", productRow.category_id)
      .single();

    categoryName = categoryData?.name ?? "";
  }

  // Fetch product details
  const productDetails = await fetchProductDetails(productId);

  const product: ProductDetailsProduct = {
    id: String(productSlug),
    product_id: Number(productRow.id),
    name: productRow.name ?? "",
    category_id: productRow.category_id ?? undefined,
    category_name: categoryName,
    price: Number(productRow.price ?? 0),
    old_price: Number(productRow.old_price ?? 0),
    oldPrice: Number(productRow.old_price ?? 0),
    rating: `${productRow.rating ?? 0} (${productRow.rating_count ?? 0} reviews)`,
    discount: getSaveLabel(productRow.discount),
    description: productRow.description ?? "",
    image: productRow.image_url ?? "",
    image_url: productRow.image_url ?? "",
    slug: String(productSlug),
    href: `/product/${productSlug}`,
  };

  const primaryImage =
    productDetails.images.find((img) => img.is_primary)?.image_url ||
    product.image;

  return (
    <>
      <Navbar />

      {/* Product Section */}
      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 md:py-8">
        <div className="grid gap-6 lg:gap-8 grid-cols-1 lg:grid-cols-2 items-start">
          {/* Image Gallery - Left */}
          <div>
            <ProductGallery
              productImages={productDetails.images}
              primaryImage={primaryImage}
            />
          </div>

          {/* Product Details - Right */}
          <div>
            <ProductDetails
              product={product}
              features={productDetails.features}
            />
          </div>
        </div>
      </main>

      {/* Description Section */}
      <ProductDescription
        description={product.description}
        specifications={productDetails.specifications}
      />

      {/* Specifications Section */}
      <ProductSpecifications
        specifications={productDetails.specifications}
      />

      {/* Related Products Section */}
      <RelatedProducts />

      <Footer />
      <WhatsAppButton />
    </>
  );
}