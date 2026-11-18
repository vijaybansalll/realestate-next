"use client";

import { Building2, RotateCcw, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface PropertiesEmptyStateProps {
  onReset: () => void;
  onOpenSheet: () => void;
}

export function PropertiesEmptyState({
  onReset,
  onOpenSheet,
}: PropertiesEmptyStateProps) {
  return (
    <div className="my-12 flex flex-col items-center justify-center rounded-2xl border border-dashed border-neutral-800 bg-neutral-900/30 p-12 text-center">
      <div className="mb-4 flex size-14 items-center justify-center rounded-full bg-neutral-800/80 text-neutral-400">
        <Building2 className="size-7 text-amber-400/70" />
      </div>
      <h3 className="text-lg font-medium text-neutral-200">
        No Properties Found
      </h3>
      <p className="mt-2 max-w-sm text-xs leading-relaxed text-neutral-400">
        No architectural estates match your current filter criteria. Try
        adjusting the budget, BHK size, or clearing specific filters.
      </p>
      <div className="mt-5 flex items-center gap-3">
        <Button variant="secondary" size="sm" onClick={onReset}>
          <RotateCcw className="mr-1.5 size-3.5" />
          Reset All Filters
        </Button>
        <Button variant="primary" size="sm" onClick={onOpenSheet}>
          <SlidersHorizontal className="mr-1.5 size-3.5" />
          Open Filters Sheet
        </Button>
      </div>
    </div>
  );
}

export default PropertiesEmptyState;
