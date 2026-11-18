import type { NavItem, FooterSection } from "@/types";

export const NAV_ITEMS: NavItem[] = [
  {
    title: "Home",
    href: "#",
  },
  {
    title: "Walkthrough",
    href: "#walkthrough",
  },
  {
    title: "Portfolio",
    href: "#properties",
  },
  {
    title: "Residences",
    href: "#residences",
  },
  {
    title: "Showcase",
    href: "#showcase",
  },
  {
    title: "Contact",
    href: "#contact",
  },
];

export const FOOTER_SECTIONS: FooterSection[] = [
  {
    title: "Estates & Portfolio",
    links: [
      {
        title: "Featured Estates",
        href: "#properties",
      },
      {
        title: "Virtual Walkthrough",
        href: "#walkthrough",
      },
      {
        title: "Interactive Showcase",
        href: "#showcase",
      },
      {
        title: "Spatial Staging",
        href: "#transformation",
      },
    ],
  },
  {
    title: "Services & Studio",
    links: [
      {
        title: "Architectural Planning",
        href: "#",
      },
      {
        title: "Interior Architecture",
        href: "#",
      },
      {
        title: "Private Commissions",
        href: "#contact",
      },
      {
        title: "Privacy & Terms",
        href: "#",
      },
    ],
  },
];
