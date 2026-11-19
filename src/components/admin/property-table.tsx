"use client";

import { useState } from "react";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
  onAddProperty?: () => void;
  onEditProperty?: (property: Property) => void;
  onDeleteProperty: (id: string) => Promise<void>;
  isLoading?: boolean;
}

export function PropertyTable({
  properties,
  onAddProperty,
  onEditProperty,
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

    const matchesPurpose = purposeFilter === "all" || p.purpose === purposeFilter;
    const matchesType = typeFilter === "all" || p.type === typeFilter;

    return matchesSearch && matchesPurpose && matchesType;
  });

  const handleDelete = async (id: string, title: string) => {
    if (confirm(`Are you sure you want to delete "${title}"?`)) {
      setDeletingId(id);
      try {
        await onDeleteProperty(id);
      } finally {
        setDeletingId(null);
      }
    }
  };

  return (
    <Card className="border-neutral-800 bg-neutral-900/60 shadow-xl backdrop-blur-md">
      <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-neutral-800/80 pb-5">
        <div>
          <CardTitle className="text-lg font-semibold text-neutral-100 flex items-center gap-2">
            Properties Portfolio Directory
            <Badge variant="outline" className="text-xs border-neutral-700 text-neutral-300">
              {filteredProperties.length} items
            </Badge>
          </CardTitle>
          <CardDescription className="text-xs text-neutral-400 mt-1">
            Perform live Create, Read, Update, and Delete operations synced with Supabase.
          </CardDescription>
        </div>

        <Link
          href="/admin/properties/new"
          className={cn(
            buttonVariants({ variant: "default", size: "sm" }),
            "bg-amber-400 text-neutral-950 font-semibold hover:bg-amber-300 transition-colors self-start sm:self-auto gap-1.5"
          )}
        >
          <PlusIcon className="size-4 mr-1.5" />
          Add New Property
        </Link>
      </CardHeader>

      <CardContent className="pt-5 space-y-4">
        {/* Filters and Search Bar */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-md">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-neutral-500" />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by title, address, or location..."
              className="pl-9 bg-neutral-950 border-neutral-800 text-neutral-100 placeholder:text-neutral-500 focus-visible:border-amber-400/80"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Purpose Filter Pills */}
            <div className="inline-flex rounded-lg border border-neutral-800 bg-neutral-950 p-1">
              {["all", "buy", "rent"].map((purpose) => (
                <button
                  type="button"
                  key={purpose}
                  onClick={() => setPurposeFilter(purpose)}
                  className={`px-3 py-1 text-xs font-medium rounded-md capitalize transition-colors cursor-pointer ${
                    purposeFilter === purpose
                      ? "bg-neutral-800 text-neutral-100"
                      : "text-neutral-400 hover:text-neutral-200"
                  }`}
                >
                  {purpose === "all" ? "All Purposes" : purpose === "buy" ? "For Sale" : "For Lease"}
                </button>
              ))}
            </div>

            {/* Type Filter */}
            <div className="inline-flex rounded-lg border border-neutral-800 bg-neutral-950 p-1">
              {["all", "estate", "villa", "penthouse"].map((t) => (
                <button
                  type="button"
                  key={t}
                  onClick={() => setTypeFilter(t)}
                  className={`px-2.5 py-1 text-xs font-medium rounded-md capitalize transition-colors cursor-pointer ${
                    typeFilter === t
                      ? "bg-neutral-800 text-neutral-100"
                      : "text-neutral-400 hover:text-neutral-200"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Properties List / Grid */}
        {isLoading ? (
          <div className="py-16 text-center text-neutral-500 text-sm">
            Loading properties from database...
          </div>
        ) : filteredProperties.length === 0 ? (
          <div className="py-16 text-center rounded-xl border border-dashed border-neutral-800 bg-neutral-950/40 p-8">
            <p className="text-sm text-neutral-300 font-medium">No properties matched your criteria.</p>
            <p className="text-xs text-neutral-500 mt-1">Try modifying search terms or add a new property listing.</p>
            <Link
              href="/admin/properties/new"
              className={cn(
                buttonVariants({ variant: "outline", size: "sm" }),
                "mt-4 border-neutral-800 text-neutral-200 gap-1.5"
              )}
            >
              <PlusIcon className="size-4 mr-1" /> Add Property
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-neutral-800/80 rounded-xl border border-neutral-800/80 bg-neutral-950/50 overflow-hidden">
            {filteredProperties.map((property) => (
              <div
                key={property.id}
                className="flex flex-col gap-4 p-4 transition-colors hover:bg-neutral-900/40 sm:flex-row sm:items-center sm:justify-between"
              >
                {/* Left: Thumbnail & Details */}
                <div className="flex items-center gap-4 min-w-0">
                  <div className="relative size-16 shrink-0 overflow-hidden rounded-lg border border-neutral-800 bg-neutral-900">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={
                        (Array.isArray(property.images) && property.images.length > 0
                          ? property.images[0]
                          : property.image) || "/images/canadian-wooden-house.jpg"
                      }
                      alt={property.title}
                      className="h-full w-full object-cover"
                    />
                    {Array.isArray(property.images) && property.images.length > 1 && (
                      <span className="absolute bottom-1 right-1 rounded bg-black/80 px-1 py-0.5 text-[9px] font-semibold text-neutral-200 backdrop-blur-xs">
                        +{property.images.length}
                      </span>
                    )}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-sm font-semibold text-neutral-100 truncate">
                        {property.title}
                      </h4>
                      <Badge
                        variant="secondary"
                        className="text-[10px] uppercase font-semibold tracking-wider bg-neutral-800 text-neutral-300"
                      >
                        {property.type}
                      </Badge>
                      <Badge
                        variant="outline"
                        className={`text-[10px] uppercase font-semibold tracking-wider ${
                          property.purpose === "buy"
                            ? "border-emerald-500/30 text-emerald-400"
                            : "border-sky-500/30 text-sky-400"
                        }`}
                      >
                        {property.purpose === "buy" ? "For Sale" : "For Lease"}
                      </Badge>
                      {property.isLuxury && (
                        <Badge
                          variant="secondary"
                          className="bg-amber-400/10 text-amber-300 border-amber-400/20 text-[10px] flex items-center gap-1"
                        >
                          <SparklesIcon className="size-2.5" /> Luxury
                        </Badge>
                      )}
                    </div>

                    <p className="text-xs text-neutral-400 truncate mt-0.5">{property.location}</p>

                    <div className="flex items-center gap-3 text-[11px] text-neutral-500 mt-1">
                      <span className="flex items-center gap-1">
                        <BedIcon className="size-3" /> {property.bedrooms} Beds
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <BathIcon className="size-3" /> {property.bathrooms} Baths
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Maximize2Icon className="size-3" /> {property.size}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: Price & Actions */}
                <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-neutral-800/60">
                  <div className="text-left sm:text-right">
                    <div className="text-sm font-bold text-neutral-100">
                      {property.formattedPrice || `$${property.price?.toLocaleString()}`}
                    </div>
                    <span className="text-[10px] text-neutral-500 uppercase tracking-widest font-mono">
                      ID: {property.id}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <Link
                      href={`/admin/properties/${property.id}/edit`}
                      className="inline-flex items-center justify-center size-8 rounded-lg text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800 transition-colors"
                      title="Edit Property (Full Page)"
                    >
                      <PencilIcon className="size-3.5" />
                    </Link>

                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleDelete(property.id, property.title)}
                      disabled={deletingId === property.id}
                      className="size-8 text-rose-400/70 hover:text-rose-400 hover:bg-rose-500/10"
                      title="Delete Property"
                    >
                      <Trash2Icon className="size-3.5" />
                    </Button>

                    <Link
                      href={`/properties/${property.id}`}
                      target="_blank"
                      className="inline-flex items-center justify-center size-8 rounded-lg text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800 transition-colors"
                      title="View Public Listing"
                    >
                      <ExternalLinkIcon className="size-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
