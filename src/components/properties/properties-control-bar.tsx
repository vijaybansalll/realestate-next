"use client";

import { Search, X, ArrowUpDown, RotateCcw } from "lucide-react";
import type { PropertyFilters } from "@/types";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/motion/select";
import { PropertyFiltersSheet } from "./property-filters-sheet";
import { SORT_OPTIONS } from "./constants";

export interface PropertiesControlBarProps {
  filters: PropertyFilters;
  onFilterChange: <K extends keyof PropertyFilters>(
    key: K,
    value: PropertyFilters[K]
  ) => void;
  onPurposeChange?: (mode: "all" | "buy" | "rent") => void;
  onReset: () => void;
  totalCount: number;
  filteredCount: number;
  activeChipsCount: number;
  filterSheetOpen: boolean;
  onFilterSheetOpenChange: (open: boolean) => void;
}

export function PropertiesControlBar({
  filters,
  onFilterChange,
  onPurposeChange,
  onReset,
  totalCount,
  filteredCount,
  activeChipsCount,
  filterSheetOpen,
  onFilterSheetOpenChange,
}: PropertiesControlBarProps) {
  return (
    <div className="relative z-30 mb-6 flex flex-col gap-4 rounded-2xl border border-neutral-200/80 bg-white/80 p-4 shadow-sm backdrop-blur-md sm:flex-row sm:items-center sm:justify-between dark:border-neutral-800/80 dark:bg-neutral-900/40">
      {/* Left: Quick Search & Filter Trigger */}
      <div className="flex flex-1 flex-wrap items-center gap-3">
        {/* Quick Search Input */}
        <div className="relative max-w-sm min-w-[200px] flex-1">
          <Search className="absolute top-1/2 left-3 size-3.5 -translate-y-1/2 text-neutral-400 dark:text-neutral-500" />
          <input
            type="text"
            value={filters.search}
            onChange={(e) => onFilterChange("search", e.target.value)}
            placeholder="Quick search estates, cities..."
            className="w-full rounded-xl border border-neutral-200 bg-white py-2 pr-8 pl-8 text-xs text-neutral-900 placeholder:text-neutral-400 focus:border-amber-500/80 focus:outline-none dark:border-neutral-800 dark:bg-neutral-900/90 dark:text-neutral-200 dark:placeholder:text-neutral-500 dark:focus:border-amber-400/80"
          />
          {filters.search && (
            <Button
              type="button"
              variant="secondary"
              size="icon-xs"
              onClick={() => onFilterChange("search", "")}
              className="absolute top-1/2 right-2.5 -translate-y-1/2 rounded-full"
              aria-label="Clear search"
            >
              <X className="size-3.5" />
            </Button>
          )}
        </div>

        {/* Filter Drawer Sheet */}
        <PropertyFiltersSheet
          filters={filters}
          onFilterChange={onFilterChange}
          onPurposeChange={onPurposeChange}
          onReset={onReset}
          totalCount={totalCount}
          filteredCount={filteredCount}
          open={filterSheetOpen}
          onOpenChange={onFilterSheetOpenChange}
        />

        {/* Active Chip Count Reset */}
        {activeChipsCount > 0 && (
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={onReset}
            className="gap-1.5"
          >
            <RotateCcw className="size-3" />
            <span>Reset ({activeChipsCount})</span>
          </Button>
        )}
      </div>

      {/* Right: Results Count & Sort Dropdown */}
      <div className="flex items-center justify-between gap-4 border-t border-neutral-200/60 pt-3 sm:border-0 sm:pt-0 dark:border-neutral-800/60">
        <span className="text-xs font-medium text-neutral-600 dark:text-neutral-400">
          Showing{" "}
          <span className="font-semibold text-neutral-900 dark:text-neutral-200">
            {filteredCount}
          </span>{" "}
          of {totalCount}
        </span>

        {/* Sort Select */}
        <div className="flex items-center gap-2">
          <label
            htmlFor="sort-properties"
            className="hidden items-center gap-1 text-xs text-neutral-600 dark:text-neutral-400 md:inline-flex"
          >
            <ArrowUpDown className="size-3 text-neutral-400 dark:text-neutral-500" />
            Sort:
          </label>
          <div className="relative z-40 w-44">
            <Select
              value={filters.sortBy}
              onValueChange={(val) =>
                onFilterChange("sortBy", val as PropertyFilters["sortBy"])
              }
            >
              <SelectTrigger className="rounded-xl border-neutral-200 bg-white py-1.5 text-xs text-neutral-900 hover:border-neutral-300 dark:border-neutral-800 dark:bg-neutral-900/90 dark:text-neutral-200 dark:hover:border-neutral-700">
                <SelectValue placeholder="Featured First" />
              </SelectTrigger>
              <SelectContent className="z-50 rounded-xl border-neutral-200 bg-white text-xs text-neutral-900 shadow-xl dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-200 dark:shadow-2xl">
                {SORT_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PropertiesControlBar;
