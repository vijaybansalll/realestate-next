import type { ReactNode } from "react";
import {
  LayoutGridIcon,
  HomeIcon,
  BuildingIcon,
  CompassIcon,
  PlusCircleIcon,
  LayersIcon,
} from "lucide-react";

export type SidebarNavItem = {
  title: string;
  path?: string;
  icon?: ReactNode;
  subItems?: SidebarNavItem[];
};

export type SidebarNavGroup = {
  label: string;
  items: SidebarNavItem[];
};

export const navGroups: SidebarNavGroup[] = [
  {
    label: "Estate Management",
    items: [
      {
        title: "Overview",
        path: "/admin",
        icon: <LayoutGridIcon className="size-4" />,
      },
      {
        title: "Properties",
        path: "/admin/properties",
        icon: <BuildingIcon className="size-4" />,
        subItems: [
          {
            title: "Properties Directory",
            path: "/admin/properties",
            icon: <LayersIcon className="size-3.5" />,
          },
          {
            title: "Add New Listing",
            path: "/admin/properties/new",
            icon: <PlusCircleIcon className="size-3.5" />,
          },
        ],
      },
    ],
  },
];

export const footerNavLinks: SidebarNavItem[] = [
  {
    title: "Public Website",
    path: "/",
    icon: <HomeIcon className="size-4" />,
  },
  {
    title: "Properties Catalog",
    path: "/properties",
    icon: <CompassIcon className="size-4" />,
  },
];

export const navLinks: SidebarNavItem[] = [
  ...navGroups.flatMap((group) =>
    group.items.flatMap((item) =>
      item.subItems?.length ? [item, ...item.subItems] : [item]
    )
  ),
  ...footerNavLinks,
];
