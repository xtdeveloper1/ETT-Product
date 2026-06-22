"use client";

import { useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import type { ProductImage } from "@/services/product-details-service";
import type { MouseEvent } from "react";

interface ProductGalleryProps {
  productImages?: ProductImage[];
  primaryImage?: string;
}

export default function ProductGallery({
  productImages = [],
  primaryImage,
}: ProductGalleryProps) {
  const [isZoomed, setIsZoomed] = useState(false);
  const [isHoverZoomed, setIsHoverZoomed] = useState(false);
  const [isModalZoomed, setIsModalZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 });
  const galleryImages = [...productImages]
    .filter((image) => image.image_url)
    .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
    .slice(0, 10);

  const fallbackImage = primaryImage || "/images/categories/panel.jpg";
  const images =
    galleryImages.length > 0
      ? galleryImages
      : [
          {
            id: "fallback-image",
            product_id: "",
            image_url: fallbackImage,
            is_primary: true,
            sort_order: 0,
          },
        ];
  const initialImage =
    images.find((image) => image.is_primary)?.image_url || images[0].image_url;
  const [selectedImage, setSelectedImage] = useState(initialImage);
  const isRemoteImage = selectedImage.startsWith("http");
  const zoomBackgroundImage = `url("${selectedImage.replace(/"/g, '\\"')}")`;

  const closeZoom = () => {
    setIsZoomed(false);
    setIsModalZoomed(false);
  };

  const handleZoomMove = (event: MouseEvent<HTMLButtonElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();

    setZoomPosition({
      x: ((event.clientX - bounds.left) / bounds.width) * 100,
      y: ((event.clientY - bounds.top) / bounds.height) * 100,
    });
  };

  return (
    <div className="w-full space-y-3 sm:space-y-4">
      <div className="relative w-full bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm">
        <button
          type="button"
          onClick={() => setIsZoomed(true)}
          onMouseEnter={() => setIsHoverZoomed(true)}
          onMouseLeave={() => setIsHoverZoomed(false)}
          onMouseMove={handleZoomMove}
          className="relative block w-full h-[300px] sm:h-[380px] md:h-[440px] lg:h-[520px] cursor-zoom-in group bg-slate-50"
          aria-label="Zoom product image"
        >
          <Image
            src={selectedImage}
            alt="Product"
            fill
            preload
            className="object-contain p-4 sm:p-6 group-hover:scale-[1.03] transition-transform duration-300"
            sizes="(max-width: 1024px) 100vw, 50vw"
            unoptimized={isRemoteImage}
          />
          <span
            className={`pointer-events-none absolute inset-0 hidden lg:block transition-opacity duration-200 ${
              isHoverZoomed ? "opacity-100" : "opacity-0"
            }`}
            style={{
              backgroundImage: zoomBackgroundImage,
              backgroundPosition: `${zoomPosition.x}% ${zoomPosition.y}%`,
              backgroundRepeat: "no-repeat",
              backgroundSize: "220%",
            }}
            aria-hidden="true"
          />
          <span className="pointer-events-none absolute bottom-3 left-3 hidden rounded bg-white/90 px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm lg:block">
            Hover to zoom
          </span>
        </button>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1 sm:grid sm:grid-cols-6 lg:grid-cols-8 sm:overflow-visible">
        {images.map((image, index) => {
          const isActive = image.image_url === selectedImage;
          const thumbnailIsRemote = image.image_url.startsWith("http");

          return (
            <button
              key={`${image.id}-${image.image_url}`}
              type="button"
              onClick={() => {
                setSelectedImage(image.image_url);
                setIsHoverZoomed(false);
              }}
              aria-label={`View product image ${index + 1}`}
              aria-current={isActive ? "true" : undefined}
              className={`relative h-16 w-16 sm:h-20 sm:w-full flex-shrink-0 overflow-hidden rounded-md border bg-white transition-all ${
                isActive
                  ? "border-blue-600 ring-2 ring-blue-100"
                  : "border-slate-200 hover:border-slate-400"
              }`}
            >
              <Image
                src={image.image_url}
                alt={`Product thumbnail ${index + 1}`}
                fill
                className="object-contain p-1.5"
                sizes="80px"
                unoptimized={thumbnailIsRemote}
              />
            </button>
          );
        })}
      </div>

      {isZoomed && (
        <div
          className="fixed inset-0 z-[9999] bg-black/95 flex items-center justify-center p-4"
          onClick={closeZoom}
        >
          <div
            className="relative w-full max-w-6xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={closeZoom}
              className="absolute -top-12 right-0 text-white hover:bg-white/10 p-2 rounded-lg transition-colors"
              aria-label="Close zoom"
            >
              <X size={24} />
            </button>

            <button
              type="button"
              onClick={() => setIsModalZoomed((value) => !value)}
              className={`relative block w-full overflow-auto rounded-lg bg-white/5 ${
                isModalZoomed ? "cursor-zoom-out" : "cursor-zoom-in"
              }`}
              aria-label={isModalZoomed ? "Zoom out" : "Zoom in"}
            >
              <Image
                src={selectedImage}
                alt="Zoomed Product"
                width={1600}
                height={1600}
                className={`mx-auto h-auto object-contain transition-transform duration-300 ${
                  isModalZoomed
                    ? "max-h-none w-[140vw] max-w-none sm:w-[120vw] lg:w-[90vw]"
                    : "w-full max-h-[90vh]"
                }`}
                unoptimized={isRemoteImage}
              />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
