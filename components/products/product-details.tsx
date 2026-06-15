"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { useCart } from "@/hooks/use-cart";
import { ShoppingCart, Heart, Share2, Truck, Shield, Clock, CheckCircle } from "lucide-react";
import type { ProductFeature } from "@/services/product-details-service";

export interface ProductDetailsProduct {
  id: string; // slug
  product_id?: number; // numeric ID from Supabase
  name: string;
  category_id?: string | number; // ID for cart storage
  category_name?: string; // Display name (also used as category for UI)
  price: number;
  old_price?: number; // For cart (renamed from oldPrice)
  oldPrice?: number; // Legacy - for display only
  rating: string;
  discount: string;
  description: string;
  image_url?: string; // For cart storage
  image?: string; // Legacy - for display
  slug?: string; // For cart (same as id)
  href?: string; // For cart
}

interface ProductDetailsProps {
  product: ProductDetailsProduct;
  features?: ProductFeature[];
}

export default function ProductDetails({
  product,
  features = [],
}: ProductDetailsProps) {
  const router = useRouter();
  const { addItem } = useCart();

  const [quantity, setQuantity] = useState(1);
  const [successMessage, setSuccessMessage] = useState("");
  const [liked, setLiked] = useState(false);

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showMessage = () => {
    setSuccessMessage("Product added successfully");

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      setSuccessMessage("");
    }, 3000);
  };

  const handleAddToCart = () => {
    addItem({
      id: product.id, // slug
      product_id: product.product_id,
      name: product.name,
      category_id: product.category_id ?? "",
      category_name: product.category_name,
      price: product.price,
      old_price: product.old_price ?? product.oldPrice,
      image_url: product.image_url ?? product.image ?? "",
      slug: product.slug ?? product.id,
      href: product.href,
      quantity,
    });
    showMessage();
  };

  const handleBuyNow = () => {
    addItem({
      id: product.id, // slug
      product_id: product.product_id,
      name: product.name,
      category_id: product.category_id ?? "",
      category_name: product.category_name,
      price: product.price,
      old_price: product.old_price ?? product.oldPrice,
      image_url: product.image_url ?? product.image ?? "",
      slug: product.slug ?? product.id,
      href: product.href,
      quantity,
    });
    router.push("/checkout");
  };

  const discountPercentage = product.discount
    ? parseInt(product.discount.match(/\d+/)?.[0] || "0")
    : 0;

  return (
    <div className="space-y-4">
      {/* Category */}
      <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
        {product.category_name || "Product"}
      </p>

      {/* Title */}
      <h1 className="text-xl md:text-2xl font-bold text-slate-900">
        {product.name}
      </h1>

      {/* Rating */}
      <div className="flex items-center gap-2 text-sm">
        <span className="text-yellow-400">★</span>
        <span className="font-semibold text-slate-900">{product.rating || "5.0 (0 reviews)"}</span>
      </div>

      {/* Price */}
      <div className="flex items-center gap-3 py-3 border-y border-slate-200">
        <span className="text-2xl font-bold text-slate-900">
          ₹{Number(product.price || 0).toLocaleString()}
        </span>
        {(product.oldPrice ?? product.old_price ?? 0) > 0 && (
          <>
            <span className="text-sm text-slate-500 line-through">
              ₹{Number(product.oldPrice ?? product.old_price).toLocaleString()}
            </span>
            {discountPercentage > 0 && (
              <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-1 rounded">
                Save {discountPercentage}%
              </span>
            )}
          </>
        )}
      </div>

      <p className="text-xs text-slate-600">Inclusive of all taxes</p>

      {/* Description */}
      {product.description && (
        <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
          {product.description}
        </p>
      )}

      {/* Features as bullet list */}
      {features.length > 0 && (
        <div className="space-y-1.5">
          {features.map((feature) => (
            <div key={feature.id} className="flex items-start gap-2 text-sm">
              <span className="text-blue-600 font-bold flex-shrink-0 mt-0.5">✓</span>
              <span className="text-slate-700">{feature.feature}</span>
            </div>
          ))}
        </div>
      )}

      {/* Quantity and Actions */}
      <div className="space-y-3 pt-3 border-t border-slate-200">
        <div>
          <label className="block text-xs font-semibold text-slate-900 mb-2 uppercase">Quantity</label>
          <div className="flex items-center gap-2 w-fit">
            <button
              type="button"
              onClick={() => setQuantity((v) => Math.max(1, v - 1))}
              className="px-3 py-1.5 border border-slate-300 rounded hover:bg-slate-100"
            >
              −
            </button>
            <span className="px-4 py-1.5 font-semibold text-slate-900 min-w-[40px] text-center">
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => setQuantity((v) => v + 1)}
              className="px-3 py-1.5 border border-slate-300 rounded hover:bg-slate-100"
            >
              +
            </button>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleAddToCart}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-1.5 rounded font-semibold text-sm transition-colors"
          >
            Add to cart
          </button>

          <button
            type="button"
            onClick={handleBuyNow}
            className="border border-blue-600 text-blue-600 hover:bg-blue-50 px-6 py-1.5 rounded font-semibold text-sm transition-colors"
          >
            Buy now
          </button>

          <button
            onClick={() => setLiked(!liked)}
            className="px-2 py-1.5 border border-slate-300 rounded hover:bg-slate-100"
          >
            <Heart size={16} fill={liked ? "#ef4444" : "none"} className={liked ? "text-red-500" : "text-slate-600"} />
          </button>
        </div>

        {successMessage && (
          <div className="bg-green-50 border border-green-200 text-green-700 rounded p-2 text-xs font-medium flex items-center gap-2">
            <CheckCircle size={14} />
            {successMessage}
          </div>
        )}
      </div>

      {/* Trust Signals */}
      <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-200 text-center text-xs">
        <div>
          <Truck size={18} className="text-blue-600 mx-auto mb-1" />
          <p className="font-semibold text-slate-900">Free shipping</p>
          <p className="text-slate-600 text-xs">Pan-india</p>
        </div>
        <div>
          <Shield size={18} className="text-blue-600 mx-auto mb-1" />
          <p className="font-semibold text-slate-900">Warranty</p>
          <p className="text-slate-600 text-xs">Authentic</p>
        </div>
        <div>
          <Clock size={18} className="text-blue-600 mx-auto mb-1" />
          <p className="font-semibold text-slate-900">Fast delivery</p>
          <p className="text-slate-600 text-xs">Quick</p>
        </div>
      </div>

      {/* WhatsApp */}
      <a
        href={`https://wa.me/917479766602?text=Hello,%20I%20am%20interested%20in%20${encodeURIComponent(
          product.name
        )}`}
        target="_blank"
        rel="noopener noreferrer"
        className="block w-full text-center px-4 py-2.5 border-2 border-green-500 text-green-600 font-semibold rounded text-sm hover:bg-green-50 transition-colors flex items-center justify-center gap-2"
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.67-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421-7.403h-.006c-1.052 0-2.082.264-2.995.767L7.97 3.90l1.531 4.642c-.547.928-.834 1.995-.834 3.148 0 3.365 2.736 6.1 6.1 6.1h.006c1.624 0 3.15-.624 4.291-1.764 1.141-1.141 1.766-2.667 1.766-4.292 0-3.365-2.736-6.1-6.1-6.1" />
        </svg>
        WhatsApp Inquiry
      </a>
    </div>
  );
}