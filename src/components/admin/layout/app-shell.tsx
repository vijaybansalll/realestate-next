"use client";

import { Suspense } from "react";
import { usePathname } from "next/navigation";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppHeader } from "./app-header";
import { AppSidebar } from "./app-sidebar";

function AppShellInner({
  children,
  pathname: customPathname,
}: {
  children: React.ReactNode;
  pathname?: string;
}) {
  const currentPath = usePathname();
  const activePath = customPathname || currentPath || "/admin";

  return (
    <SidebarProvider>
      <AppSidebar pathname={activePath} />
      <SidebarInset className="p-3 sm:p-4 md:p-6 bg-neutral-100/70 text-neutral-900 transition-colors duration-200 dark:bg-neutral-950 dark:text-neutral-100 min-h-screen max-w-full overflow-x-hidden">
        <AppHeader pathname={activePath} />
        <div className="flex flex-1 flex-col gap-4 sm:gap-6">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}

export function AppShell({
  children,
  pathname,
}: {
  children: React.ReactNode;
  pathname?: string;
}) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-neutral-50 text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100 flex items-center justify-center p-8">
          <div className="flex items-center gap-3 text-neutral-500 dark:text-neutral-400">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-amber-500 border-t-transparent" />
            <span>Loading admin console...</span>
          </div>
        </div>
      }
    >
      <AppShellInner pathname={pathname}>{children}</AppShellInner>
    </Suspense>
  );
}

export default AppShell;
