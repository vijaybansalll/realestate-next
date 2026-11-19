"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { AppBreadcrumbs } from "@/components/app-breadcrumbs";
import { CustomSidebarTrigger } from "@/components/custom-sidebar-trigger";
import { navLinks } from "@/components/app-shared";
import { NavUser } from "@/components/nav-user";
import { BellIcon, LayoutGridIcon, BuildingIcon } from "lucide-react";

import { ThemeToggle } from "@/components/theme-toggle";

export function AppHeader({ pathname }: { pathname?: string }) {
  let activeItem = navLinks.find((item) => item.path === pathname);

  if (!activeItem && pathname?.includes("/edit")) {
    activeItem = {
      title: "Edit Property",
      icon: <BuildingIcon className="size-4" />,
    };
  } else if (!activeItem) {
    activeItem = navLinks.find(
      (item) =>
        item.path && pathname?.startsWith(item.path) && item.path !== "/admin"
    ) || { title: "Overview", icon: <LayoutGridIcon className="size-4" /> };
  }

  return (
    <header className={cn("mb-6 flex items-center justify-between gap-2 px-2")}>
      <div className="flex items-center gap-3">
        <CustomSidebarTrigger />
        <Separator
          className="mr-2 h-4 data-[orientation=vertical]:self-center"
          orientation="vertical"
        />
        <AppBreadcrumbs page={activeItem} />
      </div>

      <div className="flex items-center gap-3">
        <ThemeToggle />
      </div>
    </header>
  );
}
