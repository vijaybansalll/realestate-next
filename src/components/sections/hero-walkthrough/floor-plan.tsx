"use client";

import { useMemo } from "react";
import { HOUSE_LAYOUT, TOUR_STOPS } from "@/data/house-tour";
import { cn } from "@/lib/utils";

interface FloorPlanProps {
  activeRoom?: string;
  onSelectRoom?: (slug: string) => void;
  variant?: "detailed" | "compact";
  className?: string;
}

export function FloorPlan({
  activeRoom,
  onSelectRoom,
  variant = "detailed",
  className,
}: FloorPlanProps) {
  const { w, d } = HOUSE_LAYOUT.footprint;

  const roomTitles = useMemo(() => {
    return Object.fromEntries(
      TOUR_STOPS.map((s) => [s.slug, s.title.replace(/^The /, "")])
    );
  }, []);

  const rooms = useMemo(() => {
    return HOUSE_LAYOUT.rooms.map((room) => ({
      ...room,
      top: d - room.y - room.d,
      title: roomTitles[room.slug] ?? room.label,
    }));
  }, [d, roomTitles]);

  const baths = useMemo(() => {
    return HOUSE_LAYOUT.baths.map((bath) => ({
      ...bath,
      top: d - bath.y - bath.d,
    }));
  }, [d]);

  return (
    <div
      className={cn(
        "relative select-none transition-all duration-300",
        variant === "detailed" ? "w-full rounded-xl border border-neutral-800/80 bg-neutral-950/60 p-4" : "w-32",
        className
      )}
    >
      {variant === "detailed" && (
        <div className="mb-3 flex items-center justify-between text-xs text-neutral-400">
          <span className="font-semibold tracking-wider text-amber-500 uppercase">Interactive Architectural Plan</span>
          <span className="text-[11px] text-neutral-500">Click room to inspect in 3D</span>
        </div>
      )}

      <svg
        viewBox={`-0.4 -0.4 ${w + 0.8} ${d + 1.8}`}
        className="w-full h-auto overflow-visible"
        role="presentation"
      >
        {/* Outer perimeter outline */}
        <rect
          x="0"
          y="0"
          width={w}
          height={d}
          rx="0.12"
          className="fill-neutral-900/40 stroke-neutral-700/60"
          strokeWidth="0.08"
        />

        {/* Rooms */}
        {rooms.map((room) => {
          const isActive = activeRoom === room.slug;
          return (
            <g
              key={room.slug}
              onClick={() => onSelectRoom?.(room.slug)}
              className={cn(
                "cursor-pointer transition-all duration-200 group",
                isActive ? "opacity-100" : "opacity-75 hover:opacity-100"
              )}
            >
              <rect
                x={room.x}
                y={room.top}
                width={room.w}
                height={room.d}
                rx="0.08"
                className={cn(
                  "transition-all duration-200",
                  isActive
                    ? "fill-amber-500/25 stroke-amber-400 stroke-[0.12] drop-shadow-[0_0_8px_rgba(245,158,11,0.4)]"
                    : "fill-neutral-800/50 stroke-neutral-700/70 stroke-[0.06] group-hover:fill-neutral-700/60 group-hover:stroke-neutral-500"
                )}
              />

              {variant === "detailed" && (
                <text
                  x={room.x + room.w / 2}
                  y={room.top + room.d / 2}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className={cn(
                    "text-[0.68px] font-medium transition-colors pointer-events-none select-none",
                    isActive ? "fill-amber-300 font-semibold" : "fill-neutral-300 group-hover:fill-white"
                  )}
                >
                  {room.title}
                </text>
              )}
            </g>
          );
        })}

        {/* Bathrooms */}
        {baths.map((bath, idx) => (
          <g key={idx} className="pointer-events-none">
            <rect
              x={bath.x}
              y={bath.top}
              width={bath.w}
              height={bath.d}
              rx="0.04"
              className="fill-neutral-900/70 stroke-neutral-700/80 stroke-[0.05]"
            />
            {variant === "detailed" && (
              <text
                x={bath.x + bath.w / 2}
                y={bath.top + bath.d / 2}
                textAnchor="middle"
                dominantBaseline="middle"
                className="text-[0.45px] fill-neutral-500 font-normal"
              >
                Bath
              </text>
            )}
          </g>
        ))}

        {/* Front Entrance Door Marker */}
        <path
          d={`M3.4 ${d} h1.2`}
          className="stroke-amber-500 stroke-[0.16] stroke-linecap-round"
        />

        {variant === "detailed" && (
          <text
            x={w / 2}
            y={d + 1.1}
            textAnchor="middle"
            className="text-[0.55px] fill-neutral-400 tracking-wider uppercase font-medium"
          >
            Garden Grounds & Entrance
          </text>
        )}
      </svg>
    </div>
  );
}
