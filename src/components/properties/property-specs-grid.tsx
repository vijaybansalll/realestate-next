"use client";

import React from "react";
import {
  Maximize2,
  Layers,
  Bed,
  Bath,
  Sofa,
  UtensilsCrossed,
  SunMedium,
  Car,
  Trees,
  Waves,
  Wine,
  ShieldCheck,
  Check,
  X,
  LucideIcon,
} from "lucide-react";
import type { Property, PropertySpecs } from "@/types";
import { cn } from "@/lib/utils";

export interface PropertySpecsGridProps {
  property: Property;
  className?: string;
}

interface SpecItemConfig {
  key: string;
  icon: LucideIcon;
  title: string;
  isBoolean: boolean;
  countValue?: string;
  booleanValue?: boolean;
  detail?: string;
}

export function PropertySpecsGrid({
  property,
  className,
}: PropertySpecsGridProps) {
  // Ensure specs object exists with defaults from property fields
  const specs: PropertySpecs = property.specs || {
    homeAreaSqM: property.homeAreaSqM,
    landAreaSqM: property.landAreaSqM,
    bedrooms: property.bedrooms,
    bathrooms: property.bathrooms,
    livingRooms: Math.max(1, Math.floor(property.bedrooms / 2)),
    pantry: property.bedrooms >= 3 ? "Yes (Butler's Pantry)" : false,
    alfrescoOutdoor:
      property.features?.includes("Infinity Pool") || property.isLuxury
        ? "Large alfresco + pool"
        : "Yes (Outdoor Terrace)",
    garage: property.garage,
    garden: property.landAreaSqM > 500 ? "Yes (Landscaped Grounds)" : false,
    pool:
      property.features?.includes("Infinity Pool") ||
      property.features?.includes("Lap Pool"),
    wineCellar: property.features?.includes("Wine Cellar"),
    smartHome: property.features?.includes("Smart Home"),
  };

  const parseBooleanOrString = (
    val: boolean | string | undefined
  ): { isYes: boolean; textDetail?: string } => {
    if (typeof val === "boolean") {
      return { isYes: val };
    }
    if (typeof val === "string") {
      const isYes =
        val.toLowerCase().startsWith("yes") ||
        val.toLowerCase().includes("large alfresco") ||
        val.length > 0;
      return {
        isYes,
        textDetail: val.replace(/^yes\s*\(?/i, "").replace(/\)$/, ""),
      };
    }
    return { isYes: false };
  };

  const pantryInfo = parseBooleanOrString(specs.pantry);
  const alfrescoInfo = parseBooleanOrString(specs.alfrescoOutdoor);
  const gardenInfo = parseBooleanOrString(specs.garden);
  const poolInfo = parseBooleanOrString(specs.pool);
  const wineInfo = parseBooleanOrString(specs.wineCellar);
  const smartInfo = parseBooleanOrString(specs.smartHome);

  const specItems: SpecItemConfig[] = [
    {
      key: "homeArea",
      icon: Maximize2,
      title: "Home Area (m²)",
      isBoolean: false,
      countValue: `${specs.homeAreaSqM.toLocaleString()} m²`,
      detail: property.size.includes("sq ft")
        ? property.size.split("(")[1]?.replace(")", "")
        : undefined,
    },
    {
      key: "landArea",
      icon: Layers,
      title: "Land Area (m²)",
      isBoolean: false,
      countValue: `${specs.landAreaSqM.toLocaleString()} m²`,
      detail: "Total Private Parcel",
    },
    {
      key: "bed",
      icon: Bed,
      title: "Bed",
      isBoolean: false,
      countValue: `${specs.bedrooms} Bedrooms`,
      detail: `${property.bhk} BHK Configuration`,
    },
    {
      key: "bath",
      icon: Bath,
      title: "Bath",
      isBoolean: false,
      countValue: `${specs.bathrooms} Bathrooms`,
      detail: `${Math.min(specs.bedrooms, specs.bathrooms)} En-suite Suites`,
    },
    {
      key: "livingRoom",
      icon: Sofa,
      title: "Living Room",
      isBoolean: false,
      countValue: `${specs.livingRooms} Living Areas`,
      detail: "Formal Lounge & Family Salon",
    },
    {
      key: "pantry",
      icon: UtensilsCrossed,
      title: "Pantry",
      isBoolean: true,
      booleanValue: pantryInfo.isYes,
      detail:
        pantryInfo.textDetail ||
        (pantryInfo.isYes ? "Butler's Pantry" : undefined),
    },
    {
      key: "alfrescoOutdoor",
      icon: SunMedium,
      title: "Alfresco / Outdoor",
      isBoolean: true,
      booleanValue: alfrescoInfo.isYes,
      detail:
        typeof specs.alfrescoOutdoor === "string"
          ? specs.alfrescoOutdoor
          : alfrescoInfo.isYes
            ? "Large alfresco + pool"
            : undefined,
    },
    {
      key: "garage",
      icon: Car,
      title: "Garage",
      isBoolean: false,
      countValue: `${specs.garage} Car Spaces`,
      detail: "Secure Covered / EV Ready",
    },
    {
      key: "garden",
      icon: Trees,
      title: "Garden",
      isBoolean: true,
      booleanValue: gardenInfo.isYes,
      detail:
        gardenInfo.textDetail ||
        (gardenInfo.isYes ? "Private Landscaped" : undefined),
    },
    {
      key: "pool",
      icon: Waves,
      title: "Swimming Pool",
      isBoolean: true,
      booleanValue: poolInfo.isYes,
      detail:
        poolInfo.textDetail ||
        (poolInfo.isYes ? "Heated Lap & Spa" : undefined),
    },
    {
      key: "wineCellar",
      icon: Wine,
      title: "Wine Cellar",
      isBoolean: true,
      booleanValue: wineInfo.isYes,
      detail:
        wineInfo.textDetail ||
        (wineInfo.isYes ? "Climate-controlled" : undefined),
    },
    {
      key: "smartHome",
      icon: ShieldCheck,
      title: "Smart Home",
      isBoolean: true,
      booleanValue: smartInfo.isYes,
      detail:
        smartInfo.textDetail ||
        (smartInfo.isYes ? "Crestron / Lutron" : undefined),
    },
  ];

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold tracking-tight text-neutral-900 sm:text-xl dark:text-neutral-100">
          Property Specifications & Amenities
        </h3>
      </div>

      {/* Grid of Specification Tiles */}
      <div className="grid grid-cols-1 gap-x-8 divide-y-3 divide-solid divide-neutral-200 sm:grid-cols-2 dark:divide-neutral-800">
        {specItems.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.key}
              className="group relative flex flex-col justify-between py-3"
            >
              {/* Header: Icon + Title */}
              <div className="flex items-center gap-3">
                <div className="flex shrink-0 items-center justify-center text-neutral-900 dark:text-neutral-100">
                  <Icon className="size-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="block text-sm text-neutral-900 dark:text-neutral-100">
                    {item.title}
                  </span>
                </div>
                {item.isBoolean ? (
                  <div className="flex items-center gap-2">
                    {item.booleanValue ? (
                      <span className="inline-flex items-center gap-1 text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                        <Check className="size-4 stroke-[2.5]" />
                        <span>Yes</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-sm font-medium text-neutral-400 dark:text-neutral-500">
                        <X className="size-4" />
                        <span>No</span>
                      </span>
                    )}
                  </div>
                ) : (
                  <div>
                    <span className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                      {item.countValue}
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default PropertySpecsGrid;
