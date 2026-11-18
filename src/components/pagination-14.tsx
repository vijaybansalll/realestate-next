"use client";

import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import React from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export interface Pagination14Props {
  currentPage?: number;
  pageSize?: number;
  totalItems?: number;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  pageSizeOptions?: number[];
  label?: string;
  className?: string;
}

export function Pagination14({
  currentPage: controlledPage,
  pageSize: controlledPageSize,
  totalItems = 100,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [6, 9, 12, 18],
  label = "Estates per page:",
  className,
}: Pagination14Props) {
  const [internalPageSize, setInternalPageSize] = React.useState(
    pageSizeOptions[0] ?? 6
  );
  const [internalPage, setInternalPage] = React.useState(1);

  const pageSize = controlledPageSize ?? internalPageSize;
  const page = controlledPage ?? internalPage;

  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    if (onPageChange) {
      onPageChange(newPage);
    } else {
      setInternalPage(newPage);
    }
  };

  const handlePageSizeChange = (newSize: number) => {
    if (onPageSizeChange) {
      onPageSizeChange(newSize);
    } else {
      setInternalPageSize(newSize);
      setInternalPage(1);
    }
  };

  const startItem = totalItems === 0 ? 0 : (page - 1) * pageSize + 1;
  const endItem = Math.min(page * pageSize, totalItems);

  return (
    <div
      className={cn(
        "flex w-full flex-col gap-3 rounded-2xl border border-neutral-800/80 bg-neutral-900/40 p-4 backdrop-blur-md sm:flex-row sm:items-center sm:justify-between",
        className
      )}
      aria-label="Pagination Navigation"
    >
      {/* Left: Page Size Selector */}
      <div className="flex items-center gap-2.5">
        <Label className="text-xs font-medium whitespace-nowrap text-neutral-400">
          {label}
        </Label>
        <Select
          onValueChange={(val) => {
            if (val) handlePageSizeChange(Number(val));
          }}
          value={pageSize.toString()}
        >
          <SelectTrigger
            size="sm"
            className="h-8 w-18 rounded-xl border-neutral-800 bg-neutral-900/90 px-2.5 py-1 text-xs text-neutral-200 hover:border-neutral-700"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="z-50 min-w-[4.5rem] rounded-xl border-neutral-800 bg-neutral-900 text-xs text-neutral-200 shadow-2xl">
            {pageSizeOptions.map((opt) => (
              <SelectItem key={opt} value={opt.toString()}>
                {opt}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Right: Item Range & Prev/Next Controls */}
      <div className="flex items-center justify-between gap-3 sm:justify-end">
        <span className="text-xs whitespace-nowrap text-neutral-400">
          <span className="font-semibold text-neutral-200">
            {startItem}-{endItem}
          </span>{" "}
          of{" "}
          <span className="font-semibold text-neutral-200">{totalItems}</span>
        </span>

        <Pagination className="mx-0 w-auto">
          <PaginationContent className="gap-1.5">
            <PaginationItem>
              <Button
                type="button"
                aria-label="Go to previous page"
                disabled={page <= 1}
                size="icon-sm"
                variant="secondary"
                onClick={() => handlePageChange(page - 1)}
                className="rounded-lg"
              >
                <ChevronLeftIcon className="size-4" />
              </Button>
            </PaginationItem>
            <PaginationItem>
              <Button
                type="button"
                aria-label="Go to next page"
                disabled={page >= totalPages}
                size="icon-sm"
                variant="secondary"
                onClick={() => handlePageChange(page + 1)}
                className="rounded-lg"
              >
                <ChevronRightIcon className="size-4" />
              </Button>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}

export default Pagination14;
