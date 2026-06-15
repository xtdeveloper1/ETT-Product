"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import type { ProductImage } from "@/services/product-details-service";

interface ProductGalleryProps {
  productImages?: ProductImage[];
  primaryImage?: string;
}

export default function ProductGallery({
  productImages = [],
  primaryImage,
}: ProductGalleryProps) {
  const images =
    productImages.length > 0
      ? productImages
          .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0))
          .map((img) => img.image_url)
          .filter(Boolean)
      : primaryImage
      ? [primaryImage]
      : ["/images/categories/panel.jpg"];

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  useEffect(() => {
    setSelectedIndex(0);
  }, [images]);

  const handleNext = () => {
    setSelectedIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrev = () => {
    setSelectedIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const selectedImage = images[selectedIndex];

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
          />
        </button>

        {/* Navigation arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              className="absolute left-3 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white p-1.5 rounded-full shadow-md transition-all"
              aria-label="Previous image"
            >
              <ChevronLeft size={18} className="text-slate-900" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white p-1.5 rounded-full shadow-md transition-all"
              aria-label="Next image"
            >
              <ChevronRight size={18} className="text-slate-900" />
            </button>
          </>
        )}

        {/* Image counter */}
        {images.length > 1 && (
          <div className="absolute top-3 right-3 bg-black/70 px-2 py-1 rounded text-xs font-medium text-white">
            {selectedIndex + 1} / {images.length}
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {images.map((img, index) => (
            <button
              key={index}
              onClick={() => setSelectedIndex(index)}
              className={`flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded overflow-hidden border transition-all ${
                selectedIndex === index
                  ? "border-blue-600 ring-2 ring-blue-300"
                  : "border-slate-200 hover:border-slate-300"
              }`}
            >
              <Image
                src={img}
                alt={`Thumbnail ${index + 1}`}
                width={80}
                height={80}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

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
            />
          </div>
        </div>
      )}
    </>
  );
}