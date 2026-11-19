import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  MapPin,
  Sparkles,
  ArrowLeft,
  Calendar,
  Share2,
  ShieldCheck,
  Phone,
  Mail,
  User,
  ArrowUpRight,
} from "lucide-react";
import { ALL_PROPERTIES } from "@/data/properties";
import { fetchPropertyById, fetchProperties } from "@/lib/supabase";
import { siteConfig } from "@/config/site";
import { PropertyGridGallery } from "@/components/properties/property-grid-gallery";
import { PropertySpecsGrid } from "@/components/properties/property-specs-grid";
import { PropertyCard } from "@/components/properties/property-card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const propRes = await fetchPropertyById(id);
  const property = propRes.data || ALL_PROPERTIES.find((p) => p.id === id);

  if (!property) {
    return {
      title: `Estate Not Found | ${siteConfig.name}`,
    };
  }

  return {
    title: `${property.title} | ${property.location} | ${siteConfig.name}`,
    description: property.description,
    openGraph: {
      title: `${property.title} | ${siteConfig.name}`,
      description: property.description,
      images: [
        {
          url: property.image,
          width: 1200,
          height: 800,
          alt: property.title,
        },
      ],
    },
  };
}

export default async function PropertyDetailPage({ params }: PageProps) {
  const { id } = await params;
  const propRes = await fetchPropertyById(id);
  const property = propRes.data || ALL_PROPERTIES.find((p) => p.id === id);

  if (!property) {
    notFound();
  }

  const allImages =
    property.images && property.images.length > 0
      ? property.images
      : [property.image];

  // Related properties (same purpose or type, excluding current)
  const allPropsRes = await fetchProperties();
  const allProps = allPropsRes.data.length > 0 ? allPropsRes.data : ALL_PROPERTIES;
  const relatedProperties = allProps.filter(
    (p) => p.id !== property.id && p.purpose === property.purpose
  ).slice(0, 3);

  return (
    <main className="min-h-screen bg-neutral-50 pt-24 pb-20 text-neutral-900 transition-colors duration-200 dark:bg-neutral-950 dark:text-neutral-100 selection:bg-amber-500 selection:text-neutral-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Navigation & Breadcrumb */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <Link
            href="/properties"
            className="inline-flex items-center gap-2 rounded-xl border border-neutral-200 bg-white/80 px-3.5 py-1.5 text-xs font-medium text-neutral-700 shadow-xs backdrop-blur-sm transition-colors hover:border-neutral-300 hover:text-neutral-900 dark:border-neutral-800 dark:bg-neutral-900/60 dark:text-neutral-300 dark:hover:border-neutral-700 dark:hover:text-white"
          >
            <ArrowLeft className="size-3.5" />
            <span>Back to Estates</span>
          </Link>

          <div className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400">
            <Link href="/" className="transition-colors hover:text-neutral-900 dark:hover:text-amber-400">
              Home
            </Link>
            <span>/</span>
            <Link
              href="/properties"
              className="transition-colors hover:text-neutral-900 dark:hover:text-amber-400"
            >
              Estates
            </Link>
            <span>/</span>
            <span className="max-w-[180px] truncate text-neutral-900 sm:max-w-xs dark:text-neutral-200">
              {property.title}
            </span>
          </div>
        </div>

        {/* Title Header Bar */}
        <div className="mb-6 flex flex-col justify-between gap-4 border-b border-neutral-200/80 pb-6 md:flex-row md:items-end dark:border-neutral-800/80">
          <div>
            <div className="mb-2.5 flex flex-wrap items-center gap-2">
              <span
                className={cn(
                  "rounded-full px-2.5 py-1 text-xs font-semibold shadow-sm",
                  property.purpose === "buy"
                    ? "border border-amber-500/30 bg-amber-500/20 text-amber-700 dark:text-amber-300"
                    : "border border-sky-500/30 bg-sky-500/20 text-sky-700 dark:text-sky-300"
                )}
              >
                {property.purpose === "buy"
                  ? "For Acquisition"
                  : "Luxury Lease"}
              </span>

              {property.isLuxury && (
                <span className="flex items-center gap-1 rounded-full border border-amber-500/30 bg-amber-500/15 px-2.5 py-1 text-xs font-semibold text-amber-700 dark:border-amber-400/30 dark:bg-amber-400/15 dark:text-amber-300">
                  <Sparkles className="size-3 text-amber-500 dark:text-amber-300" />
                  <span>Curated Signature</span>
                </span>
              )}

              <span className="rounded-full border border-neutral-200 bg-neutral-100 px-2.5 py-1 text-xs font-medium tracking-wider text-neutral-600 uppercase dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-400">
                {property.type}
              </span>
            </div>

            <h1 className="text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl md:text-4xl dark:text-neutral-100">
              {property.title}
            </h1>

            <p className="mt-2 flex items-center gap-1.5 text-xs text-neutral-600 sm:text-sm dark:text-neutral-300">
              <MapPin className="size-4 shrink-0 text-amber-500 dark:text-amber-400" />
              <span>{property.location}</span>
            </p>
          </div>

          {/* Pricing & Quick Action */}
          <div className="flex flex-row items-baseline justify-between gap-4 border-t border-neutral-200/60 pt-4 md:flex-col md:items-end md:border-t-0 md:pt-0 dark:border-neutral-800/60">
            <div>
              <span className="block text-sm text-neutral-500 md:text-right dark:text-neutral-400">
                Offering Price
              </span>
              <span className="text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl md:text-4xl dark:text-neutral-100">
                {property.formattedPrice}
              </span>
            </div>

            <span className="rounded-lg border border-neutral-200 bg-white/80 px-3 py-1 text-xs font-medium text-neutral-700 shadow-xs dark:border-neutral-800 dark:bg-neutral-900/80 dark:text-neutral-300">
              {property.bhk} BHK • {property.homeAreaSqM} m²
            </span>
          </div>
        </div>

        {/* Grid Gallery Format */}
        <div className="mb-12">
          <PropertyGridGallery images={allImages} title={property.title} />
        </div>

        {/* Main Two-Column Layout */}
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
          {/* Left Column: Architectural Overview & Full Specifications */}
          <div className="space-y-10 lg:col-span-2">
            {/* Overview & Description */}
            <section className="space-y-4 rounded-2xl border border-neutral-200 bg-white/80 p-6 shadow-sm backdrop-blur-sm sm:p-8 dark:border-neutral-800 dark:bg-neutral-900/50">
              <h2 className="text-xl font-semibold tracking-tight text-neutral-900 sm:text-2xl dark:text-neutral-100">
                Architectural Overview
              </h2>
              <p className="text-sm leading-relaxed text-neutral-600 sm:text-base dark:text-neutral-300">
                {property.description}
              </p>
            </section>

            {/* Specifications & Amenities Grid: icon + title + count or boolean */}
            <section className="rounded-2xl border border-neutral-200 bg-white/80 p-6 shadow-sm backdrop-blur-sm sm:p-8 dark:border-neutral-800 dark:bg-neutral-900/50">
              <PropertySpecsGrid property={property} />
            </section>
          </div>

          {/* Right Column: Private Client Inquiries & Tour Booking */}
          <div className="space-y-6 lg:col-span-1">
            <div className="sticky top-28 rounded-2xl border border-neutral-200 bg-white/90 p-6 shadow-xl backdrop-blur-md sm:p-7 dark:border-neutral-800 dark:bg-neutral-900/70">
              <div className="border-b border-neutral-200 pb-4 dark:border-neutral-800">
                <span className="text-[11px] font-semibold tracking-wider text-amber-600 uppercase dark:text-amber-400">
                  Private Showing
                </span>
                <h3 className="mt-1 text-xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
                  Request Exclusive Viewing
                </h3>
                <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                  Coordinate an in-person or virtual walkthrough with the
                  listing principal.
                </p>
              </div>

              {/* Inquiry Form */}
              <form className="mt-5 space-y-3.5">
                <div>
                  <label className="mb-1 block text-xs font-medium text-neutral-700 dark:text-neutral-300">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-neutral-400 dark:text-neutral-500" />
                    <input
                      type="text"
                      placeholder="Sir / Lady Harrison"
                      className="w-full rounded-xl border border-neutral-200 bg-white py-2.5 pr-3 pl-9 text-xs text-neutral-900 placeholder:text-neutral-400 focus:border-amber-500 focus:outline-none dark:border-neutral-800 dark:bg-neutral-950/80 dark:text-neutral-100 dark:placeholder:text-neutral-500 dark:focus:border-amber-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-xs font-medium text-neutral-700 dark:text-neutral-300">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-neutral-400 dark:text-neutral-500" />
                    <input
                      type="email"
                      placeholder="harrison@estate-family.com"
                      className="w-full rounded-xl border border-neutral-200 bg-white py-2.5 pr-3 pl-9 text-xs text-neutral-900 placeholder:text-neutral-400 focus:border-amber-500 focus:outline-none dark:border-neutral-800 dark:bg-neutral-950/80 dark:text-neutral-100 dark:placeholder:text-neutral-500 dark:focus:border-amber-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-xs font-medium text-neutral-700 dark:text-neutral-300">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-neutral-400 dark:text-neutral-500" />
                    <input
                      type="tel"
                      placeholder="+1 (555) 019-2834"
                      className="w-full rounded-xl border border-neutral-200 bg-white py-2.5 pr-3 pl-9 text-xs text-neutral-900 placeholder:text-neutral-400 focus:border-amber-500 focus:outline-none dark:border-neutral-800 dark:bg-neutral-950/80 dark:text-neutral-100 dark:placeholder:text-neutral-500 dark:focus:border-amber-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-xs font-medium text-neutral-700 dark:text-neutral-300">
                    Preferred Viewing Date
                  </label>
                  <div className="relative">
                    <Calendar className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-neutral-400 dark:text-neutral-500" />
                    <input
                      type="date"
                      className="w-full rounded-xl border border-neutral-200 bg-white py-2.5 pr-3 pl-9 text-xs text-neutral-900 placeholder:text-neutral-400 focus:border-amber-500 focus:outline-none dark:border-neutral-800 dark:bg-neutral-950/80 dark:text-neutral-100 dark:placeholder:text-neutral-500 dark:focus:border-amber-400"
                    />
                  </div>
                </div>

                <Button
                  type="button"
                  variant="primary"
                  size="lg"
                  className="mt-2 w-full"
                >
                  <span>Book Private Tour</span>
                  <ArrowUpRight className="ml-1 size-4" />
                </Button>
              </form>
            </div>
          </div>
        </div>

        {/* Similar / Related Estates Showcase */}
        {relatedProperties.length > 0 && (
          <section className="mt-20 border-t border-neutral-200/80 pt-12 dark:border-neutral-800/80">
            <div className="mb-8 flex items-end justify-between">
              <div>
                <span className="text-xs font-semibold tracking-wider text-amber-600 uppercase dark:text-amber-400">
                  Curated Portfolio
                </span>
                <h2 className="mt-1 text-xl font-semibold tracking-tight text-neutral-900 sm:text-2xl dark:text-neutral-100">
                  Similar Architectural Residences
                </h2>
              </div>
              <Link
                href="/properties"
                className="text-xs font-medium text-amber-600 transition-colors hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-300"
              >
                View Full Catalog →
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {relatedProperties.map((relatedProp) => (
                <PropertyCard key={relatedProp.id} property={relatedProp} />
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
