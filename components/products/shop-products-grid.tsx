import ProductCard from "./product-card";

interface Product {
  id?: number; // numeric ID from Supabase
  category: string;
  categoryId: string;
  name: string;
  price: number;
  oldPrice: number;
  rating: string;
  discount: string;
  image: string;
  href: string;
}

interface ShopProductsGridProps {
  products: Product[];
}

export default function ShopProductsGrid({ products }: ShopProductsGridProps) {
  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-500">No products found in this category.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-x-[22px] gap-y-6 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
      {products.map((product, index) => (
        <ProductCard
          key={index}
          product={{
            category: product.category,
            name: product.name,
            price: `₹${product.price.toLocaleString()}`,
            oldPrice: `₹${product.oldPrice.toLocaleString()}`,
            rating: product.rating,
            discount: product.discount,
            image: product.image,
            href: product.href,
          }}
          product_id={product.id}
          category_id={product.categoryId}
        />
      ))}
    </div>
  );
}
