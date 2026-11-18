"use client";

import { X, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ActiveChip } from "./use-property-filters";

export interface PropertiesActiveChipsProps {
  chips: ActiveChip[];
  onOpenSheet: () => void;
}

export function PropertiesActiveChips({
  chips,
  onOpenSheet,
}: PropertiesActiveChipsProps) {
  if (chips.length === 0) return null;

  return (
    <div
      className="mb-6 flex flex-wrap items-center gap-1.5"
      aria-label="Active filters"
    >
      <span className="mr-1 text-xs text-neutral-500">Active filters:</span>
      {chips.map((chip) => (
        <span
          key={chip.id}
          className="inline-flex items-center gap-1 rounded-full border border-neutral-800 bg-neutral-900 px-3 py-1 text-xs text-neutral-300"
        >
          <span>{chip.label}</span>
          <Button
            type="button"
            variant="secondary"
            size="icon-xs"
            onClick={chip.onRemove}
            className="size-4 rounded-full border-0 bg-transparent p-0 hover:bg-neutral-800"
            aria-label={`Remove filter ${chip.label}`}
          >
            <X className="size-3" />
          </Button>
        </span>
      ))}
      <Button
        type="button"
        variant="secondary"
        size="xs"
        onClick={onOpenSheet}
        className="ml-1 gap-1 rounded-full"
      >
        <SlidersHorizontal className="size-3" />
        <span>Modify in Sheet</span>
      </Button>
    </div>
  );
}

export default PropertiesActiveChips;
