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
    title: "Explore",
    links: [
      {
        title: "Home",
        href: "/",
      },
      {
        title: "All Properties",
        href: "/properties",
      },
      {
        title: "Featured Portfolio",
        href: "/#properties",
      },
      {
        title: "Featured Residences",
        href: "/#residences",
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
        title: "Design Transformations",
        href: "/#transformation",
      },
    ],
  },
  {
    title: "Get in Touch",
    links: [
      {
        title: "Contact Us",
        href: "/contact-us",
      },
      {
        title: "Request a Viewing",
        href: "/#contact",
      },
    ],
  },
];
