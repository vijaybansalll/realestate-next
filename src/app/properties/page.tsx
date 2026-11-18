"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowUpDown,
  Home as HomeIcon,
  X,
  Building2,
  RotateCcw,
} from "lucide-react";
import { ALL_PROPERTIES } from "@/data";
import type { Property, PropertyFilters } from "@/types";
import {
  PropertyCard,
  PropertyFiltersComponent,
  PropertyInquiryModal,
} from "@/components/properties";
import { Button } from "@/components/ui/button";

const INITIAL_FILTERS: PropertyFilters = {
  purpose: "all",
  bhk: "all",
  search: "",
  luxuryOnly: false,
  minBudget: 0,
  maxBudget: 50000000,
  minHomeArea: 0,
  maxHomeArea: 2000,
  minLandArea: 0,
  maxLandArea: 10000,
  sortBy: "featured",
};

export default function PropertiesPage() {
  const [filters, setFilters] = useState<PropertyFilters>(INITIAL_FILTERS);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(
    null
  );

  const handleFilterChange = <K extends keyof PropertyFilters>(
    key: K,
    value: PropertyFilters[K]
  ) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleReset = () => {
    setFilters(INITIAL_FILTERS);
  };

  // Filtered & Sorted properties
  const filteredProperties = useMemo(() => {
    return ALL_PROPERTIES.filter((property) => {
      // 1. Purpose filter (Buy vs Rent)
      if (filters.purpose !== "all" && property.purpose !== filters.purpose) {
        return false;
      }

      // 2. Search query (Name, Location, or Features)
      if (filters.search.trim()) {
        const q = filters.search.toLowerCase().trim();
        const matchTitle = property.title.toLowerCase().includes(q);
        const matchLocation = property.location.toLowerCase().includes(q);
        const matchFeature = property.features?.some((f) =>
          f.toLowerCase().includes(q)
        );
        if (!matchTitle && !matchLocation && !matchFeature) return false;
      }

      // 3. BHK filter
      if (filters.bhk !== "all") {
        if (filters.bhk === "5+") {
          if (property.bhk < 5) return false;
        } else {
          if (property.bhk !== Number(filters.bhk)) return false;
        }
      }

      // 4. Luxury Only
      if (filters.luxuryOnly && !property.isLuxury) {
        return false;
      }

      // 5. Budget Range
      if (
        property.price < filters.minBudget ||
        property.price > filters.maxBudget
      ) {
        return false;
      }

      // 6. Home Area (m²)
      if (
        property.homeAreaSqM < filters.minHomeArea ||
        property.homeAreaSqM > filters.maxHomeArea
      ) {
        return false;
      }

      // 7. Land Area (m²)
      if (
        property.landAreaSqM < filters.minLandArea ||
        property.landAreaSqM > filters.maxLandArea
      ) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (filters.sortBy === "price-asc") return a.price - b.price;
      if (filters.sortBy === "price-desc") return b.price - a.price;
      if (filters.sortBy === "homeArea-desc")
        return b.homeAreaSqM - a.homeAreaSqM;

      // Default "featured":
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return b.price - a.price;
    });
  }, [filters]);

  // Active filter pills for quick removal
  const activeChips = useMemo(() => {
    const chips: { label: string; onRemove: () => void }[] = [];

    if (filters.purpose !== "all") {
      chips.push({
        label: filters.purpose === "buy" ? "For Sale" : "For Lease",
        onRemove: () => handleFilterChange("purpose", "all"),
      });
    }

    if (filters.bhk !== "all") {
      chips.push({
        label: `${filters.bhk} BHK`,
        onRemove: () => handleFilterChange("bhk", "all"),
      });
    }

    if (filters.luxuryOnly) {
      chips.push({
        label: "Luxury Only",
        onRemove: () => handleFilterChange("luxuryOnly", false),
      });
    }

    if (filters.search.trim()) {
      chips.push({
        label: `"${filters.search}"`,
        onRemove: () => handleFilterChange("search", ""),
      });
    }

    if (filters.minBudget > 0 || filters.maxBudget < 50000000) {
      chips.push({
        label: `Budget: $${(filters.minBudget / 1000000).toFixed(1)}M - $${(filters.maxBudget / 1000000).toFixed(1)}M`,
        onRemove: () => {
          handleFilterChange("minBudget", 0);
          handleFilterChange("maxBudget", 50000000);
        },
      });
    }

    if (filters.minHomeArea > 0 || filters.maxHomeArea < 2000) {
      chips.push({
        label: `Home: ${filters.minHomeArea}m² - ${filters.maxHomeArea}m²`,
        onRemove: () => {
          handleFilterChange("minHomeArea", 0);
          handleFilterChange("maxHomeArea", 2000);
        },
      });
    }

    if (filters.minLandArea > 0 || filters.maxLandArea < 10000) {
      chips.push({
        label: `Land: ${filters.minLandArea}m² - ${filters.maxLandArea}m²`,
        onRemove: () => {
          handleFilterChange("minLandArea", 0);
          handleFilterChange("maxLandArea", 10000);
        },
      });
    }

    return chips;
  }, [filters]);

  return (
    <main className="min-h-screen bg-neutral-950 pt-24 pb-20 text-neutral-100 selection:bg-amber-500 selection:text-neutral-950">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Navigation Breadcrumb */}
        <div className="mb-6 flex items-center gap-2 text-xs text-neutral-400">
          <Link
            href="/"
            className="flex items-center gap-1 transition-colors hover:text-neutral-200"
          >
            <HomeIcon className="size-3.5" />
            <span>Home</span>
          </Link>
          <span>/</span>
          <span className="font-medium text-neutral-200">Estates Catalog</span>
        </div>

        {/* Page Header */}
        <div className="mb-8 flex flex-col gap-4 border-b border-neutral-800/80 pb-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold tracking-[0.25em] text-amber-400 uppercase">
                Curated Portfolio
              </span>
              <span className="inline-flex items-center rounded-full border border-amber-400/20 bg-amber-400/10 px-2 py-0.5 text-[11px] font-medium text-amber-300">
                {ALL_PROPERTIES.length} Estates Available
              </span>
            </div>
            <h1 className="mt-2 text-3xl font-medium tracking-tight text-neutral-100 sm:text-5xl">
              Architectural Estates & Residences
            </h1>
            <p className="mt-2 max-w-2xl text-xs leading-relaxed text-neutral-400 sm:text-sm">
              Browse our premier portfolio of coastal retreats, hillside villas,
              and penthouses available for private acquisition and luxury lease.
            </p>
          </div>

          <Link
            href="/"
            className="hidden items-center gap-1.5 text-xs text-neutral-400 transition-colors hover:text-neutral-200 sm:inline-flex"
          >
            <ArrowLeft className="size-3.5" />
            <span>Back to Walkthrough</span>
          </Link>
        </div>

        {/* Layout: Sidebar Filters + Property Grid */}
        <div className="flex flex-col items-start gap-8 lg:flex-row">
          {/* Filters Sidebar */}
          <PropertyFiltersComponent
            filters={filters}
            onFilterChange={handleFilterChange}
            onReset={handleReset}
            totalCount={ALL_PROPERTIES.length}
            filteredCount={filteredProperties.length}
          />

          {/* Results Main Column */}
          <div className="w-full flex-1">
            {/* Top Toolbar: Active Chips & Sort */}
            <div className="mb-6 flex flex-col justify-between gap-4 border-b border-neutral-800/80 pb-4 sm:flex-row sm:items-center">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-neutral-200">
                  {filteredProperties.length}{" "}
                  {filteredProperties.length === 1 ? "Property" : "Properties"}{" "}
                  Found
                </span>
                {activeChips.length > 0 && (
                  <button
                    type="button"
                    onClick={handleReset}
                    className="ml-2 flex items-center gap-1 text-xs text-amber-400 hover:text-amber-300"
                  >
                    <RotateCcw className="size-3" />
                    <span>Reset</span>
                  </button>
                )}
              </div>

              {/* Sort By Dropdown */}
              <div className="flex items-center gap-2">
                <label
                  htmlFor="sort-properties"
                  className="flex items-center gap-1 text-xs whitespace-nowrap text-neutral-400"
                >
                  <ArrowUpDown className="size-3.5 text-neutral-400" />
                  Sort by:
                </label>
                <select
                  id="sort-properties"
                  value={filters.sortBy}
                  onChange={(e) =>
                    handleFilterChange(
                      "sortBy",
                      e.target.value as PropertyFilters["sortBy"]
                    )
                  }
                  className="rounded-xl border border-neutral-800 bg-neutral-900 px-3 py-1.5 text-xs text-neutral-200 focus:border-amber-400 focus:outline-none"
                >
                  <option value="featured">Featured First</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="homeArea-desc">Home Area: Largest</option>
                </select>
              </div>
            </div>

            {/* Active Filters Pill Bar */}
            {activeChips.length > 0 && (
              <div className="mb-6 flex flex-wrap items-center gap-1.5">
                <span className="mr-1 text-xs text-neutral-500">
                  Active filters:
                </span>
                {activeChips.map((chip) => (
                  <span
                    key={chip.label}
                    className="inline-flex items-center gap-1 rounded-full border border-neutral-800 bg-neutral-900 px-3 py-1 text-xs text-neutral-300"
                  >
                    <span>{chip.label}</span>
                    <button
                      type="button"
                      onClick={chip.onRemove}
                      className="text-neutral-500 hover:text-neutral-200"
                      aria-label={`Remove filter ${chip.label}`}
                    >
                      <X className="size-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}

            {/* Property Cards Grid */}
            {filteredProperties.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {filteredProperties.map((property) => (
                  <PropertyCard
                    key={property.id}
                    property={property}
                    onInquire={(prop) => setSelectedProperty(prop)}
                  />
                ))}
              </div>
            ) : (
              /* Empty State */
              <div className="my-8 flex flex-col items-center justify-center rounded-2xl border border-dashed border-neutral-800 bg-neutral-900/30 p-12 text-center">
                <div className="mb-4 flex size-14 items-center justify-center rounded-full bg-neutral-800/80 text-neutral-400">
                  <Building2 className="size-7" />
                </div>
                <h3 className="text-lg font-medium text-neutral-200">
                  No Properties Found
                </h3>
                <p className="mt-2 max-w-sm text-xs leading-relaxed text-neutral-400">
                  No architectural estates match your current filter criteria.
                  Try adjusting the budget, BHK size, or clearing filters.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleReset}
                  className="mt-5 border-neutral-700 bg-neutral-900 text-xs text-neutral-200 hover:bg-neutral-800"
                >
                  <RotateCcw className="mr-1.5 size-3.5" />
                  Reset All Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Inquiry Sheet Modal */}
      <PropertyInquiryModal
        property={selectedProperty}
        onClose={() => setSelectedProperty(null)}
      />
    </main>
  );
}
