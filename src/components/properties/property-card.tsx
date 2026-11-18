"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Bed,
  Bath,
  Maximize2,
  MapPin,
  Sparkles,
  Heart,
  Layers,
  ArrowUpRight,
} from "lucide-react";
import type { Property } from "@/types";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PropertyCardProps {
  property: Property;
  onInquire?: (property: Property) => void;
  className?: string;
}

export function PropertyCard({
  property,
  onInquire,
  className,
}: PropertyCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);

  return (
    <article
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900/60 backdrop-blur-sm transition-all duration-300 hover:border-neutral-700 hover:shadow-2xl hover:shadow-black/60",
        className
      )}
    >
      {/* Media Frame */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-neutral-950">
        <Image
          src={property.image}
          alt={property.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          draggable={false}
        />

        {/* Dark Vignette Overlay */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-transparent to-neutral-950/40" />

        {/* Top Badges */}
        <div className="pointer-events-none absolute inset-x-3 top-3 flex items-center justify-between">
          <div className="flex flex-wrap items-center gap-1.5">
            <span
              className={cn(
                "rounded-full px-2.5 py-1 text-xs font-semibold tracking-wider uppercase shadow-sm backdrop-blur-md",
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

          {/* Favorite Toggle Button */}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsFavorite(!isFavorite);
            }}
            aria-label={isFavorite ? "Remove from saved" : "Save property"}
            className="pointer-events-auto flex size-8 items-center justify-center rounded-full border border-neutral-700/60 bg-neutral-950/60 text-neutral-200 backdrop-blur-md transition-all hover:scale-110 hover:text-white active:scale-95"
          >
            <Heart
              className={cn(
                "size-4 transition-colors",
                isFavorite
                  ? "fill-rose-500 text-rose-500"
                  : "text-neutral-300 hover:text-white"
              )}
            />
          </button>
        </div>

        {/* Bottom Price Tag inside image */}
        <div className="absolute right-3 bottom-3 left-3 flex items-end justify-between">
          <div className="rounded-lg border border-neutral-800/80 bg-neutral-950/80 px-3 py-1.5 shadow-lg backdrop-blur-md">
            <span className="block text-xs font-medium tracking-wider text-neutral-400 uppercase">
              Price
            </span>
            <span className="text-lg font-bold tracking-tight text-neutral-100 sm:text-xl">
              {property.formattedPrice}
            </span>
          </div>

          <span className="rounded-md border border-neutral-800 bg-neutral-900/90 px-2.5 py-1 text-xs font-medium text-neutral-300 backdrop-blur-md">
            {property.bhk} BHK
          </span>
        </div>
      </div>

      {/* Content Details */}
      <div className="flex flex-1 flex-col justify-between p-5">
        <div>
          {/* Title & Location */}
          <div className="space-y-1">
            <h3
              className="text-lg font-medium tracking-tight text-neutral-100 transition-colors group-hover:text-amber-400"
              title={property.title}
            >
              {property.title}
            </h3>
            <p className="flex items-center gap-1.5 text-xs text-neutral-400">
              <MapPin className="size-3.5 shrink-0 text-amber-400" />
              <span className="truncate">{property.location}</span>
            </p>
          </div>

          {/* Specs Matrix */}
          <div className="mt-4 grid grid-cols-4 gap-2 border-y border-neutral-800/80 py-3 text-xs text-neutral-300">
            <div className="flex flex-col">
              <span className="text-[10px] tracking-wider text-neutral-500 uppercase">
                Beds
              </span>
              <span className="mt-0.5 flex items-center gap-1 font-semibold text-neutral-200">
                <Bed className="size-3.5 text-neutral-400" />
                {property.bedrooms}
              </span>
            </div>

            <div className="flex flex-col">
              <span className="text-[10px] tracking-wider text-neutral-500 uppercase">
                Baths
              </span>
              <span className="mt-0.5 flex items-center gap-1 font-semibold text-neutral-200">
                <Bath className="size-3.5 text-neutral-400" />
                {property.bathrooms}
              </span>
            </div>

            <div className="flex flex-col">
              <span className="text-[10px] tracking-wider text-neutral-500 uppercase">
                Home Area
              </span>
              <span className="mt-0.5 flex items-center gap-1 font-semibold text-neutral-200">
                <Maximize2 className="size-3.5 text-neutral-400" />
                {property.homeAreaSqM}m²
              </span>
            </div>

            <div className="flex flex-col">
              <span className="text-[10px] tracking-wider text-neutral-500 uppercase">
                Land Area
              </span>
              <span className="mt-0.5 flex items-center gap-1 font-semibold text-neutral-200">
                <Layers className="size-3.5 text-neutral-400" />
                {property.landAreaSqM}m²
              </span>
            </div>
          </div>

          {/* Feature Highlights */}
          {property.features && property.features.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {property.features.slice(0, 3).map((feature) => (
                <span
                  key={feature}
                  className="rounded-md border border-neutral-700/40 bg-neutral-800/70 px-2 py-0.5 text-[11px] font-medium text-neutral-300"
                >
                  {feature}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="mt-5 flex items-center gap-2 border-t border-neutral-800/60 pt-2">
          <Button
            variant="default"
            size="sm"
            onClick={() => onInquire?.(property)}
            className="w-full bg-neutral-100 text-xs font-semibold tracking-wide text-neutral-950 transition-all hover:bg-neutral-200 active:scale-95"
          >
            <span>Inquire & Book Viewing</span>
            <ArrowUpRight className="ml-1 size-3.5" />
          </Button>
        </div>
      </div>
    </article>
  );
}

export default PropertyCard;
