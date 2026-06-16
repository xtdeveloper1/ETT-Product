"use client";

import { useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import type { ProductImage } from "@/services/product-details-service";

interface ProductGalleryProps {
  productImages?: ProductImage[];
  primaryImage?: string;
}

export default function ProductGallery({
  productImages = [],
  primaryImage,
}: ProductGalleryProps) {
  const [isZoomed, setIsZoomed] = useState(false);
  const sortedProductImages = [...productImages].sort(
    (a, b) => (a.sort_order || 0) - (b.sort_order || 0)
  );
  const selectedImage =
    primaryImage ||
    sortedProductImages.find((img) => img.is_primary)?.image_url ||
    sortedProductImages.find((img) => img.image_url)?.image_url ||
    "/images/categories/panel.jpg";
  const isRemoteImage =
    selectedImage.startsWith("http") || selectedImage.includes("supabase");

  return (
    <>
      {/* Main Image */}
      <div className="relative w-full bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg overflow-hidden shadow-sm">
        <button
          onClick={() => setIsZoomed(true)}
          className="relative w-full h-[300px] md:h-[350px] lg:h-[400px] cursor-zoom-in group"
        >
          <Image
            src={selectedImage}
            alt="Product"
            fill
            priority
            className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width:768px) 100vw, 50vw"
            unoptimized={isRemoteImage}
          />
        </button>
      </div>

      {/* Zoom Modal */}
      {isZoomed && (
        <div
          className="fixed inset-0 z-[9999] bg-black/95 flex items-center justify-center p-4"
          onClick={() => setIsZoomed(false)}
        >
          <div
            className="relative w-full max-w-6xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsZoomed(false)}
              className="absolute -top-12 right-0 text-white hover:bg-white/10 p-2 rounded-lg transition-colors"
              aria-label="Close zoom"
            >
              <X size={24} />
            </button>

            <Image
              src={selectedImage}
              alt="Zoomed Product"
              width={1600}
              height={1600}
              className="w-full h-auto object-contain max-h-[90vh]"
              unoptimized={isRemoteImage}
            />
          </div>
        </div>
      )}
    </>
  );
}
