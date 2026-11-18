import type { PropertyFilters } from "@/types";

export const INITIAL_FILTERS: PropertyFilters = {
  purpose: "all",
  bhk: "all",
  search: "",
  propertyType: "all",
  location: "all",
  bathrooms: 0,
  luxuryOnly: false,
  featuredOnly: false,
  hasPool: false,
  minBudget: 0,
  maxBudget: 50000000,
  minHomeArea: 0,
  maxHomeArea: 2000,
  minLandArea: 0,
  maxLandArea: 10000,
  sortBy: "featured",
};

export const SORT_OPTIONS = [
  { value: "featured", label: "Featured First" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "homeArea-desc", label: "Area: Largest First" },
] as const;

export const PROPERTY_TYPE_OPTIONS = [
  { value: "all", label: "All Property Types" },
  { value: "estate", label: "Signature Estate" },
  { value: "villa", label: "Luxury Villa" },
  { value: "penthouse", label: "Architectural Penthouse" },
  { value: "townhouse", label: "Modern Townhouse" },
  { value: "apartment", label: "Luxury Apartment" },
] as const;

export const LOCATION_OPTIONS = [
  { value: "all", label: "All Locations" },
  { value: "california", label: "California (Malibu, Beverly Hills)" },
  { value: "florida", label: "Florida (Miami, Palm Beach)" },
  { value: "colorado", label: "Colorado (Aspen)" },
  { value: "new york", label: "New York (Tribeca, Manhattan)" },
  { value: "texas", label: "Texas (Austin)" },
  { value: "arizona", label: "Arizona (Scottsdale)" },
] as const;

export const RENT_BUDGET_PRESETS = [
  { label: "Under $10k", min: 0, max: 10000 },
  { label: "$10k - $25k", min: 10000, max: 25000 },
  { label: "$25k - $50k", min: 25000, max: 50000 },
] as const;

export const BUY_BUDGET_PRESETS = [
  { label: "< $5M", min: 0, max: 5000000 },
  { label: "$5M - $15M", min: 5000000, max: 15000000 },
  { label: "$15M - $30M", min: 15000000, max: 30000000 },
  { label: "$30M+", min: 30000000, max: 50000000 },
] as const;
