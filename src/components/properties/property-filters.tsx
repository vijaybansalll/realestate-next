"use client";

import { useState, useLayoutEffect, useRef, useMemo } from "react";
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
import { Liquid, LiquidItem } from "@/components/motion/liquid";
import { cn } from "@/lib/utils";

/* -------------------------------------------------------------------------- */
/*                     Liquid Purpose Selector Component                      */
/* -------------------------------------------------------------------------- */

interface LiquidPurposeSelectorProps {
  value: "all" | "buy" | "rent";
  onChange: (value: "all" | "buy" | "rent") => void;
}

function LiquidPurposeSelector({
  value,
  onChange,
}: LiquidPurposeSelectorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(400);

  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const update = () => {
      if (el.offsetWidth > 0) setContainerWidth(el.offsetWidth);
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const items = [
    { id: "all", label: "All Properties" },
    { id: "buy", label: "For Sale" },
    { id: "rent", label: "For Lease" },
  ] as const;

  const activeIndex = items.findIndex((i) => i.id === value);
  const padding = 4;
  const innerWidth = Math.max(120, containerWidth - padding * 2);
  const itemWidth = Math.floor(innerWidth / items.length);
  const height = 36;
  const x = padding + (activeIndex >= 0 ? activeIndex : 0) * itemWidth;

  return (
    <div
      ref={containerRef}
      className="relative isolate w-full rounded-2xl border border-neutral-800 bg-neutral-900/80 p-1 select-none"
    >
      <Liquid
        blur={6}
        contrast={18}
        fill="#262626"
        edgeColor="#f59e0b"
        edgeOpacity={0.25}
        edgeWidth={1}
        className="h-9 w-full"
      >
        <LiquidItem
          x={x}
          y={0}
          width={itemWidth}
          height={height}
          radius={12}
          transition={{ duration: 320, ease: [0.22, 1.25, 0.71, 1] }}
        >
          <div className="size-full rounded-xl border border-amber-400/40 bg-neutral-800 shadow-xs" />
        </LiquidItem>
      </Liquid>

      {/* Clickable tabs */}
      <div className="absolute inset-1 z-20 grid grid-cols-3">
        {items.map((item) => {
          const isSelected = item.id === value;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onChange(item.id)}
              className={cn(
                "flex cursor-pointer items-center justify-center rounded-xl text-xs font-medium transition-colors duration-200 outline-none select-none",
                isSelected
                  ? "font-semibold text-amber-300"
                  : "text-neutral-400 hover:text-neutral-200"
              )}
            >
              {item.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                       Main Property Filters Component                       */
/* -------------------------------------------------------------------------- */

export interface PropertyFiltersComponentProps {
  filters: PropertyFilters;
  onFilterChange: <K extends keyof PropertyFilters>(
    key: K,
    value: PropertyFilters[K]
  ) => void;
  onReset: () => void;
  totalCount: number;
  filteredCount: number;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: React.ReactNode;
  className?: string;
}

export function PropertyFiltersComponent({
  filters,
  onFilterChange,
  onReset,
  totalCount,
  filteredCount,
  open: openProp,
  onOpenChange,
  trigger,
  className,
}: PropertyFiltersComponentProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const isControlled = openProp !== undefined;
  const isOpen = isControlled ? openProp : uncontrolledOpen;
  const setIsOpen = isControlled
    ? (onOpenChange ?? (() => {}))
    : setUncontrolledOpen;

  // Active filter count calculation
  const activeFiltersCount = useMemo(() => {
    return [
      filters.purpose !== "all",
      filters.bhk !== "all",
      filters.search.trim().length > 0,
      filters.propertyType !== "all",
      filters.location !== "all",
      filters.bathrooms > 0,
      filters.luxuryOnly,
      filters.minBudget > 0,
      filters.purpose === "rent"
        ? filters.maxBudget < 50000
        : filters.maxBudget < 50000000,
      filters.minHomeArea > 0,
      filters.maxHomeArea < 2000,
      filters.minLandArea > 0,
      filters.maxLandArea < 10000,
    ].filter(Boolean).length;
  }, [filters]);

  // Handle Purpose change with adaptive budget adjustments
  const handlePurposeChange = (mode: "all" | "buy" | "rent") => {
    onFilterChange("purpose", mode);
    if (mode === "rent" && filters.maxBudget > 100000) {
      onFilterChange("minBudget", 0);
      onFilterChange("maxBudget", 50000);
    } else if (
      (mode === "buy" || mode === "all") &&
      filters.maxBudget <= 50000
    ) {
      onFilterChange("minBudget", 0);
      onFilterChange("maxBudget", 50000000);
    }
  };

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

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      {/* Trigger: User supplied or Default Button */}
      {trigger ? (
        <SheetTrigger render={<div>{trigger}</div>} />
      ) : (
        <SheetTrigger
          render={
            <Button
              variant="outline"
              className={cn(
                "group relative flex items-center gap-2 rounded-xl border border-neutral-800 bg-neutral-900/90 px-4 py-2.5 text-xs font-medium text-neutral-200 transition-all hover:border-amber-400/50 hover:bg-neutral-800/80 hover:text-white",
                className
              )}
            />
          }
        >
          <SlidersHorizontal className="size-3.5 text-amber-400 transition-transform group-hover:scale-110" />
          <span>Filters</span>
          {activeFiltersCount > 0 && (
            <span className="flex size-5 items-center justify-center rounded-full bg-amber-400 text-[10px] font-bold text-neutral-950 shadow-xs">
              {activeFiltersCount}
            </span>
          )}
        </SheetTrigger>
      )}

      {/* Filter Drawer Sheet Content */}
      <SheetContent
        side="right"
        className="flex h-dvh max-h-screen w-full flex-col overflow-hidden border-l border-neutral-800 bg-neutral-950 p-0 text-neutral-100 shadow-2xl sm:max-w-lg data-[side=right]:sm:max-w-lg"
      >
        {/* Header */}
        <SheetHeader className="shrink-0 border-b border-neutral-800/80 px-6 py-5">
          <div className="flex items-center gap-2.5 pr-8">
            <div className="flex size-8 items-center justify-center rounded-xl border border-amber-400/30 bg-amber-400/10 text-amber-400">
              <SlidersHorizontal className="size-4" />
            </div>
            <div>
              <SheetTitle className="text-base font-semibold text-neutral-100">
                Filter Properties
              </SheetTitle>
              <SheetDescription className="text-xs text-neutral-400">
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
              <label className="text-xs font-medium text-neutral-300">
                Acquisition Purpose
              </label>
              <span className="text-xs font-medium text-amber-400">
                {filters.purpose === "all"
                  ? "All Modes"
                  : filters.purpose === "buy"
                    ? "Purchase Only"
                    : "Lease Only"}
              </span>
            </div>
            <LiquidPurposeSelector
              value={filters.purpose}
              onChange={handlePurposeChange}
            />
          </div>

          {/* 2. Keyword Search */}
          <div className="space-y-2">
            <div>
              <label className="text-xs font-medium text-neutral-300">
                Search Keyword
              </label>
            </div>
            <div className="relative">
              <Search className="absolute top-1/2 left-3 size-3.5 -translate-y-1/2 text-neutral-500" />
              <input
                type="text"
                value={filters.search}
                onChange={(e) => onFilterChange("search", e.target.value)}
                placeholder="Search title, location, architectural features..."
                className="w-full rounded-xl border border-neutral-800 bg-neutral-900/70 py-2.5 pr-9 pl-9 text-xs text-neutral-100 transition-all placeholder:text-neutral-500 focus:border-amber-400/80 focus:ring-1 focus:ring-amber-400/80 focus:outline-none"
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

          {/* 3. Classification & Region (Motion Select Components) */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {/* Property Type Select */}
            <div className="space-y-1.5">
              <label className="flex items-center gap-1.5 text-xs font-medium text-neutral-300">
                <Building2 className="size-3.5 text-amber-400" />
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
                <SelectTrigger className="w-full rounded-xl border-neutral-800 bg-neutral-900/80 py-2 text-xs text-neutral-200 hover:border-neutral-700">
                  <SelectValue placeholder="All Property Types" />
                </SelectTrigger>
                <SelectContent className="z-50 rounded-xl border-neutral-800 bg-neutral-900 text-xs text-neutral-200 shadow-2xl">
                  <SelectItem value="all">All Property Types</SelectItem>
                  <SelectItem value="estate">Signature Estate</SelectItem>
                  <SelectItem value="villa">Luxury Villa</SelectItem>
                  <SelectItem value="penthouse">
                    Architectural Penthouse
                  </SelectItem>
                  <SelectItem value="townhouse">Modern Townhouse</SelectItem>
                  <SelectItem value="apartment">Luxury Apartment</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Region Select */}
            <div className="space-y-1.5">
              <label className="flex items-center gap-1.5 text-xs font-medium text-neutral-300">
                <MapPin className="size-3.5 text-amber-400" />
                <span>Region / Location</span>
              </label>
              <Select
                value={filters.location}
                onValueChange={(val) => onFilterChange("location", val)}
              >
                <SelectTrigger className="w-full rounded-xl border-neutral-800 bg-neutral-900/80 py-2 text-xs text-neutral-200 hover:border-neutral-700">
                  <SelectValue placeholder="All Locations" />
                </SelectTrigger>
                <SelectContent className="z-50 rounded-xl border-neutral-800 bg-neutral-900 text-xs text-neutral-200 shadow-2xl">
                  <SelectItem value="all">All Locations</SelectItem>
                  <SelectItem value="california">
                    California (Malibu, Beverly Hills)
                  </SelectItem>
                  <SelectItem value="florida">
                    Florida (Miami, Palm Beach)
                  </SelectItem>
                  <SelectItem value="colorado">Colorado (Aspen)</SelectItem>
                  <SelectItem value="new york">
                    New York (Tribeca, Manhattan)
                  </SelectItem>
                  <SelectItem value="texas">Texas (Austin)</SelectItem>
                  <SelectItem value="arizona">Arizona (Scottsdale)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* 4. Bedrooms & Bathrooms (Small Adaptive Stepper Components) */}
          <div className="space-y-2.5">
            <div>
              <label className="text-xs font-medium text-neutral-300">
                Bedrooms & Bathrooms
              </label>
            </div>
            <div className="space-y-3.5 rounded-2xl border border-neutral-800 bg-neutral-900/40 p-4">
              {/* Bedrooms Row */}
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="flex size-7 items-center justify-center rounded-lg border border-amber-400/20 bg-amber-400/10 text-amber-400">
                    <BedDouble className="size-3.5" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-neutral-200">
                      Bedrooms
                    </p>
                    <p className="text-[11px] text-neutral-500">
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

              {/* Subtle Divider */}
              <div className="h-px bg-neutral-800/70" />

              {/* Bathrooms Row */}
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="flex size-7 items-center justify-center rounded-lg border border-amber-400/20 bg-amber-400/10 text-amber-400">
                    <Bath className="size-3.5" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-neutral-200">
                      Bathrooms
                    </p>
                    <p className="text-[11px] text-neutral-500">
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

          {/* 5. Budget / Price Range (Slider Component) */}
          <div className="space-y-3 rounded-2xl border border-neutral-800 bg-neutral-900/40 p-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-neutral-300">
                Budget Range
              </label>
              <span className="rounded-md bg-amber-400/10 px-2 py-0.5 text-xs font-medium text-amber-300 tabular-nums">
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
              {isRent ? (
                <>
                  {[
                    { label: "Under $10k", min: 0, max: 10000 },
                    { label: "$10k - $25k", min: 10000, max: 25000 },
                    { label: "$25k - $50k", min: 25000, max: 50000 },
                  ].map((p) => (
                    <button
                      key={p.label}
                      type="button"
                      onClick={() => {
                        onFilterChange("minBudget", p.min);
                        onFilterChange("maxBudget", p.max);
                      }}
                      className="cursor-pointer rounded-lg border border-neutral-800 bg-neutral-900/80 px-2.5 py-1 text-[10px] font-medium text-neutral-400 transition-colors hover:border-amber-400/50 hover:text-neutral-200"
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
                    { label: "$15M - $30M", min: 15000000, max: 30000000 },
                    { label: "$30M+", min: 30000000, max: 50000000 },
                  ].map((p) => (
                    <button
                      key={p.label}
                      type="button"
                      onClick={() => {
                        onFilterChange("minBudget", p.min);
                        onFilterChange("maxBudget", p.max);
                      }}
                      className="cursor-pointer rounded-lg border border-neutral-800 bg-neutral-900/80 px-2.5 py-1 text-[10px] font-medium text-neutral-400 transition-colors hover:border-amber-400/50 hover:text-neutral-200"
                    >
                      {p.label}
                    </button>
                  ))}
                </>
              )}
            </div>
          </div>

          {/* 6. Area Specifications: Home Area & Land Area Sliders */}
          <div className="space-y-4 rounded-2xl border border-neutral-800 bg-neutral-900/40 p-4">
            {/* Home Living Area */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-neutral-300">
                  Home Living Area
                </label>
                <span className="text-xs font-medium text-neutral-200 tabular-nums">
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

            <div className="h-px bg-neutral-800/70" />

            {/* Land Parcel Area */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-neutral-300">
                  Land Parcel Area
                </label>
                <span className="text-xs font-medium text-neutral-200 tabular-nums">
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

          {/* 7. Luxury Portfolio Only (Switch Component) */}
          <div className="flex items-center justify-between rounded-2xl border border-neutral-800 bg-neutral-900/40 p-4">
            <span className="text-xs font-medium text-neutral-200">
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
        <SheetFooter className="shrink-0 border-t border-neutral-800/80 bg-neutral-950/90 px-6 py-4 backdrop-blur-md">
          <div className="flex w-full items-center gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onReset}
              className="flex-1 gap-1.5 rounded-xl border-neutral-800 bg-neutral-900 py-3 text-xs font-medium text-neutral-300 transition-colors hover:bg-neutral-800 hover:text-white"
            >
              <RotateCcw className="size-3.5" />
              <span>Reset All</span>
            </Button>
            <Button
              type="button"
              onClick={() => setIsOpen(false)}
              className="flex-1 rounded-xl bg-amber-400 py-3 text-xs font-semibold text-neutral-950 transition-all hover:bg-amber-300"
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

export default PropertyFiltersComponent;
