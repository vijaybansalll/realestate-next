"use client";

import { useState } from "react";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/sonner";
import {
  SearchIcon,
  PencilIcon,
  Trash2Icon,
  ExternalLinkIcon,
  PlusIcon,
  SparklesIcon,
  BedIcon,
  BathIcon,
  Maximize2Icon,
} from "lucide-react";
import type { Property } from "@/types";

interface PropertyTableProps {
  properties: Property[];
  onDeleteProperty: (id: string) => Promise<void>;
  isLoading?: boolean;
}

export function PropertyTable({
  properties,
  onDeleteProperty,
  isLoading = false,
}: PropertyTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [purposeFilter, setPurposeFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const filteredProperties = properties.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.location.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesPurpose =
      purposeFilter === "all" || p.purpose === purposeFilter;
    const matchesType =
      typeFilter === "all"
        ? true
        : typeFilter === "featured"
          ? Boolean(p.featured)
          : p.type === typeFilter;

    return matchesSearch && matchesPurpose && matchesType;
  });

  const handleDelete = (id: string, title: string) => {
    toast(`Delete "${title}"?`, {
      description:
        "Are you sure you want to delete this property from the inventory?",
      action: {
        label: "Delete",
        onClick: async () => {
          setDeletingId(id);
          try {
            await onDeleteProperty(id);
          } finally {
            setDeletingId(null);
          }
        },
      },
      cancel: {
        label: "Cancel",
        onClick: () => {},
      },
    });
  };

  return (
    // <Card className="border-transparent! bg-transparent! p-0! md:border-neutral-200 md:bg-white md:p-4 md:shadow-md md:dark:border-neutral-800 md:dark:bg-neutral-900/60 md:dark:shadow-xl">
    //   <CardContent className="space-y-4 border-transparent! bg-transparent! p-0!">
    <>
      {/* Filters and Search Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-md">
          <SearchIcon className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-neutral-400 dark:text-neutral-500" />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by title, address, or location..."
            className="border-neutral-200 bg-neutral-50 pl-9 text-xs text-neutral-900 placeholder:text-neutral-400 focus-visible:border-amber-500/80 sm:text-sm dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-100 dark:placeholder:text-neutral-500 dark:focus-visible:border-amber-400/80"
          />
        </div>

        <div className="flex max-w-full flex-wrap items-center gap-2 overflow-x-auto pb-1">
          {/* Purpose Filter Pills */}
          <div className="inline-flex rounded-lg border border-neutral-200 bg-neutral-100 p-1 dark:border-neutral-800 dark:bg-neutral-950">
            {["all", "buy", "rent"].map((purpose) => (
              <button
                type="button"
                key={purpose}
                onClick={() => setPurposeFilter(purpose)}
                className={`cursor-pointer rounded-md px-2.5 py-1 text-xs font-medium capitalize transition-colors sm:px-3 ${
                  purposeFilter === purpose
                    ? "bg-white text-neutral-900 shadow-xs dark:bg-neutral-800 dark:text-neutral-100"
                    : "text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-200"
                }`}
              >
                {purpose === "all"
                  ? "All Purposes"
                  : purpose === "buy"
                    ? "For Sale"
                    : "For Lease"}
              </button>
            ))}
          </div>

          {/* Type Filter */}
          <div className="inline-flex rounded-lg border border-neutral-200 bg-neutral-100 p-1 dark:border-neutral-800 dark:bg-neutral-950">
            {["all", "featured", "estate", "villa", "penthouse"].map((t) => (
              <button
                type="button"
                key={t}
                onClick={() => setTypeFilter(t)}
                className={`cursor-pointer rounded-md px-2 py-1 text-xs font-medium capitalize transition-colors sm:px-2.5 ${
                  typeFilter === t
                    ? "bg-white text-neutral-900 shadow-xs dark:bg-neutral-800 dark:text-neutral-100"
                    : "text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-200"
                }`}
              >
                {t === "all" ? "All Types" : t}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Properties List / Grid */}
      {isLoading ? (
        <div className="py-16 text-center text-sm text-neutral-500">
          Loading properties from database...
        </div>
      ) : filteredProperties.length === 0 ? (
        <div className="rounded-xl border border-dashed border-neutral-200 bg-neutral-50/60 p-8 py-16 text-center dark:border-neutral-800 dark:bg-neutral-950/40">
          <p className="text-sm font-medium text-neutral-800 dark:text-neutral-300">
            No properties matched your criteria.
          </p>
          <p className="mt-1 text-xs text-neutral-500">
            Try modifying search terms or add a new property listing.
          </p>
          <Link
            href="/admin/properties/new"
            className={cn(
              buttonVariants({ variant: "outline", size: "sm" }),
              "mt-4 gap-1.5 border-neutral-200 text-neutral-700 hover:bg-neutral-100 dark:border-neutral-800 dark:text-neutral-200"
            )}
          >
            <PlusIcon className="mr-1 size-4" /> Add Property
          </Link>
        </div>
      ) : (
        <div className="divide-y divide-neutral-200 overflow-hidden rounded-xl border border-neutral-200 bg-neutral-50/40 dark:divide-neutral-800/80 dark:border-neutral-800/80 dark:bg-neutral-950/50">
          {filteredProperties.map((property) => (
            <div
              key={property.id}
              className="flex flex-col gap-3 p-3.5 transition-colors hover:bg-neutral-100/60 sm:flex-row sm:items-center sm:justify-between sm:p-4 dark:hover:bg-neutral-900/40"
            >
              {/* Left: Thumbnail & Details */}
              <div className="flex min-w-0 items-start gap-3 sm:items-center sm:gap-4">
                <div className="relative size-16 shrink-0 overflow-hidden rounded-lg border border-neutral-200 bg-neutral-100 sm:size-20 dark:border-neutral-800 dark:bg-neutral-900">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={
                      (Array.isArray(property.images) &&
                      property.images.length > 0
                        ? property.images[0]
                        : property.image) || "/images/canadian-wooden-house.jpg"
                    }
                    alt={property.title}
                    className="h-full w-full object-cover"
                  />
                  {Array.isArray(property.images) &&
                    property.images.length > 1 && (
                      <span className="absolute right-1 bottom-1 rounded bg-black/80 px-1 py-0.5 text-[9px] font-semibold text-neutral-200 backdrop-blur-xs">
                        +{property.images.length}
                      </span>
                    )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                    <h4 className="line-clamp-1 text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                      {property.title}
                    </h4>
                    <div className="flex flex-wrap items-center gap-1">
                      <Badge
                        variant="secondary"
                        className="bg-neutral-200 px-1.5 py-0 text-[9px] font-semibold tracking-wider text-neutral-700 uppercase sm:text-[10px] dark:bg-neutral-800 dark:text-neutral-300"
                      >
                        {property.type}
                      </Badge>
                      <Badge
                        variant="outline"
                        className={`px-1.5 py-0 text-[9px] font-semibold tracking-wider uppercase sm:text-[10px] ${
                          property.purpose === "buy"
                            ? "border-emerald-500/30 text-emerald-600 dark:text-emerald-400"
                            : "border-sky-500/30 text-sky-600 dark:text-sky-400"
                        }`}
                      >
                        {property.purpose === "buy" ? "For Sale" : "For Lease"}
                      </Badge>
                      {property.featured && (
                        <Badge
                          variant="secondary"
                          className="inline-flex items-center gap-1 border-amber-500/30 bg-amber-500/15 px-1.5 py-0 text-[9px] font-semibold text-amber-700 sm:text-[10px] dark:border-amber-400/30 dark:bg-amber-400/15 dark:text-amber-300"
                        >
                          <SparklesIcon className="size-2.5 text-amber-500 dark:text-amber-400" /> Featured
                        </Badge>
                      )}
                      {property.isLuxury && (
                        <Badge
                          variant="secondary"
                          className="hidden items-center gap-1 border-amber-500/20 bg-amber-500/10 px-1.5 py-0 text-[9px] text-amber-700 sm:inline-flex sm:text-[10px] dark:border-amber-400/20 dark:bg-amber-400/10 dark:text-amber-300"
                        >
                          <SparklesIcon className="size-2.5" /> Luxury
                        </Badge>
                      )}
                    </div>
                  </div>

                  <p className="mt-0.5 truncate text-xs text-neutral-600 dark:text-neutral-400">
                    {property.location}
                  </p>

                  <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px] text-neutral-500 sm:gap-3 dark:text-neutral-300">
                    <span className="flex items-center gap-1">
                      <BedIcon className="size-3 text-amber-500 dark:text-amber-300" />{" "}
                      {property.bedrooms} Beds
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <BathIcon className="size-3 text-amber-500 dark:text-amber-300" />{" "}
                      {property.bathrooms} Baths
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Maximize2Icon className="size-3 text-amber-500 dark:text-amber-300" />{" "}
                      {property.size}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right: Price & Actions */}
              <div className="flex shrink-0 items-center justify-between gap-3 border-t border-neutral-200/80 pt-2.5 sm:justify-end sm:border-t-0 sm:pt-0 dark:border-neutral-800/60">
                <div className="text-left sm:text-right">
                  <div className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                    {property.formattedPrice ||
                      `$${property.price?.toLocaleString()}`}
                  </div>
                  <span className="font-mono text-xs text-neutral-500 uppercase dark:text-neutral-400">
                    ID: {property.id}
                  </span>
                </div>

                <div className="flex items-center gap-1 sm:gap-1.5">
                  <Link
                    href={`/admin/properties/${property.id}/edit`}
                    className="inline-flex size-9 items-center justify-center rounded-lg border border-neutral-200 bg-white text-neutral-700 shadow-2xs transition-colors hover:bg-neutral-100 hover:text-neutral-900 sm:size-8 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:hover:text-white"
                    title="Edit Property (Full Page)"
                    aria-label="Edit Property"
                  >
                    <PencilIcon className="size-4 sm:size-3.5" />
                  </Link>

                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => handleDelete(property.id, property.title)}
                    disabled={deletingId === property.id}
                    className="size-9 rounded-lg border border-transparent text-rose-500 transition-colors hover:bg-rose-500/10 hover:text-rose-600 sm:size-8 dark:text-rose-400 dark:hover:bg-rose-500/10"
                    title="Delete Property"
                    aria-label="Delete Property"
                  >
                    <Trash2Icon className="size-4 sm:size-3.5" />
                  </Button>

                  <Link
                    href={`/properties/${property.id}`}
                    target="_blank"
                    className="inline-flex size-9 items-center justify-center rounded-lg border border-neutral-200 bg-white text-neutral-700 shadow-2xs transition-colors hover:bg-neutral-100 hover:text-neutral-900 sm:size-8 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:hover:text-white"
                    title="View Public Listing"
                    aria-label="View Public Listing"
                  >
                    <ExternalLinkIcon className="size-4 sm:size-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
    //    </CardContent>
    // </Card>
  );
}
