import type { NavItem, FooterSection } from "@/types";

export const NAV_ITEMS: NavItem[] = [
  {
    title: "Home",
    href: "/",
  },
  {
    title: "All Properties",
    href: "/properties",
  },

  {
    title: "Portfolio",
    href: "/#properties",
  },
  {
    title: "Residences",
    href: "/#residences",
  },
  {
    title: "Contact",
    href: "/#contact",
  },
];

export const FOOTER_SECTIONS: FooterSection[] = [
  {
    title: "Estates & Portfolio",
    links: [
      {
        title: "All Properties Catalog",
        href: "/properties",
      },
      {
        title: "Featured Estates",
        href: "/#properties",
      },
      {
        title: "Virtual Walkthrough",
        href: "/#walkthrough",
      },
      {
        title: "Interactive Showcase",
        href: "/#showcase",
      },
      {
        title: "Spatial Staging",
        href: "/#transformation",
      },
    ],
  },
  {
    title: "Services & Studio",
    links: [
      {
        title: "Architectural Planning",
        href: "/#contact",
      },
      {
        title: "Interior Architecture",
        href: "/#contact",
      },
      {
        title: "Private Commissions",
        href: "/#contact",
      },
      {
        title: "Privacy & Terms",
        href: "#",
      },
    ],
  },
];
