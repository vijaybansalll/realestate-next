"use client";

import { useState } from "react";
import type { Property } from "@/types";
import { usePropertyFilters } from "./use-property-filters";
import { PropertiesHeader } from "./properties-header";
import { PropertiesControlBar } from "./properties-control-bar";
import { PropertiesActiveChips } from "./properties-active-chips";
import { PropertiesGrid } from "./properties-grid";
import { PropertiesEmptyState } from "./properties-empty-state";
import { PropertyInquiryModal } from "./property-inquiry-modal";

export function PropertiesCatalog() {
  const {
    filters,
    filterSheetOpen,
    setFilterSheetOpen,
    handleFilterChange,
    handlePurposeChange,
    handleReset,
    filteredProperties,
    totalCount,
    filteredCount,
    activeChips,
  } = usePropertyFilters();

  const [selectedProperty, setSelectedProperty] = useState<Property | null>(
    null
  );

  return (
    <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      {/* Header with Breadcrumb & Walkthrough link */}
      <PropertiesHeader totalCount={totalCount} />

      {/* Control Bar: Search + Filter Sheet Trigger + Sort */}
      <PropertiesControlBar
        filters={filters}
        onFilterChange={handleFilterChange}
        onPurposeChange={handlePurposeChange}
        onReset={handleReset}
        totalCount={totalCount}
        filteredCount={filteredCount}
        activeChipsCount={activeChips.length}
        filterSheetOpen={filterSheetOpen}
        onFilterSheetOpenChange={setFilterSheetOpen}
      />

      {/* Active Filter Chips */}
      <PropertiesActiveChips
        chips={activeChips}
        onOpenSheet={() => setFilterSheetOpen(true)}
      />

      {/* Estates Grid or Empty State */}
      {filteredProperties.length > 0 ? (
        <PropertiesGrid
          properties={filteredProperties}
          onInquire={(prop) => setSelectedProperty(prop)}
        />
      ) : (
        <PropertiesEmptyState
          onReset={handleReset}
          onOpenSheet={() => setFilterSheetOpen(true)}
        />
      )}

      {/* Inquiry Sheet Modal */}
      <PropertyInquiryModal
        property={selectedProperty}
        onClose={() => setSelectedProperty(null)}
      />
    </div>
  );
}

export default PropertiesCatalog;
