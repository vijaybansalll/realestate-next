"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { FEATURED_PROPERTIES } from "@/data";
import type { Property } from "@/types";
import { PropertyCard, PropertyInquiryModal } from "@/components/properties";

interface FeaturedPropertiesProps {
  properties?: Property[];
}

export function FeaturedProperties({
  properties = FEATURED_PROPERTIES,
}: FeaturedPropertiesProps) {
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(
    null
  );

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
          render={<Link href="/properties" />}
        >
          View more
        </Button>
      </div>

      <Carousel className="mt-6 w-full" opts={{ loop: true, align: "start" }}>
        <CarouselContent>
          {properties.map((property) => (
            <CarouselItem
              className="basis-[88%] sm:basis-1/2 lg:basis-1/3"
              key={property.id}
            >
              <div className="h-full p-1">
                <PropertyCard
                  property={property}
                  onInquire={(prop) => setSelectedProperty(prop)}
                  enableImageDrag={false}
                  className="h-full"
                />
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
            render={<Link href="/properties" />}
          >
            View more
          </Button>
        </div>
      </Carousel>

      {/* Property Inquiry Sheet Modal */}
      <PropertyInquiryModal
        property={selectedProperty}
        onClose={() => setSelectedProperty(null)}
      />
    </section>
  );
}

export default FeaturedProperties;
