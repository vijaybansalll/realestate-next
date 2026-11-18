export interface NavItem {
  title: string;
  href: string;
}

export interface Property {
  id: string;
  title: string;
  size: string;
  bedrooms: number;
  bathrooms: number;
  garage: number;
  image: string;
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
}

export interface FooterLink {
  title: string;
  href: string;
}

export interface FooterSection {
  title: string;
  links: FooterLink[];
}
