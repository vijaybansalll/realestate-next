"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import {
  Grid3x3,
  ChevronLeft,
  ChevronRight,
  X,
  Camera,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface PropertyGridGalleryProps {
  images: string[];
  title: string;
  className?: string;
}

export function PropertyGridGallery({
  images = [],
  title,
  className,
}: PropertyGridGalleryProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activeIdx, setActiveIdx] = useState(0);

  const displayImages = images.length > 0 ? images : ["/placeholder.jpg"];
  // Up to 5 images for the primary mosaic grid
  const mosaicImages = displayImages.slice(0, 5);

  const openLightbox = (index: number) => {
    setActiveIdx(index);
    setLightboxOpen(true);
  };

  const closeLightbox = useCallback(() => {
    setLightboxOpen(false);
  }, []);

  const nextImage = useCallback(() => {
    setActiveIdx((prev) => (prev + 1) % displayImages.length);
  }, [displayImages.length]);

  const prevImage = useCallback(() => {
    setActiveIdx(
      (prev) => (prev - 1 + displayImages.length) % displayImages.length
    );
  }, [displayImages.length]);

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (!lightboxOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") nextImage();
      if (e.key === "ArrowLeft") prevImage();
    };

    window.addEventListener("keydown", handleKeyDown);
    // Prevent background scrolling while modal is open
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [lightboxOpen, closeLightbox, nextImage, prevImage]);

  return (
    <section className={cn("relative w-full select-none", className)}>
      {/* 5-Image Mosaic Grid Gallery */}
      <div className="relative grid grid-cols-1 gap-2.5 overflow-hidden rounded-2xl sm:grid-cols-2 md:h-[460px] md:grid-cols-4 md:grid-rows-2 lg:h-[500px]">
        {/* Main Hero Image (Large, spans 2 rows & 2 cols) */}
        <div
          onClick={() => openLightbox(0)}
          className="group relative aspect-[16/10] h-full w-full cursor-pointer overflow-hidden bg-neutral-950 sm:aspect-auto md:col-span-2 md:row-span-2"
        >
          <Image
            src={mosaicImages[0]}
            alt={`${title} - Primary view`}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
            draggable={false}
          />
          <div className="absolute inset-0 bg-neutral-950/10 transition-colors duration-300 group-hover:bg-transparent" />
          <div className="absolute top-3 left-3 flex items-center gap-1.5 rounded-full border border-neutral-700/60 bg-neutral-950/75 px-3 py-1 text-xs font-medium text-neutral-200 backdrop-blur-md">
            <Camera className="size-3.5 text-amber-400" />
            <span>Featured View</span>
          </div>
        </div>

        {/* 4 Supporting Images in 2x2 Grid */}
        {mosaicImages.slice(1, 5).map((imgUrl, i) => {
          const actualIndex = i + 1;
          return (
            <div
              key={`${imgUrl}-${actualIndex}`}
              onClick={() => openLightbox(actualIndex)}
              className="group relative hidden aspect-[4/3] h-full w-full cursor-pointer overflow-hidden bg-neutral-950 sm:block md:aspect-auto"
            >
              <Image
                src={imgUrl}
                alt={`${title} - View ${actualIndex + 1}`}
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                draggable={false}
              />
              <div className="absolute inset-0 bg-neutral-950/20 transition-colors duration-300 group-hover:bg-transparent" />
            </div>
          );
        })}

        {/* Floating "View All Photos" Button */}
        <button
          type="button"
          onClick={() => openLightbox(0)}
          className="absolute right-4 bottom-4 z-10 flex items-center gap-2 rounded-xl border border-neutral-700/80 bg-neutral-950/85 px-4 py-2.5 text-xs font-semibold text-neutral-100 shadow-xl backdrop-blur-md transition-all duration-200 hover:scale-105 hover:border-amber-400/80 hover:bg-neutral-900 focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:outline-none"
        >
          <Grid3x3 className="size-4 text-amber-400" />
          <span>Show all {displayImages.length} photos</span>
        </button>
      </div>

      {/* Fullscreen Lightbox Modal */}
      {lightboxOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Estate Photo Gallery"
          className="fixed inset-0 z-50 flex animate-in flex-col bg-neutral-950/95 backdrop-blur-xl duration-200 fade-in"
        >
          {/* Lightbox Top Header Bar */}
          <div className="flex h-16 shrink-0 items-center justify-between border-b border-neutral-800/80 px-4 sm:px-6">
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold tracking-wider text-amber-400 uppercase">
                Estate Gallery
              </span>
              <span className="text-xs text-neutral-500">•</span>
              <span className="max-w-xs truncate text-sm font-medium text-neutral-200 sm:max-w-md">
                {title}
              </span>
            </div>

            <div className="flex items-center gap-4">
              <span className="rounded-full border border-neutral-800 bg-neutral-900/80 px-3 py-1 text-xs font-medium text-neutral-300">
                {activeIdx + 1} / {displayImages.length}
              </span>

              <button
                type="button"
                onClick={closeLightbox}
                aria-label="Close photo gallery"
                className="flex size-9 items-center justify-center rounded-full border border-neutral-800 bg-neutral-900 text-neutral-300 transition-colors hover:border-neutral-700 hover:bg-neutral-800 hover:text-white"
              >
                <X className="size-4" />
              </button>
            </div>
          </div>

          {/* Lightbox Main Stage */}
          <div className="relative flex flex-1 items-center justify-center overflow-hidden px-4 py-3 sm:px-12">
            {/* Previous Button */}
            <button
              type="button"
              onClick={prevImage}
              aria-label="Previous photo"
              className="absolute left-4 z-10 flex size-10 items-center justify-center rounded-full border border-neutral-700/80 bg-neutral-900/80 text-white shadow-lg backdrop-blur-md transition-transform hover:scale-110 hover:border-amber-400/80 hover:bg-neutral-800 sm:left-6 sm:size-12"
            >
              <ChevronLeft className="size-6" />
            </button>

            {/* Current Active Image */}
            <div className="relative h-full w-full max-w-5xl">
              <Image
                src={displayImages[activeIdx]}
                alt={`${title} - Photo ${activeIdx + 1}`}
                fill
                priority
                sizes="100vw"
                className="object-contain"
                draggable={false}
              />
            </div>

            {/* Next Button */}
            <button
              type="button"
              onClick={nextImage}
              aria-label="Next photo"
              className="absolute right-4 z-10 flex size-10 items-center justify-center rounded-full border border-neutral-700/80 bg-neutral-900/80 text-white shadow-lg backdrop-blur-md transition-transform hover:scale-110 hover:border-amber-400/80 hover:bg-neutral-800 sm:right-6 sm:size-12"
            >
              <ChevronRight className="size-6" />
            </button>
          </div>

          {/* Lightbox Bottom Thumbnail Filmstrip */}
          <div className="h-20 shrink-0 overflow-x-auto border-t border-neutral-800/80 bg-neutral-950/80 px-4 py-2">
            <div className="flex h-full items-center justify-center gap-2">
              {displayImages.map((src, i) => (
                <button
                  key={`${src}-thumb-${i}`}
                  type="button"
                  onClick={() => setActiveIdx(i)}
                  aria-label={`Jump to photo ${i + 1}`}
                  className={cn(
                    "relative h-14 w-20 shrink-0 overflow-hidden rounded-lg border transition-all duration-200",
                    activeIdx === i
                      ? "scale-105 border-amber-400 ring-2 ring-amber-400/30"
                      : "border-neutral-800 opacity-60 hover:opacity-100"
                  )}
                >
                  <Image
                    src={src}
                    alt={`Thumbnail ${i + 1}`}
                    fill
                    sizes="80px"
                    className="object-cover"
                    draggable={false}
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default PropertyGridGallery;
