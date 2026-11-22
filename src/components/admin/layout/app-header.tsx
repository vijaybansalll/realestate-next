"use client";

import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { AppBreadcrumbs } from "./app-breadcrumbs";
import { CustomSidebarTrigger } from "./custom-sidebar-trigger";
import { navLinks } from "./app-shared";
import { LayoutGridIcon, BuildingIcon } from "lucide-react";
import { ThemeToggle } from "@/components/theme/theme-toggle";

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
        item.path &&
        item.path !== "/" &&
        item.path !== "/admin" &&
        pathname?.startsWith(item.path)
    ) || { title: "Overview", icon: <LayoutGridIcon className="size-4" /> };
  }

  return (
    <header className={cn("mb-4 sm:mb-6 flex items-center justify-between gap-2 px-1 sm:px-2")}>
      <div className="flex min-w-0 items-center gap-2 sm:gap-3">
        <CustomSidebarTrigger />
        <Separator
          className="h-4 data-[orientation=vertical]:self-center opacity-60"
          orientation="vertical"
        />
        <AppBreadcrumbs page={activeItem} />
      </div>

      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        <ThemeToggle />
      </div>
    </header>
  );
}
