"use client";

import { useState, useEffect } from "react";
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
import {
  fetchProperties,
  getInitialProperties,
  subscribeToProperties,
} from "@/lib/supabase";
import type { Property } from "@/types";
import { PropertyCard, PropertyInquiryModal } from "@/components/properties";

interface FeaturedPropertiesProps {
  properties?: Property[];
}

export function FeaturedProperties({
  properties: propList,
}: FeaturedPropertiesProps) {
  const [properties, setProperties] = useState<Property[]>(() => propList || getInitialProperties());
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(
    null
  );

  useEffect(() => {
    if (!propList) {
      let isMounted = true;
      fetchProperties().then((res) => {
        if (isMounted && res.data) {
          setProperties(res.data);
        }
      });

      // Reactive update: update carousel cards when properties are added, edited, or deleted
      const unsubscribe = subscribeToProperties((updatedList) => {
        if (isMounted) {
          setProperties(updatedList);
        }
      });

      const handleFocus = () => {
        fetchProperties().then((res) => {
          if (isMounted && res.data) {
            setProperties(res.data);
          }
        });
      };
      window.addEventListener("focus", handleFocus);

      return () => {
        isMounted = false;
        unsubscribe();
        window.removeEventListener("focus", handleFocus);
      };
    }
  }, [propList]);

  return (
    <section
      id="residences"
      className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-20 lg:px-8"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span className="text-xs font-semibold tracking-[0.25em] text-amber-500 dark:text-amber-400 uppercase">
            Signature Residences
          </span>
          <h2 className="mt-2 text-2xl font-medium tracking-tight text-neutral-900 dark:text-neutral-100 sm:text-3xl">
            Featured Architectural Estates
          </h2>
          <p className="mt-1 text-xs leading-relaxed text-pretty text-neutral-600 dark:text-muted-foreground sm:mt-2 sm:text-sm md:text-base">
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

      {properties.length === 0 ? (
        <div className="mt-8 rounded-xl border border-dashed border-neutral-200 bg-neutral-100/60 p-12 text-center dark:border-neutral-800 dark:bg-neutral-900/30">
          <p className="text-sm font-medium text-neutral-800 dark:text-neutral-300">No estates listed currently.</p>
          <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
            Properties added in the admin console will automatically appear here.
          </p>
        </div>
      ) : (
        <Carousel
          className="mt-6 w-full"
          opts={{ loop: properties.length > 1, align: "start" }}
        >
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
      )}

      {/* Property Inquiry Sheet Modal */}
      <PropertyInquiryModal
        property={selectedProperty}
        onClose={() => setSelectedProperty(null)}
      />
    </section>
  );
}

export default FeaturedProperties;
