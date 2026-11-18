"use client";

import type { Property } from "@/types";
import { PropertyCard } from "./property-card";

export interface PropertiesGridProps {
  properties: Property[];
  onInquire: (property: Property) => void;
}

export function PropertiesGrid({ properties, onInquire }: PropertiesGridProps) {
  return (
    <div
      id="properties-grid"
      role="region"
      aria-label="Available architectural estates"
      className="grid scroll-mt-24 grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
    >
      {properties.map((property) => (
        <PropertyCard
          key={property.id}
          property={property}
          onInquire={onInquire}
        />
      ))}
    </div>
  );
}

export default PropertiesGrid;
