"use client";

import { useMemo } from "react";
import Link from "next/link";
import {
  Bed,
  Bath,
  Maximize2,
  MapPin,
  Sparkles,
  Layers,
  ArrowUpRight,
} from "lucide-react";
import type { Property } from "@/types";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { PropertyImageCarousel } from "./property-image-carousel";

interface PropertyCardProps {
  property: Property;
  onInquire?: (property: Property) => void;
  className?: string;
  enableImageDrag?: boolean;
}

export function PropertyCard({
  property,
  onInquire,
  className,
  enableImageDrag = true,
}: PropertyCardProps) {
  // Normalize image list: support multiple images with fallback to property.image
  const images = useMemo(() => {
    if (property.images && property.images.length > 0) {
      return property.images;
    }
    return property.image ? [property.image] : [];
  }, [property.images, property.image]);

  // Subtle stagger for auto-play across different cards in grid
  const autoPlayInterval = useMemo(() => {
    const hash = property.id
      .split("")
      .reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return 3400 + (hash % 5) * 300;
  }, [property.id]);

  return (
    <article
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm backdrop-blur-sm transition-all duration-300 hover:border-neutral-300 hover:shadow-xl dark:border-neutral-800 dark:bg-neutral-900/60 dark:hover:border-neutral-700 dark:hover:shadow-2xl dark:hover:shadow-black/60",
        className
      )}
    >
      {/* Media Frame with Auto Image Carousel */}
      <PropertyImageCarousel
        images={images}
        alt={property.title}
        aspectRatio="aspect-[16/10]"
        autoPlay={true}
        autoPlayInterval={autoPlayInterval}
        pauseOnHover={true}
        showArrows={true}
        showDots={true}
        showCounter={true}
        counterClassName="top-3 right-3"
        enableDrag={enableImageDrag}
        dotsClassName="bottom-3"
      >
        {/* Top Badges */}
        <div className="pointer-events-none absolute inset-x-3 top-3 z-10 flex items-center justify-between">
          <div className="flex flex-wrap items-center gap-1.5">
            <span
              className={cn(
                "rounded-full px-2 py-1 text-xs font-semibold shadow-sm backdrop-blur-md",
                property.purpose === "buy"
                  ? "border border-amber-500/30 bg-amber-500/20 text-amber-300"
                  : "border border-sky-500/30 bg-sky-500/20 text-sky-300"
              )}
            >
              {property.purpose === "buy" ? "For Sale" : "For Lease"}
            </span>

            {property.isLuxury && (
              <span className="flex items-center gap-1 rounded-full border border-amber-400/30 bg-amber-400/15 px-2.5 py-1 text-xs font-semibold text-amber-300 shadow-sm backdrop-blur-md">
                <Sparkles className="size-3 text-amber-300" />
                <span>Luxury</span>
              </span>
            )}
          </div>
        </div>

        {/* Bottom Price Tag inside image */}
        <div className="pointer-events-none absolute right-3 bottom-3 left-3 z-10 flex items-end justify-between">
          <div className="pointer-events-auto rounded-lg border border-neutral-800/80 bg-neutral-950/80 px-3 py-1.5 shadow-lg backdrop-blur-md">
            <span className="block text-xs text-neutral-300">Price</span>
            <span className="text-base font-semibold tracking-tight text-neutral-100 sm:text-xl md:font-bold">
              {property.formattedPrice}
            </span>
          </div>

          <span className="pointer-events-auto rounded-md border border-neutral-800 bg-neutral-900/90 px-2.5 py-1 text-xs font-medium text-neutral-300 backdrop-blur-md">
            {property.bhk} BHK
          </span>
        </div>
      </PropertyImageCarousel>

      {/* Content Details */}
      <div className="flex flex-1 flex-col justify-between p-5">
        <div>
          {/* Title & Location */}
          <div className="space-y-1">
            <h3
              className="text-lg font-medium tracking-tight text-neutral-900 transition-colors group-hover:text-amber-600 hover:text-amber-600 dark:text-neutral-100 dark:group-hover:text-amber-400 dark:hover:text-amber-400"
              title={property.title}
            >
              <Link
                href={`/properties/${property.id}`}
                className="hover:underline"
              >
                {property.title}
              </Link>
            </h3>
            <p className="flex items-center gap-1.5 text-xs text-neutral-600 dark:text-neutral-300">
              <MapPin className="size-3.5 shrink-0 text-amber-500 dark:text-amber-400" />
              <span className="truncate">{property.location}</span>
            </p>
          </div>

          {/* Specs Matrix */}
          <div className="mt-4 grid grid-cols-4 gap-2 border-y border-neutral-200 py-3 text-xs text-neutral-600 dark:border-neutral-800/80 dark:text-neutral-300">
            <div className="flex flex-col">
              <span className="text-[10px] text-neutral-500 dark:text-neutral-400">Beds</span>
              <span className="mt-0.5 flex items-center gap-1 font-semibold text-neutral-900 dark:text-neutral-200">
                <Bed className="size-3.5 text-neutral-400 dark:text-neutral-500" />
                {property.bedrooms}
              </span>
            </div>

            <div className="flex flex-col">
              <span className="text-[10px] text-neutral-500 dark:text-neutral-400">Baths</span>
              <span className="mt-0.5 flex items-center gap-1 font-semibold text-neutral-900 dark:text-neutral-200">
                <Bath className="size-3.5 text-neutral-400 dark:text-neutral-500" />
                {property.bathrooms}
              </span>
            </div>

            <div className="flex flex-col">
              <span className="text-[10px] text-neutral-500 dark:text-neutral-400">Home Area</span>
              <span className="mt-0.5 flex items-center gap-1 font-semibold text-neutral-900 dark:text-neutral-200">
                <Maximize2 className="size-3.5 text-neutral-400 dark:text-neutral-500" />
                {property.homeAreaSqM}m²
              </span>
            </div>

            <div className="flex flex-col">
              <span className="text-[10px] text-neutral-500 dark:text-neutral-400">Land Area</span>
              <span className="mt-0.5 flex items-center gap-1 font-semibold text-neutral-900 dark:text-neutral-200">
                <Layers className="size-3.5 text-neutral-400 dark:text-neutral-500" />
                {property.landAreaSqM}m²
              </span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-5 flex items-center gap-2 border-t border-neutral-200 pt-3 dark:border-neutral-800/60">
          <Link
            href={`/properties/${property.id}`}
            className="flex-1 rounded-xl border border-neutral-300 bg-neutral-100 py-2 text-center text-xs font-semibold text-neutral-800 transition-colors hover:border-neutral-400 hover:bg-neutral-200 hover:text-neutral-950 dark:border-neutral-700/60 dark:bg-neutral-800/70 dark:text-neutral-200 dark:hover:border-neutral-600 dark:hover:bg-neutral-800 dark:hover:text-white"
          >
            Explore Estate
          </Link>
          <Button
            variant="primary"
            size="sm"
            onClick={() => onInquire?.(property)}
            className="flex-1"
          >
            <span>Inquire</span>
            <ArrowUpRight className="ml-1 size-3.5" />
          </Button>
        </div>
      </div>
    </article>
  );
}

export default PropertyCard;
