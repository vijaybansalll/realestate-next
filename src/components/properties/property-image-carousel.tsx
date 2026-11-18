"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import type { UseEmblaCarouselType } from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { ChevronLeft, ChevronRight, Camera } from "lucide-react";
import { cn } from "@/lib/utils";

type CarouselApi = UseEmblaCarouselType[1];

export interface PropertyImageCarouselProps {
  images?: string[];
  alt: string;
  aspectRatio?: string;
  autoPlay?: boolean;
  autoPlayInterval?: number;
  pauseOnHover?: boolean;
  showArrows?: boolean;
  showDots?: boolean;
  showCounter?: boolean;
  enableDrag?: boolean;
  className?: string;
  imageClassName?: string;
  sizes?: string;
  priority?: boolean;
  dotsClassName?: string;
  counterClassName?: string;
  children?: React.ReactNode;
}

export function PropertyImageCarousel({
  images = [],
  alt,
  aspectRatio = "aspect-[16/10]",
  autoPlay = true,
  autoPlayInterval = 3500,
  pauseOnHover = true,
  showArrows = true,
  showDots = true,
  showCounter = true,
  enableDrag = true,
  className,
  imageClassName,
  sizes = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw",
  priority = false,
  dotsClassName = "bottom-15",
  counterClassName = "top-3 right-3",
  children,
}: PropertyImageCarouselProps) {
  // Normalize images array
  const validImages = useMemo(
    () => (images && images.length > 0 ? images : []),
    [images]
  );
  const hasMultiple = validImages.length > 1;

  // Initialize Autoplay plugin
  const plugins = useMemo(() => {
    if (!autoPlay || !hasMultiple) return [];
    return [
      Autoplay({
        delay: autoPlayInterval,
        stopOnInteraction: false,
        stopOnMouseEnter: pauseOnHover,
        playOnInit: true,
      }),
    ];
  }, [autoPlay, autoPlayInterval, pauseOnHover, hasMultiple]);

  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: hasMultiple,
      watchDrag: enableDrag && hasMultiple,
      align: "start",
    },
    plugins
  );

  const [selectedIndex, setSelectedIndex] = useState(0);

  const onSelect = useCallback((api: CarouselApi) => {
    if (!api) return;
    setSelectedIndex(api.selectedScrollSnap());
  }, []);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect(emblaApi);
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);

    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  const scrollPrev = useCallback(
    (e?: React.MouseEvent) => {
      e?.preventDefault();
      e?.stopPropagation();
      emblaApi?.scrollPrev();
    },
    [emblaApi]
  );

  const scrollNext = useCallback(
    (e?: React.MouseEvent) => {
      e?.preventDefault();
      e?.stopPropagation();
      emblaApi?.scrollNext();
    },
    [emblaApi]
  );

  const scrollTo = useCallback(
    (index: number, e?: React.MouseEvent) => {
      e?.preventDefault();
      e?.stopPropagation();
      emblaApi?.scrollTo(index);
    },
    [emblaApi]
  );

  // If no images provided
  if (validImages.length === 0) {
    return (
      <div
        className={cn(
          "relative w-full overflow-hidden bg-neutral-950",
          aspectRatio,
          className
        )}
      >
        <div className="flex h-full w-full items-center justify-center text-xs text-neutral-500">
          No image available
        </div>
        {children}
      </div>
    );
  }

  // If only 1 image provided
  if (!hasMultiple) {
    return (
      <div
        className={cn(
          "relative w-full overflow-hidden bg-neutral-950",
          aspectRatio,
          className
        )}
      >
        <Image
          src={validImages[0]}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          className={cn(
            "object-cover transition-transform duration-500 ease-out group-hover:scale-105",
            imageClassName
          )}
          draggable={false}
        />
        {/* Vignette Overlay */}
        <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-t from-neutral-950/85 via-neutral-950/10 to-neutral-950/40" />
        {children}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "group/carousel relative w-full overflow-hidden bg-neutral-950 select-none",
        aspectRatio,
        className
      )}
      role="region"
      aria-roledescription="carousel"
      aria-label={`${alt} photo gallery`}
    >
      {/* Embla Track Viewport */}
      <div ref={emblaRef} className="h-full w-full overflow-hidden">
        <div className="flex h-full touch-pan-y">
          {validImages.map((src, index) => (
            <div
              key={`${src}-${index}`}
              className="relative h-full w-full min-w-0 flex-[0_0_100%]"
              role="group"
              aria-roledescription="slide"
              aria-label={`Photo ${index + 1} of ${validImages.length}`}
            >
              <Image
                src={src}
                alt={`${alt} - View ${index + 1}`}
                fill
                sizes={sizes}
                priority={priority && index === 0}
                className={cn(
                  "object-cover transition-transform duration-500 ease-out group-hover:scale-105",
                  imageClassName
                )}
                draggable={false}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Vignette Overlay */}
      <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-t from-neutral-950/85 via-neutral-950/10 to-neutral-950/40" />

      {/* Counter Badge */}
      {showCounter && (
        <div
          className={cn("pointer-events-none absolute z-20", counterClassName)}
        >
          <span className="flex items-center gap-1 rounded-full border border-neutral-700/60 bg-neutral-950/75 px-2 py-0.5 text-[11px] font-medium text-neutral-200 shadow-sm backdrop-blur-md">
            <Camera className="size-3 text-amber-400" />
            <span>
              {selectedIndex + 1}/{validImages.length}
            </span>
          </span>
        </div>
      )}

      {/* Navigation Arrows */}
      {showArrows && (
        <>
          <button
            type="button"
            onClick={scrollPrev}
            aria-label="Previous photo"
            className="absolute top-1/2 left-2.5 z-20 flex size-7 -translate-y-1/2 items-center justify-center rounded-full border border-neutral-700/60 bg-neutral-950/75 text-neutral-200 opacity-0 shadow-md backdrop-blur-md transition-all duration-200 group-hover:opacity-100 group-hover/carousel:opacity-100 hover:scale-105 hover:border-amber-400/60 hover:bg-neutral-900 hover:text-white focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:outline-none max-sm:opacity-75 sm:size-8"
          >
            <ChevronLeft className="size-4" />
          </button>

          <button
            type="button"
            onClick={scrollNext}
            aria-label="Next photo"
            className="absolute top-1/2 right-2.5 z-20 flex size-7 -translate-y-1/2 items-center justify-center rounded-full border border-neutral-700/60 bg-neutral-950/75 text-neutral-200 opacity-0 shadow-md backdrop-blur-md transition-all duration-200 group-hover:opacity-100 group-hover/carousel:opacity-100 hover:scale-105 hover:border-amber-400/60 hover:bg-neutral-900 hover:text-white focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:outline-none max-sm:opacity-75 sm:size-8"
          >
            <ChevronRight className="size-4" />
          </button>
        </>
      )}

      {/* Pagination Indicators / Dots */}
      {showDots && (
        <div
          className={cn(
            "pointer-events-none absolute left-1/2 z-20 flex -translate-x-1/2 items-center gap-1.5 rounded-full border border-neutral-800/60 bg-neutral-950/60 px-2 py-1 shadow-sm backdrop-blur-md",
            dotsClassName
          )}
        >
          {validImages.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={(e) => scrollTo(idx, e)}
              aria-label={`Go to slide ${idx + 1}`}
              className={cn(
                "pointer-events-auto h-1.5 rounded-full transition-all duration-300 focus-visible:outline-none",
                selectedIndex === idx
                  ? "w-4 bg-amber-400 shadow-xs shadow-amber-400/50"
                  : "w-1.5 bg-neutral-400/50 hover:bg-neutral-200"
              )}
            />
          ))}
        </div>
      )}

      {/* Overlays / Children (Top Badges, Bottom Price Tags, etc.) */}
      {children}
    </div>
  );
}

export default PropertyImageCarousel;
