"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Bed, Bath, Car, Maximize2 } from "lucide-react";
import { FEATURED_PROPERTIES } from "@/data";
import type { Property } from "@/types";

interface FeaturedPropertiesProps {
  properties?: Property[];
}

export function FeaturedProperties({
  properties = FEATURED_PROPERTIES,
}: FeaturedPropertiesProps) {
  return (
    <section
      id="residences"
      className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-20 lg:px-8"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span className="text-xs font-semibold tracking-[0.25em] text-amber-400 uppercase">
            Signature Residences
          </span>
          <h2 className="mt-2 text-2xl font-medium tracking-tight text-neutral-100 sm:text-3xl">
            Featured Architectural Estates
          </h2>
          <p className="mt-1 text-xs leading-relaxed text-pretty text-muted-foreground sm:mt-2 sm:text-sm md:text-base">
            Explore our curated portfolio of prime coastal retreats, hill
            sanctuaries, and modern penthouses.
          </p>
        </div>
        <Button
          className="max-sm:hidden"
          size="sm"
          variant="secondary"
          render={<Link href="#contact" />}
        >
          Inquire on Estates
        </Button>
      </div>

      <Carousel className="mt-6 w-full" opts={{ loop: true, align: "start" }}>
        <CarouselContent>
          {properties.map((property) => (
            <CarouselItem
              className="basis-[88%] sm:basis-1/2 lg:basis-1/3"
              key={property.id}
            >
              <div className="p-1">
                <div className="group overflow-hidden rounded-xl border border-border bg-card text-card-foreground shadow-xs transition hover:shadow-md">
                  {/* Property Image */}
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
                    <Image
                      className="object-cover transition duration-300 group-hover:scale-105"
                      src={property.image}
                      alt={property.title}
                      fill
                      sizes="(max-width: 640px) 88vw, (max-width: 1024px) 50vw, 33vw"
                      draggable={false}
                    />
                  </div>

                  {/* Property Info */}
                  <div className="p-3 sm:p-3.5">
                    {/* Title */}
                    <h3
                      className="truncate text-sm font-medium tracking-tight text-foreground sm:text-base"
                      title={property.title}
                    >
                      {property.title}
                    </h3>

                    {/* Property Size */}
                    <div className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Maximize2 className="size-3.5" />
                      <span>{property.size}</span>
                    </div>

                    {/* Stats: Bedroom, Bathroom, Car Garage */}
                    <div className="mt-3 flex items-center justify-between border-t border-border/80 pt-2.5 text-[11px] text-muted-foreground sm:text-xs">
                      <div
                        className="flex items-center gap-1"
                        title={`${property.bedrooms} Bedrooms`}
                      >
                        <Bed className="size-3.5 text-muted-foreground" />
                        <span>{property.bedrooms} Beds</span>
                      </div>
                      <div
                        className="flex items-center gap-1"
                        title={`${property.bathrooms} Bathrooms`}
                      >
                        <Bath className="size-3.5 text-muted-foreground" />
                        <span>{property.bathrooms} Baths</span>
                      </div>
                      <div
                        className="flex items-center gap-1"
                        title={`${property.garage} Car Garage`}
                      >
                        <Car className="size-3.5 text-muted-foreground" />
                        <span>{property.garage} Garage</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="mt-6 flex items-center justify-between sm:justify-end">
          <div className="flex items-center justify-end gap-2">
            <CarouselPrevious className="static translate-y-0" />
            <CarouselNext className="static translate-y-0" />
          </div>

          <Button
            className="sm:hidden"
            size="sm"
            variant="secondary"
            render={<Link href="#contact" />}
          >
            Inquire on Estates
          </Button>
        </div>
      </Carousel>
    </section>
  );
}

export default FeaturedProperties;
