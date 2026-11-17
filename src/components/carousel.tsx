import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Bed, Bath, Car, Maximize2 } from "lucide-react";

interface Property {
  id: string;
  title: string;
  size: string;
  bedrooms: number;
  bathrooms: number;
  garage: number;
  image: string;
}

const properties: Property[] = [
  {
    id: "prop-1",
    title: "Villa Lumina Estate",
    size: "5,400 sq ft",
    bedrooms: 5,
    bathrooms: 4,
    garage: 3,
    image:
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "prop-2",
    title: "The Azure Coast Sanctuary",
    size: "6,800 sq ft",
    bedrooms: 6,
    bathrooms: 6,
    garage: 4,
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "prop-3",
    title: "Aura Modern Penthouse",
    size: "3,650 sq ft",
    bedrooms: 3,
    bathrooms: 3,
    garage: 2,
    image:
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "prop-4",
    title: "Solaria Crest Pavilion",
    size: "4,950 sq ft",
    bedrooms: 4,
    bathrooms: 4,
    garage: 3,
    image:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "prop-5",
    title: "Highland Vista Retreat",
    size: "7,600 sq ft",
    bedrooms: 5,
    bathrooms: 6,
    garage: 4,
    image:
      "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "prop-6",
    title: "Serenity Desert Haven",
    size: "4,200 sq ft",
    bedrooms: 4,
    bathrooms: 3,
    garage: 2,
    image:
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=800&q=80",
  },
];

export default function CarouselDemo() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-20 lg:px-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-medium tracking-tight text-neutral-100 sm:text-3xl">dddepth</h2>
          <p className="mt-1 sm:mt-2 text-xs sm:text-sm md:text-base leading-relaxed text-pretty text-muted-foreground">
            A Curated Collection of AI-generated Abstract 3D Shapes
          </p>
        </div>
        <Button className="max-sm:hidden" size="sm" variant="outline">
          <Link href="https://www.fffuel.co/dddepth/" target="_blank">
            View all
          </Link>
        </Button>
      </div>
      <Carousel className="mt-6 w-full" opts={{ loop: true, align: "start" }}>
        <CarouselContent>
          {properties.map((property) => (
            <CarouselItem className="basis-[88%] sm:basis-1/2 lg:basis-1/3" key={property.id}>
              <div className="p-1">
                <div className="group overflow-hidden rounded-xl border border-border bg-card text-card-foreground shadow-xs transition hover:shadow-md">
                  {/* Property Image */}
                  <div className="aspect-[4/3] w-full overflow-hidden bg-muted">
                    <img
                      className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                      src={property.image}
                      alt={property.title}
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
                    <div className="mt-3 flex items-center justify-between border-t border-border/80 pt-2.5 text-[11px] sm:text-xs text-muted-foreground">
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

          <Button className="sm:hidden" size="sm" variant="outline">
            <Link href="https://www.fffuel.co/dddepth/" target="_blank">View all</Link>
          </Button>
        </div>
      </Carousel>
    </div>
  );
}
