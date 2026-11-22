export interface NavItem {
  title: string;
  href: string;
}

export type PropertyPurpose = "buy" | "rent";
export type PropertyType =
  "estate" | "villa" | "penthouse" | "townhouse" | "apartment";

export interface PropertySpecs {
  homeAreaSqM: number;
  landAreaSqM: number;
  bedrooms: number;
  bathrooms: number;
  livingRooms: number | string;
  pantry: boolean | string;
  alfrescoOutdoor: string | boolean;
  garage: number;
  garden: boolean | string;
  pool?: boolean | string;
  wineCellar?: boolean | string;
  smartHome?: boolean | string;
}

export interface Property {
  id: string;
  title: string;
  location: string;
  purpose: PropertyPurpose;
  type: PropertyType;
  bhk: number;
  bedrooms: number;
  bathrooms: number;
  garage: number;
  price: number;
  formattedPrice: string;
  isLuxury: boolean;
  homeAreaSqM: number;
  landAreaSqM: number;
  size: string;
  image: string;
  images?: string[];
  description?: string;
  features?: string[];
  featured?: boolean;
  specs?: PropertySpecs;
}

export interface PropertyFilters {
  purpose: "all" | PropertyPurpose;
  bhk: string; // "all" | "1" | "2" | "3" | "4" | "5+"
  search: string;
  propertyType: "all" | PropertyType;
  location: string;
  bathrooms: number; // 0 = any, 1, 2, 3, 4, 5, 6+
  luxuryOnly: boolean;
  featuredOnly: boolean;
  hasPool: boolean;
  minBudget: number;
  maxBudget: number;
  minHomeArea: number;
  maxHomeArea: number;
  minLandArea: number;
  maxLandArea: number;
  sortBy: "featured" | "price-asc" | "price-desc" | "homeArea-desc";
}

export interface PortfolioGalleryItem {
  image: string;
  label: string;
  link?: string;
  alt?: string;
}

export interface ShowcaseCard {
  id: number | string;
  image: string;
  alt?: string;
  title?: string;
  subtitle?: string;
  tag?: string;
}

export interface StatItem {
  value: string;
  label: string;
  subtext?: string;
  icon?: string;
}

export interface FooterLink {
  title: string;
  href: string;
}

export interface FooterSection {
  title: string;
  links: FooterLink[];
}
