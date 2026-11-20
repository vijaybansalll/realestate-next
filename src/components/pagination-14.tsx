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

  // Generate pagination pills with ellipsis windowing
  const getVisiblePages = (): (number | "...")[] => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    if (page <= 3) {
      return [1, 2, 3, 4, "...", totalPages];
    }
    if (page >= totalPages - 2) {
      return [
        1,
        "...",
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages,
      ];
    }
    return [1, "...", page - 1, page, page + 1, "...", totalPages];
  };

  const visiblePages = getVisiblePages();

  return (
    <div
      className={cn(
        "flex w-full flex-col gap-4 rounded-2xl border border-neutral-200/80 bg-white/80 p-4 shadow-sm backdrop-blur-md sm:flex-row sm:items-center sm:justify-between dark:border-neutral-800/80 dark:bg-neutral-900/40",
        className
      )}
      aria-label="Pagination Navigation"
    >
      {/* Left: Page Size Selector */}
      <div className="flex items-center gap-2.5">
        <Label className="text-xs font-medium whitespace-nowrap text-neutral-600 dark:text-neutral-400">
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
            className="h-8 w-18 rounded-xl border border-neutral-200 bg-white px-2.5 py-1 text-xs font-medium text-neutral-800 shadow-xs transition-colors hover:border-neutral-300 hover:bg-neutral-50 focus:border-amber-500/80 focus:ring-2 focus:ring-amber-500/20 dark:border-neutral-800 dark:bg-neutral-900/90 dark:text-neutral-200 dark:hover:border-neutral-700 dark:hover:bg-neutral-800/80 dark:focus:border-amber-400/80 dark:focus:ring-amber-400/20"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="z-50 min-w-[4.5rem] rounded-xl border border-neutral-200 bg-white p-1 text-xs text-neutral-800 shadow-xl dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-200">
            {pageSizeOptions.map((opt) => (
              <SelectItem
                key={opt}
                value={opt.toString()}
                className="cursor-pointer rounded-lg py-1.5 text-xs text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900 focus:bg-neutral-100 focus:text-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:hover:text-neutral-100 dark:focus:bg-neutral-800 dark:focus:text-neutral-100"
              >
                {opt}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Right: Item Range & Page Navigation Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 sm:justify-end">
        <span className="text-xs whitespace-nowrap text-neutral-600 dark:text-neutral-400">
          <span className="font-semibold text-neutral-900 dark:text-neutral-100">
            {startItem}–{endItem}
          </span>{" "}
          of{" "}
          <span className="font-semibold text-neutral-900 dark:text-neutral-100">
            {totalItems}
          </span>
        </span>

        <Pagination className="mx-0 w-auto">
          <PaginationContent className="gap-1.5">
            {/* Previous Page Button */}
            <PaginationItem>
              <Button
                type="button"
                aria-label="Go to previous page"
                disabled={page <= 1}
                size="icon-sm"
                variant="secondary"
                onClick={() => handlePageChange(page - 1)}
                className="size-8 rounded-xl border border-neutral-200 bg-white text-neutral-700 shadow-xs transition-colors hover:border-neutral-300 hover:bg-neutral-100 hover:text-neutral-900 disabled:pointer-events-none disabled:border-neutral-200/60 disabled:opacity-35 dark:border-neutral-800 dark:bg-neutral-900/90 dark:text-neutral-300 dark:hover:border-neutral-700 dark:hover:bg-neutral-800 dark:hover:text-neutral-100 dark:disabled:border-neutral-800/60"
              >
                <ChevronLeftIcon className="size-4" />
              </Button>
            </PaginationItem>

            {/* Page Number Pills */}
            {visiblePages.map((item, idx) => {
              if (item === "...") {
                return (
                  <PaginationItem key={`ellipsis-${idx}`}>
                    <span className="flex size-8 items-center justify-center text-xs text-neutral-400 dark:text-neutral-500">
                      …
                    </span>
                  </PaginationItem>
                );
              }

              const isCurrent = item === page;
              return (
                <PaginationItem key={item}>
                  <Button
                    type="button"
                    size="icon-sm"
                    onClick={() => handlePageChange(item)}
                    className={cn(
                      "size-8 rounded-xl text-xs font-medium transition-all",
                      isCurrent
                        ? "bg-amber-500 font-semibold text-neutral-950 shadow-xs hover:bg-amber-400 active:scale-95 dark:bg-amber-400 dark:text-neutral-950 dark:hover:bg-amber-300"
                        : "border border-neutral-200 bg-white text-neutral-700 shadow-xs hover:border-neutral-300 hover:bg-neutral-100 hover:text-neutral-900 active:scale-95 dark:border-neutral-800 dark:bg-neutral-900/90 dark:text-neutral-300 dark:hover:border-neutral-700 dark:hover:bg-neutral-800 dark:hover:text-neutral-100"
                    )}
                    aria-label={`Page ${item}`}
                    aria-current={isCurrent ? "page" : undefined}
                  >
                    {item}
                  </Button>
                </PaginationItem>
              );
            })}

            {/* Next Page Button */}
            <PaginationItem>
              <Button
                type="button"
                aria-label="Go to next page"
                disabled={page >= totalPages}
                size="icon-sm"
                variant="secondary"
                onClick={() => handlePageChange(page + 1)}
                className="size-8 rounded-xl border border-neutral-200 bg-white text-neutral-700 shadow-xs transition-colors hover:border-neutral-300 hover:bg-neutral-100 hover:text-neutral-900 disabled:pointer-events-none disabled:border-neutral-200/60 disabled:opacity-35 dark:border-neutral-800 dark:bg-neutral-900/90 dark:text-neutral-300 dark:hover:border-neutral-700 dark:hover:bg-neutral-800 dark:hover:text-neutral-100 dark:disabled:border-neutral-800/60"
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