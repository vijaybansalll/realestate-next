"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LogoIcon } from "@/components/logo";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { NavGroup } from "@/components/nav-group";
import { navGroups } from "@/components/app-shared";
import { PlusIcon, CompassIcon, LogOut } from "lucide-react";
import { logoutAction } from "@/app/(auth)/login/actions";

interface AppSidebarProps {
  pathname?: string;
  onAddProperty?: () => void;
}

export function AppSidebar({ pathname, onAddProperty }: AppSidebarProps) {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await logoutAction();
      router.push("/login");
      router.refresh();
    } catch (err) {
      console.error("Logout failed", err);
      setIsLoggingOut(false);
    }
  };

  return (
    <Sidebar collapsible="icon" variant="floating">
      <SidebarHeader className="h-14 justify-center">
        <SidebarMenuButton render={<Link href="/admin" />}>
          <LogoIcon className="size-5 text-amber-400" />
          <span className="font-semibold tracking-tight text-neutral-100">
            Estate Admin
          </span>
        </SidebarMenuButton>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarMenuItem className="flex items-center gap-2">
            {onAddProperty ? (
              <SidebarMenuButton
                onClick={onAddProperty}
                className="min-w-8 bg-neutral-100 text-neutral-950 duration-200 ease-linear hover:bg-neutral-200 active:bg-neutral-300 font-medium cursor-pointer"
                tooltip="Add Property"
              >
                <PlusIcon className="size-4" />
                <span>Add Property</span>
              </SidebarMenuButton>
            ) : (
              <SidebarMenuButton
                render={<Link href="/admin/properties/new" />}
                className="min-w-8 bg-neutral-100 text-neutral-950 duration-200 ease-linear hover:bg-neutral-200 active:bg-neutral-300 font-medium cursor-pointer"
                tooltip="Add Property"
              >
                <PlusIcon className="size-4" />
                <span>Add Property</span>
              </SidebarMenuButton>
            )}
            <Link
              href="/properties"
              aria-label="View Catalog"
              className={cn(
                buttonVariants({ variant: "outline", size: "icon" }),
                "size-8 group-data-[collapsible=icon]:opacity-0 border-neutral-800"
              )}
              title="Public Catalog"
            >
              <CompassIcon className="size-4 text-neutral-400" />
              <span className="sr-only">View Catalog</span>
            </Link>
          </SidebarMenuItem>
        </SidebarGroup>

        {navGroups.map((group, index) => (
          <NavGroup
            key={`sidebar-group-${index}`}
            {...group}
            pathname={pathname}
          />
        ))}
      </SidebarContent>

      <SidebarFooter className="border-t border-neutral-800/60 p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={handleLogout}
              disabled={isLoggingOut}
              tooltip="Log out"
              className="text-neutral-400 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer w-full flex items-center gap-2"
            >
              <LogOut className="size-4 shrink-0 text-red-400/90" />
              <span>{isLoggingOut ? "Logging out..." : "Log out"}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

export default AppSidebar;
