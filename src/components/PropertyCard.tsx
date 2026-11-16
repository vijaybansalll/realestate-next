"use client";

import React from "react";
import { cn } from "@/lib/utils";
import {
  ArrowRight,
  Bath,
  BedDouble,
  Expand,
  MapPin,
  Sparkles,
  Zap,
  Star,
} from "lucide-react";

interface PerspectiveFlipCardProps {
  className?: string;
  front: React.ReactNode;
  back: React.ReactNode;
  h?: string;
  w?: string;
}

/**
 * Card 14 - Perspective Real Estate Card (Final Fix)
 * Uses standard rounded-2xl border radius and optimized 3D depth.
 * Removed overflow-hidden from faces to allow Z-translation to work correctly.
 */
export function PerspectiveFlipCard({
  className,
  front,
  back,
  h = "h-[500px]",
  w = "w-[360px]",
}: PerspectiveFlipCardProps) {
  return (
    <div className={cn("group/p-card [perspective:2000px]", h, w, className)}>
      <div
        className={cn(
          "relative h-full w-full transition-all duration-700 [transform-style:preserve-3d] group-hover/p-card:[transform:rotateY(180deg)]",
          "rounded-2xl"
        )}
      >
        {/* Front Face: Property Overview */}
        <div className="bg-card text-card-foreground absolute inset-0 size-full rounded-2xl border [backface-visibility:hidden] [transform-style:preserve-3d]">
          <div className="size-full p-3 [transform-style:preserve-3d]">
            {front}
          </div>
        </div>

        {/* Back Face: Property Specs */}
        <div className="bg-card text-card-foreground absolute inset-0 size-full [transform:rotateY(180deg)] rounded-2xl border [backface-visibility:hidden] [transform-style:preserve-3d]">
          <div className="flex size-full flex-col items-center justify-center p-8 text-center [transform-style:preserve-3d]">
            {back}
          </div>
        </div>
      </div>
    </div>
  );
}

const PerspectiveFront = () => (
  <div className="flex size-full flex-col [transform-style:preserve-3d]">
    {/* Image Section (Z: 50px) */}
    <div className="relative h-64 w-full [transform:translateZ(50px)] [transform-style:preserve-3d]">
      <div className="bg-muted border-border/50 absolute inset-0 overflow-hidden rounded-xl border">
        <img
          src="https://cdn.21st.dev/assets/localized/28aed8f89959cb96d95b3599ad19796bfeb7b264a125d9ba6be1a52c3c1aa0af.jpg"
          alt="Serenity Residential"
          className="h-full w-full object-cover transition duration-700 group-hover/p-card:scale-110"
        />
      </div>

      {/* Floating Rating Badge (Z: 100px) */}
      <div className="border-border absolute bottom-4 left-4 flex [transform:translateZ(80px)] items-center gap-1.5 rounded-full border bg-background/90 px-3 py-1.5 text-[11px] font-medium tracking-tight text-foreground shadow-lg backdrop-blur-md">
        <Star className="size-3.5 fill-yellow-400 text-yellow-400" />
        <span>4.9 (120 Reviews)</span>
      </div>
    </div>

    {/* Content Section (Z: 60px) */}
    <div className="flex flex-grow flex-col justify-between p-6 py-8 [transform-style:preserve-3d]">
      <div className="[transform:translateZ(60px)] space-y-2 [transform-style:preserve-3d]">
        <div className="text-primary flex items-center gap-2 text-xs font-semibold tracking-wide">
          <Sparkles className="size-4" />
          <span>Exclusive Listing</span>
        </div>
        <h3 className="group-hover/p-card:text-primary text-2xl leading-tight font-bold tracking-tight text-foreground transition duration-300">
          Serenity Residential Home
        </h3>
        <p className="text-muted-foreground mt-2 flex items-center gap-1.5 text-[15px] leading-none font-medium">
          <MapPin className="text-primary size-4" />
          15 S Aurora Ave, Miami
        </p>
      </div>

      <div className="text-muted-foreground flex [transform:translateZ(40px)] items-center justify-between text-xs font-semibold tracking-wider">
        <span className="group-hover/p-card:text-primary transition-all group-hover/p-card:translate-x-1">
          Hover to see more
        </span>
        <ArrowRight className="group-hover/p-card:text-primary size-4" />
      </div>
    </div>
  </div>
);

const PerspectiveBack = () => (
  <div className="flex size-full flex-col items-center justify-center [transform-style:preserve-3d]">
    {/* Feature Icons (Z: 130px) */}
    <div className="mb-10 flex w-full justify-center gap-4 [transform-style:preserve-3d]">
      <div className="bg-muted/80 border-border/50 flex min-w-[90px] [transform:translateZ(130px)] flex-col items-center gap-2 rounded-2xl border p-4 [transform-style:preserve-3d]">
        <div className="bg-card border-border text-primary [transform:translateZ(20px)] rounded-xl border p-2 shadow-sm">
          <BedDouble className="size-6" />
        </div>
        <p className="[transform:translateZ(10px)] text-[11px] font-bold tracking-tight">
          5 Beds
        </p>
      </div>
      <div className="bg-muted/80 border-border/50 flex min-w-[90px] [transform:translateZ(160px)] flex-col items-center gap-2 rounded-2xl border p-4 [transform-style:preserve-3d]">
        <div className="bg-card border-border text-primary [transform:translateZ(25px)] rounded-xl border p-2 shadow-sm">
          <Bath className="size-6" />
        </div>
        <p className="[transform:translateZ(10px)] text-[11px] font-bold tracking-tight">
          3 Baths
        </p>
      </div>
      <div className="bg-muted/80 border-border/50 flex min-w-[90px] [transform:translateZ(130px)] flex-col items-center gap-2 rounded-2xl border p-4 [transform-style:preserve-3d]">
        <div className="bg-card border-border text-primary [transform:translateZ(20px)] rounded-xl border p-2 shadow-sm">
          <Expand className="size-6" />
        </div>
        <p className="[transform:translateZ(10px)] text-[11px] font-bold tracking-tight">
          120m²
        </p>
      </div>
    </div>

    {/* Description (Z: 80px) */}
    <div className="space-y-3 px-6 [transform-style:preserve-3d]">
      <h3 className="[transform:translateZ(80px)] text-xl font-bold tracking-tight text-foreground">
        Property Highlights
      </h3>
      <p className="text-muted-foreground mx-auto max-w-[280px] [transform:translateZ(40px)] text-[13px] leading-relaxed font-medium">
        Award-winning residential design with 24/7 smart security and
        unparalleled tranquility.
      </p>
    </div>

    {/* Action (Z: 100px) */}
    <div className="mt-8 w-full px-6 [transform-style:preserve-3d]">
      <button className="bg-primary text-primary-foreground h-11 w-full [transform:translateZ(100px)] rounded-xl text-xs font-bold tracking-wider shadow-[0_15px_30px_-5px_rgba(0,0,0,0.3)] transition-all hover:scale-[1.03] active:scale-95">
        <Zap className="mr-2 inline-block size-3.5 fill-current" />
        Book Viewing
      </button>
    </div>
  </div>
);

export default function Card14Demo() {
  return (
    <div className="flex min-h-[600px] items-center justify-center bg-background p-12">
      <PerspectiveFlipCard
        front={<PerspectiveFront />}
        back={<PerspectiveBack />}
      />
    </div>
  );
}
