"use client";

import { useMemo } from "react";
import {
  Search,
  X,
  SlidersHorizontal,
  RotateCcw,
  Building2,
  MapPin,
  BedDouble,
  Bath,
} from "lucide-react";
import type { PropertyFilters } from "@/types";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/motion/select";
import {
  AdaptiveStepper,
  AdaptiveStepperDecrement,
  AdaptiveStepperValue,
  AdaptiveStepperIncrement,
} from "@/components/motion/adaptive-stepper";
import { cn } from "@/lib/utils";
import { LiquidPurposeSelector } from "./liquid-purpose-selector";
import {
  PROPERTY_TYPE_OPTIONS,
  LOCATION_OPTIONS,
  RENT_BUDGET_PRESETS,
  BUY_BUDGET_PRESETS,
} from "./constants";

export interface PropertyFiltersSheetProps {
  filters: PropertyFilters;
  onFilterChange: <K extends keyof PropertyFilters>(
    key: K,
    value: PropertyFilters[K]
  ) => void;
  onPurposeChange?: (mode: "all" | "buy" | "rent") => void;
  onReset: () => void;
  totalCount: number;
  filteredCount: number;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: React.ReactNode;
  className?: string;
}

export function PropertyFiltersSheet({
  filters,
  onFilterChange,
  onPurposeChange,
  onReset,
  filteredCount,
  open,
  onOpenChange,
  trigger,
  className,
}: PropertyFiltersSheetProps) {
  // Convert BHK string to numeric value for AdaptiveStepper
  const bhkNumber = useMemo(() => {
    if (filters.bhk === "all") return 0;
    if (filters.bhk === "5+") return 5;
    const n = parseInt(filters.bhk, 10);
    return Number.isNaN(n) ? 0 : n;
  }, [filters.bhk]);

  const handleBhkChange = (val: number) => {
    if (val === 0) onFilterChange("bhk", "all");
    else if (val >= 5) onFilterChange("bhk", "5+");
    else onFilterChange("bhk", String(val));
  };

  // Budget Slider logic
  const isRent = filters.purpose === "rent";
  const budgetMin = 0;
  const budgetMax = isRent ? 50000 : 50000000;
  const budgetStep = isRent ? 1000 : 500000;

  const currentBudgetRange: [number, number] = [
    Math.min(filters.minBudget, budgetMax),
    Math.min(filters.maxBudget, budgetMax),
  ];

  const handleBudgetChange = (val: number | readonly number[]) => {
    if (Array.isArray(val) && val.length === 2) {
      onFilterChange("minBudget", val[0]);
      onFilterChange("maxBudget", val[1]);
    }
  };

  // Home Area Slider logic (m²)
  const handleHomeAreaChange = (val: number | readonly number[]) => {
    if (Array.isArray(val) && val.length === 2) {
      onFilterChange("minHomeArea", val[0]);
      onFilterChange("maxHomeArea", val[1]);
    }
  };

  // Land Area Slider logic (m²)
  const handleLandAreaChange = (val: number | readonly number[]) => {
    if (Array.isArray(val) && val.length === 2) {
      onFilterChange("minLandArea", val[0]);
      onFilterChange("maxLandArea", val[1]);
    }
  };

  // Formatted Budget string for display
  const formattedBudgetDisplay = useMemo(() => {
    if (isRent) {
      return `$${filters.minBudget.toLocaleString()} - $${filters.maxBudget.toLocaleString()} / mo`;
    }
    const minM = (filters.minBudget / 1000000).toFixed(1);
    const maxM = (filters.maxBudget / 1000000).toFixed(1);
    return `$${minM}M - $${maxM}M`;
  }, [filters.minBudget, filters.maxBudget, isRent]);

  const handlePurpose = (mode: "all" | "buy" | "rent") => {
    if (onPurposeChange) {
      onPurposeChange(mode);
    } else {
      onFilterChange("purpose", mode);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      {/* Trigger: User supplied or Default Button */}
      {trigger ? (
        <SheetTrigger render={<div>{trigger}</div>} />
      ) : (
        <SheetTrigger
          render={
            <Button
              variant="secondary"
              className={cn(
                "group relative flex items-center gap-2 px-4 py-2.5",
                className
              )}
            />
          }
        >
          <SlidersHorizontal className="size-3.5 text-amber-400 transition-transform group-hover:scale-110" />
          <span>Filters</span>
        </SheetTrigger>
      )}

      {/* Filter Drawer Sheet Content */}
      <SheetContent
        side="right"
        className="flex h-dvh max-h-screen w-full! max-w-full! flex-col overflow-hidden border-l border-neutral-200 bg-white p-0 text-neutral-900 shadow-2xl sm:max-w-lg! data-[side=right]:sm:max-w-lg! dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-100"
      >
        {/* Header */}
        <SheetHeader className="shrink-0 border-b border-neutral-200/80 px-6 py-5 dark:border-neutral-800/80">
          <div className="flex items-center gap-2.5 pr-8">
            <div className="flex size-8 items-center justify-center rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-600 dark:border-amber-400/30 dark:bg-amber-400/10 dark:text-amber-400">
              <SlidersHorizontal className="size-4" />
            </div>
            <div>
              <SheetTitle className="text-base font-semibold text-neutral-900 dark:text-neutral-100">
                Filter Properties
              </SheetTitle>
              <SheetDescription className="text-xs text-neutral-600 dark:text-neutral-400">
                Refine architectural estates and luxury leases
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>

        {/* Scrollable Filters Body */}
        <div
          data-lenis-prevent
          onWheel={(e) => e.stopPropagation()}
          className="custom-scrollbar min-h-0 flex-1 space-y-6 overflow-y-auto overscroll-contain px-6 py-5 pr-4"
        >
          {/* 1. Transaction Type (Liquid Component) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-neutral-700 dark:text-neutral-300">
                Acquisition Purpose
              </label>
              <span className="text-xs font-medium text-amber-600 dark:text-amber-400">
                {filters.purpose === "all"
                  ? "All Modes"
                  : filters.purpose === "buy"
                    ? "Purchase Only"
                    : "Lease Only"}
              </span>
            </div>
            <LiquidPurposeSelector
              value={filters.purpose}
              onChange={handlePurpose}
            />
          </div>

          {/* 2. Keyword Search */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-neutral-700 dark:text-neutral-300">
              Search Keyword
            </label>
            <div className="relative">
              <Search className="absolute top-1/2 left-3 size-3.5 -translate-y-1/2 text-neutral-400 dark:text-neutral-500" />
              <input
                type="text"
                value={filters.search}
                onChange={(e) => onFilterChange("search", e.target.value)}
                placeholder="Search title, location, architectural features..."
                className="w-full rounded-xl border border-neutral-200 bg-neutral-100/70 py-2.5 pr-9 pl-9 text-xs text-neutral-900 transition-all placeholder:text-neutral-400 focus:border-amber-500/80 focus:ring-1 focus:ring-amber-500/80 focus:outline-none dark:border-neutral-800 dark:bg-neutral-900/70 dark:text-neutral-100 dark:placeholder:text-neutral-500 dark:focus:border-amber-400/80 dark:focus:ring-amber-400/80"
              />
              {filters.search && (
                <Button
                  type="button"
                  variant="secondary"
                  size="icon-xs"
                  onClick={() => onFilterChange("search", "")}
                  className="absolute top-1/2 right-3 -translate-y-1/2 rounded-full"
                  aria-label="Clear search"
                >
                  <X className="size-3.5" />
                </Button>
              )}
            </div>
          </div>

          {/* 3. Classification & Region */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {/* Property Type Select */}
            <div className="space-y-1.5">
              <label className="flex items-center gap-1.5 text-xs font-medium text-neutral-700 dark:text-neutral-300">
                <Building2 className="size-3.5 text-amber-500 dark:text-amber-400" />
                <span>Property Type</span>
              </label>
              <Select
                value={filters.propertyType}
                onValueChange={(val) =>
                  onFilterChange(
                    "propertyType",
                    val as PropertyFilters["propertyType"]
                  )
                }
              >
                <SelectTrigger className="w-full rounded-xl border-neutral-200 bg-white py-2 text-xs text-neutral-900 hover:border-neutral-300 dark:border-neutral-800 dark:bg-neutral-900/80 dark:text-neutral-200 dark:hover:border-neutral-700">
                  <SelectValue placeholder="All Property Types" />
                </SelectTrigger>
                <SelectContent className="z-50 rounded-xl border-neutral-200 bg-white text-xs text-neutral-900 shadow-xl dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-200 dark:shadow-2xl">
                  {PROPERTY_TYPE_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Region Select */}
            <div className="space-y-1.5">
              <label className="flex items-center gap-1.5 text-xs font-medium text-neutral-700 dark:text-neutral-300">
                <MapPin className="size-3.5 text-amber-500 dark:text-amber-400" />
                <span>Region / Location</span>
              </label>
              <Select
                value={filters.location}
                onValueChange={(val) => onFilterChange("location", val)}
              >
                <SelectTrigger className="w-full rounded-xl border-neutral-200 bg-white py-2 text-xs text-neutral-900 hover:border-neutral-300 dark:border-neutral-800 dark:bg-neutral-900/80 dark:text-neutral-200 dark:hover:border-neutral-700">
                  <SelectValue placeholder="All Locations" />
                </SelectTrigger>
                <SelectContent className="z-50 rounded-xl border-neutral-200 bg-white text-xs text-neutral-900 shadow-xl dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-200 dark:shadow-2xl">
                  {LOCATION_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* 4. Bedrooms & Bathrooms */}
          <div className="space-y-2.5">
            <label className="text-xs font-medium text-neutral-700 dark:text-neutral-300">
              Bedrooms & Bathrooms
            </label>
            <div className="space-y-3.5 rounded-2xl border border-neutral-200 bg-neutral-50/80 p-4 dark:border-neutral-800 dark:bg-neutral-900/40">
              {/* Bedrooms Row */}
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="flex size-7 items-center justify-center rounded-lg border border-amber-500/20 bg-amber-500/10 text-amber-600 dark:border-amber-400/20 dark:bg-amber-400/10 dark:text-amber-400">
                    <BedDouble className="size-3.5" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-neutral-900 dark:text-neutral-200">
                      Bedrooms
                    </p>
                    <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                      {filters.bhk === "all"
                        ? "Any bedroom count"
                        : `Minimum ${filters.bhk} BHK`}
                    </p>
                  </div>
                </div>
                <AdaptiveStepper
                  size="sm"
                  value={bhkNumber}
                  onValueChange={handleBhkChange}
                  min={0}
                  max={5}
                  fill="#262626"
                >
                  <AdaptiveStepperDecrement />
                  <AdaptiveStepperValue>
                    {(val) =>
                      val === 0 ? "Any" : val >= 5 ? "5+ BHK" : `${val} BHK`
                    }
                  </AdaptiveStepperValue>
                  <AdaptiveStepperIncrement />
                </AdaptiveStepper>
              </div>

              <div className="h-px bg-neutral-200 dark:bg-neutral-800/70" />

              {/* Bathrooms Row */}
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="flex size-7 items-center justify-center rounded-lg border border-amber-500/20 bg-amber-500/10 text-amber-600 dark:border-amber-400/20 dark:bg-amber-400/10 dark:text-amber-400">
                    <Bath className="size-3.5" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-neutral-900 dark:text-neutral-200">
                      Bathrooms
                    </p>
                    <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                      {filters.bathrooms === 0
                        ? "Any bathroom count"
                        : `Minimum ${filters.bathrooms}+ baths`}
                    </p>
                  </div>
                </div>
                <AdaptiveStepper
                  size="sm"
                  value={filters.bathrooms}
                  onValueChange={(val) => onFilterChange("bathrooms", val)}
                  min={0}
                  max={6}
                  fill="#262626"
                >
                  <AdaptiveStepperDecrement />
                  <AdaptiveStepperValue>
                    {(val) => (val === 0 ? "Any" : `${val}+ Baths`)}
                  </AdaptiveStepperValue>
                  <AdaptiveStepperIncrement />
                </AdaptiveStepper>
              </div>
            </div>
          </div>

          {/* 5. Budget Range Slider */}
          <div className="space-y-3 rounded-2xl border border-neutral-200 bg-neutral-50/80 p-4 dark:border-neutral-800 dark:bg-neutral-900/40">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-neutral-700 dark:text-neutral-300">
                Budget Range
              </label>
              <span className="rounded-md bg-amber-500/10 px-2 py-0.5 text-xs font-medium text-amber-700 tabular-nums dark:bg-amber-400/10 dark:text-amber-300">
                {formattedBudgetDisplay}
              </span>
            </div>

            <div className="pt-2 pb-1">
              <Slider
                min={budgetMin}
                max={budgetMax}
                step={budgetStep}
                value={currentBudgetRange}
                onValueChange={handleBudgetChange}
              />
            </div>

            {/* Quick Presets */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {(isRent ? RENT_BUDGET_PRESETS : BUY_BUDGET_PRESETS).map((p) => {
                const isSelected =
                  filters.minBudget === p.min && filters.maxBudget === p.max;
                return (
                  <Button
                    key={p.label}
                    type="button"
                    size="xs"
                    variant={isSelected ? "primary" : "secondary"}
                    onClick={() => {
                      onFilterChange("minBudget", p.min);
                      onFilterChange("maxBudget", p.max);
                    }}
                  >
                    {p.label}
                  </Button>
                );
              })}
            </div>
          </div>

          {/* 6. Area Specifications */}
          <div className="space-y-4 rounded-2xl border border-neutral-200 bg-neutral-50/80 p-4 dark:border-neutral-800 dark:bg-neutral-900/40">
            {/* Home Living Area */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-neutral-700 dark:text-neutral-300">
                  Home Living Area
                </label>
                <span className="text-xs font-medium text-neutral-900 tabular-nums dark:text-neutral-200">
                  {filters.minHomeArea} m² - {filters.maxHomeArea} m²
                </span>
              </div>
              <div className="pt-1 pb-1">
                <Slider
                  min={0}
                  max={2000}
                  step={25}
                  value={[filters.minHomeArea, filters.maxHomeArea]}
                  onValueChange={handleHomeAreaChange}
                />
              </div>
            </div>

            <div className="h-px bg-neutral-200 dark:bg-neutral-800/70" />

            {/* Land Parcel Area */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-neutral-700 dark:text-neutral-300">
                  Land Parcel Area
                </label>
                <span className="text-xs font-medium text-neutral-900 tabular-nums dark:text-neutral-200">
                  {filters.minLandArea} m² - {filters.maxLandArea} m²
                </span>
              </div>
              <div className="pt-1 pb-1">
                <Slider
                  min={0}
                  max={10000}
                  step={100}
                  value={[filters.minLandArea, filters.maxLandArea]}
                  onValueChange={handleLandAreaChange}
                />
              </div>
            </div>
          </div>

          {/* 7. Luxury Only Switch */}
          <div className="flex items-center justify-between rounded-2xl border border-neutral-200 bg-neutral-50/80 p-4 dark:border-neutral-800 dark:bg-neutral-900/40">
            <span className="text-xs font-medium text-neutral-900 dark:text-neutral-200">
              Luxury Portfolio Only
            </span>
            <Switch
              checked={filters.luxuryOnly}
              onCheckedChange={(checked) =>
                onFilterChange("luxuryOnly", Boolean(checked))
              }
            />
          </div>
        </div>

        {/* Footer Actions */}
        <SheetFooter className="shrink-0 border-t border-neutral-200/80 bg-white/95 px-6 py-4 backdrop-blur-md dark:border-neutral-800/80 dark:bg-neutral-950/90">
          <div className="flex w-full items-center gap-3">
            <Button
              type="button"
              variant="secondary"
              size="lg"
              onClick={onReset}
              className="flex-1 gap-1.5"
            >
              <RotateCcw className="size-3.5" />
              <span>Reset All</span>
            </Button>
            <Button
              type="button"
              variant="primary"
              size="lg"
              onClick={() => onOpenChange?.(false)}
              className="flex-1"
            >
              Show {filteredCount}{" "}
              {filteredCount === 1 ? "Property" : "Properties"}
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

export default PropertyFiltersSheet;
