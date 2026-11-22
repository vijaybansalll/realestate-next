"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
  MinusIcon,
  TrendingUpIcon,
  ArrowUpIcon,
  ChevronUpIcon,
  TrendingDownIcon,
  ArrowDownIcon,
  ChevronDownIcon,
} from "lucide-react";

type DeltaIconVariant = "default" | "trend" | "arrow";
type DeltaVariant = "default" | "badge";

type DeltaContextValue = {
  value: number;
};

const DeltaContext = React.createContext<DeltaContextValue | null>(null);

function useDeltaValue() {
  const context = React.useContext(DeltaContext);

  if (!context) {
    throw new Error(
      "DeltaIcon and DeltaValue must be used inside a `Delta` component."
    );
  }

  return context.value;
}

function Delta({
  className,
  value,
  variant = "default",
  ...props
}: React.ComponentProps<"div"> & {
  value: number;
  variant?: DeltaVariant;
}) {
  return (
    <DeltaContext.Provider value={{ value }}>
      {variant === "badge" ? (
        <Badge
          className={cn(
            "gap-1 border-none tabular-nums [&_svg]:size-4 [&_svg]:shrink-0",
            value > 0
              ? "bg-emerald-500/10 text-emerald-500"
              : "bg-red-500/10 text-red-500",
            className
          )}
          data-slot="delta"
          variant="secondary"
          {...(props as React.ComponentProps<typeof Badge>)}
        />
      ) : (
        <div
          className={cn(
            "inline-flex items-center gap-1 text-muted-foreground tabular-nums",
            "[&_svg]:size-3 [&_svg]:shrink-0",
            value > 0 ? "text-emerald-600 dark:text-emerald-400" : "",
            value < 0 ? "text-rose-600 dark:text-rose-400" : "",
            className
          )}
          data-slot="delta"
          {...props}
        />
      )}
    </DeltaContext.Provider>
  );
}

function DeltaIcon({
  variant = "default",
  className,
  ...props
}: React.ComponentProps<"svg"> & {
  variant?: DeltaIconVariant;
}) {
  const resolvedValue = useDeltaValue();

  if (resolvedValue === 0) {
    return <MinusIcon className={cn("size-3", className)} {...props} />;
  }

  if (variant === "trend") {
    return resolvedValue > 0 ? (
      <TrendingUpIcon className={cn("size-3", className)} {...props} />
    ) : (
      <TrendingDownIcon className={cn("size-3", className)} {...props} />
    );
  }

  if (variant === "arrow") {
    return resolvedValue > 0 ? (
      <ArrowUpIcon className={cn("size-3", className)} {...props} />
    ) : (
      <ArrowDownIcon className={cn("size-3", className)} {...props} />
    );
  }

  return resolvedValue > 0 ? (
    <ChevronUpIcon className={cn("size-3", className)} {...props} />
  ) : (
    <ChevronDownIcon className={cn("size-3", className)} {...props} />
  );
}

function DeltaValue({
  className,
  ...props
}: React.ComponentProps<"span">) {
  const resolvedValue = useDeltaValue();

  return (
    <span
      className={cn(
        "text-xs font-semibold tabular-nums",
        resolvedValue > 0 && "text-emerald-600 dark:text-emerald-400",
        resolvedValue < 0 && "text-rose-600 dark:text-rose-400",
        className
      )}
      data-slot="delta-value"
      {...props}
    >
      {resolvedValue > 0 ? `+${resolvedValue}%` : `${resolvedValue}%`}
    </span>
  );
}

export { Delta, DeltaIcon, DeltaValue };
