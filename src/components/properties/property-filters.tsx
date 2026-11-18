"use client";

import { useState } from "react";
import {
  Search,
  X,
  SlidersHorizontal,
  Sparkles,
  RotateCcw,
} from "lucide-react";
import type { PropertyFilters } from "@/types";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

interface PropertyFiltersComponentProps {
  filters: PropertyFilters;
  onFilterChange: <K extends keyof PropertyFilters>(
    key: K,
    value: PropertyFilters[K]
  ) => void;
  onReset: () => void;
  totalCount: number;
  filteredCount: number;
  className?: string;
}

export function PropertyFiltersComponent({
  filters,
  onFilterChange,
  onReset,
  totalCount,
  filteredCount,
  className,
}: PropertyFiltersComponentProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const activeFiltersCount = [
    filters.purpose !== "all",
    filters.bhk !== "all",
    filters.search.trim().length > 0,
    filters.luxuryOnly,
    filters.minBudget > 0,
    filters.maxBudget < 50000000,
    filters.minHomeArea > 0,
    filters.maxHomeArea < 2000,
    filters.minLandArea > 0,
    filters.maxLandArea < 10000,
  ].filter(Boolean).length;

  // Reusable Filter Form Content
  const filterControls = (
    <div className="space-y-6">
      {/* 1. Purpose: Buy / Rent / All */}
      <div className="space-y-2">
        <label className="block text-xs font-semibold tracking-wider text-neutral-300 uppercase">
          Purpose
        </label>
        <div className="grid grid-cols-3 gap-1 rounded-xl border border-neutral-800 bg-neutral-900 p-1">
          {(["all", "buy", "rent"] as const).map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => onFilterChange("purpose", mode)}
              className={cn(
                "rounded-lg py-2 text-xs font-medium capitalize transition-all select-none",
                filters.purpose === mode
                  ? "bg-neutral-800 font-semibold text-neutral-100 shadow-sm"
                  : "text-neutral-400 hover:text-neutral-200"
              )}
            >
              {mode === "all" ? "All" : mode === "buy" ? "Buy" : "Rent"}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Search by Property Name */}
      <div className="space-y-2">
        <label className="block text-xs font-semibold tracking-wider text-neutral-300 uppercase">
          Search Property Name
        </label>
        <div className="relative">
          <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-neutral-500" />
          <input
            type="text"
            value={filters.search}
            onChange={(e) => onFilterChange("search", e.target.value)}
            placeholder="e.g. Villa Lumina, Penthouse..."
            className="w-full rounded-xl border border-neutral-800 bg-neutral-900 py-2.5 pr-9 pl-9 text-xs text-neutral-100 transition-all placeholder:text-neutral-500 focus:border-amber-400/80 focus:ring-1 focus:ring-amber-400/80 focus:outline-none"
          />
          {filters.search && (
            <button
              type="button"
              onClick={() => onFilterChange("search", "")}
              className="absolute top-1/2 right-3 -translate-y-1/2 text-neutral-400 hover:text-neutral-200"
              aria-label="Clear search"
            >
              <X className="size-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* 3. BHK Configuration */}
      <div className="space-y-2">
        <label className="block text-xs font-semibold tracking-wider text-neutral-300 uppercase">
          Bedrooms (BHK)
        </label>
        <div className="grid grid-cols-6 gap-1">
          {["all", "1", "2", "3", "4", "5+"].map((bhkVal) => (
            <button
              key={bhkVal}
              type="button"
              onClick={() => onFilterChange("bhk", bhkVal)}
              className={cn(
                "rounded-lg border py-2 text-center text-xs font-medium transition-all select-none",
                filters.bhk === bhkVal
                  ? "border-amber-400/60 bg-amber-400/15 font-semibold text-amber-300 shadow-xs"
                  : "border-neutral-800 bg-neutral-900 text-neutral-400 hover:border-neutral-700 hover:text-neutral-200"
              )}
            >
              {bhkVal === "all" ? "All" : `${bhkVal}`}
            </button>
          ))}
        </div>
      </div>

      {/* 4. Luxury Properties Toggle */}
      <div className="flex items-center justify-between rounded-xl border border-neutral-800 bg-neutral-900/80 p-3.5">
        <div className="flex items-center gap-2">
          <div className="flex size-7 items-center justify-center rounded-lg border border-amber-400/20 bg-amber-400/10 text-amber-400">
            <Sparkles className="size-3.5" />
          </div>
          <div>
            <p className="text-xs font-medium text-neutral-200">
              Luxury Properties
            </p>
            <p className="text-[11px] text-neutral-500">
              Signature architectural estates only
            </p>
          </div>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={filters.luxuryOnly}
          onClick={() => onFilterChange("luxuryOnly", !filters.luxuryOnly)}
          className={cn(
            "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none",
            filters.luxuryOnly ? "bg-amber-400" : "bg-neutral-800"
          )}
        >
          <span
            className={cn(
              "pointer-events-none inline-block size-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out",
              filters.luxuryOnly ? "translate-x-5" : "translate-x-0"
            )}
          />
        </button>
      </div>

      {/* 5. Budget Range */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold tracking-wider text-neutral-300 uppercase">
            Budget
          </label>
          <span className="text-[11px] text-neutral-400">
            {filters.purpose === "rent"
              ? `$${filters.minBudget.toLocaleString()} - $${filters.maxBudget.toLocaleString()}/mo`
              : `$${(filters.minBudget / 1000000).toFixed(1)}M - $${(filters.maxBudget / 1000000).toFixed(1)}M`}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <span className="mb-1 block text-[10px] tracking-wider text-neutral-500 uppercase">
              Min ($)
            </span>
            <input
              type="number"
              value={filters.minBudget}
              onChange={(e) =>
                onFilterChange(
                  "minBudget",
                  Math.max(0, Number(e.target.value) || 0)
                )
              }
              step={filters.purpose === "rent" ? 1000 : 500000}
              className="w-full rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-1.5 text-xs text-neutral-100 focus:border-amber-400/80 focus:outline-none"
            />
          </div>
          <div>
            <span className="mb-1 block text-[10px] tracking-wider text-neutral-500 uppercase">
              Max ($)
            </span>
            <input
              type="number"
              value={filters.maxBudget}
              onChange={(e) =>
                onFilterChange(
                  "maxBudget",
                  Math.max(0, Number(e.target.value) || 0)
                )
              }
              step={filters.purpose === "rent" ? 1000 : 500000}
              className="w-full rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-1.5 text-xs text-neutral-100 focus:border-amber-400/80 focus:outline-none"
            />
          </div>
        </div>

        {/* Quick Budget Presets */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {filters.purpose === "rent" ? (
            <>
              {[
                { label: "Under $10k", min: 0, max: 10000 },
                { label: "$10k - $25k", min: 10000, max: 25000 },
                { label: "$25k+", min: 25000, max: 50000 },
              ].map((p) => (
                <button
                  key={p.label}
                  type="button"
                  onClick={() => {
                    onFilterChange("minBudget", p.min);
                    onFilterChange("maxBudget", p.max);
                  }}
                  className="rounded-md border border-neutral-800 bg-neutral-900/60 px-2 py-1 text-[10px] text-neutral-400 hover:border-neutral-700 hover:text-neutral-200"
                >
                  {p.label}
                </button>
              ))}
            </>
          ) : (
            <>
              {[
                { label: "< $5M", min: 0, max: 5000000 },
                { label: "$5M - $15M", min: 5000000, max: 15000000 },
                { label: "$15M+", min: 15000000, max: 50000000 },
              ].map((p) => (
                <button
                  key={p.label}
                  type="button"
                  onClick={() => {
                    onFilterChange("minBudget", p.min);
                    onFilterChange("maxBudget", p.max);
                  }}
                  className="rounded-md border border-neutral-800 bg-neutral-900/60 px-2 py-1 text-[10px] text-neutral-400 hover:border-neutral-700 hover:text-neutral-200"
                >
                  {p.label}
                </button>
              ))}
            </>
          )}
        </div>
      </div>

      {/* 6. Home Area (m²) */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold tracking-wider text-neutral-300 uppercase">
            Home Area (m²)
          </label>
          <span className="text-[11px] text-neutral-400">
            {filters.minHomeArea} m² - {filters.maxHomeArea} m²
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <span className="mb-1 block text-[10px] tracking-wider text-neutral-500 uppercase">
              Min m²
            </span>
            <input
              type="number"
              value={filters.minHomeArea}
              onChange={(e) =>
                onFilterChange(
                  "minHomeArea",
                  Math.max(0, Number(e.target.value) || 0)
                )
              }
              step={50}
              className="w-full rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-1.5 text-xs text-neutral-100 focus:border-amber-400/80 focus:outline-none"
            />
          </div>
          <div>
            <span className="mb-1 block text-[10px] tracking-wider text-neutral-500 uppercase">
              Max m²
            </span>
            <input
              type="number"
              value={filters.maxHomeArea}
              onChange={(e) =>
                onFilterChange(
                  "maxHomeArea",
                  Math.max(0, Number(e.target.value) || 0)
                )
              }
              step={50}
              className="w-full rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-1.5 text-xs text-neutral-100 focus:border-amber-400/80 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* 7. Land Area (m²) */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold tracking-wider text-neutral-300 uppercase">
            Land Area (m²)
          </label>
          <span className="text-[11px] text-neutral-400">
            {filters.minLandArea} m² - {filters.maxLandArea} m²
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <span className="mb-1 block text-[10px] tracking-wider text-neutral-500 uppercase">
              Min m²
            </span>
            <input
              type="number"
              value={filters.minLandArea}
              onChange={(e) =>
                onFilterChange(
                  "minLandArea",
                  Math.max(0, Number(e.target.value) || 0)
                )
              }
              step={100}
              className="w-full rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-1.5 text-xs text-neutral-100 focus:border-amber-400/80 focus:outline-none"
            />
          </div>
          <div>
            <span className="mb-1 block text-[10px] tracking-wider text-neutral-500 uppercase">
              Max m²
            </span>
            <input
              type="number"
              value={filters.maxLandArea}
              onChange={(e) =>
                onFilterChange(
                  "maxLandArea",
                  Math.max(0, Number(e.target.value) || 0)
                )
              }
              step={100}
              className="w-full rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-1.5 text-xs text-neutral-100 focus:border-amber-400/80 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Reset Action */}
      <div className="pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={onReset}
          className="w-full gap-1.5 border-neutral-800 bg-neutral-900 text-xs text-neutral-300 hover:bg-neutral-800 hover:text-white"
        >
          <RotateCcw className="size-3.5" />
          <span>Reset All Filters</span>
        </Button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Filters Panel */}
      <aside
        className={cn(
          "sticky top-28 hidden w-80 shrink-0 self-start rounded-2xl border border-neutral-800 bg-neutral-950/80 p-5 shadow-xl backdrop-blur-xl lg:block",
          className
        )}
      >
        <div className="mb-5 flex items-center justify-between border-b border-neutral-800/80 pb-4">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="size-4 text-amber-400" />
            <h2 className="text-sm font-semibold tracking-wide text-neutral-100">
              Filter Properties
            </h2>
          </div>
          {activeFiltersCount > 0 && (
            <button
              type="button"
              onClick={onReset}
              className="text-[11px] font-medium text-amber-400 hover:text-amber-300"
            >
              Clear ({activeFiltersCount})
            </button>
          )}
        </div>

        {filterControls}
      </aside>

      {/* Mobile Filters Trigger & Sheet */}
      <div className="mb-6 flex w-full items-center justify-between gap-3 lg:hidden">
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger
            render={
              <Button
                variant="outline"
                className="flex items-center gap-2 rounded-xl border-neutral-800 bg-neutral-900/90 px-4 py-2 text-xs text-neutral-200"
              />
            }
          >
            <SlidersHorizontal className="size-4 text-amber-400" />
            <span>Filters</span>
            {activeFiltersCount > 0 && (
              <span className="flex size-4 items-center justify-center rounded-full bg-amber-400 text-[10px] font-bold text-neutral-950">
                {activeFiltersCount}
              </span>
            )}
          </SheetTrigger>

          <SheetContent
            side="left"
            className="w-[90%] max-w-md overflow-y-auto border-r border-neutral-800 bg-neutral-950 p-6 text-neutral-100"
          >
            <SheetHeader className="mb-6 border-b border-neutral-800 pb-4">
              <SheetTitle className="flex items-center gap-2 text-base font-semibold text-neutral-100">
                <SlidersHorizontal className="size-4 text-amber-400" />
                Filter Properties
              </SheetTitle>
            </SheetHeader>

            {filterControls}

            <div className="mt-8 border-t border-neutral-800 pt-4">
              <Button
                className="w-full rounded-xl bg-neutral-100 py-3 text-xs font-semibold text-neutral-950 hover:bg-neutral-200"
                onClick={() => setMobileOpen(false)}
              >
                Show {filteredCount} Properties
              </Button>
            </div>
          </SheetContent>
        </Sheet>

        <span className="text-xs font-medium text-neutral-400">
          Showing {filteredCount} of {totalCount} estates
        </span>
      </div>
    </>
  );
}

export default PropertyFiltersComponent;
