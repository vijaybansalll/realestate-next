"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { ALL_PROPERTIES } from "@/data";
import {
  fetchProperties,
  getInitialProperties,
  subscribeToProperties,
} from "@/lib/supabase";
import type { Property, PropertyFilters } from "@/types";
import { INITIAL_FILTERS } from "./constants";

export interface ActiveChip {
  id: string;
  label: string;
  onRemove: () => void;
}

export function usePropertyFilters(initial = INITIAL_FILTERS) {
  const [propertiesList, setPropertiesList] = useState<Property[]>(() =>
    getInitialProperties()
  );
  const [isLoaded, setIsLoaded] = useState(false);
  const [filters, setFilters] = useState<PropertyFilters>(initial);
  const [filterSheetOpen, setFilterSheetOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);

  useEffect(() => {
    let isMounted = true;
    fetchProperties().then((res) => {
      if (isMounted) {
        if (res.data) {
          setPropertiesList(res.data);
        }
        setIsLoaded(true);
      }
    });

    // Reactive subscription: auto-updates cards on add, edit, or delete operations
    const unsubscribe = subscribeToProperties((updatedList) => {
      if (isMounted) {
        setPropertiesList(updatedList);
        setIsLoaded(true);
      }
    });

    // Refresh when user returns to this browser tab
    const handleFocus = () => {
      fetchProperties().then((res) => {
        if (isMounted && res.data) {
          setPropertiesList(res.data);
        }
      });
    };
    window.addEventListener("focus", handleFocus);

    return () => {
      isMounted = false;
      unsubscribe();
      window.removeEventListener("focus", handleFocus);
    };
  }, []);

  const handleFilterChange = useCallback(
    <K extends keyof PropertyFilters>(key: K, value: PropertyFilters[K]) => {
      setFilters((prev) => ({
        ...prev,
        [key]: value,
      }));
      setPage(1);
    },
    []
  );

  const handleReset = useCallback(() => {
    setFilters(INITIAL_FILTERS);
    setPage(1);
  }, []);

  const handlePurposeChange = useCallback((mode: "all" | "buy" | "rent") => {
    setFilters((prev) => {
      const next = { ...prev, purpose: mode };
      if (mode === "rent" && prev.maxBudget > 100000) {
        next.minBudget = 0;
        next.maxBudget = 50000;
      } else if (
        (mode === "buy" || mode === "all") &&
        prev.maxBudget <= 50000
      ) {
        next.minBudget = 0;
        next.maxBudget = 50000000;
      }
      return next;
    });
    setPage(1);
  }, []);

  // Filtered & Sorted properties
  const filteredProperties = useMemo(() => {
    const dataSource =
      isLoaded || propertiesList.length > 0 ? propertiesList : ALL_PROPERTIES;
    return dataSource.filter((property) => {
      // 1. Purpose filter (Buy vs Rent)
      if (filters.purpose !== "all" && property.purpose !== filters.purpose) {
        return false;
      }

      // 2. Search query (Name, Location, or Features)
      if (filters.search.trim()) {
        const q = filters.search.toLowerCase().trim();
        const matchTitle = property.title.toLowerCase().includes(q);
        const matchLocation = property.location.toLowerCase().includes(q);
        const matchFeature = property.features?.some((f) =>
          f.toLowerCase().includes(q)
        );
        if (!matchTitle && !matchLocation && !matchFeature) return false;
      }

      // 3. Property Type filter
      if (
        filters.propertyType !== "all" &&
        property.type !== filters.propertyType
      ) {
        return false;
      }

      // 4. Location / Region filter
      if (
        filters.location !== "all" &&
        !property.location
          .toLowerCase()
          .includes(filters.location.toLowerCase())
      ) {
        return false;
      }

      // 5. BHK Bedrooms filter
      if (filters.bhk !== "all") {
        if (filters.bhk === "5+") {
          if (property.bhk < 5) return false;
        } else {
          if (property.bhk !== Number(filters.bhk)) return false;
        }
      }

      // 6. Bathrooms filter
      if (filters.bathrooms > 0 && property.bathrooms < filters.bathrooms) {
        return false;
      }

      // 7. Luxury Only
      if (filters.luxuryOnly && !property.isLuxury) {
        return false;
      }

      // 8. Featured Only
      if (filters.featuredOnly && !property.featured) {
        return false;
      }

      // 9. Pool / Spa
      if (
        filters.hasPool &&
        !property.features?.some((f) => f.toLowerCase().includes("pool"))
      ) {
        return false;
      }

      // 10. Budget Range
      if (
        property.price < filters.minBudget ||
        property.price > filters.maxBudget
      ) {
        return false;
      }

      // 11. Home Area (m²)
      if (
        property.homeAreaSqM < filters.minHomeArea ||
        property.homeAreaSqM > filters.maxHomeArea
      ) {
        return false;
      }

      // 12. Land Area (m²)
      if (
        property.landAreaSqM < filters.minLandArea ||
        property.landAreaSqM > filters.maxLandArea
      ) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (filters.sortBy === "price-asc") return a.price - b.price;
      if (filters.sortBy === "price-desc") return b.price - a.price;
      if (filters.sortBy === "homeArea-desc")
        return b.homeAreaSqM - a.homeAreaSqM;

      // Default "featured":
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return b.price - a.price;
    });
  }, [filters, propertiesList, isLoaded]);

  // Active filter count
  const activeFiltersCount = useMemo(() => {
    return [
      filters.purpose !== "all",
      filters.bhk !== "all",
      filters.search.trim().length > 0,
      filters.propertyType !== "all",
      filters.location !== "all",
      filters.bathrooms > 0,
      filters.luxuryOnly,
      filters.minBudget > 0,
      filters.purpose === "rent"
        ? filters.maxBudget < 50000
        : filters.maxBudget < 50000000,
      filters.minHomeArea > 0,
      filters.maxHomeArea < 2000,
      filters.minLandArea > 0,
      filters.maxLandArea < 10000,
    ].filter(Boolean).length;
  }, [filters]);

  // Active filter chips for quick removal
  const activeChips = useMemo<ActiveChip[]>(() => {
    const chips: ActiveChip[] = [];

    if (filters.purpose !== "all") {
      chips.push({
        id: "purpose",
        label: filters.purpose === "buy" ? "For Sale" : "For Lease",
        onRemove: () => handleFilterChange("purpose", "all"),
      });
    }

    if (filters.search.trim()) {
      chips.push({
        id: "search",
        label: `"${filters.search}"`,
        onRemove: () => handleFilterChange("search", ""),
      });
    }

    if (filters.propertyType !== "all") {
      chips.push({
        id: "propertyType",
        label: `Type: ${filters.propertyType}`,
        onRemove: () => handleFilterChange("propertyType", "all"),
      });
    }

    if (filters.location !== "all") {
      chips.push({
        id: "location",
        label: `Location: ${filters.location}`,
        onRemove: () => handleFilterChange("location", "all"),
      });
    }

    if (filters.bhk !== "all") {
      chips.push({
        id: "bhk",
        label: `${filters.bhk} BHK`,
        onRemove: () => handleFilterChange("bhk", "all"),
      });
    }

    if (filters.bathrooms > 0) {
      chips.push({
        id: "bathrooms",
        label: `${filters.bathrooms}+ Baths`,
        onRemove: () => handleFilterChange("bathrooms", 0),
      });
    }

    if (filters.luxuryOnly) {
      chips.push({
        id: "luxuryOnly",
        label: "Luxury Only",
        onRemove: () => handleFilterChange("luxuryOnly", false),
      });
    }

    if (
      filters.minBudget > 0 ||
      (filters.purpose === "rent"
        ? filters.maxBudget < 50000
        : filters.maxBudget < 50000000)
    ) {
      const isRent = filters.purpose === "rent";
      const budgetLabel = isRent
        ? `$${filters.minBudget.toLocaleString()} - $${filters.maxBudget.toLocaleString()}/mo`
        : `$${(filters.minBudget / 1000000).toFixed(1)}M - $${(filters.maxBudget / 1000000).toFixed(1)}M`;
      chips.push({
        id: "budget",
        label: `Budget: ${budgetLabel}`,
        onRemove: () => {
          handleFilterChange("minBudget", 0);
          handleFilterChange("maxBudget", isRent ? 50000 : 50000000);
        },
      });
    }

    if (filters.minHomeArea > 0 || filters.maxHomeArea < 2000) {
      chips.push({
        id: "homeArea",
        label: `Home: ${filters.minHomeArea}m² - ${filters.maxHomeArea}m²`,
        onRemove: () => {
          handleFilterChange("minHomeArea", 0);
          handleFilterChange("maxHomeArea", 2000);
        },
      });
    }

    if (filters.minLandArea > 0 || filters.maxLandArea < 10000) {
      chips.push({
        id: "landArea",
        label: `Land: ${filters.minLandArea}m² - ${filters.maxLandArea}m²`,
        onRemove: () => {
          handleFilterChange("minLandArea", 0);
          handleFilterChange("maxLandArea", 10000);
        },
      });
    }

    return chips;
  }, [filters, handleFilterChange]);

  // Pagination calculation and clamping
  const totalPages = Math.max(
    1,
    Math.ceil(filteredProperties.length / pageSize)
  );
  const safePage = Math.min(Math.max(1, page), totalPages);

  const paginatedProperties = useMemo(() => {
    const start = (safePage - 1) * pageSize;
    return filteredProperties.slice(start, start + pageSize);
  }, [filteredProperties, safePage, pageSize]);

  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage);
    if (typeof window !== "undefined") {
      const gridElem = document.getElementById("properties-grid");
      if (gridElem) {
        gridElem.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  }, []);

  const handlePageSizeChange = useCallback((newSize: number) => {
    setPageSize(newSize);
    setPage(1);
  }, []);

  return {
    filters,
    filterSheetOpen,
    setFilterSheetOpen,
    handleFilterChange,
    handlePurposeChange,
    handleReset,
    filteredProperties,
    paginatedProperties,
    page: safePage,
    pageSize,
    totalPages,
    setPage: handlePageChange,
    setPageSize: handlePageSizeChange,
    totalCount: (isLoaded || propertiesList.length > 0 ? propertiesList : ALL_PROPERTIES).length,
    filteredCount: filteredProperties.length,
    activeChips,
    activeFiltersCount,
  };
}
