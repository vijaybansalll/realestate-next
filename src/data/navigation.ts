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
    href: "/contact-us",
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
        href: "/contact-us",
      },
      {
        title: "Interior Architecture",
        href: "/contact-us",
      },
      {
        title: "Private Commissions",
        href: "/contact-us",
      },
      {
        title: "Privacy & Terms",
        href: "#",
      },
    ],
  },
];
