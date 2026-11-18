// Core Catalog Orchestrator
export { PropertiesCatalog } from "./properties-catalog";

// Page Section Components
export { PropertiesHeader } from "./properties-header";
export { PropertiesControlBar } from "./properties-control-bar";
export { PropertiesActiveChips } from "./properties-active-chips";
export { PropertiesGrid } from "./properties-grid";
export { PropertiesEmptyState } from "./properties-empty-state";

// Interactive Estate Components
export { PropertyCard } from "./property-card";
export { PropertyImageCarousel } from "./property-image-carousel";
export {
  PropertyFiltersSheet,
  PropertyFiltersSheet as PropertyFiltersComponent,
} from "./property-filters-sheet";
export { PropertyInquiryModal } from "./property-inquiry-modal";
export { LiquidPurposeSelector } from "./liquid-purpose-selector";
export {
  Pagination14,
  Pagination14 as PropertiesPagination,
} from "@/components/pagination-14";

// Hooks & State Management
export { usePropertyFilters, type ActiveChip } from "./use-property-filters";

// Configuration & Constants
export {
  INITIAL_FILTERS,
  SORT_OPTIONS,
  PROPERTY_TYPE_OPTIONS,
  LOCATION_OPTIONS,
  RENT_BUDGET_PRESETS,
  BUY_BUDGET_PRESETS,
} from "./constants";
