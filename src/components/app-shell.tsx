"use client";

import { Suspense } from "react";
import { usePathname } from "next/navigation";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppHeader } from "@/components/app-header";
import { AppSidebar } from "@/components/app-sidebar";

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
      <SidebarInset className="p-4 md:p-6 bg-neutral-950 text-neutral-100 min-h-screen">
        <AppHeader pathname={activePath} />
        <div className="flex flex-1 flex-col gap-6">{children}</div>
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
        <div className="min-h-screen bg-neutral-950 text-neutral-100 flex items-center justify-center p-8">
          <div className="flex items-center gap-3 text-neutral-400">
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
