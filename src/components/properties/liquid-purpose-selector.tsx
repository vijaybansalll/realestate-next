"use client";

import { useState, useLayoutEffect, useRef } from "react";
import { Liquid, LiquidItem } from "@/components/motion/liquid";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface LiquidPurposeSelectorProps {
  value: "all" | "buy" | "rent";
  onChange: (value: "all" | "buy" | "rent") => void;
  className?: string;
}

export function LiquidPurposeSelector({
  value,
  onChange,
  className,
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
      className={cn(
        "relative isolate w-full rounded-2xl border border-neutral-800 bg-neutral-900/80 p-1 select-none",
        className
      )}
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
            <Button
              key={item.id}
              type="button"
              variant="secondary"
              onClick={() => onChange(item.id)}
              className={cn(
                "h-full border-0 bg-transparent text-xs shadow-none hover:bg-transparent",
                isSelected
                  ? "font-semibold text-amber-300"
                  : "text-neutral-400 hover:text-neutral-200"
              )}
            >
              {item.label}
            </Button>
          );
        })}
      </div>
    </div>
  );
}

export default LiquidPurposeSelector;
